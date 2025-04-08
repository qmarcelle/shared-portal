import DashboardPage from '@/app/dashboard/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// LoggedInUserInfo call
mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedInUserInfoMockResp));
mockedAxios.get.mockResolvedValueOnce({
  data: {
    physicianId: '3118777',
    physicianName: 'Louthan, James D.',
    address1: '2033 Meadowview Ln Ste 200',
    address2: '',
    address3: '',
    city: 'Kingsport',
    state: 'TN',
    zip: '376607432',
    phone: '4238572260',
    ext: '',
    addressType: '1',
    taxId: '621388079',
  },
});
mockedAxios.get.mockResolvedValueOnce({
  data: [
    {
      id: '45',
      providedBy: 'Davis Vision',
      contact: '1-800-456-9876',
      url: 'https://davis-vision.com',
    },
    {
      id: '87',
      providedBy: 'Nirmal Dental',
      contact: '1-800-367-9676',
      url: 'https://nirmaldental.com',
    },
    {
      id: '25',
      providedBy: 'Low Pharm',
      contact: '1-800-834-2465',
    },
    {
      id: '289',
      providedBy: 'Quant Labs',
      contact: '1-800-834-3465',
    },
  ],
});
mockedAxios.get.mockResolvedValueOnce({
  data: {
    currentPolicies: [
      {
        memberCk: '502622001',
        subscriberName: 'REBEKAH WILSON',
        groupName: 'Radio Systems Corporation',
        memberId: '90447969100',
        planTypes: ['M', 'R', 'S'],
        amplifyMember: false,
      },
    ],
    pastPolicies: [],
  },
});
jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88287',
          role: UserRole.MEMBER,
          plan: {
            fhirId: '654543434',
            grgrCk: '7678765456',
            grpId: '65654323',
            memCk: '123456789',
            sbsbCk: '5654566',
            subId: '56543455',
          },
        },
        vRules: {},
      },
    }),
  ),
}));

describe('Dashboard when PR is selected', () => {
  let containerSnap: HTMLElement;
  beforeAll(async () => {
    const component = await DashboardPage();
    const { container } = render(component);
    containerSnap = container;
  });

  it('should render UI correctly with proper greeting and plan details', () => {
    expect(mockedFetch).toHaveBeenCalledWith(
      'PORTAL_SVCS_URL/MEM_SVC_CONTEXT/api/member/v1/members/byMemberCk/123456789',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['123456789'] },
      },
    );
    expect(screen.getByText('Welcome, Chris')).toBeVisible();
    expect(screen.getByText('Plan: Chris B Hall Enterprises')).toBeVisible();
    expect(
      screen.getByText('Policies: Medical, Wellness, Vision, Dental'),
    ).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();

    expect(containerSnap).toMatchSnapshot();
  });
});
