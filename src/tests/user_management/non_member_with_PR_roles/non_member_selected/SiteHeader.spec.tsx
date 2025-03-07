import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

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
                  relatedPersonFirstName: 'AMDS',
                  relatedPersonLastName: 'Deped',
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
                  relatedPersonMemeCk: '6765458',
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

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
          role: UserRole.NON_MEM,
          plan: undefined,
        },
        vRules: {},
      },
    }),
  ),
}));

describe('SiteHeader for Non Member with PR Role', () => {
  let containerSnap: HTMLElement;
  beforeAll(async () => {
    const SiteHeader = await SiteHeaderServerWrapper();
    const { container } = render(SiteHeader);
    containerSnap = container;
  });

  it('should render UI correctly with no nav menu, plan selector and action buttons', () => {
    expect(screen.getByText('Alpha Beta')).toBeVisible();
    expect(screen.queryByText('View Plan:')).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/searchMemberLookupDetails/getPBEConsentDetails',
      { params: { isPBERequired: true, userName: 'testUser' } },
    );
    expect(containerSnap).toMatchSnapshot();
  });
});
