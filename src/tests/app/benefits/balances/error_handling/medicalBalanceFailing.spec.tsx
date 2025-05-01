import BalancesPage from '@/app/(common)/myplan/benefits/balances/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { createAxiosErrorForTest, fetchRespWrapper } from '@/tests/test_utils';
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

describe('Medical Balances Error Handling with Dental working', () => {
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
    .mockRejectedValueOnce(
      createAxiosErrorForTest({ errorObject: {}, status: 400 }),
    );
  // loggedIn userInfo for member names
  mockedFetch.mockResolvedValueOnce(
    fetchRespWrapper({
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
    }),
  );

  it('should call Balances api and render error for Medical Balance, success for Dental', async () => {
    const { container } = render(await BalancesPage());

    // Container Headers need to be visible
    expect(screen.getByText('Medical & Pharmacy Balance')).toBeVisible();
    expect(screen.getByText('Dental Balance')).toBeVisible();

    // Medical Balance
    // Show the user names
    // 1 for dropdown selected, 1 for dropdown option
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

    // Dental Balance Section
    expect(screen.getAllByText('ChrisBalance HALL').length).toBe(2);
    expect(
      screen.getAllByText('You do not have any Deductible amounts.').length,
    ).toBe(1);
    expect(
      screen.getAllByText('You do not have any Out-of-Pocket amounts.').length,
    ).toBe(1);

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
