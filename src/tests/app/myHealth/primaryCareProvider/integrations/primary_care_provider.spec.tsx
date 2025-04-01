import PrimaryCareOptionsPage from '@/app/myPrimaryCareProvider/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const page = await PrimaryCareOptionsPage();
  render(page);
};

const vRules = {
  user: {
    currUsr: { plan: { memCk: '91722407' } },
    vRules: {
      blueCare: true,
      myPCPElig: true,
      futureEffective: false,
      fsaOnly: false,
      wellnessOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

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
    {
      isActive: true,
      memberOrigEffDt: '06/15/2009',
      memberCk: 91722406,
      firstName: 'KRISSY',
      middleInitial: 'C',
      lastName: 'HALL',
      title: '',
      memRelation: 'D',
      birthDate: '06/15/2009',
      gender: 'F',
      memberSuffix: 5,
      mailAddressType: 'H',
      workPhone: '',
      otherInsurance: [],
      inXPermissions: true,
      futureEffective: false,
      loggedIn: false,
      hasSocial: false,
      esipharmacyEligible: true,
    },
  ],
  authFunctions: [
    {
      functionName: 'MULTITIER',
      available: true,
    },
    {
      functionName: 'MULTITIER',
      available: true,
    },
    {
      functionName: 'MULTITIER',
      available: true,
    },
    {
      functionName: 'MULTITIER',
      available: true,
    },
    {
      functionName: 'MULTITIER',
      available: true,
    },
    {
      functionName: 'MULTITIER',
      available: true,
    },
    {
      functionName: 'MDLIVE',
      available: false,
    },
    {
      functionName: 'OHDELIGIBLE',
      available: false,
    },
    {
      functionName: 'MedicareAdvantageGroupIndicator',
      available: false,
    },
    {
      functionName: 'AllMedicareAdvantage',
      available: false,
    },
    {
      functionName: 'TELEHEALTH_BEHAVIORAL',
      available: true,
    },
    {
      functionName: 'QUEST_SELECT',
      available: false,
    },
    {
      functionName: 'TELADOC',
      available: false,
    },
    {
      functionName: 'TELADOC_PRIMARY360',
      available: false,
    },
    {
      functionName: 'TELADOC_MYSTRENGTHCOMPLETE',
      available: false,
    },
    {
      functionName: 'TELADOC_DIABETESPREVENTION',
      available: false,
    },
    {
      functionName: 'TELADOC_DIABETESMGMT',
      available: false,
    },
    {
      functionName: 'TELADOC_HYPERTENSIONMGMT',
      available: false,
    },
    {
      functionName: 'MedicalWellnesswithIncentives',
      available: false,
    },
    {
      functionName: 'PHACommercialEligible',
      available: true,
    },
    {
      functionName: 'HealthReimbursementAccount',
      available: false,
    },
    {
      functionName: 'FlexibleSpendingAccount',
      available: false,
    },
    {
      functionName: 'UpdateSSNIneligible',
      available: false,
    },
    {
      functionName: 'PBP_INELIGIBLE',
      available: false,
    },
    {
      functionName: 'PHARMACYINTEGRATEDGROUP',
      available: true,
    },
    {
      functionName: 'CLAIMSHOLD',
      available: false,
    },
    {
      functionName: 'DELINQUENCY',
      available: false,
    },
    {
      functionName: 'COBUPDATEELIGIBLE',
      available: true,
    },
    {
      functionName: 'COBRAELIGIBLE',
      available: true,
    },
    {
      functionName: 'HEALTHCOACHELIGIBLE',
      available: true,
    },
    {
      functionName: 'BLUEHEALTHREWARDS',
      available: false,
    },
    {
      functionName: 'CHIPELIGIBLE',
      available: false,
    },
    {
      functionName: 'PHSELIGIBLE',
      available: true,
    },
    {
      functionName: 'CHAT_ELIGIBLE',
      available: true,
    },
    {
      functionName: 'PCAWELLNESSELIGIBLE',
      available: false,
    },
    {
      functionName: 'HEALTHYMATERNITY',
      available: true,
    },
    {
      functionName: 'LIVONGO',
      available: true,
    },
    {
      functionName: 'LIVONGODMP',
      available: true,
    },
    {
      functionName: 'ONLIFEWELLNESSELIGIBLE',
      available: true,
    },
    {
      functionName: 'BLUEPRKS',
      available: true,
    },
    {
      functionName: 'TEMPIDEXCLUSION',
      available: false,
    },
    {
      functionName: 'MYPCPELIGIBLE',
      available: true,
    },
    {
      functionName: 'IDPROTECTELIGIBLE',
      available: true,
    },
    {
      functionName: 'ENROLLELIGIBLE',
      available: true,
    },
    {
      functionName: 'FSAHRAELIGIBLE',
      available: true,
    },
    {
      functionName: 'DENTALCOSTELIGIBLE',
      available: true,
    },
    {
      functionName: 'ENABLE_COST_TOOLS',
      available: true,
    },
    {
      functionName: 'ENABLE_COST_EST_TOOL',
      available: true,
    },
    {
      functionName: 'INDIVIDUAL_SBC_ELIGIBLE',
      available: false,
    },
    {
      functionName: 'ENABLE_BENEFIT_CHANGE_TAB',
      available: false,
    },
    {
      functionName: 'SOLERAELIGIBLE',
      available: false,
    },
    {
      functionName: 'ENABLE_PHAR_TAB',
      available: true,
    },
    {
      functionName: 'RX_MEDICARE',
      available: false,
    },
    {
      functionName: 'RX_PREFERRED_ELIGIBLE',
      available: true,
    },
    {
      functionName: 'SANITAS_ELIGIBLE',
      available: false,
    },
    {
      functionName: 'CONDENSED_EXPERIENCE',
      available: false,
    },
    {
      functionName: 'HINGE_HEALTH_ELIGIBLE',
      available: true,
    },
    {
      functionName: 'OTCEnable',
      available: false,
    },
    {
      functionName: 'careManagementExclusion',
      available: true,
    },
    {
      functionName: 'COBUPDATEREMINDER',
      available: true,
    },
    {
      functionName: 'EMBOLD_HEALTH',
      available: false,
    },
    {
      functionName: 'GROUP_RENEWAL_DATE_BEFORE_TODAY',
      available: true,
    },
  ],
  healthCareAccounts: [],
  esigroupNum: '100000MBPX0806',
  cmcondition: [],
};

describe('Primary Care Options', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(loggedinUser));
  });
  it('Should test success flow of pcPhysician', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
        name: 'CHRIS HALL',
        dob: '01/01/1943',
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, Wolverine',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
        name: 'KRISSY HALL',
        dob: '06/15/2009',
      },
    });

    await setupUI();
    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/pcPhysician/91722407');

      screen.getByText('Louthan, James D.');
      screen.getAllByText('2033 Meadowview Ln Ste 200');
      screen.getAllByText('Kingsport TN 37660-7432');
      screen.getAllByText('(423) 857-2260');
      screen.getByText('CHRISTMAS HALL');
      screen.getByText('06/29/2009');
    });
  });
  it('Should test success flow of dependents pcPhysician', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
        name: 'CHRISTMAS HALL',
        dob: '06/29/2009',
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, Wolverine',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
        name: 'KRISSY HALL',
        dob: '06/15/2009',
      },
    });

    await setupUI();
    await waitFor(async () => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/pcPhysician/91722407');

      screen.getByText('Louthan, James D.');
      screen.getByText('Louthan, Wolverine');
      screen.getAllByText('2033 Meadowview Ln Ste 200');
      screen.getAllByText('Kingsport TN 37660-7432');
      screen.getAllByText('(423) 857-2260');
      screen.getByText('CHRISTMAS HALL');
      screen.getByText('06/29/2009');
    });
  });
  it('Should test 200 HttpStatus flow of pcPhysician when we get null', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue(vRules);
    mockedAxios.get.mockResolvedValueOnce(null);
    mockedAxios.get.mockResolvedValueOnce(null);

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/pcPhysician/91722407');
      screen.getAllByText(
        'Oops, it looks like something went wrong. Try again later.',
      );
    });
  });
  it('Should test 200 HttpStatus flow of pcPhysician with empty data', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        physicianId: '3118777',
        physicianName: 'Louthan, James D.',
        address1: '2033 Meadowview Ln Ste 200',
        address2: '',
        address3: '',
        city: 'Kingsport',
        state: 'TN',
        zip: '376607432',
        phone: '4238572260',
        ext: '',
        addressType: '1',
        taxId: '621388079',
        name: 'CHRISTMAS HALL',
        dob: '06/29/2009',
      },
    });
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        name: 'KRISSY HALL',
        dob: '06/15/2009',
      },
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/pcPhysician/91722407');
      screen.getByText(
        "We don't have a Primary Care Provider listed for you or someone on your plan. If you already have a doctor or need to find one, we'll help you get set up.",
      );
    });
  });
});
