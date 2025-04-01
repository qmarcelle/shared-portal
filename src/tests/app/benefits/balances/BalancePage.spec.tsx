import BalancesPage from '@/app/benefits/balances/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await BalancesPage();
  return render(page);
};

process.env.NEXT_PUBLIC_IDP_EYEMED = 'Eyemed';

const vRules = {
  user: {
    currUsr: {
      plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
    },
    vRules: {
      dental: true,
      dentalCostsEligible: true,
      enableCostTools: true,
      vision: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));
const baseUrl = window.location.origin;
describe('Balances Page', () => {
  it('should render Dental Balance information on the Balances page', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        accumulatorsDetails: [
          {
            productType: 'D',
            members: [
              {
                memberCK: 54363201,
                listofSerLimitMetDetails: [
                  {
                    accumNum: 819,
                    metAmount: 0.0,
                  },
                  {
                    accumNum: 827,
                    metAmount: 0.0,
                  },
                ],
              },
              {
                memberCK: 91722407,
                listofSerLimitMetDetails: [
                  {
                    accumNum: 819,
                    metAmount: 0.0,
                  },
                ],
              },
            ],
            serviceLimitDetails: [
              {
                accumNum: 819,
                serviceDesc: '$3000 Annual Maximum Basic and Major',
                isDollarLimit: true,
                isDays: false,
                maxAllowedAmount: 3000.0,
              },
              {
                accumNum: 827,
                serviceDesc: '$3000 Ortho Lifetime Maximum',
                isDollarLimit: true,
                isDays: false,
                maxAllowedAmount: 3000.0,
              },
            ],
          },
        ],
      },
    });

    const component = await renderUI();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/bySubscriberCk/654567656/balances/deductibleAndOOP/M',
    );
    expect(screen.getByText('Dental Balance')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render Vision Balance information on the Balances page', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    const component = await renderUI();
    expect(screen.getByText('Vision Balance')).toBeVisible();
    expect(screen.getByText('visit EyeMed')).toBeVisible();
    expect(screen.getByRole('link', { name: 'visit EyeMed' })).toHaveProperty(
      'href',
      `${baseUrl}/sso/launch?PartnerSpId=Eyemed`,
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
