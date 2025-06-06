import AccessOthersInformationPage from '@/app/accessOthersInformation/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

mockedFetch.mockResolvedValueOnce(
  fetchRespWrapper({
    data: {
      getPBEmessage: 'Person Record fetched Successfully ',
      getPBECorrelationId: '177d46e6-dcce-4fde-9b37-a5c83d23f606',
      getPBEDetails: [
        {
          umpid: '65d2e2f5497bf42cd43c70d2',
          firstName: 'JAQUANA',
          middleName: 'H',
          lastName: 'WILLIAMS',
          dob: '1982-12-30',
          suffix: '',
          userName: '',
          personFHIRID: '2095c29f-cdd6-4041-b07f-92a600b96ef5',
          gender: 'F',
          email: 'joshua_schklar@bcbst.com',
          address1: '505 SLIM ST',
          address2: '',
          city: 'INDIANOLA',
          state: 'MS',
          zip: 38751,
          phoneNumber: '6157089053',
          hasAccount: true,
          relationshipInfo: [
            {
              personRoleType: 'Dependent',
              patientFHIRID: '2f3662a9-3e26-4b77-a890-726b5f4b09cb',
              masterPatientFHIRID: '3592d8a7-2a0c-495f-b25b-a4ffce04e45b',
              org: 'bcbst.facets',
              nativeId: '90042469502-87898',
              userName: 'm900424695',
              memeCk: '54758353',
              roleTermDate: '2199-12-31',
              primaryPlanFlag: 'FALSE',
              clientId: 'EI',
              multiPlanConfirmed: 'FALSE',
              multiPlanConfirmedDate: '',
              approvalRequestId: '',
              relatedPersons: [
                {
                  relatedPersonUMPID: '65d3d344b13e1a7e4cc07265',
                  relatedPersonFirstName: 'JASMINE',
                  relatedPersonLastName: 'WILLIAMS',
                  relatedPersonMiddleName: '',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '2001-10-08',
                  relatedPersonFHIRID: '7a5d633f-b4bc-4535-b44d-ba5359ba8018',
                  relatedPersonRoleType: 'Dependent',
                  relatedPersonNativeId: '90042469501-87898',
                  relatedPersonRelationshipTermDate: '2027-10-31',
                  relatedPersonPatientFHIRID:
                    'd68816e6-6b8e-4624-93a1-998c2126bb21',
                  relatedPersonMasterPatientFHIRID:
                    'cba766c9-7a5b-43d6-87bf-ca76b63eb55e',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '54758352',
                },
                {
                  relatedPersonUMPID: '65d43e21af192d5acc98fe49',
                  relatedPersonFirstName: 'PRESLEY',
                  relatedPersonLastName: 'WILLIAMS',
                  relatedPersonMiddleName: 'R',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '2007-04-08',
                  relatedPersonFHIRID: 'cbb393f7-1b6a-43bd-9e1c-3cef747000f5',
                  relatedPersonRoleType: 'Dependent',
                  relatedPersonNativeId: '90042469504-87898',
                  relatedPersonRelationshipTermDate: '2036-05-31',
                  relatedPersonPatientFHIRID:
                    '0ddf2013-40b3-4fc7-a758-c8a641e61676',
                  relatedPersonMasterPatientFHIRID:
                    '47099149-9ee4-44dd-8d38-e646ccb84345',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '54758355',
                },
                {
                  relatedPersonUMPID: '65d4fc801571f425de7c2c4d',
                  relatedPersonFirstName: 'LEMOND',
                  relatedPersonLastName: 'WILLIAMS',
                  relatedPersonMiddleName: '',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '1974-07-18',
                  relatedPersonFHIRID: '202d0d80-e05f-4486-87fc-9101ce49816f',
                  relatedPersonRoleType: 'Subscriber',
                  relatedPersonNativeId: '90042469500-87898',
                  relatedPersonRelationshipTermDate: '2199-12-31',
                  relatedPersonPatientFHIRID:
                    'a0594698-f7e8-47a2-9eda-caa235890d58',
                  relatedPersonMasterPatientFHIRID:
                    '37d9bd7b-0a4b-4c71-8cd3-7d62c9e757fe',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '54758351',
                },
                {
                  relatedPersonUMPID: '65d5bd8d1571f425de7e582a',
                  relatedPersonFirstName: 'PAILI- GRACE',
                  relatedPersonLastName: 'WILLIAMS',
                  relatedPersonMiddleName: '',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '2020-03-05',
                  relatedPersonFHIRID: '119b010e-d608-42df-9eb4-7fa6b753cfd0',
                  relatedPersonRoleType: 'Dependent',
                  relatedPersonNativeId: '90042469503-87898',
                  relatedPersonRelationshipTermDate: '2046-03-31',
                  relatedPersonPatientFHIRID:
                    '624e738c-10ee-448d-9875-5a635e534299',
                  relatedPersonMasterPatientFHIRID:
                    '93c3e96d-d407-4e91-aa14-d4e2111bd58f',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '54758354',
                },
                {
                  relatedPersonUMPID: '67f5617015c21e3531ce9dad',
                  relatedPersonFirstName: 'LEMOND',
                  relatedPersonLastName: 'WILLIAMS',
                  relatedPersonMiddleName: '',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '1974-07-18',
                  relatedPersonFHIRID: 'f7be977a-b1bf-42e8-8fd5-1fdceadb5396',
                  relatedPersonRoleType: 'AU',
                  relatedPersonNativeId: '',
                  relatedPersonRelationshipTermDate: 'Null',
                  relatedPersonPatientFHIRID: '',
                  relatedPersonMasterPatientFHIRID: '',
                  relatedPersonApprovalRequestId: '727994786063169',
                  relatedPersonMemeCk: 0,
                },
                {
                  relatedPersonUMPID: '681286ab2a4eb81d451a9384',
                  relatedPersonFirstName: 'BIANKA',
                  relatedPersonLastName: 'SANDERS',
                  relatedPersonMiddleName: '',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '2000-02-27',
                  relatedPersonFHIRID: '63b2626b-ad8d-4d5c-88ca-bd4988ea3f4e',
                  relatedPersonRoleType: 'PR',
                  relatedPersonNativeId: '',
                  relatedPersonRelationshipTermDate: 'Null',
                  relatedPersonPatientFHIRID: '',
                  relatedPersonMasterPatientFHIRID: '',
                  relatedPersonApprovalRequestId: '176853284200012',
                  relatedPersonMemeCk: 0,
                },
              ],
            },
            {
              personRoleType: 'AU',
              patientFHIRID: '',
              masterPatientFHIRID: '',
              org: 'bcbst.prau',
              nativeId: '',
              userName: '',
              memeCk: '0',
              roleTermDate: '',
              primaryPlanFlag: 'FALSE',
              clientId: '',
              multiPlanConfirmed: 'FALSE',
              multiPlanConfirmedDate: '',
              approvalRequestId: '215064786061469',
              relatedPersons: [
                {
                  relatedPersonUMPID: '65d2e2ff64873667162b82d5',
                  relatedPersonFirstName: 'CORY',
                  relatedPersonLastName: 'ROACH',
                  relatedPersonMiddleName: 'M',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '1980-11-10',
                  relatedPersonFHIRID: '69227329-4882-443d-a5ef-e2ace87f1c07',
                  relatedPersonRoleType: 'Subscriber',
                  relatedPersonNativeId: '91000935300-130508',
                  relatedPersonRelationshipTermDate: '2199-12-31',
                  relatedPersonPatientFHIRID:
                    'cb4025c1-8ec1-4133-ab71-eacd51cca198',
                  relatedPersonMasterPatientFHIRID:
                    '5857b4b6-ec1f-4a07-87c0-4881d473167e',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '941063251',
                  version: '0',
                  id: '1b9627dd-a43b-41cb-a71d-bb32ac6e4b71',
                  createdAt: '2025-02-25T18:33:52Z',
                  modifiedAt: '2025-02-25T18:33:52Z',
                  createdBy: 'Arjun Muthalagu',
                  modifiedBy: 'Arjun Muthalagu',
                  deleted: 'FALSE',
                  performer: '',
                  requester: 'Person/2095c29f-cdd6-4041-b07f-92a600b96ef5',
                  requestee: 'Patient/cb4025c1-8ec1-4133-ab71-eacd51cca198',
                  policyId: 'out-of-box-policy-0003',
                  policyBusinessIdentifier: 'LimitedAccess',
                  type: 'People to People',
                  effectiveOn: '2025-04-14T00:00:00Z',
                  expiresOn: '',
                  signedOn: '',
                  name: 'Limited Access',
                  description: 'Limited Access',
                  enableFinancialDataMasking: 'FALSE',
                  status: '',
                  accessControl: 'Allow access to all the data with exceptions',
                  options: [],
                  implicit: 'TRUE',
                },
              ],
            },
            {
              personRoleType: 'AU',
              patientFHIRID: '',
              masterPatientFHIRID: '',
              org: 'bcbst.prau',
              nativeId: '',
              userName: '',
              memeCk: '0',
              roleTermDate: '',
              primaryPlanFlag: 'FALSE',
              clientId: '',
              multiPlanConfirmed: 'FALSE',
              multiPlanConfirmedDate: '',
              approvalRequestId: '315064716061469',
              relatedPersons: [
                {
                  relatedPersonUMPID: '65d3deaf5933377f545f4543',
                  relatedPersonFirstName: 'AMANDA',
                  relatedPersonLastName: 'ASHE',
                  relatedPersonMiddleName: 'M',
                  relatedPersonSuffix: '',
                  relatedPersonDob: '1987-05-04',
                  relatedPersonFHIRID: 'c99d0144-66a4-4853-bdee-e2273492b07a',
                  relatedPersonRoleType: 'Subscriber',
                  relatedPersonNativeId: '90690393100-104650',
                  relatedPersonRelationshipTermDate: '2019-04-30T00:00:00Z',
                  relatedPersonPatientFHIRID:
                    '2db7eeac-679a-4375-bc94-720d647d49ae',
                  relatedPersonMasterPatientFHIRID:
                    'ebfbcb13-befc-4595-9157-b1828d70a269',
                  relatedPersonApprovalRequestId: '',
                  relatedPersonMemeCk: '726492501',
                  version: '0',
                  id: '1b9627dd-a43b-41cb-a71d-bb32ac6e4b71',
                  createdAt: '2025-02-25T18:33:52Z',
                  modifiedAt: '2025-02-25T18:33:52Z',
                  createdBy: 'Arjun Muthalagu',
                  modifiedBy: 'Arjun Muthalagu',
                  deleted: 'FALSE',
                  performer: '',
                  requester: 'Person/2095c29f-cdd6-4041-b07f-92a600b96ef5',
                  requestee: 'Patient/2db7eeac-679a-4375-bc94-720d647d49ae',
                  policyId: 'out-of-box-policy-0003',
                  policyBusinessIdentifier: 'LimitedAccess',
                  type: 'People to People',
                  effectiveOn: '2025-04-15T00:00:00Z',
                  expiresOn: '',
                  signedOn: '',
                  name: 'Limited Access',
                  description: 'Limited Access',
                  enableFinancialDataMasking: 'FALSE',
                  status: '',
                  accessControl: 'Allow access to all the data with exceptions',
                  options: [],
                  implicit: 'TRUE',
                },
              ],
            },
          ],
        },
      ],
    },
    details: {
      componentName: 'searchmemberlookupdetails',
      componentStatus: 'Success',
      returnCode: '0',
      subSystemName: 'Multiple Services',
      message: '',
      problemTypes: '0',
      innerDetails: {
        statusDetails: [
          {
            componentName: 'getPBEDetails',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
          {
            componentName: 'GetConsent',
            componentStatus: 'Success',
            returnCode: '0',
            subSystemName: '',
            message: '',
            problemTypes: '0',
            innerDetails: {},
          },
        ],
      },
    },
  }),
);
mockedAxios.get.mockResolvedValueOnce({
  data: {
    currentPolicies: [
      {
        memberCk: '726492501',
        subscriberName: 'AMANDA ASHE',
        groupName: 'Ruby Tuesday Operations LLC',
        memberId: '90865577900',
        planTypes: ['D', 'R', 'S', 'M', 'V'],
        amplifyMember: false,
      },
    ],
  },
});

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
          role: UserRole.AUTHORIZED_USER,
          plan: {
            fhirId: '654543434',
            grgrCk: '7678765456',
            grpId: '65654323',
            memCk: '726492501',
            sbsbCk: '5654566',
            subId: '56543455',
          },
        },
        vRules: {},
      },
    }),
  ),
}));

describe('Display Others Information  - Access Other Information', () => {
  let containerSnap: HTMLElement;
  beforeAll(async () => {
    const SiteHeader = await AccessOthersInformationPage();
    const { container } = render(SiteHeader);
    containerSnap = container;
  });
  it('Plan Details Success Scenario', async () => {
    expect(mockedFetch).toHaveBeenCalledWith(
      'ES_SVC_URL/searchMemberLookupDetails/getPBEConsentDetails?userName=testUser&isPBERequired=true&isConsentRequired=false',
      {
        cache: undefined,
        headers: { Authorization: 'Bearer BearerTokenMockedValue' },
        next: { revalidate: 1800, tags: ['testUser'] },
      },
    );

    // Policy Info called
    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/api/v1/policyInfo?members=941063251,726492501',
    );
    expect(screen.getByText('Cory Roach')).toBeInTheDocument();
    expect(screen.getByText('Amanda Ashe')).toBeInTheDocument();

    expect(containerSnap).toMatchSnapshot();
  });
});
