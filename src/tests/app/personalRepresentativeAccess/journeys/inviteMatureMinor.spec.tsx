import PersonalRepresentativePage from '@/app/personalRepresentativeAccess/page';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '65d4458442db105635427958',
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
    }),
  ),
}));

jest.mock('src/utils/date_formatter', () => ({
  formatDateToLocale: jest.fn(),
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
describe('Inviting Mature Minor to regsiter online', () => {
  beforeEach(() => {
    const mockFormatDate = jest.requireMock(
      'src/utils/date_formatter',
    ).formatDateToLocale;
    mockFormatDate.mockReturnValueOnce('01/18/1985');
    const { dismissModal } = useAppModalStore.getState();
    dismissModal();
  });
  it('should show member details and Invite', async () => {
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
                        relatedPersonFHIRID:
                          'ddd94652-d077-454d-b252-bcb7c24e1de5',
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
                        relatedPersonFHIRID:
                          'ddd94652-d077-454d-b252-bcb7c24e1de5',
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
                hasAccount: false,
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
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          isEmailSent: 'true',
        },
      },
    });

    const component = await renderUI();

    // eslint-disable-next-line prettier/prettier
    expect(screen.getByText('Understanding Access')).toBeVisible();
    expect(screen.getByText('Members You Represent')).toBeVisible();
    expect(screen.getByText('Rafusal Claud')).toBeVisible();
    fireEvent.click(screen.getByText('Invite to Register'));
    expect(
      screen.getByRole('heading', { name: 'Invite to Register' }),
    ).toBeVisible();

    const inputEmail = screen.getAllByRole('textbox', {
      name: /Their Email Address/i,
    })[0];
    const inputConfirmationEmail = screen.getByRole('textbox', {
      name: /Confirm Their Email Address/i,
    });
    fireEvent.change(inputEmail, { target: { value: 'testuser@bcbst.com' } });
    fireEvent.change(inputConfirmationEmail, {
      target: { value: 'testuser@bcbst.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Invite/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/userRegistration/sharePermission/sendInvite?memeck=502622001&requesteeFHRID=ddd94652-d077-454d-b252-bcb7c24e1de5&requesteeEmailID=testuser@bcbst.com&requestType=Invite',
      );
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Invitation to Register Sent' }),
      ).toBeVisible();
    });
    fireEvent.click(screen.getByRole('button', { name: /Done/i }));
    expect(screen.getByText('Pending...')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
