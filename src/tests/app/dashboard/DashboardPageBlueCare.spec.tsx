import DashboardPage from '@/app/dashboard/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await DashboardPage();
  return render(page);
};

jest.mock('../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
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
          blueCare: true,
          myPCPElig: true,
        },
      },
    }),
  ),
}));

describe('Dashboard Page for BlueCare', () => {
  it('should render Welcome Banner UI correctly', async () => {
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
    const component = await renderUI();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789',
    );
    expect(
      screen.getByText('Plan: BlueCross BlueShield of Tennessee'),
    ).toBeVisible();
    expect(screen.getByText('Estimate Costs')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Plan your upcoming care costs before you make an appointment.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('View or Update Primary Care Provider'),
    ).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
