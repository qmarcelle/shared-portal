import DashboardPage from '@/app/dashboard/page';
import { AppModal } from '@/components/foundation/AppModal';
import { mockedFetch } from '@/tests/setup';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Loggedin user Info Call
mockedFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
          role: UserRole.MEMBER,
          plan: {
            fhirId: '654543434',
            grgrCk: '7678765456',
            grpId: '65654323',
            memCk: '502622001',
            sbsbCk: '5654566',
            subId: '56543455',
          },
        },
        vRules: {},
      },
    }),
  ),
}));

describe('Dashboard - LoggedinUserInfo Service Failure to populate the plan information', () => {
  let containerSnap: HTMLElement;
  beforeAll(async () => {
    const component = await DashboardPage();
    const { container } = render(
      <>
        <AppModal />
        {component}
      </>,
    );
    containerSnap = container;
  });

  it('Should not populate plan information on the dashboard and should show loading error screen', () => {
    // Policy Info called
    expect(mockedFetch).toHaveBeenCalledWith(
      'PORTAL_SVCS_URL/MEM_SVC_CONTEXT/api/member/v1/members/byMemberCk/502622001',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['502622001'] },
      },
    );
    expect(screen.getByText('Loading Error'));
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "Sorry, we can't load this information right now. Please try again later.",
      ),
    ).toBeVisible();
    expect(screen.getByText('Try Again')).toBeVisible();
    expect(screen.getByText('Log Out')).toBeVisible();
    expect(screen.getByText('Need help?')).toBeVisible();
    expect(
      screen.getByText(
        'Give us a call using the number listed on the back of your Member ID card or',
      ),
    ).toBeVisible();
    expect(screen.getByText('contact us')).toBeVisible();
    expect(containerSnap).toMatchSnapshot();
  });
});
