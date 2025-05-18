import ShareMyInformationPage from '@/app/shareMyInformation/page';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

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

describe('Share My Information Page', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });
  it('Share My Information,Understanding Sharing My Information - GA events', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue(vRules);

    const component = await renderUI();
    expect(
      screen.getByText('Understanding Sharing My Information'),
    ).toBeVisible();
    expect(screen.getByText('Full Sharing')).toBeVisible();
    fireEvent.click(screen.getByText('Full Sharing'));

    expect(
      screen.getByText(
        'The information we will disclose may reveal other sensitive health information about the Member, including information about treatment for substance use disorders (drugs/alcohol), mental or behavioral health disorders, HIV/AIDS, sexually transmitted diseases (STDs), communicable diseases, developmental or intellectual disabilities, genetic disorders (including genetic testing for such disorders and genetic history) or other sensitive information.',
      ),
    ).toBeVisible();
    expect(window.dataLayer).toContainEqual({
      event: 'select_content',
      click_text: 'Full Sharing',
      click_url: undefined,
      page_section: undefined,
      selection_type: 'accordion',
      element_category: 'Understanding Sharing My Information',
      action: 'expand',
    });
    expect(component).toMatchSnapshot();
  });

  it('Share My Information click Update - GA events', async () => {
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
                      description: 'Basic Access',
                      enableFinancialDataMasking: 'FALSE',
                      status: '',
                      accessControl: 'Forbid access to all the data',
                      options: [],
                      implicit: 'TRUE',
                    },
                  ],
                },
              ],
            },
          ],
        },
      }),
    );
    const component = await renderUI();
    expect(
      screen.getByText('Understanding Sharing My Information'),
    ).toBeVisible();
    expect(screen.getByText('Full Sharing')).toBeVisible();
    expect(screen.getByText('Jessica Meyer')).toBeVisible();
    expect(screen.getByText('DOB: 07/19/1964')).toBeVisible();
    expect(screen.getByText('Update')).toBeVisible();
    fireEvent.click(screen.getByText('Update'));
    expect(window.dataLayer).toContainEqual({
      event: 'select_content',
      click_text: 'Update',
      click_url: undefined,
      page_section: undefined,
      selection_type: 'modal',
      element_category: 'On My Plan',
      action: 'click',
    });
    expect(component).toMatchSnapshot();
  });
});
