export const SSO_IMPL_MAP: Map<string, string> = new Map([
  [`${process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS}`, 'ChipRewardsImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_EYEMED}`, 'EyemedImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY}`, 'HealthEquityImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_EMBOLD}`, 'EmboldImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`, 'CVSCaremarkImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_TELADOC}`, 'TeladocImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK}`, 'PinnacleBankImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_HSA_BANK}`, 'HSABankImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_INSTAMED}`, 'InstamedImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`, 'OnLifeImpl'],
  [`${process.env.NEXT_PUBLIC_IDP_BLUE_365}`, 'Blue365Impl'],
  [`${process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH}`, 'PremiseHealthImpl'],
  [
    `${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}`,
    'ProviderDirectoryImpl',
  ],
  [`${process.env.NEXT_PUBLIC_IDP_VITALSPRP}`, 'VitalsPRPImpl'],
  [
    `${process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA}`,
    'ElectronicPaymentBOAImpl',
  ],
  [`${process.env.NEXT_PUBLIC_IDP_M3P}`, 'M3PImpl'],
]);

export const SSO_TEXT_MAP = new Map<string, string>([
  [`${process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS}`, 'Chip Rewards'],
  [`${process.env.NEXT_PUBLIC_IDP_EYEMED}`, 'Eyemed'],
  [`${process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY}`, 'Health Equity'],
  [`${process.env.NEXT_PUBLIC_IDP_EMBOLD}`, 'Embold'],
  [`${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`, 'CVS Caremark'],
  [`${process.env.NEXT_PUBLIC_IDP_TELADOC}`, 'Teladoc'],
  [`${process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK}`, 'Pinnacle Bank'],
  [`${process.env.NEXT_PUBLIC_IDP_HSA_BANK}`, 'HSA Bank'],
  [`${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`, 'On Life'],
  [`${process.env.NEXT_PUBLIC_IDP_BLUE_365}`, 'Blue 365'],
  [`${process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH}`, 'Premise Health'],
  [`${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}`, 'Find a Doctor'],
  [`${process.env.NEXT_PUBLIC_IDP_INSTAMED}`, 'Instamed'],
  [`${process.env.NEXT_PUBLIC_IDP_VITALSPRP}`, 'Vitals PRP'],
  [
    `${process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA}`,
    'Electronic Paymnet BOA',
  ],
  [`${process.env.NEXT_PUBLIC_IDP_M3P}`, 'M3P'],
]);

export const SSO_SUBJECT = 'subject';
export const SSO_FIRST_NAME = 'firstname';
export const SSO_LAST_NAME = 'lastname';
export const SSO_DOB = 'dob';
export const SSO_CLIENT_ID = 'clientid';
export const SSO_MEMBER_ID = 'memberid';
export const SSO_GENDER = 'gender';
export const SSO_PERSON_ID = 'personid';
export const SSO_INSURED_ID = 'insuredid';
export const SSO_PLAN_ID = 'planid';
export const SSO_SUBSCRIBER_ID = 'subscriberid';
export const SSO_TARGET_RESOURCE = 'targetresource';
export const SSO_USER_ID = 'userid';
export const SSO_EMPLOYER_CODE = 'employercode';
export const SSO_ACCOUNT_TYPE = 'accounttype';
export const SSO_KEY = 'ssokey';
export const SSO_FED_ID = 'grouporemployerid';
export const SSO_CANCEL_URL = 'cancelurl';
export const SSO_CONFIRM_URL = 'confirmurl';
export const SSO_USER_NAME = 'username';
export const SSO_POLICY_NUMBER = 'policynumber';
export const SSO_GROUP_NUMBER = 'groupnumber';
export const SSO_DEP_SEQ_NUMBER = 'dependentsequencenumber';
export const SSO_RELATIONSHIP = 'relationship';
export const SSO_ORGANIZATION = 'organization';
export const SSO_EMPLOYEE_ID = 'employeeid';
export const SSO_GROUP_ID = 'groupid';
export const SSO_BIRTH_YEAR = 'birthyear';
export const SSO_ZIP_CODE = 'zipcode';
export const SSO_ALPHA_PREFIX = 'alphaprefix';
export const SSO_EMAIL_ADDRESS = 'emailaddress';
export const SSO_LANDING_PAGE = 'bpassmain';
export const SSO_PROGRAM_ID = 'programid';
export const SSO_PREFIX = 'prefix';
export const SSO_NETWORK = 'network';
export const SSO_COPAY = 'copayexcludedoop';
export const SSO_DED = 'dedexcludedoop';
export const SSO_SANITAS = 'sanitas';
export const SSO_PCP_PHYSICIAN_ID = 'currentprprid';
export const SSO_TELEHEALTH = 'telehealth';
export const SSO_PATIENT_FIRST_NAME = 'patientfirstname';
export const SSO_PATIENT_LAST_NAME = 'patientlastname';
export const SSO_CLAIM_NUMBER = 'claimnumber';
export const SSO_PATIENT_SERVICE_BEGIN_DATE = 'patientservicebegindate';
export const SSO_PATIENT_SERVICE_END_DATE = 'patientserviceenddate';
export const SSO_CLAIM_REF_NUMBER = 'claimreferencenumber';
export const SSO_AMOUNT_DUE = 'amountdue';
export const SSO_PROVIDER_BILLING_TIN = 'providerbillingtin';
export const SSO_PAY_TO_PROVIDER_NAME = 'paytoprovidername';
export const SSO_PAY_TO_PROVIDER_ADDRESS = 'paytoprovideraddress1';
export const SSO_PAY_TO_PROVIDER_CITY = 'paytoprovidercity';
export const SSO_PAY_TO_PROVIDER_STATE = 'paytoproviderstate';
export const SSO_PAY_TO_PROVIDER_ZIP = 'paytoproviderzip';
export const SSO_PATIENT_ID = 'patientid';
export const SSO_RENDERING_PROVIDER = 'renderingprovidername';
export const SSO_ID = 'ssoid';
export const SSO_USER_FIRST_NAME = 'userfirstname';
export const SSO_USER_LAST_NAME = 'userlastname';
export const SSO_RELATIONSHIP_CODE = 'relationshipcode';
export const SSO_USER_DOB = 'userdob';
export const SSO_USER_EMAIL = 'useremail';
export const SSO_REDIRECT = 'redirectinfo';
export const SSO_DATE_TIME = 'datetime';
export const SSO_PARTNER_KEY = 'pkey';
export const SSO_PARTNER_SIGNATURE_KEY = 'sig';
export const SSO_ACCOUNT_NUMBER = 'acctno';
export const SSO_CURRENT_BALANCE = 'currbal';
export const SSO_CURRENT_STATEMENT_BALANCE = 'currstmtbal';
export const SSO_PAYMENT_DUE_DATE = 'pmtduedt';
export const SSO_PARTNER_SESSION_ID = 'pcsid';
export const SSO_TIME_STAMP = 'ts';
export const SSO_CUSTOMER_ID = 'customerid';

