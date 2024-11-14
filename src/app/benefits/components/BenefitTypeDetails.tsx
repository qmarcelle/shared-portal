import { BalanceSection } from '@/app/balances/components/BalanceSection';
import { SpendingAccountSection } from '@/app/balances/components/SpendingAccountsSection';
import { MedicalBalanceSection } from '@/app/dashboard/components/MedicalBalanceSection';
import { GetHelpSection } from '@/components/composite/GetHelpSection';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { BenefitTypeDetail } from '../models/benefit_details';
import { BenefitDetailSection } from './BenefitDetailSection';
import { BenefitTypeHeaderSection } from './BenefitTypeHeaderSection';
//This Template will provide structure which will be used to create benefits pages
interface BenefitTypeDetailsProps extends IComponent {
  benefitTypeDetails?: BenefitTypeDetail;
}

export const BenefitTypeDetails = ({
  benefitTypeDetails,
}: BenefitTypeDetailsProps) => {
  return (
    <Column className="app-content app-base-font-color">
      {benefitTypeDetails?.benefitTypeHeaderDetails && (
        <>
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow page-section-63_33 items-stretch">
              <Column className="app-content app-base-font-color">
                <BenefitTypeHeaderSection
                  benefitTypeHeaderDetails={
                    benefitTypeDetails?.benefitTypeHeaderDetails
                  }
                />
                <Spacer size={16} />
              </Column>
            </Column>
          </section>
        </>
      )}
      <section className="flex flex-row items-start app-body">
        <Column className="flex-grow page-section-63_33 items-stretch">
          <BenefitDetailSection
            benefitDetail={benefitTypeDetails?.benefitDetails ?? []}
          />
        </Column>
        <Column className=" flex-grow page-section-36_67 items-stretch md:ml-4">
          {benefitTypeDetails && (
            <>
              {benefitTypeDetails?.estimateCosts && (
                <InfoCard
                  label={benefitTypeDetails?.estimateCosts.label}
                  body={benefitTypeDetails?.estimateCosts.body}
                  icon={benefitTypeDetails?.estimateCosts.icon}
                  link={benefitTypeDetails.estimateCosts.link}
                />
              )}
              {benefitTypeDetails?.servicesUsed && (
                <InfoCard
                  label={benefitTypeDetails?.servicesUsed.label}
                  body={benefitTypeDetails?.servicesUsed.body}
                  icon={benefitTypeDetails?.servicesUsed.icon}
                  link={benefitTypeDetails.servicesUsed.link}
                />
              )}
              {benefitTypeDetails?.medicalAndPharmacyBalance && (
                <MedicalBalanceSection
                  members={
                    benefitTypeDetails?.medicalAndPharmacyBalance?.members
                  }
                  selectedMemberId={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.selectedMemberId
                  }
                  balanceNetworks={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.balanceNetworks
                  }
                  selectedNetworkId={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.selectedNetworkId
                  }
                  deductibleSpent={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.deductibleSpent
                  }
                  deductibleLimit={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.deductibleLimit
                  }
                  outOfPocketSpent={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.outOfPocketSpent
                  }
                  outOfPocketLimit={
                    benefitTypeDetails?.medicalAndPharmacyBalance
                      ?.outOfPocketLimit
                  }
                  onSelectedMemberChange={
                    benefitTypeDetails.medicalAndPharmacyBalance
                      .onSelectedMemberChange
                  }
                  onSelectedNetworkChange={
                    benefitTypeDetails.medicalAndPharmacyBalance
                      .onSelectedNetworkChange
                  }
                  displayDisclaimerText={
                    benefitTypeDetails.medicalAndPharmacyBalance
                      ?.displayDisclaimerText
                  }
                  className={
                    benefitTypeDetails.medicalAndPharmacyBalance.className
                  }
                />
              )}
              {benefitTypeDetails?.dentalBalance && (
                <BalanceSection
                  title="Dental Balance"
                  balanceDetailLink={true}
                  members={benefitTypeDetails?.dentalBalance?.members}
                  selectedMemberId={
                    benefitTypeDetails?.dentalBalance?.selectedMemberId
                  }
                  deductibleSpent={
                    benefitTypeDetails?.dentalBalance?.deductibleSpent
                  }
                  deductibleLimit={
                    benefitTypeDetails?.dentalBalance?.deductibleLimit
                  }
                  outOfPocketSpent={
                    benefitTypeDetails?.dentalBalance?.outOfPocketSpent
                  }
                  outOfPocketLimit={
                    benefitTypeDetails?.dentalBalance?.outOfPocketLimit
                  }
                  onSelectedMemberChange={
                    benefitTypeDetails.dentalBalance.onSelectedMemberChange
                  }
                  serviceDetailsUsed={
                    benefitTypeDetails.dentalBalance.serviceDetailsUsed
                  }
                  balancesFlag={benefitTypeDetails.dentalBalance.balancesFlag}
                  className={benefitTypeDetails.dentalBalance.className}
                />
              )}
              {benefitTypeDetails?.spendingAccounts && (
                <SpendingAccountSection
                  fsaBalance={benefitTypeDetails?.spendingAccounts.fsaBalance}
                  hsaBalance={benefitTypeDetails?.spendingAccounts.hsaBalance}
                  linkURL={benefitTypeDetails?.spendingAccounts.linkURL}
                  className={benefitTypeDetails?.spendingAccounts.className}
                />
              )}
              {benefitTypeDetails?.getHelpWithBenefits && (
                <GetHelpSection
                  linkURL={benefitTypeDetails?.getHelpWithBenefits.linkURL}
                  headerText={
                    benefitTypeDetails?.getHelpWithBenefits.headerText
                  }
                />
              )}
            </>
          )}
        </Column>
      </section>
    </Column>
  );
};
