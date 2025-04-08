import BalancesPage from '@/app/benefits/balances/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
        },
        vRules: {
          dental: true,
          dentalCostsEligible: true,
          enableCostTools: true,
        },
      },
    }),
  ),
}));

describe('Medical and Dental Balances API Failing Error Handling', () => {
  console.log(process.env.ES_PORTAL_SVCS_API_URL);
  mockedAxios.get
    .mockResolvedValueOnce({
      data: {
        isActive: true,
        subscriberLoggedIn: true,
        lob: 'REGL',
        groupData: {
          groupID: '100000',
          groupCK: '21908',
          groupName: 'Chris B Hall Enterprises',
          parentGroupID: '100001',
          subGroupID: '0001',
          subGroupCK: 28951,
          subGroupName: 'Chris B Hall Enterprises',
          clientID: 'EI',
          policyType: 'INT',
          groupEIN: '620427913',
        },
        networkPrefix: 'QMI',
        subscriberID: '902218823',
        subscriberCK: '91722400',
        subscriberFirstName: 'CHRIS',
        subscriberLastName: 'HALL',
        subscriberTitle: '',
        subscriberDateOfBirth: '08/06/1959',
        subscriberOriginalEffectiveDate: '01/01/2001',
        members: [
          {
            isActive: true,
            memberOrigEffDt: '06/29/2009',
            memberCk: 91722407,
            firstName: 'CHRISTMAS',
            middleInitial: '',
            lastName: 'HALL',
            title: '',
            memRelation: 'S',
            birthDate: '06/29/2009',
            gender: 'M',
            memberSuffix: 6,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: true,
            esipharmacyEligible: true,
          },
          {
            isActive: true,
            memberOrigEffDt: '06/15/2009',
            memberCk: 91722406,
            firstName: 'KRISSY',
            middleInitial: 'C',
            lastName: 'HALL',
            title: '',
            memRelation: 'D',
            birthDate: '06/15/2009',
            gender: 'F',
            memberSuffix: 5,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: false,
            esipharmacyEligible: true,
          },
          {
            isActive: true,
            memberOrigEffDt: '05/01/2009',
            memberCk: 91722405,
            firstName: 'CHRISTIAN',
            middleInitial: '',
            lastName: 'HALL',
            title: '',
            memRelation: 'S',
            birthDate: '10/31/2011',
            gender: 'M',
            memberSuffix: 4,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: true,
            esipharmacyEligible: true,
          },
          {
            isActive: true,
            memberOrigEffDt: '01/01/2001',
            memberCk: 91722402,
            firstName: 'KRISTY',
            middleInitial: '',
            lastName: 'HALL',
            title: '',
            memRelation: 'W',
            birthDate: '05/17/1971',
            gender: 'F',
            memberSuffix: 1,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: true,
            esipharmacyEligible: false,
          },
          {
            isActive: true,
            memberOrigEffDt: '01/01/2001',
            memberCk: 91722401,
            firstName: 'CHRIS',
            middleInitial: 'B',
            lastName: 'HALL',
            title: '',
            memRelation: 'M',
            birthDate: '08/06/1959',
            gender: 'M',
            memberSuffix: 0,
            mailAddressType: 'H',
            workPhone: '1234567890',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'D',
                coverageLevel: '*',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'D',
                planID: 'DEHCNY02',
                effectiveDate: 1509508800000,
                planStartDate: 1451624400000,
                planClassID: 'PPOA',
                networkPlanName: 'DentalBlue Preferred Network',
              },
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: true,
            hasSocial: true,
            esipharmacyEligible: true,
          },
          {
            isActive: true,
            memberOrigEffDt: '01/01/2014',
            memberCk: 91722409,
            firstName: 'CHRISTOFF',
            middleInitial: '',
            lastName: 'HALL',
            title: '',
            memRelation: 'S',
            birthDate: '01/01/2000',
            gender: 'M',
            memberSuffix: 8,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: false,
            esipharmacyEligible: true,
          },
          {
            isActive: true,
            memberOrigEffDt: '12/11/2006',
            memberCk: 91722408,
            firstName: 'CHRISTO',
            middleInitial: '',
            lastName: 'HALL',
            title: '',
            memRelation: 'S',
            birthDate: '12/11/2006',
            gender: 'M',
            memberSuffix: 7,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: true,
            esipharmacyEligible: true,
          },
          {
            isActive: true,
            memberOrigEffDt: '12/11/2006',
            memberCk: 54363201,
            firstName: 'ChrisBalance',
            middleInitial: '',
            lastName: 'HALL',
            title: '',
            memRelation: 'S',
            birthDate: '12/11/2006',
            gender: 'M',
            memberSuffix: 7,
            mailAddressType: 'H',
            workPhone: '',
            otherInsurance: [],
            coverageTypes: [
              {
                productType: 'M',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'S',
                coverageLevel: 'A',
                exchange: false,
                indvGroupInd: '',
                pedAdultInd: '',
              },
              {
                productType: 'V',
                coverageLevel: 'A',
                exchange: true,
                indvGroupInd: 'Group',
                pedAdultInd: 'Adult',
              },
            ],
            planDetails: [
              {
                productCategory: 'M',
                planID: 'MBPX0806',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Blue Network P',
              },
              {
                productCategory: 'S',
                planID: 'WSXM0218',
                effectiveDate: 1546318800000,
                planStartDate: 1514782800000,
                planClassID: 'PPOA',
                networkPlanName: 'Wellness Plan',
              },
              {
                productCategory: 'V',
                planID: 'VEMGN002',
                effectiveDate: 1546318800000,
                planStartDate: 1383278400000,
                planClassID: 'PPOA',
                networkPlanName: 'Vision Blue',
              },
            ],
            inXPermissions: true,
            futureEffective: false,
            loggedIn: false,
            hasSocial: true,
            esipharmacyEligible: true,
          },
        ],
        coverageTypes: [
          {
            productType: 'M',
            coverageLevel: 'A',
            exchange: false,
            indvGroupInd: '',
            pedAdultInd: '',
          },
          {
            productType: 'S',
            coverageLevel: 'A',
            exchange: false,
            indvGroupInd: '',
            pedAdultInd: '',
          },
          {
            productType: 'V',
            coverageLevel: 'A',
            exchange: true,
            indvGroupInd: 'Group',
            pedAdultInd: 'Adult',
          },
          {
            productType: 'D',
            coverageLevel: '*',
            exchange: true,
            indvGroupInd: 'Group',
            pedAdultInd: 'Adult',
          },
        ],
        addresses: [
          {
            type: '1',
            address1: 'TEST BLUE ACCESS',
            address2: '',
            address3: '',
            city: 'Chattanooga',
            state: 'TN',
            zipcode: '37412',
            county: 'HAMILTON',
            phone: '',
            email: '',
          },
          {
            type: '2',
            address1: 'TEST 2 BLUE ACCESS',
            address2: '',
            address3: '',
            city: 'Chattanooga',
            state: 'TN',
            zipcode: '37402',
            county: 'HAMILTON',
            phone: '',
            email: '',
          },
          {
            type: 'H',
            address1: '1 CAMERON HILL CIRCLE',
            address2: '',
            address3: '',
            city: 'CHATTANOOGA',
            state: 'TN',
            zipcode: '37402',
            county: 'HAMILTON',
            phone: '4235353065',
            email: '',
          },
        ],
        healthCareAccounts: [],
        esigroupNum: '100000MBPX0806',
        cmcondition: [],
      },
    })
    .mockResolvedValueOnce({
      data: {
        memberServicePhoneNumber: '1-800-565-9000',
      },
    })
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
    });
  // loggedIn userInfo for member names
  mockedFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

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
      '/api/member/v1/members/bySubscriberCk/654567656/balances/deductibleAndOOP/D',
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/member/v1/members/bySubscriberCk/654567656/balances/deductibleAndOOP/M',
    );
    expect(mockedFetch).toHaveBeenCalledWith(
      'PORTAL_SVCS_URL/MEM_SVC_CONTEXT/api/member/v1/members/byMemberCk/123456789',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['123456789'] },
      },
    );
  });
});