export const MD_LIVE_OU = 'ou';
export const PCA_MEME_CK = 'externalMemberId_CareAdvance';
export const EYEMED_SSO_CLIENT_ID_VALUE = 'BCBST';
export const CVS_DEFAULT_CLIENT_ID_VALUE = '1699';
export const PINNACLE_ACCOUNT_TYPE_CONSUMER = 'Consumer-028';
export const SCHEDULER = 'scheduler';
export const SCHEDULE = 'schedule';
export const MAIN = 'main';
export const ON_LIFE_ID = 'ON_LIFE';
export const TARGET_PARAM_NAME = 'target';
export const ON_LIFE_CHALLENGE_ID_PARAM_NAME = 'challengeId';
export const ON_LIFE_CHALLENGE = 'Challenge';
export const ON_LIFE_PHA = 'PHA';
export const ON_LIFE_CHALLENGE_DETAILS_PATH = '/ChallengeDetails';
export const ON_LIFE_ELIGIBLE_GROUPS = '82040';
export const WIPRO_CUSTOMER_ID = 'HCF0314';
// try to move below properties to config
export const CVS_ClientID_130449 = '1589';
export const MD_LIVE_OU_GROUPS = '87898';
export const CLIENT_ID_MANAGEMENT = 'BCBST-DM';
export const CLIENT_ID_PREVENTION = 'BCBST-DPP';
export const CLIENT_ID_FULL = 'BCBST-HEALTH';
export const PROGRAM_ID_DIABETES = 'DIABETES';
export const PROGRAM_ID_PREDIABETES = 'PREDIABETES';
export const PROGRAM_ID_HYPERTENSION = 'HYPERTENSION';
export const PROGRAM_ID_BEHAVIORAL = 'BEHAVIORAL_HEALTH';
export const TARGET_DIABETES = 'Diabetes';
export const TARGET_PREDIABETES = 'Prediabetes';
export const TARGET_HYPERTENSION = 'Hypertension';
export const TARGET_BEHAVIORAL = 'BehavioralHealth';
export const TELEHEALTH_CD = 'teleHealthCd';
export const TELEHEALTH_VENDCD = 'teleHealthVendCd';
export const TELEHEALTH_PROD_TYPE = 'teleHealthProdType';
export const TELEHEALTH_URL = 'teleHealthUrl';
export const LIVONGO_REG_CODE = new Map<string, string>([
  ['100041', 'FIRSTFLEET'],
  ['111169', 'LIFECARE'],
  ['115586', 'ROGERS'],
  ['115598', 'ETCH'],
  ['115616', 'NEMAK'],
  ['125225', 'WESTFRASER'],
  ['130445', 'BISCUIT'],
  ['130447', 'CITYOFMEMPHIS'],
  ['130465', 'PLAYCORE'],
  ['130513', 'VACO'],
  ['80656', 'ASTEC'],
  ['80860', 'STATEOFTENN'],
  ['82040', 'NISSAN'],
  ['111169', 'LIFECARE'],
]);
export const BOA_PARTNER_KEY = new Map<string, string>([
  ['103800', '6722658679'],
  ['111800', '6722658679'],
  ['114800', '6722658679'],
  ['115800', '6722658679'],
  ['116800', '6722658679'],
  ['116884', '3404123643'],
  ['120800', '6722658679'],
  ['123776', '6722658679'],
  ['123800', '6722658679'],
  ['124800', '6722658679'],
  ['127600', '3150439449'],
  ['129000', '6722658679'],
  ['129800', '6722658679'],
  ['129884', '6722658679'],
  ['80635', '6722658679'],
  ['82125', '6722658679'],
  ['83091', '6722658679'],
  ['83560', '6722658679'],
  ['89520', '6722658679'],
  ['95800', '6722658679'],
  ['cobra', '6660677689'],
]);
export const BOA_PARTNER_KEY_SIGNATURE = new Map<string, string>([
  ['3150439449', 'Z6W5XZXQJNNG3W27'],
  ['3404123643', 'BC46VFVJKFSLZTXV'],
  ['6722658679', '276NDQW2LXC6QYJC'],
  ['6660677689', 'WNTZ16QVCWJQ7PZY'],
]);

