import DashboardPage from '@/app/dashboard/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
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
          plan: {
            planName: 'BlueCross BlueShield of Tennessee',
            subId: '123456',
            grpId: '100000',
            memCk: '123456789',
            coverageType: ['Medical', 'Dental', 'Vision'],
          },
        },
      },
    }),
  ),
}));

describe('Dashboard Page', () => {
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
    expect(screen.getByText('Policies: Medical, Dental, Vision')).toBeVisible();
    expect(screen.getByText('View Plan Details')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
