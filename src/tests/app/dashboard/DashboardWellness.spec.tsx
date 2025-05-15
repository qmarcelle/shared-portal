import DashboardPage from '@/app/dashboard/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
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
          isWellnessQa: true,
        },
      },
    }),
  ),
}));

describe('Dashboard Page for Wellness Only', () => {
  it('should render UI correctly', async () => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
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
        pastPolicies: [
          {
            memberCk: '846239401',
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
      '/api/member/v1/members/byMemberCk/123456789/benefits/employerProvidedBenefits',
    );

    expect(screen.getByText('Member Wellness Center')).toBeVisible();
    expect(screen.getByText('Member Discount')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
