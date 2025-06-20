import DashboardPage from '@/app/dashboard/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await DashboardPage();
  return render(page);
};

const vRules = {
  user: {
    currUsr: {
      firstName: 'Chris',
      role: UserRole.MEMBER,
      plan: {
        planName: 'BlueCross BlueShield of Tennessee',
        subId: '123456',
        grpId: '100000',
        memCk: '123456789',
        coverageType: ['Medical', 'Dental', 'Vision'],
      },
    },
    vRules: {
      futureEffective: false,
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
      blueCare: false,
      myPCPElig: false,
      subscriber: true,
      payMyPremiumElig: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Dashboard Page', () => {
  it('should render UI correctly for Pay Premium component', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;

    mockAuth.mockResolvedValueOnce(vRules);

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
        currentPolicies: [],
        pastPolicies: [
          {
            memberCk: '123456789',
            subscriberName: 'JOHNATHAN ANDERL',
            groupName: 'Ruby Tuesday Operations LLC',
            memberId: '90865577900',
            planTypes: ['D', 'R', 'S', 'M', 'V'],
            amplifyMember: false,
          },
        ],
      },
    });
    const component = await renderUI();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/memberservice/api/v1/policyInfo?members=123456789',
    );
    expect(screen.getByText('Recent Claims')).toBeVisible();
    expect(screen.getByText('Spending Summary')).toBeVisible();
    expect(screen.queryByText('Pay Premium')).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