//Target Resource
export const EYEMED_PROVIDER_DIRECTORY = 'EYEMED_PROVIDER_DIRECTORY';
export const EYEMED_VISION = 'EYEMED_VISION';
export const CVS_PHARMACY_SEARCH_FAST = 'CVS_PHARMACY_SEARCH_FAST';
export const CVS_DRUG_SEARCH_INIT = 'CVS_DRUG_SEARCH_INIT';
export const CVS_REFILL_RX = 'CVS_REFILL_RX';
export const PROV_DIR_MEDICAL = 'PROV_DIR_MEDICAL';
export const PROV_DIR_DENTAL = 'PROV_DIR_DENTAL';
export const PROV_DIR_VISION = 'PROV_DIR_VISION';
export const PROV_DIR_MENTAL_HEALTH = 'PROV_DIR_MENTAL_HEALTH';
export const BLUE_365_FOOTWEAR = 'BLUE_365_FOOTWEAR';
export const BLUE_365_FITNESS = 'BLUE_365_FITNESS';
export const BLUE_365_HEARING_VISION = 'BLUE_365_HEARING_VISION';
export const BLUE_365_HOME_FAMILY = 'BLUE_365_HOME_FAMILY';
export const BLUE_365_NUTRITION = 'BLUE_365_NUTRITION';
export const BLUE_365_PERSONAL_CARE = 'BLUE_365_PERSONAL_CARE';
export const BLUE_365_TRAVEL = 'BLUE_365_TRAVEL';

export const CVS_DEEPLINK_MAP: Map<string, string> = new Map([
  ['CVS_REFILL_RX', 'refillRx'],
  ['CVS_DRUG_SEARCH_INIT', 'drugSearchInit.do'],
  ['CVS_PHARMACY_SEARCH_FAST', 'pharmacySearchFast'],
]);

export const EYEMED_DEEPLINK_MAP: Map<string, string> = new Map([
  ['EYEMED_VISION', 'know-before-you-go'],
  ['EYEMED_PROVIDER_DIRECTORY', 'provider-locator'],
]);

export const PROV_DIR_DEEPLINK_MAP: Map<string, string> = new Map([
  ['PROV_DIR_MEDICAL', '?guided_search=wayfinding_home_findCost_header'],
  ['PROV_DIR_DENTAL', '?guided_search=wayfinding_home_DentalCare_header'],
  ['PROV_DIR_VISION', '?guided_search=wayfinding_tile_cost_vision_health'],
  [
    'PROV_DIR_MENTAL_HEALTH',
    '?guided_search=wayfinding_tile_cost_behavioral_health',
  ],
]);

export const BLUE_365_DEEPLINK_MAP: Map<string, string> = new Map([
  ['BLUE_365_FOOTWEAR', 'offer-category-apparel-footwear'],
  ['BLUE_365_FITNESS', 'offer-category-fitness'],
  ['BLUE_365_HEARING_VISION', 'offer-category-hearing-vision'],
  ['BLUE_365_HOME_FAMILY', 'offer-category-home-family'],
  ['BLUE_365_NUTRITION', 'offer-category-nutrition'],
  ['BLUE_365_PERSONAL_CARE', 'offer-category-personal-care'],
  ['BLUE_365_TRAVEL', 'offer-category-travel'],
]);
