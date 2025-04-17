import AccessOtherInformationPage from '@/app/accessOthersInformation/page';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
jest.setTimeout(30000);
jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '65d4458442db105635427958',
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
    }),
  ),
}));

jest.mock('src/utils/date_formatter', () => ({
  formatDateToLocale: jest.fn(),
}));

const contactResponse = {
  data: {
    data: {
      email: 'testuser@bcbst.com',
      email_verified_flag: true,
      phone: '7654387656',
      phone_verified_flag: true,
      umpi: 'pool5',
    },
  },
};

const renderUI = async () => {
  const component = await AccessOtherInformationPage();
  const { container } = render(
    <>
      <AppModal />
      {component}
    </>,
  );

  return container;
};
describe('Invite To Register - Access Other Information', () => {
  beforeEach(() => {
    const mockFormatDate = jest.requireMock(
      'src/utils/date_formatter',
    ).formatDateToLocale;
    mockFormatDate.mockReturnValueOnce('01/18/1985');
    mockFormatDate.mockReturnValueOnce('07/27/2000');
    const { dismissModal } = useAppModalStore.getState();
    dismissModal();
  });
  it('send invite API call- Success Scenario', async () => {
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
              zip: '',
              phoneNumber: '',
              relationshipInfo: [
                {
                  personRoleType: 'Subscriber',
                  patientFHIRID: '4b17879b-60db-42f2-bc0e-1e900aea3312',
                  masterPatientFHIRID: 'c24ff5df-b104-4fa7-b864-81875d79a946',
                  org: 'bcbst.facets',
                  nativeId: '91000945200-130508',
                  userName: 'meyermatt0',
                  memeCk: '147235702',
                  roleTermDate: '2199-12-31T00:00:00.000Z',
                  primaryPlanFlag: 'FALSE',
                  clientId: 'EI',
                  multiPlanConfirmed: 'FALSE',
                  multiPlanConfirmedDate: '',
                  approvalRequestId: '',
                  relatedPersons: [
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
                        '9355b876-2ba7-4d96-8630-e66b5616778c',
                      relatedPersonMasterPatientFHIRID:
                        'faaaeab3-9643-4147-a52d-2dd71cc6eabe',
                      relatedPersonApprovalRequestId: '',
                      relatedPersonMemeCk: '941068203',
                      version: '0',
                      id: '3451b668-29c4-4307-aae7-6ad133f3c9b8',
                      createdAt: '2025-02-25T18:34:04Z',
                      modifiedAt: '2025-02-25T18:34:04Z',
                      createdBy: 'Test User',
                      modifiedBy: 'Test User',
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
    mockedAxios.get.mockResolvedValueOnce(contactResponse);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          isEmailSent: 'true',
        },
      },
    });
    const container = await renderUI();

    // eslint-disable-next-line prettier/prettier
    expect(screen.getByText(/Access Others' Information/i)).toBeVisible();
    expect(screen.getByText('Juniper Meyer')).toBeVisible();
    fireEvent.click(screen.getByText('Invite to Register'));
    expect(screen.getByText('Their Email Address')).toBeVisible();
    const emailAddress = screen.getByRole('textbox', {
      name: 'Their Email Address',
    });
    await userEvent.type(emailAddress, 'abc@bcbst.com');
    const confirmEmailAddress = screen.getByRole('textbox', {
      name: 'Confirm Their Email Address',
    });
    await userEvent.type(confirmEmailAddress, 'abc@bcbst.com');
    fireEvent.click(screen.getByRole('button', { name: /Send Invite/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/userRegistration/sharePermission/sendInvite?memeck=941068203&requesteeFHRID=9355b876-2ba7-4d96-8630-e66b5616778c&requesteeEmailID=abc@bcbst.com&requestType=Invite',
      );
    });
    expect(container).toMatchSnapshot();
  });
});
