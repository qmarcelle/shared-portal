import DashboardPage from '@/app/dashboard/page';
import { SideBarModal } from '@/components/foundation/SideBarModal';
import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import { mockedFetch } from '@/tests/setup';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// PBE Call
mockedFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

// eslint-disable-next-line no-var
jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
          role: UserRole.NON_MEM,
          plan: undefined,
        },
        vRules: {},
      },
    }),
  ),
  unstable_update: jest.fn(),
}));

const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
      push: () => null,
      refresh: mockRefresh,
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '/dashboard';
  },
}));

describe('Site Header - PBE Service Failure to populate the profile information', () => {
  beforeAll(async () => {
    const SiteHeader = await SiteHeaderServerWrapper();
    render(
      <>
        <SideBarModal />
        {SiteHeader}
      </>,
    );
  });

  it('Should not populate profile information on the dashboard', async () => {
    expect(mockedFetch).toHaveBeenCalledWith(
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=testUser&isPBERequired=true&isConsentRequired=true',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['testUser'] },
      },
    );
    expect(screen.queryByText('My Profile:')).toBeNull();
  });
});

describe('Dashboard - PBE Service Failure to populate the profile information', () => {
  let containerSnap: HTMLElement;
  beforeAll(async () => {
    const component = await DashboardPage();
    const { container } = render(component);
    containerSnap = container;
  });
  it('Should not populate profile information on the dashboard', () => {
    expect(mockedFetch).toHaveBeenCalledWith(
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=testUser&isPBERequired=true&isConsentRequired=true',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['testUser'] },
      },
    );
    expect(screen.queryByText('My Profile:')).toBeNull();
    expect(containerSnap).toMatchSnapshot();
  });
});
