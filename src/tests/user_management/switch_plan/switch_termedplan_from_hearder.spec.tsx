import { unstable_update } from '@/auth';
import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// PBE Call
mockedAxios.get.mockResolvedValueOnce({
  data: {
    data: {
      getPBEmessage: 'Person Record fetched Successfully ',
      getConsentmessage: 'Person Record fetched Successfully ',
      getPBECorrelationId: '0124b43b-efd0-42bc-b904-cb2ac9c712b9',
      consentCorrelationId: 'cd30f2b3-3bae-42f3-b93a-8fa42f3884e7',
      getPBEDetails: [
        {
          umpid: '57c85test3ebd23c7db88245',
          userName: 'Testuser553',
          personFHIRID: '30345928-abcd-ef01-2345-6789abcdef51',
          firstName: 'Alpha',
          middleName: 'S',
          lastName: 'Beta',
          suffix: 'Mr.',
          address1: 'street1',
          address2: 'street2',
          phoneNumber: '8095469997',
          city: 'Ongole',
          state: 'AP',
          zip: 34566,
          dob: '2019-10-29T00:00:10.0000000+00:00',
          gender: 'M',
          email: 'sub.m@gmail.com',
          relationshipInfo: [
            {
              personRoleType: 'Dependent',
              org: 'bcbst_facets',
              roleTermDate: '2030-11-30T00:00:00.0000000+00:00',
              nativeId: '38922455201-100000',
              primaryPlanFlag: false,
              patientFHIRID: '30345928-abcd-ef01-2345-6789abcdef52',
              userName: 'Testuser553',
              memeCk: '502622001',
              clientId: '194',
              multiPlanConfirmed: false,
              multiPlanConfirmedDate: '2030-11-30T00:00:00.0000000+00:00',
              approvalRequestId: '38922455201-1123456787',
              relatedPersons: [
                {
                  relatedPersonUMPID: '57c85test3ebd23c7db88244',
                  relatedPersonFirstName: 'AM',
                  relatedPersonLastName: 'Dep',
                  relatedPersonMiddleName: 'S',
                  relatedPersonSuffix: 'Mr.',
                  relatedPersonNativeId: '38922455200-100000',
                  relatedPersonFHIRID: '',
                  relatedPersonPatientFHIRID: '',
                  relatedPersonRelationshipTermDate:
                    '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonRoleType: 'Subscriber',
                  relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '6765454',
                },
              ],
            },
            {
              personRoleType: 'Subscriber',
              org: 'bcbst_facets',
              roleTermDate: '2030-11-30T00:00:00.0000000+00:00',
              nativeId: '38922455201-100000',
              primaryPlanFlag: false,
              patientFHIRID: '30345928-abcd-ef01-2345-6789abcdef52',
              userName: 'Testuser553',
              memeCk: '846239401',
              clientId: '194',
              multiPlanConfirmed: false,
              multiPlanConfirmedDate: '2030-11-30T00:00:00.0000000+00:00',
              approvalRequestId: '38922455201-1123456787',
              relatedPersons: [
                {
                  relatedPersonUMPID: '57c85test3ebd23c7db88244',
                  relatedPersonFirstName: 'AM',
                  relatedPersonLastName: 'Dep',
                  relatedPersonMiddleName: 'S',
                  relatedPersonSuffix: 'Mr.',
                  relatedPersonNativeId: '38922455200-100000',
                  relatedPersonFHIRID: '',
                  relatedPersonPatientFHIRID: '',
                  relatedPersonRelationshipTermDate:
                    '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonRoleType: 'Dependent',
                  relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '6765454',
                },
              ],
            },
            {
              personRoleType: 'PR',
              org: 'bcbst_facets',
              roleTermDate: '2030-11-30T00:00:00.0000000+00:00',
              nativeId: '38922455201-100000',
              primaryPlanFlag: false,
              patientFHIRID: '30345928-abcd-ef01-2345-6789abcdef52',
              userName: 'Testuser553',
              memeCk: '3349134',
              clientId: '194',
              multiPlanConfirmed: false,
              multiPlanConfirmedDate: '2030-11-30T00:00:00.0000000+00:00',
              approvalRequestId: '38922455201-1123456787',
              relatedPersons: [
                {
                  relatedPersonUMPID: '57c85test3ebd23c7db88244',
                  relatedPersonFirstName: 'Raphel',
                  relatedPersonLastName: 'Claud',
                  relatedPersonMiddleName: 'S',
                  relatedPersonSuffix: 'Mr.',
                  relatedPersonNativeId: '38922455200-100000',
                  relatedPersonFHIRID: '',
                  relatedPersonPatientFHIRID: '',
                  relatedPersonRelationshipTermDate:
                    '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonRoleType: 'Subscriber',
                  relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '6765458',
                },
              ],
            },
            {
              personRoleType: 'PR',
              org: 'bcbst_facets',
              roleTermDate: '2030-11-30T00:00:00.0000000+00:00',
              nativeId: '38922455201-100000',
              primaryPlanFlag: false,
              patientFHIRID: '30345928-abcd-ef01-2345-6789abcdef52',
              userName: 'Testuser553',
              memeCk: '3349134',
              clientId: '194',
              multiPlanConfirmed: false,
              multiPlanConfirmedDate: '2030-11-30T00:00:00.0000000+00:00',
              approvalRequestId: '38922455201-1123456787',
              relatedPersons: [
                {
                  relatedPersonUMPID: '57c85test3ebd23c7db88287',
                  relatedPersonFirstName: 'Robert',
                  relatedPersonLastName: 'Cook',
                  relatedPersonMiddleName: 'S',
                  relatedPersonSuffix: 'Mr.',
                  relatedPersonNativeId: '38922455200-100000',
                  relatedPersonFHIRID: '',
                  relatedPersonPatientFHIRID: '',
                  relatedPersonRelationshipTermDate:
                    '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonRoleType: 'Subscriber',
                  relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '502622001',
                },
              ],
            },
          ],
        },
      ],
      consentDetails: [
        {
          id: 'e7d4e7e9-5f98-4e35-9141-de8c8eb944a6',
          name: 'Consent - Limited Access',
          description:
            'This consent is governed by limited access policy for HIV and Cancer information',
          status: 'active',
          performer: 'john.doe@bcbst.com',
          requester: 'Person/24baffdb-76b7-4cb1-bf97-47f4bcf5574a',
          requestee: 'Patient/e3c212e5-1b7f-4521-8ba1-3b48befa98d6',
          policyId: 'ce3ee5b4-3810-4c8a-bfd9-9d8681853a7e',
          policyBusinessIdentifier: 'pol_10237_lim_ac',
          type: 'PEOPLE_TO_PEOPLE',
          effectiveOn: '2023-01-01T12:00:00Z',
          expiresOn: '2023-12-31T12:00:00Z',
          signedOn: '2023-01-01T12:00:00Z',
          modifiedAt: '2023-01-01T12:00:00Z',
          accessControl: 'PERMIT_ALL',
          options: [
            {
              id: 'f83a70bf-736d-4dfa-96eb-31d5c5a09535',
              businessIdentifier: 'option_biz_id_001',
              caption: 'HIV',
              mappings: [
                {
                  criteria: 'CODE',
                  key: 'http://hl7.org/fhir/sid/icd-10',
                  value: 'B20,B9735',
                },
              ],
            },
          ],
        },
      ],
    },
    details: {
      componentName: 'string',
      componentStatus: 'string',
      returnCode: 'string',
      subSystemName: 'string',
      message: 'string',
      problemTypes: 'string',
      innerDetails: {
        statusDetails: [
          {
            componentName: 'string',
            componentStatus: 'string',
            returnCode: 'string',
            subSystemName: 'string',
            message: 'string',
            problemTypes: 'string',
            innerDetails: {
              statusDetails: ['string'],
            },
          },
        ],
      },
    },
  },
});

// Policy Info Call
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

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
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
  unstable_update: jest.fn(),
}));

const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
      push: () => null,
      refresh: mockRefresh,
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '/dashboard';
  },
}));

describe('Switch Plan from SiteHeader for Termed Plan', () => {
  beforeAll(async () => {
    const SiteHeader = await SiteHeaderServerWrapper();
    render(SiteHeader);
  });

  it('should call update from NextAuth correctly followed by router.refresh()', async () => {
    const selectedPlan = screen.getAllByText('Radio Systems Corporation')[0];
    expect(screen.getByText('My Profile:')).toBeVisible();
    expect(screen.getByText('Alpha Beta')).toBeVisible();
    expect(screen.getAllByText('View Plan:')[0]).toBeVisible();
    expect(selectedPlan).toBeVisible();
    fireEvent.click(selectedPlan);
    fireEvent.click(screen.getByText('View Past Plans'));
    const planToSelect = screen.getByText('Ruby Tuesday Operations LLC');
    fireEvent.click(planToSelect);

    await waitFor(() => {
      expect(unstable_update).toHaveBeenCalledWith({
        planId: '846239401',
        userId: '57c85test3ebd23c7db88245',
      });
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
