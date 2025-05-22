export const MEDICAL_HDHP_EPO = 'Medical HDHP plan with EPO';
export const MEDICAL_HDHP = 'Medical HDHP plan';
export const MEDICAL_PPO_EPO = 'Medical PPO plan with EPO';
export const MEDICAL_PPO = 'Medical PPO plan';
export const NOT_AVAILABLE = 'NA';

// spending account constants
export const EXT_ACCT_HSA = 'HSA';
export const EXT_ACCT_FSA = 'FSA';
export const EXT_ACCT_HRA = 'HRA';
export const EXT_ACCT_DCRA = 'DCRA';
export const EXT_BANK_HEALTHEQUITY = 'HealthEquity';
export const EXT_BANK_HSABANK = 'HSABank';

export const PINNACLE_ACCOUNT_DCFSA = 'DCFSA';
export const PINNACLE_ACCOUNT_MFSA = 'MFSA';
export const PINNACLE_ACCOUNT_LFSA = 'LFSA';

export const ES_BANKFLAG_HE = 2;
export const ES_BANKFLAG_HSA = 1;
export const ES_ACCTFLAG_HSA = 1;
export const ES_ACCTFLAG_HRA = 2;
export const ES_ACCTFLAG_FSA = 4;
export const ES_ACCTFLAG_DCRA = 8;

export const SPEND_ACC_BANK_MAP: { [key: string]: string } = {
  hsabank: 'visit HSA Bank',
  healthequity: 'visit Health Equity',
  pinnacle: 'visit Pinnacle',
};

export const SPEND_ACC_SSO_MAP: { [key: string]: string } = {
  hsabank: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_HSA_BANK}`,
  healthequity: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY}`,
  pinnacle: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK}`,
};
