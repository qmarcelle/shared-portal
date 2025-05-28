import ShareMyInformationPage from '@/app/shareMyInformation/page';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const vRules = {
  user: {
    id: 'Testuser553',
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
    vRules: {
      active: true,
      matureMinor: true,
    },
  },
};
jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));
const renderUI = async () => {
  const component = await ShareMyInformationPage();
  const { container } = render(
    <>
      <AppModal />
      {component}
    </>,
  );

  return container;
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Create Consent Level of Access for Share My Information', () => {
  beforeEach(() => {
    const { dismissModal } = useAppModalStore.getState();
    dismissModal();
  });
  it('API Success Scenario', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.active = true;
    vRules.user.vRules.matureMinor = true;
    vRules.user.currUsr.role = UserRole.MEMBER;
    mockAuth.mockResolvedValue(vRules);

    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper({
        data: {
          getPBEmessage: 'Person Record fetched Successfully ',
          getConsentmessage: 'Person Record fetched Successfully ',
          getPBECorrelationId: '0124b43b-efd0-42bc-b904-cb2ac9c712b9',
          consentCorrelationId: 'cd30f2b3-3bae-42f3-b93a-8fa42f3884e7',
          getPBEDetails: [
            {
              umpid: '65d4458442db105635427958',
              firstName: 'MATTHEW',
              middleName: '',
              lastName: 'MEYER',
              dob: '1977-07-31',
              suffix: '',
              userName: '',
              personFHIRID: 'efe8eb7b-1801-4528-bbab-df0bd691b281',
              gender: 'M',
              email: '',
              address1: '',
              address2: '',
              city: '',
              state: '',
              zip: 2345,
              phoneNumber: '',
              relationshipInfo: [
                {
                  personRoleType: 'Dependent',
                  patientFHIRID: '4b17879b-60db-42f2-bc0e-1e900aea3312',
                  org: 'bcbst.facets',
                  nativeId: '91000945200-130508',
                  userName: 'meyermatt0',
                  memeCk: '147235702',
                  roleTermDate: '2199-12-31T00:00:00.000Z',
                  primaryPlanFlag: false,
                  clientId: 'EI',
                  multiPlanConfirmed: false,
                  multiPlanConfirmedDate: '',
                  approvalRequestId: '',
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
                      relatedPersonRoleType: 'Subscriber',
                      relatedPersonNativeId: '91000945201-130508',
                      relatedPersonRelationshipTermDate:
                        '2199-12-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'ddd94652-d077-454d-b252-bcb7c24e1de5',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '147235702',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      policyId: 'out-of-box-policy-0001',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '2024-12-12T05:00:00Z',
                      name: 'Basic Access',
                      implicit: true,
                      status: 'active',
                      performer: 'john.doe@bcbst.com',
                      requester: 'Person/24baffdb-76b7-4cb1-bf97-47f4bcf5574a',
                      requestees:
                        'Patient/e3c212e5-1b7f-4521-8ba1-3b48befa98d6',
                      policyBusinessIdentifier: 'pol_10237_lim_ac',
                      type: 'PEOPLE_TO_PEOPLE',
                      firstName: 'JESSICA',
                      lastName: 'MEYER',
                    },
                    {
                      relatedPersonUMPID: '65d2eff4a053e83c5b335279',
                      relatedPersonFirstName: 'JUNIPER',
                      relatedPersonLastName: 'MEYER',
                      relatedPersonMiddleName: '',
                      relatedPersonSuffix: '',
                      relatedPersonDob: '2000-07-28',
                      relatedPersonFHIRID:
                        '9355b876-2ba7-4d96-8630-e66b5616778c',
                      relatedPersonRoleType: 'Dependent',
                      relatedPersonNativeId: '91000945202-130508',
                      relatedPersonRelationshipTermDate:
                        '2044-07-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'b1bfed7b-430f-45dd-9563-7791fefe73a5',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '730046702',
                      id: '3451b668-29c4-4307-aae7-6ad133f3c9b8',
                      policyId: 'out-of-box-policy-0002',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'No Access',
                    },
                    {
                      relatedPersonUMPID: '65d417545933377f545fe352',
                      relatedPersonFirstName: 'MAGNOLIA',
                      relatedPersonLastName: 'MEYER',
                      relatedPersonMiddleName: '',
                      relatedPersonSuffix: '',
                      relatedPersonDob: '2020-09-24',
                      relatedPersonFHIRID:
                        'ffdd4385-7abe-47c5-8e54-326a28f802fd',
                      relatedPersonRoleType: 'Dependent',
                      relatedPersonNativeId: '90696602903-80616',
                      relatedPersonRelationshipTermDate:
                        '2020-12-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'b805bdee-0088-418c-b3b1-eed78d1983c4',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '730046703',
                      id: '3451b668-29c4-4307-aae7-6ad133f3c9b8',
                      policyId: 'out-of-box-policy-0002',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'No Access',
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
    expect(mockedFetch).toHaveBeenCalledWith(
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=Testuser553&isPBERequired=true&isConsentRequired=false',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['Testuser553'] },
      },
    );
    expect(screen.getByText('On My Plan')).toBeVisible();
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    expect(screen.getAllByText('DOB: 01/19/1985')[0]);
    expect(screen.getAllByText('Update')[0]);

    fireEvent.click(screen.getAllByText('Update')[0]);

    expect(
      screen.getByRole('heading', { name: 'Edit Level Of Access' }),
    ).toBeVisible();

    expect(screen.getByText('Edit Level Of Access')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Save Permissions')).toBeVisible();
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Success',
        },
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Permissions/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/consentOperations/createConsent',
        {
          performer: 'john.doe@bcbst.com',
          requester: 'Person/24baffdb-76b7-4cb1-bf97-47f4bcf5574a',
          requestees: 'Patient/e3c212e5-1b7f-4521-8ba1-3b48befa98d6',
          policyBusinessIdentifier: 'pol_10237_lim_ac',
          type: 'PEOPLE_TO_PEOPLE',
          effectiveOn: '2024-11-11T05:00:00Z',
          expiresOn: '2024-12-12T05:00:00Z',
          firstName: 'JESSICA',
          lastName: 'MEYER',
        },
      );
    });
    expect(component).toMatchSnapshot();
  });
  it('API Failure Scenario', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.active = true;
    vRules.user.vRules.matureMinor = true;
    vRules.user.currUsr.role = UserRole.MEMBER;
    mockAuth.mockResolvedValue(vRules);

    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper({
        data: {
          getPBEmessage: 'Person Record fetched Successfully ',
          getConsentmessage: 'Person Record fetched Successfully ',
          getPBECorrelationId: '0124b43b-efd0-42bc-b904-cb2ac9c712b9',
          consentCorrelationId: 'cd30f2b3-3bae-42f3-b93a-8fa42f3884e7',
          getPBEDetails: [
            {
              umpid: '65d4458442db105635427958',
              firstName: 'MATTHEW',
              middleName: '',
              lastName: 'MEYER',
              dob: '1977-07-31',
              suffix: '',
              userName: '',
              personFHIRID: 'efe8eb7b-1801-4528-bbab-df0bd691b281',
              gender: 'M',
              email: '',
              address1: '',
              address2: '',
              city: '',
              state: '',
              zip: 2345,
              phoneNumber: '',
              relationshipInfo: [
                {
                  personRoleType: 'Dependent',
                  patientFHIRID: '4b17879b-60db-42f2-bc0e-1e900aea3312',
                  org: 'bcbst.facets',
                  nativeId: '91000945200-130508',
                  userName: 'meyermatt0',
                  memeCk: '147235702',
                  roleTermDate: '2199-12-31T00:00:00.000Z',
                  primaryPlanFlag: false,
                  clientId: 'EI',
                  multiPlanConfirmed: false,
                  multiPlanConfirmedDate: '',
                  approvalRequestId: '',
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
                      relatedPersonRoleType: 'Subscriber',
                      relatedPersonNativeId: '91000945201-130508',
                      relatedPersonRelationshipTermDate:
                        '2199-12-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'ddd94652-d077-454d-b252-bcb7c24e1de5',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '147235702',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      policyId: 'out-of-box-policy-0001',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '2024-12-12T05:00:00Z',
                      name: 'Basic Access',
                      implicit: true,
                      status: 'active',
                      performer: 'john.doe@bcbst.com',
                      requester: 'Person/24baffdb-76b7-4cb1-bf97-47f4bcf5574a',
                      requestees:
                        'Patient/e3c212e5-1b7f-4521-8ba1-3b48befa98d6',
                      policyBusinessIdentifier: 'pol_10237_lim_ac',
                      type: 'PEOPLE_TO_PEOPLE',
                      firstName: 'JESSICA',
                      lastName: 'MEYER',
                    },
                    {
                      relatedPersonUMPID: '65d2eff4a053e83c5b335279',
                      relatedPersonFirstName: 'JUNIPER',
                      relatedPersonLastName: 'MEYER',
                      relatedPersonMiddleName: '',
                      relatedPersonSuffix: '',
                      relatedPersonDob: '2000-07-28',
                      relatedPersonFHIRID:
                        '9355b876-2ba7-4d96-8630-e66b5616778c',
                      relatedPersonRoleType: 'Dependent',
                      relatedPersonNativeId: '91000945202-130508',
                      relatedPersonRelationshipTermDate:
                        '2044-07-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'b1bfed7b-430f-45dd-9563-7791fefe73a5',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '730046702',
                      id: '3451b668-29c4-4307-aae7-6ad133f3c9b8',
                      policyId: 'out-of-box-policy-0002',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'No Access',
                    },
                    {
                      relatedPersonUMPID: '65d417545933377f545fe352',
                      relatedPersonFirstName: 'MAGNOLIA',
                      relatedPersonLastName: 'MEYER',
                      relatedPersonMiddleName: '',
                      relatedPersonSuffix: '',
                      relatedPersonDob: '2020-09-24',
                      relatedPersonFHIRID:
                        'ffdd4385-7abe-47c5-8e54-326a28f802fd',
                      relatedPersonRoleType: 'Dependent',
                      relatedPersonNativeId: '90696602903-80616',
                      relatedPersonRelationshipTermDate:
                        '2020-12-31T00:00:00.000Z',
                      relatedPersonPatientFHIRID:
                        'b805bdee-0088-418c-b3b1-eed78d1983c4',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '730046703',
                      id: '3451b668-29c4-4307-aae7-6ad133f3c9b8',
                      policyId: 'out-of-box-policy-0002',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'No Access',
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
    expect(mockedFetch).toHaveBeenCalledWith(
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=Testuser553&isPBERequired=true&isConsentRequired=false',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['Testuser553'] },
      },
    );
    expect(screen.getByText('On My Plan')).toBeVisible();
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    expect(screen.getAllByText('Update')[0]);

    fireEvent.click(screen.getAllByText('Update')[0]);

    expect(
      screen.getByRole('heading', { name: 'Edit Level Of Access' }),
    ).toBeVisible();

    expect(screen.getByText('Edit Level Of Access')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Save Permissions')).toBeVisible();
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Failure',
        },
      },
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Permissions/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/consentOperations/createConsent',
        {
          performer: 'john.doe@bcbst.com',
          requester: 'Person/24baffdb-76b7-4cb1-bf97-47f4bcf5574a',
          requestees: 'Patient/e3c212e5-1b7f-4521-8ba1-3b48befa98d6',
          policyBusinessIdentifier: 'pol_10237_lim_ac',
          type: 'PEOPLE_TO_PEOPLE',
          effectiveOn: '2024-11-11T05:00:00Z',
          expiresOn: '2024-12-12T05:00:00Z',
          firstName: 'JESSICA',
          lastName: 'MEYER',
        },
      );
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Try Again Later' }),
      ).toBeVisible();
    });
    expect(component).toMatchSnapshot();
  });
});
