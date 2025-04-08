import { CardType } from '@/app/myPlan/model/api/card_type';
import { ExtensionType } from '@/app/myPlan/model/api/extension_type';
import MyPlanPage from '@/app/myPlan/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { createAxiosErrorForTest, fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MyPlanPage();
  render(Result);
};

jest.mock('../../../../auth', () => ({
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
            sbsbCk: '91722400',
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
        },
      },
    }),
  ),
}));

describe('ID Card SVG Image Front', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        memberServicePhoneNumber: '1-800-565-9000',
      },
    });
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
  });
  test('ID Card SVG Image Front for Member Relation - M', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });

  test('ID Card SVG Image API integration null scenario', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: null,
    });

    await setupUI();

    await waitFor(() => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(response).toBeNull;
    });
  });

  test('ID Card SVG Image integration API  400 bad request scenario', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );

    await setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      //expect(response).not.toBeInTheDocument;
      expect(
        screen.getByText('Your ID card is not available at this time.'),
      ).toBeVisible();
    });
  });

  test('ID Card SVG Image Front for Future effective members', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.members[4].planDetails[1].effectiveDate = 253370782800000;
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });

    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
            'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  xit('ID Card SVG Image Front for Member Relation - S', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.memberRelation = 'S';
    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?memberCk=${memberDetails.member_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });
});
