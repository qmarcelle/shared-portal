import OtherHealthInsurancePage from '@/app/reportOtherHealthInsurance/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { createAxiosErrorForTest, fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const page = await OtherHealthInsurancePage();
  render(page);
};

const vRules = { user: { currUsr: { plan: { memCk: '91722407' } } } };

jest.mock('src/auth', () => ({ auth: jest.fn() }));

const loggedinUser = {
  isActive: true,
  subscriberLoggedIn: true,
  lob: 'REGL',
  groupData: {
    groupID: '100000',
    groupCK: '21908',
    groupName: 'Chris B Hall Enterprises',
    parentGroupID: '100001',
    subGroupID: '0001',
    subGroupCK: 28951,
    subGroupName: 'Chris B Hall Enterprises',
    clientID: 'EI',
    policyType: 'INT',
    groupEIN: '620427913',
  },
  networkPrefix: 'QMI',
  subscriberID: '902218823',
  subscriberCK: '91722400',
  subscriberFirstName: 'CHRIS',
  subscriberLastName: 'HALL',
  subscriberTitle: '',
  subscriberDateOfBirth: '08/06/1959',
  subscriberOriginalEffectiveDate: '01/01/2001',
  members: [
    {
      isActive: true,
      memberOrigEffDt: '06/29/2009',
      memberCk: 91722407,
      firstName: 'CHRISTMAS',
      middleInitial: '',
      lastName: 'HALL',
      title: '',
      memRelation: 'M',
      birthDate: '06/29/2009',
      gender: 'M',
      memberSuffix: 6,
      mailAddressType: 'H',
      workPhone: '',
      otherInsurance: [],
      inXPermissions: true,
      futureEffective: false,
      loggedIn: false,
      hasSocial: true,
      esipharmacyEligible: true,
    },
  ],
  authFunctions: [
    { functionName: 'MULTITIER', available: true },
    { functionName: 'MULTITIER', available: true },
    { functionName: 'MULTITIER', available: true },
    { functionName: 'MULTITIER', available: true },
    { functionName: 'MULTITIER', available: true },
    { functionName: 'MULTITIER', available: true },
    { functionName: 'MDLIVE', available: false },
    { functionName: 'OHDELIGIBLE', available: false },
    { functionName: 'MedicareAdvantageGroupIndicator', available: false },
    { functionName: 'AllMedicareAdvantage', available: false },
    { functionName: 'TELEHEALTH_BEHAVIORAL', available: true },
    { functionName: 'QUEST_SELECT', available: false },
    { functionName: 'TELADOC', available: false },
    { functionName: 'TELADOC_PRIMARY360', available: false },
    { functionName: 'TELADOC_MYSTRENGTHCOMPLETE', available: false },
    { functionName: 'TELADOC_DIABETESPREVENTION', available: false },
    { functionName: 'TELADOC_DIABETESMGMT', available: false },
    { functionName: 'TELADOC_HYPERTENSIONMGMT', available: false },
    { functionName: 'MedicalWellnesswithIncentives', available: false },
    { functionName: 'PHACommercialEligible', available: true },
    { functionName: 'HealthReimbursementAccount', available: false },
    { functionName: 'FlexibleSpendingAccount', available: false },
    { functionName: 'UpdateSSNIneligible', available: false },
    { functionName: 'PBP_INELIGIBLE', available: false },
    { functionName: 'PHARMACYINTEGRATEDGROUP', available: true },
    { functionName: 'CLAIMSHOLD', available: false },
    { functionName: 'DELINQUENCY', available: false },
    { functionName: 'COBUPDATEELIGIBLE', available: true },
    { functionName: 'COBRAELIGIBLE', available: true },
    { functionName: 'HEALTHCOACHELIGIBLE', available: true },
    { functionName: 'BLUEHEALTHREWARDS', available: false },
    { functionName: 'CHIPELIGIBLE', available: false },
    { functionName: 'PHSELIGIBLE', available: true },
    { functionName: 'CHAT_ELIGIBLE', available: true },
    { functionName: 'PCAWELLNESSELIGIBLE', available: false },
    { functionName: 'HEALTHYMATERNITY', available: true },
    { functionName: 'LIVONGO', available: true },
    { functionName: 'LIVONGODMP', available: true },
    { functionName: 'ONLIFEWELLNESSELIGIBLE', available: true },
    { functionName: 'BLUEPRKS', available: true },
    { functionName: 'TEMPIDEXCLUSION', available: false },
    { functionName: 'MYPCPELIGIBLE', available: true },
    { functionName: 'IDPROTECTELIGIBLE', available: true },
    { functionName: 'ENROLLELIGIBLE', available: true },
    { functionName: 'FSAHRAELIGIBLE', available: true },
    { functionName: 'DENTALCOSTELIGIBLE', available: true },
    { functionName: 'ENABLE_COST_TOOLS', available: true },
    { functionName: 'ENABLE_COST_EST_TOOL', available: true },
    { functionName: 'INDIVIDUAL_SBC_ELIGIBLE', available: false },
    { functionName: 'ENABLE_BENEFIT_CHANGE_TAB', available: false },
    { functionName: 'SOLERAELIGIBLE', available: false },
    { functionName: 'ENABLE_PHAR_TAB', available: true },
    { functionName: 'RX_MEDICARE', available: false },
    { functionName: 'RX_PREFERRED_ELIGIBLE', available: true },
    { functionName: 'SANITAS_ELIGIBLE', available: false },
    { functionName: 'CONDENSED_EXPERIENCE', available: false },
    { functionName: 'HINGE_HEALTH_ELIGIBLE', available: true },
    { functionName: 'OTCEnable', available: false },
    { functionName: 'careManagementExclusion', available: true },
    { functionName: 'COBUPDATEREMINDER', available: true },
    { functionName: 'EMBOLD_HEALTH', available: false },
    { functionName: 'GROUP_RENEWAL_DATE_BEFORE_TODAY', available: true },
  ],
  healthCareAccounts: [],
  esigroupNum: '100000MBPX0806',
  cmcondition: [],
};

