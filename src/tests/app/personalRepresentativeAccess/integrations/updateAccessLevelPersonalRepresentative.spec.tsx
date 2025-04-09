import PersonalRepresentativePage from '@/app/personalRepresentativeAccess/page';
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
  const component = await PersonalRepresentativePage();
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

describe('Updating Level of Access for Personal Representative', () => {
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
                      id: 'e7d4e7e9-5f98-4e35-9141-de8c8eb944a6',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '2026-11-11T05:00:00Z',
                      policyId: 'out-of-box-policy-0002',
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
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=Testuser553&isPBERequired=true&isConsentRequired=true',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['Testuser553'] },
      },
    );
    expect(screen.getByText('Personal Representative Access')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(screen.getByText('DOB: 07/20/1964')).toBeVisible();
    expect(screen.getByText('Basic Access as of 01/01/2024')).toBeVisible();

    expect(screen.getByText('Update')).toBeVisible();

    fireEvent.click(screen.getByText('Update'));

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
        '/consentOperations/updateConsent?consentId=e7d4e7e9-5f98-4e35-9141-de8c8eb944a6',
        {
          effectiveOn: '2024-11-11T05:00:00Z',
          expiresOn: '2026-11-11T05:00:00Z',
          policyId: 'out-of-box-policy-0002',
          requestType: 'update',
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
                      id: 'e7d4e7e9-5f98-4e35-9141-de8c8eb944a6',
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
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=Testuser553&isPBERequired=true&isConsentRequired=true',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['Testuser553'] },
      },
    );
    expect(screen.getByText('Personal Representative Access')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(screen.getByText('DOB: 07/20/1964')).toBeVisible();
    expect(screen.getByText('Basic Access as of 01/01/2024')).toBeVisible();

    expect(screen.getByText('Update')).toBeVisible();

    fireEvent.click(screen.getByText('Update'));

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
        '/consentOperations/updateConsent?consentId=e7d4e7e9-5f98-4e35-9141-de8c8eb944a6',
        {
          effectiveOn: '2024-11-11T05:00:00Z',
          expiresOn: '2026-11-11T05:00:00Z',
          policyId: 'out-of-box-policy-0002',
          requestType: 'update',
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
