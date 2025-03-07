import DashboardPage from '@/app/dashboard/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// LoggedInUserInfo call
mockedAxios.get.mockResolvedValueOnce({
  data: {
    groupData: {
      groupID: '100000',
      groupCK: '21908',
      groupName: 'BlueCross BlueShield of Tennessee',
      parentGroupID: '100001',
      subGroupID: '0001',
      subGroupCK: 28951,
      subGroupName: 'BlueCross BlueShield of Tennessee',
      clientID: 'EI',
      policyType: 'INT',
      groupEIN: '620427913',
    },
    networkPrefix: 'QMI',
    subscriberID: '902218823',
    subscriberCK: '91722400',
    subscriberFirstName: 'CHRIS',
    subscriberLastName: 'HALL',
    coverageTypes: [
      {
        productType: 'M',
        coverageLevel: 'A',
        exchange: false,
        indvGroupInd: '',
        pedAdultInd: '',
      },
      {
        productType: 'D',
        coverageLevel: 'A',
        exchange: true,
        indvGroupInd: 'Group',
        pedAdultInd: 'Adult',
      },
      {
        productType: 'V',
        coverageLevel: '*',
        exchange: true,
        indvGroupInd: 'Group',
        pedAdultInd: 'Adult',
      },
    ],
  },
});
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

describe('Dashboard when PR is selected', () => {
  let containerSnap: HTMLElement;
  beforeAll(async () => {
    const component = await DashboardPage();
    const { container } = render(component);
    containerSnap = container;
  });

  it('should render UI correctly with proper greeting and plan details', () => {
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/502622001',
    );
    expect(screen.getByText('Welcome, Chris')).toBeVisible();
    expect(
      screen.getByText('Plan: BlueCross BlueShield of Tennessee'),
    ).toBeVisible();
    expect(screen.getByText('Policies: Medical, Dental, Vision')).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();

    expect(containerSnap).toMatchSnapshot();
  });
});
