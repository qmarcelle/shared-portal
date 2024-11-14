import BalancesPage from '@/app/balances/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: { currUsr: { plan: { memCk: '123456789', grpId: '87898' } } },
    }),
  ),
}));

describe('Medical and Dental Balances API Failing Error Handling', () => {
  console.log(process.env.ES_PORTAL_SVCS_API_URL);
  mockedAxios.get
    // dental
    .mockResolvedValueOnce({
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
    })
    // medical
    .mockResolvedValueOnce({
      data: {
        accumulatorsDetails: [
          {
            productType: 'M',
            inNetFamilyOOPMax: 6000,
            outOfNetFamilyOOPMax: 12000,
            inNetFamilyOOPMet: 0,
            outOfNetFamilyOOPMet: 0,
            inNetFamilyDedMax: 1250,
            outOfNetFamilyDedMax: 3250,
            inNetFamilyDedMet: 0,
            outOfNetFamilyDedMet: 0,
            isOOPCombined: false,
            members: [
              {
                memberCK: 91722401,
                inNetOOPMax: 3000,
                inNetOOPMet: 0,
                inNetDedMax: 750,
                inNetDedMet: 0,
                outOfNetOOPMax: 6000,
                outOfNetOOPMet: 0,
                outOfNetDedMax: 1750,
                outOfNetDedMet: 0,
                listofSerLimitMetDetails: [
                  {
                    accumNum: 1,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 2,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 25,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 32,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 38,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 300,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 305,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 340,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 380,
                    metAmount: 0,
                  },
                  {
                    accumNum: 390,
                    metAmount: 0,
                  },
                  {
                    accumNum: 550,
                    metAmount: 0,
                  },
                ],
              },
              {
                memberCK: 91722402,
                inNetOOPMax: 3000,
                inNetOOPMet: 2000,
                inNetDedMax: 760,
                inNetDedMet: 198,
                outOfNetOOPMax: 4000,
                outOfNetOOPMet: 0,
                outOfNetDedMax: 1750,
                outOfNetDedMet: 1700,
                listofSerLimitMetDetails: [
                  {
                    accumNum: 1,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 2,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 25,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 32,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 38,
                    usedVisits: 0,
                  },
                  {
                    accumNum: 300,
                    usedVisits: 0,
                  },
                ],
              },
            ],
            serviceLimitDetails: [
              {
                accumNum: 32,
                serviceDesc:
                  '4 Injections Per Year --  Trigger Point Injection',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 4,
              },
              {
                accumNum: 1,
                serviceDesc: '1 Visit Per Calendar Year -- Mammogram',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 4,
              },
              {
                accumNum: 305,
                serviceDesc: '8 Visits Per Year - Tobacco Cessation Counseling',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 8,
              },
              {
                accumNum: 2,
                serviceDesc: '1 Visit Per Calendar Year -- Gyn',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 2,
              },
              {
                accumNum: 340,
                serviceDesc: '8 Visits Per Year - Alcohol Misuse Counseling',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 8,
              },
              {
                accumNum: 38,
                serviceDesc: '20 Per Benefit Period - Urine/Serum Drug Testing',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 20,
              },
              {
                accumNum: 390,
                serviceDesc:
                  '$1,000 Per Benefit Period û General Travel Benefit',
                isDollarLimit: true,
                isDays: false,
                maxAllowedAmount: 1000,
              },
              {
                accumNum: 550,
                serviceDesc: '$40,000 Lifetime Max - Infertility Treatment',
                isDollarLimit: true,
                isDays: false,
                maxAllowedAmount: 40000,
              },
              {
                accumNum: 25,
                serviceDesc: '12 Visits Per Year - Dietary Counseling',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 12,
              },
              {
                accumNum: 300,
                serviceDesc:
                  '1 Visit Per Calendar Year - Wellcare - Over Age 6',
                isDollarLimit: false,
                isDays: false,
                maxAllowedVisits: 1,
              },
              {
                accumNum: 380,
                serviceDesc:
                  '$10,000 Per Benefit Period - Organ Transplant -Travel, Meals & Lodging',
                isDollarLimit: true,
                isDays: false,
                maxAllowedAmount: 10000,
              },
            ],
          },
        ],
      },
    })
    // loggedIn userInfo for member names
    .mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 400,
        errorObject: {
          desc: 'Mocked error',
        },
      }),
    );

  it('should call Balances api and render error for Medical, Dental Balances', async () => {
    const { container } = render(await BalancesPage());

    // Container Headers need to be visible
    expect(screen.getByText('Medical & Pharmacy Balance')).toBeVisible();
    expect(screen.getByText('Dental Balance')).toBeVisible();

    // Dental Balance
    const dentalBalSec = screen.getByText('Dental Balance').parentElement;
    expect(screen.queryAllByText('ChrisBalance HALL').length).toBe(0);
    // Error Screen to be shown
    expect(
      within(dentalBalSec).getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();

    // Medical Balance
    const medicalSec = screen.getByText(
      'Medical & Pharmacy Balance',
    ).parentElement;
    expect(screen.queryAllByText('Chris HALL').length).toBe(0);
    // Error Screen to be shown
    expect(
      within(medicalSec).getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ),
    ).toBeVisible();

    // Initial render
    expect(container).toMatchSnapshot();

    // Medical, Dental Balance, LoggedInUserInfo Api calls were called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/memberlimitservice/api/member/v1/members/bySubscriberCk/undefined/balances/deductibleAndOOP/D',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/memberlimitservice/api/member/v1/members/bySubscriberCk/undefined/balances/deductibleAndOOP/M',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/byMemberCk/123456789',
    );
  });
});
