import PersonalRepresentativePage from '@/app/personalRepresentativeAccess/page';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await PersonalRepresentativePage();
  return render(page);
};

const vRules = {
  user: {
    currUsr: {
      firstName: 'Chris',
      role: UserRole.PERSONAL_REP,
      plan: {
        planName: 'BlueCross BlueShield of Tennessee',
        subId: '123456',
        grpId: '100000',
        memCk: '',
        coverageType: ['Medical', 'Dental', 'Vision'],
      },
    },
    vRules: {
      matureMinor: false,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('src/utils/date_formatter', () => ({
  formatDateToLocale: jest.fn(),
}));

describe('Personal Representative Access Page', () => {
  it('should show members represented', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    const mockFormatDate = jest.requireMock(
      'src/utils/date_formatter',
    ).formatDateToLocale;
    mockFormatDate.mockReturnValueOnce('11/30/1965');
    mockedFetch
      .mockResolvedValueOnce(
        fetchRespWrapper({
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
                firstName: 'Quino',
                middleName: 'S',
                lastName: 'Deper',
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
                        relatedPersonFirstName: 'Rafusal',
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
                        relatedPersonMemeCk: '502622001',
                      },
                      {
                        relatedPersonUMPID: '57c85test3ebd23c7db88244',
                        relatedPersonFirstName: 'Rafusal',
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
                        relatedPersonMemeCk: '846239401',
                      },
                    ],
                  },
                  {
                    personRoleType: 'Dependent',
                    org: 'bcbst_facets',
                    roleTermDate: '2030-11-30T00:00:00.0000000+00:00',
                    nativeId: '38922455201-100000',
                    primaryPlanFlag: false,
                    patientFHIRID: '30345928-abcd-ef01-2345-6789abcdef52',
                    userName: 'Testuser553',
                    memeCk: '147235702',
                    clientId: '194',
                    multiPlanConfirmed: false,
                    multiPlanConfirmedDate: '2030-11-30T00:00:00.0000000+00:00',
                    approvalRequestId: '38922455201-1123456787',
                    relatedPersons: [
                      {
                        relatedPersonUMPID: '57c85test3ebd23c7db88244',
                        relatedPersonFirstName: 'Chris',
                        relatedPersonLastName: 'Hall',
                        relatedPersonMiddleName: 'S',
                        relatedPersonSuffix: 'Mr.',
                        relatedPersonNativeId: '38922455200-100000',
                        relatedPersonFHIRID: '',
                        relatedPersonPatientFHIRID: '',
                        relatedPersonRelationshipTermDate:
                          '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonRoleType: 'PR',
                        relatedPersonDob: '1964-07-20',
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
                    memeCk: '3349138',
                    clientId: '194',
                    multiPlanConfirmed: false,
                    multiPlanConfirmedDate: '2030-11-30T00:00:00.0000000+00:00',
                    approvalRequestId: '38922455201-1123456787',
                    relatedPersons: [
                      {
                        relatedPersonUMPID: '57c85test3ebd23c7db88244',
                        relatedPersonFirstName: 'Chris',
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
                        relatedPersonMemeCk: '502622001',
                      },
                      {
                        relatedPersonUMPID: '57c85test3ebd23c7db88244',
                        relatedPersonFirstName: 'Chris',
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
                        relatedPersonMemeCk: '846239401',
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
        }),
      )
      .mockResolvedValueOnce(
        fetchRespWrapper({
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
                firstName: 'Rafusal',
                middleName: 'S',
                lastName: 'Claud',
                suffix: 'Mrs.',
                address1: 'street1',
                address2: 'street2',
                phoneNumber: '8095469997',
                city: 'Ongole',
                state: 'AP',
                zip: 34566,
                dob: '2019-10-29T00:00:10.0000000+00:00',
                gender: 'M',
                email: 'sub.m@gmail.com',
                hasAccount: true,
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
                        relatedPersonFirstName: 'Rafusal',
                        relatedPersonLastName: 'Claud',
                        relatedPersonMiddleName: 'S',
                        relatedPersonSuffix: 'Mr.',
                        relatedPersonNativeId: '38922455200-100000',
                        relatedPersonFHIRID:
                          'ddd94652-d077-454d-b252-bcb7c24e1de5',
                        relatedPersonPatientFHIRID: '',
                        relatedPersonRelationshipTermDate:
                          '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonRoleType: 'Subscriber',
                        relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonApprovalRequestId: '',
                        relatedPersonMemeCk: '502622001',
                        name: 'Full Access',
                      },
                      {
                        relatedPersonUMPID: '57c85test3ebd23c7db88244',
                        relatedPersonFirstName: 'Rafusal',
                        relatedPersonLastName: 'Claud',
                        relatedPersonMiddleName: 'S',
                        relatedPersonSuffix: 'Mr.',
                        relatedPersonNativeId: '38922455200-100000',
                        relatedPersonFHIRID:
                          'ddd94652-d077-454d-b252-bcb7c24e1de5',
                        relatedPersonPatientFHIRID: '',
                        relatedPersonRelationshipTermDate:
                          '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonRoleType: 'Subscriber',
                        relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonApprovalRequestId: '',
                        relatedPersonMemeCk: '846239401',
                        name: 'Full Access',
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
        }),
      )
      .mockResolvedValueOnce(
        fetchRespWrapper({
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
                firstName: 'Chris Claud',
                middleName: 'S',
                lastName: 'Claud',
                suffix: 'Mrs.',
                address1: 'street1',
                address2: 'street2',
                phoneNumber: '8095469997',
                city: 'Ongole',
                state: 'AP',
                zip: 34566,
                dob: '2019-10-29T00:00:10.0000000+00:00',
                gender: 'M',
                email: 'sub.m@gmail.com',
                hasAccount: true,
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
                        relatedPersonFirstName: 'Rafusal',
                        relatedPersonLastName: 'Claud',
                        relatedPersonMiddleName: 'S',
                        relatedPersonSuffix: 'Mr.',
                        relatedPersonNativeId: '38922455200-100000',
                        relatedPersonFHIRID:
                          'ddd94652-d077-454d-b252-bcb7c24e1de5',
                        relatedPersonPatientFHIRID: '',
                        relatedPersonRelationshipTermDate:
                          '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonRoleType: 'Subscriber',
                        relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonApprovalRequestId: '',
                        relatedPersonMemeCk: '502622001',
                        name: 'Full Access',
                      },
                      {
                        relatedPersonUMPID: '57c85test3ebd23c7db88244',
                        relatedPersonFirstName: 'Rafusal',
                        relatedPersonLastName: 'Claud',
                        relatedPersonMiddleName: 'S',
                        relatedPersonSuffix: 'Mr.',
                        relatedPersonNativeId: '38922455200-100000',
                        relatedPersonFHIRID:
                          'ddd94652-d077-454d-b252-bcb7c24e1de5',
                        relatedPersonPatientFHIRID: '',
                        relatedPersonRelationshipTermDate:
                          '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonRoleType: 'Subscriber',
                        relatedPersonDob: '2030-11-30T00:00:00.0000000+00:00',
                        relatedPersonApprovalRequestId: '',
                        relatedPersonMemeCk: '846239401',
                        name: 'Full Access',
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
        }),
      );
    mockAuth.mockResolvedValueOnce(vRules);
    const component = await renderUI();
    expect(screen.getByText('Personal Representative Access')).toBeVisible();
    expect(
      screen.getByText(
        /Personal representatives have the legal authority to make health care decisions on behalf of the member/i,
      ),
    ).toBeVisible();
    expect(screen.getByText('Understanding Access')).toBeVisible();
    expect(screen.getByText('Members You Represent')).toBeVisible();
    expect(screen.getByText('Rafusal Claud')).toBeVisible();
    expect(screen.getByText('Chris Claud')).toBeVisible();
    expect(screen.queryByText('Chris Hall')).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
});
