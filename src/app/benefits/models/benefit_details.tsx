import { BalanceSectionProps } from '@/app/benefits/balances/components/BalanceSection';
import { SpendingAccountSectionProps } from '@/app/benefits/balances/components/SpendingAccountsSection';
import { MedicalBalanceSectionProps } from '@/app/dashboard/components/MedicalBalanceSection';
import { GetHelpProps } from '@/components/composite/GetHelpSection';
import { InfoCardProps } from '@/components/composite/InfoCard';
import { BenefitTypeHeaderDetails } from './benefit_type_header_details';

//BenefitDetails interface is getting benefit title and type of payment(copay or coinsurance)
export interface BenefitDetails {
  benefitTitle?: string;
  copayOrCoinsurance?: string;
}

//ListBenefitDetails interface is getting list of benefit details and note(optional)
export interface ListBenefitDetails {
  listBenefitDetails: BenefitDetails[];
  note?: string;
}

//BenefitTypeDetail interface is responsible for getting details for all components of page
export interface BenefitTypeDetail {
  // benefitType: BenefitType;
  benefitTypeHeaderDetails?: BenefitTypeHeaderDetails;
  benefitDetails: ListBenefitDetails[];
  estimateCosts?: InfoCardProps;
  servicesUsed?: InfoCardProps;
  dentalBalance?: BalanceSectionProps;
  findDrugsCostAndCoverage?: InfoCardProps;
  medicalAndPharmacyBalance?: MedicalBalanceSectionProps;
  spendingAccounts?: SpendingAccountSectionProps;
  getHelpWithBenefits?: GetHelpProps;
}
