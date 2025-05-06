process.env.ENCRYPTION_SECRET = 'cb1a1f3b9f5dee0ba529d7a73f777882';
process.env.ES_API_POLICY_ID = 'aa080f071f4e8f1ce4ab0072d2aeaa12';
process.env.ES_API_APP_ID =
  '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef';

import { AccountDeactivationResponse } from '@/app/(protected)/(common)/member/login/models/api/account_deactivative_response';
import { LoginResponse } from '@/app/(protected)/(common)/member/login/models/api/login';
import LogInPage from '@/app/(protected)/(common)/member/login/page';
import { useLoginStore } from '@/app/(protected)/(common)/member/login/stores/loginStore';
import { ESResponse } from '@/models/enterprise/esResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockReplace = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
      refresh: mockRefresh,
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

jest.setTimeout(30000);

const setupUI = () => {
  render(<LogInPage />);
  const inputUsername = screen.getByRole('textbox', {
    name: /username/i,
  });
  const inputPassword = screen.getByLabelText(/password/i, {
    selector: 'input',
  });
  const loginButton = screen.getByRole('button', {
    name: /Log In/i,
  });

  return { inputUsername, inputPassword, loginButton };
};
const resetToHome = useLoginStore.getState().resetToHome;

describe('Log In User whose status is Duplicate Account', () => {
  afterEach(() => {
    resetToHome();
  });

  it('User should see redirect to dashboard page after success of account deactivation', async () => {
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
      }),
    );

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Duplicate_Account',
          interactionId: '00585a05-69b7-4b95-ad72-87d7354de7a2',
          interactionToken:
            '9ec9b4378c914db7d8ef2f15d8ec26d66eb2ad9d481288b2d540573dfde33eed94c8d01d24630a125680e5d035a61e541f24421ec76ab8bd70fe7f85c9ff61ae9bb95b775d894180c9ea09d5a695fcaccf9f7a5738e6df462d2809318cf393d7abc5d982e9f0fb279c63faf58ad806ba7ce8a371d9f576f31ff3ed81a35a7c54',
        },
        details: {
          componentName: 'mfauthentication',
          componentStatus: 'Success',
          returnCode: '0',
          subSystemName: 'Multiple Services',
          message: '',
          problemTypes: '0',
          innerDetails: {
            statusDetails: [
              {
                componentName: 'getSDKToken',
                componentStatus: 'Success',
                returnCode: '0',
                subSystemName: '',
                message: '',
                problemTypes: '0',
                innerDetails: {
                  statusDetails: [],
                },
              },
            ],
          },
        },
      } satisfies ESResponse<LoginResponse>,
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          status: 'OK',
          message:
            'Deactivation request for duplicates accounts is received successfully.',
        },
        details: {
          componentName: 'AcctCredentials',
          componentStatus: 'Success',
          returnCode: '0',
          subSystemName: 'AcctCredentials',
          message: '',
          problemTypes: '0',
          innerDetails: {
            statusDetails: [
              {
                componentName: 'AcctCredentials',
                componentStatus: 'Success',
                returnCode: '0',
                subSystemName: 'None',
                message: 'Success',
                problemTypes: '0',
                innerDetails: {
                  statusDetails: ['string'],
                },
              },
            ],
          },
        },
      } satisfies ESResponse<AccountDeactivationResponse>,
    });

    const ui = setupUI();

    await userEvent.type(ui.inputUsername, 'username');
    await userEvent.type(ui.inputPassword, 'password');
    // The input username field should have the value
    expect(ui.inputUsername).toHaveValue('username');
    // The input password field should have the password
    expect(ui.inputPassword).toHaveValue('password');

    userEvent.click(ui.loginButton);
    // Should show login indicator
    await waitFor(() => {
      expect(screen.getByLabelText(/Logging In.../i)).toBeInTheDocument();
    });
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/loginAuthentication',
      {
        appId:
          '9caf7bfcb9e40cf575bf301b36ce6d7c37b23b3b6b070eca18122a4118db14cddc194cce8aba2608099a1252bcf7f7aa8c2bd2fcb918959218ac8d93ba6782b20805ad8b6bc5653743b9e8357f7b2bde09f1ae2dbf843d5bb2102c45f33e0386165b19d629d06b068daa805f18b898fe53da1f0b585b248c11d944f17ee58cef',
        ipAddress: '1',
        password: 'password',
        policyId: 'aa080f071f4e8f1ce4ab0072d2aeaa12',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36', // mock User Agent,
        username: 'username',
        deviceProfile: 'Testing',
      },
    );

    // Check the checkbox to enable the button
    fireEvent.click(screen.getByRole('checkbox'));
    // Ensure the mockedAxios.get call is made after the button click
    fireEvent.click(screen.getByText('Continue With This Username'));

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/accountCredentials/accountDisable?primaryUserName=Testuser553&umpiId=57c85test3ebd23c7db88245',
      );
    });

    await waitFor(() => {
      // Assert the user is taken to the security
      expect(mockReplace).toHaveBeenCalledWith('/security');
    });
  });
});
