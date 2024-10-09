import { SpendingAccountSectionProps } from '@/app/balances/components/SpendingAccountsSection';
import { MedicalBalanceSectionProps } from '@/app/dashboard/components/MedicalBalanceSection';
import { GetHelpProps } from '@/components/composite/GetHelpSection';
import { InfoCardProps } from '@/components/composite/InfoCard';
import { BenefitType } from './benefit_type';
import { BenefitTypeHeaderDetails } from './benefit_type_header_details';

export interface BenefitDetails {
  benefitTitle?: string;
  copayOrCoinsurance?: string;
}

export interface ListBenefitDetails {
  listBenefitDetails: BenefitDetails[];
  note?: string;
}

export interface BenefitTypeDetail {
  benefitType: BenefitType;
  benefitTypeHeaderDetails?: BenefitTypeHeaderDetails;
  benefitDetails: ListBenefitDetails[];
  estimateCosts?: InfoCardProps;
  servicesUsed?: InfoCardProps;
  findDrugsCostAndCoverage?: InfoCardProps;
  medicalAndPharmacyBalance?: MedicalBalanceSectionProps;
  spendingAccounts?: SpendingAccountSectionProps;
  getHelpWithBenefits?: GetHelpProps;
}
