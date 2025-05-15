import { ShareMyPlanComponent } from '@/app/shareMyInformation/components/ShareMyPlanComponent';

import ShareMyInformationPage from '@/app/shareMyInformation/page';
import { AccessStatus } from '@/models/app/getSharePlanDetails';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await ShareMyInformationPage();
  return render(page);
};

const vRules = {
  user: {
    currUsr: {
      firstName: 'Chris',
      role: UserRole.MEMBER,
      plan: {
        planName: 'BlueCross BlueShield of Tennessee',
        subId: '123456',
        grpId: '100000',
        memCk: '147235702',
        coverageType: ['Medical', 'Dental', 'Vision'],
      },
    },
    vRules: {},
  },
};
jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));
jest.mock('src/utils/date_formatter', () => ({
  formatDateToLocale: jest.fn(),
}));

describe('Share My Information  Page', () => {
  it('should show Share My Information plan details info', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue(vRules);
    const mockFormatDate = jest.requireMock(
      'src/utils/date_formatter',
    ).formatDateToLocale;
    mockFormatDate.mockReturnValueOnce('07/19/1964');
    mockedFetch.mockResolvedValueOnce(
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
                      relatedPersonUMPID: '65d147f5384fca22b66288ea',
                      relatedPersonFirstName: 'JESSICA',
                      relatedPersonLastName: 'MEYER',
                      relatedPersonMiddleName: 'M',
                      relatedPersonSuffix: '',
                      relatedPersonDob: '1985-01-19',
                      relatedPersonFHIRID:
                        '9d0a3fed-0aec-475a-a0a3-ea4a06fa05ff',
                      relatedPersonRoleType: 'Dependent',
                      relatedPersonNativeId: '91000945201-130508',
                      relatedPersonRelationshipTermDate:
                        '2199-12-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'ddd94652-d077-454d-b252-bcb7c24e1de5',
                      relatedPersonMasterPatientFHIRID:
                        '1bece1f7-48f5-444e-abe1-6a7d037bc7bc',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '941068202',
                      version: '0',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      createdAt: '2025-02-25T18:34:33Z',
                      modifiedAt: '2025-02-25T18:34:33Z',
                      createdBy: 'Arjun Muthalagu',
                      modifiedBy: 'Arjun Muthalagu',
                      deleted: 'FALSE',
                      performer: '',
                      requester: 'Patient/4b17879b-60db-42f2-bc0e-1e900aea3312',
                      requestee: 'Patient/ddd94652-d077-454d-b252-bcb7c24e1de5',
                      policyId: 'out-of-box-policy-0001',
                      policyBusinessIdentifier: 'NoAccess',
                      type: 'People to People',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      signedOn: '',
                      name: 'Basic Access',
                      description: 'No Access',
                      enableFinancialDataMasking: 'FALSE',
                      status: '',
                      accessControl: 'Forbid access to all the data',
                      options: [],
                      implicit: 'TRUE',
                    },
                    {
                      relatedPersonUMPID: '65d2eff4a053e83c5b335279',
                      relatedPersonFirstName: 'JUNIPER',
                      relatedPersonLastName: 'MEYER',
                      relatedPersonMiddleName: '',
                      relatedPersonSuffix: '',
                      relatedPersonDob: '2018-07-28',
                      relatedPersonFHIRID:
                        '9355b876-2ba7-4d96-8630-e66b5616778c',
                      relatedPersonRoleType: 'Dependent',
                      relatedPersonNativeId: '91000945202-130508',
                      relatedPersonRelationshipTermDate:
                        '2044-07-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'b1bfed7b-430f-45dd-9563-7791fefe73a5',
                      relatedPersonMasterPatientFHIRID:
                        'faaaeab3-9643-4147-a52d-2dd71cc6eabe',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '941068203',
                      version: '0',
                      id: '3451b668-29c4-4307-aae7-6ad133f3c9b8',
                      createdAt: '2025-02-25T18:34:04Z',
                      modifiedAt: '2025-02-25T18:34:04Z',
                      createdBy: 'Arjun Muthalagu',
                      modifiedBy: 'Arjun Muthalagu',
                      deleted: 'FALSE',
                      performer: '',
                      requester: 'Patient/4b17879b-60db-42f2-bc0e-1e900aea3312',
                      requestee: 'Patient/b1bfed7b-430f-45dd-9563-7791fefe73a5',
                      policyId: 'out-of-box-policy-0002',
                      policyBusinessIdentifier: 'FullAccess',
                      type: 'People to People',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      signedOn: '',
                      name: 'Full Access',
                      description: 'Full Access',
                      enableFinancialDataMasking: 'FALSE',
                      status: '',
                      accessControl: 'Allow access to all the data',
                      options: [],
                      implicit: 'TRUE',
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
    const component = await renderUI();

    expect(screen.getByText('On My Plan')).toBeVisible();
    expect(
      screen.getByText(
        /Set the level of access for individuals on your health plan./i,
      ),
    ).toBeVisible();
    expect(screen.queryByText('Jessica Meyer')).toBeVisible();
    expect(screen.queryByText('DOB: 07/19/1964')).toBeVisible();
    expect(component).toMatchSnapshot();
  });

  it('should display alert message if member date of birth is 13 to 17 years old', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue(vRules);

    const selectedPlan = [
      {
        memberName: 'John Doe',
        DOB: '2010-01-01',
        isOnline: false,
        requesteeFHRID: '',
        requesteeUMPID: '',
        memberCk: '',
        accessStatus: AccessStatus.FullAccess,
        roleType: '',
        isMinor: true,
        isMatureMinor: false,
        accessStatusIsPending: false,
      },
    ];
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

    render(
      <ShareMyPlanComponent
        ShareMyPlanDetails={selectedPlan}
        infoIcon={false}
      />,
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(
      screen.getByText(
        'This is a minor dependent. Sharing permissions aren’t applicable with this account.',
      ),
    ).toBeInTheDocument();
  });

  it('should not display alert message if member date of birth is 13 to 17 years old', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue(vRules);

    const selectedPlan = [
      {
        memberName: 'John Doe',
        DOB: '1985-01-01',
        isOnline: false,
        requesteeFHRID: '',
        requesteeUMPID: '',
        memberCk: '',
        accessStatus: AccessStatus.BasicAccess,
        roleType: '',
        isMinor: false,
        isMatureMinor: false,
        accessStatusIsPending: false,
      },
    ];
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

    render(
      <ShareMyPlanComponent
        ShareMyPlanDetails={selectedPlan}
        infoIcon={false}
      />,
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(
      screen.queryByText(
        'This is a minor dependent. Sharing permissions aren’t applicable with this account.',
      ),
    ).not.toBeInTheDocument();
  });
});
