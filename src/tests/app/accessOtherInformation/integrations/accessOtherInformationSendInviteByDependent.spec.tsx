import AccessOtherInformationPage from '@/app/accessOthersInformation/page';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { createAxiosErrorForTest, fetchRespWrapper } from '@/tests/test_utils';
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
          role: UserRole.MEMBER,
          plan: {
            planName: 'BlueCross BlueShield of Tennessee',
            subId: '123456',
            grpId: '100000',
            memCk: '743573201',
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
describe('Send Access Invite by Dependent  - Access Other Information', () => {
  beforeEach(() => {
    const mockFormatDate = jest.requireMock(
      'src/utils/date_formatter',
    ).formatDateToLocale;
    mockFormatDate.mockReturnValueOnce('01/18/1985');
    mockFormatDate.mockReturnValueOnce('07/27/2000');
    mockFormatDate.mockReturnValueOnce('09/23/2020');
    const { dismissModal } = useAppModalStore.getState();
    dismissModal();
  });

  it('send invite API call by Dependent- Success Scenario', async () => {
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
                  memeCk: '743573201',
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
                      relatedPersonMemeCk: '730046700',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      policyId: 'out-of-box-policy-0001',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'Full Access',
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
                      name: 'Basic Access',
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
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    expect(screen.getByText('Juniper Meyer')).toBeVisible();
    expect(screen.getByText('Magnolia Meyer')).toBeVisible();
    fireEvent.click(screen.getByText('Update'));
    expect(
      screen.getByRole('heading', { name: 'Request Access' }),
    ).toBeVisible();
    expect(screen.getAllByText('Juniper Meyer').length).toBe(2);
    expect(screen.getAllByText('Full Access').length).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: /Send Request/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/userRegistration/sharePermission/sendInvite?memeck=743573201&requesteeFHRID=b1bfed7b-430f-45dd-9563-7791fefe73a5&requesteeEmailID=testuser@bcbst.com&requestType=Access',
      );
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Access Request Sent' }),
      ).toBeVisible();
    });
    expect(container).toMatchSnapshot();
  });

  it('send invite API call by Dependent- Success Scenario with multiple Update icons', async () => {
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
                  memeCk: '743573201',
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
                      relatedPersonMemeCk: '730046700',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      policyId: 'out-of-box-policy-0001',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'No Access',
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
                      name: 'Basic Access',
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
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    expect(screen.getByText('Juniper Meyer')).toBeVisible();
    expect(screen.getByText('Magnolia Meyer')).toBeVisible();
    expect(screen.getAllByText('Update').length).toBe(2);
    fireEvent.click(screen.getAllByText('Update')[0]);
    expect(
      screen.getByRole('heading', { name: 'Request Access' }),
    ).toBeVisible();
    expect(screen.getAllByText('Jessica Meyer').length).toBe(2);
    expect(screen.getAllByText('Basic Access').length).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: /Send Request/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/userRegistration/sharePermission/sendInvite?memeck=743573201&requesteeFHRID=ddd94652-d077-454d-b252-bcb7c24e1de5&requesteeEmailID=testuser@bcbst.com&requestType=Access',
      );
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Access Request Sent' }),
      ).toBeVisible();
    });
    expect(container).toMatchSnapshot();
  });

  it('send invite API call by Dependent - Failed Scenario', async () => {
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
                  memeCk: '743573201',
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
                      relatedPersonMemeCk: '730046700',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      policyId: 'out-of-box-policy-0001',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'Full Access',
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
                      name: 'Basic Access',
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
        },
      }),
    );
    mockedAxios.get.mockResolvedValueOnce(contactResponse);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          isEmailSent: 'false',
        },
      },
    });
    const container = await renderUI();
    // eslint-disable-next-line prettier/prettier
    expect(screen.getByText(/Access Others' Information/i)).toBeVisible();
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    fireEvent.click(screen.getByText('Update'));
    expect(
      screen.getByRole('heading', { name: 'Request Access' }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Send Request/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/userRegistration/sharePermission/sendInvite?memeck=743573201&requesteeFHRID=b1bfed7b-430f-45dd-9563-7791fefe73a5&requesteeEmailID=testuser@bcbst.com&requestType=Access',
      );
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Try Again Later' }),
      ).toBeVisible();
    });
    expect(container).toMatchSnapshot();
  });

  it('send invite API call by Dependent - API  400 bad request scenario', async () => {
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
                  memeCk: '743573201',
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
                      relatedPersonMemeCk: '730046700',
                      id: 'ec9ab8e7-fc4b-4534-9bca-fb0bc8b1540c',
                      policyId: 'out-of-box-policy-0001',
                      effectiveOn: '2024-11-11T05:00:00Z',
                      expiresOn: '',
                      name: 'Full Access',
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
                      name: 'Basic Access',
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
        },
      }),
    );
    mockedAxios.get.mockResolvedValueOnce(contactResponse);
    mockedAxios.get.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );
    const container = await renderUI();
    // eslint-disable-next-line prettier/prettier
    expect(screen.getByText(/Access Others' Information/i)).toBeVisible();
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    fireEvent.click(screen.getByText('Update'));
    expect(
      screen.getByRole('heading', { name: 'Request Access' }),
    ).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: /Send Request/i }));
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/userRegistration/sharePermission/sendInvite?memeck=743573201&requesteeFHRID=b1bfed7b-430f-45dd-9563-7791fefe73a5&requesteeEmailID=testuser@bcbst.com&requestType=Access',
      );
    });
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Try Again Later' }),
      ).toBeVisible();
    });
    expect(container).toMatchSnapshot();
  });
});