describe('OtherHealthInsurance', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
  });

  it('should render the UI correctly', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cobList: [
          {
            medicalBean: {
              otherInsuranceCompanyName: 'METLIFE (VISION COVERAGE ONLY)',
              otherInsurancePhoneNum: '8005439150',
              policyIdNum: 'VISION ONLY',
              policyHolderFirstName: '',
              policyHolderLastName: '',
              policyEffectiveDate: '01/01/2006',
              policyCancelDate: '12/31/9999',
              otherInsuranceCompanyCode: 'METLIFE',
              noOtherInsurance: false,
            },
            dentalBean: {
              otherInsuranceCompanyName: 'Not Assigned',
              otherInsurancePhoneNum: '',
              policyIdNum: '621239891',
              policyHolderFirstName: '',
              policyHolderLastName: '',
              policyEffectiveDate: '07/01/2007',
              policyCancelDate: '12/31/9999',
              otherInsuranceCompanyCode: '',
              noOtherInsurance: false,
            },
            memeCK: '91722407',
            forAllDependents: false,
            noOtherInsurance: false,
          },
        ],
      },
    });
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
    await setupUI();
    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/COBService?memeCKs=91722407&isMedAdv=false',
      );

      screen.getByRole('heading', { name: 'Report Other Health Insurance' });

      expect(screen.getByText('VISION ONLY')).toBeInTheDocument();
      expect(screen.getByText('DOB: 06/29/2009')).toBeInTheDocument();
      expect(
        screen.getByText('METLIFE (VISION COVERAGE ONLY)'),
      ).toBeInTheDocument();
      expect(screen.getByText('621239891')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'About Other Insurance' }),
      ).toBeVisible();
      expect(
        screen.getByText(
          "Even if you don't have other coverage, we still need to know that so we can process your claims correctly. This is called your Coordination of Benefits (COB). We will automatically reprocess or adjust any claims affected by the selections you make here.",
        ),
      );
    });
  });
  it('Should test 200 HttpStatus flow of other insurance with empty data', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        cobList: [
          {
            memeCK: '91722407',
            forAllDependents: true,
            noOtherInsurance: true,
          },
        ],
      },
    });
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
    await setupUI();
    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/COBService?memeCKs=91722407&isMedAdv=false',
      );
      screen.getByText('Not covered by other health insurance.');
    });
  });

  test('other Insurance api integration null scenario', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
    await setupUI();
    await waitFor(async () => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/COBService?memeCKs=91722407&isMedAdv=false',
      );
      expect(response).toBeNull;
    });
    screen.getByText('Not covered by other health insurance.');
  });

  test('other Insurance api integration 400 bad request scenario', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
    await setupUI();
    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/COBService?memeCKs=91722407&isMedAdv=false',
      );
    });
    expect(
      screen.getAllByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ).length,
    ).toBe(1);
  });

  test('other Insurance api integration 500 bad request scenario', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
    await setupUI();
    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/COBService?memeCKs=91722407&isMedAdv=false',
      );
    });
    expect(
      screen.getAllByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      ).length,
    ).toBe(1);
  });
});
