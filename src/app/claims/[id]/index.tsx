'use client';

import { PayProvider } from '@/app/claims/components/PayProvider';
import { ServicesRenderedSection } from '@/app/claims/components/ServicesRenderedSection';
import { ClaimsHelpCard } from '@/components/composite/ClaimsHelpCard';
import { ClaimsPageInformation } from '@/components/composite/ClaimsPageInformation';
import { CostBreakdown } from '@/components/composite/CostBreakdown';
import { DownloadSummary } from '@/components/composite/DownloadSummary';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { ClaimDetailsData } from '../models/app/claimDetailsData';

export type ClaimDetailsProps = {
  claimData: ClaimDetailsData;
  docURL: string;
};

const ClaimDetails = ({ claimData, docURL }: ClaimDetailsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        {claimData?.claimInfo ? (
          <>
            <ClaimsPageInformation claimInfo={claimData.claimInfo} />
            <section className="flex flex-row items-start app-body">
              <Column className="flex-grow page-section-63_33 items-stretch">
                <CostBreakdown
                  amountBilled={263.0}
                  planPaid={187.94}
                  otherInsurancePaid={0.74}
                  yourCost={0.0}
                  planDiscount={10}
                />
                <Spacer size={32} />
                <ServicesRenderedSection
                  serviceTitle="Immunization"
                  className="large-section"
                  service={[
                    {
                      serviceLabel: 'Office Visit',
                      serviceSubLabel: 'Your share',
                      serviceSubLabelValue: 30.24,
                      serviceCode: '345678',
                      labelText1: 'Amount Billed',
                      labelValue1: 145.0,
                      labelText2: 'Plan Discount',
                      labelValue2: 114.76,
                      labelText3: 'Plan Paid',
                      labelValue3: 0.0,
                    },
                    {
                      serviceLabel: 'Lab Work',
                      serviceSubLabel: 'Your share',
                      serviceSubLabelValue: 30.24,
                      serviceCode: '345678',
                      labelText1: 'Amount Billed',
                      labelValue1: 145.0,
                      labelText2: 'Plan Discount',
                      labelValue2: 114.76,
                      labelText3: 'Plan Paid',
                      labelValue3: 0.0,
                    },
                    {
                      serviceLabel: 'Immunization',
                      serviceSubLabel: 'Your share',
                      serviceSubLabelValue: 30.24,
                      serviceCode: '345678',
                      labelText1: 'Amount Billed',
                      labelValue1: 145.0,
                      labelText2: 'Plan Discount',
                      labelValue2: 114.76,
                      labelText3: 'Plan Paid',
                      labelValue3: 0.0,
                    },
                    {
                      serviceLabel: 'Medical Service',
                      serviceSubLabel: 'Your share',
                      serviceSubLabelValue: 30.24,
                      serviceCode: '345678',
                      labelText1: 'Amount Billed',
                      labelValue1: 145.0,
                      labelText2: 'Plan Discount',
                      labelValue2: 114.76,
                      labelText3: 'Plan Paid',
                      labelValue3: 0.0,
                    },
                  ]}
                />
              </Column>
              <Column className=" flex-grow page-section-36_67 items-stretch">
                <DownloadSummary docURL={docURL} />
                <Spacer size={32} />
                <PayProvider className="large-section" balanceAmount={30.24} />
                <Spacer size={32} />
                <ClaimsHelpCard />
              </Column>
            </section>
          </>
        ) : (
          <ErrorInfoCard
            className="mt-4"
            errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
          />
        )}
      </Column>
    </main>
  );
};

export default ClaimDetails;
