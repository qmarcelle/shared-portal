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
import { filterUniqueByAttributes } from '@/utils/object_utils';
import { ClaimDetailsData } from '../models/app/claimDetailsData';

export type ClaimDetailsProps = {
  claimData: ClaimDetailsData;
  docURL: string;
  phoneNumber: string;
};

const ClaimDetails = ({
  claimData,
  docURL,
  phoneNumber,
}: ClaimDetailsProps) => {
  const claimServices = filterUniqueByAttributes(
    claimData?.claimDetailServices || [],
    ['srvLineItemSeq'],
  );

  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        {claimData?.claimInfo ? (
          <>
            <ClaimsPageInformation claimInfo={claimData.claimInfo} />
            <section className="flex flex-row items-start app-body">
              <Column className="flex-grow page-section-63_33 items-stretch">
                <CostBreakdown
                  amountBilled={claimData?.claim?.claimTotalChargeAmt}
                  planPaid={claimData?.claim?.claimPaidAmt}
                  otherInsurancePaid={claimData?.claim?.claimCOBAmt}
                  yourCost={claimData?.claim?.claimPatientOweAmt}
                  planDiscount={
                    claimData?.claim?.claimTotalChargeAmt -
                    claimData?.claim?.totalAllowedAmt
                  }
                />
                <Spacer size={32} />
                <ServicesRenderedSection
                  serviceTitle={'Services On This Claim'}
                  className="large-section"
                  service={claimServices.map((service) => ({
                    serviceLabel: service.srvLineDesc,
                    serviceSubLabel: 'Your Share',
                    serviceSubLabelValue: service.srvcPatientOwe,
                    labelText1: 'Amount Billed',
                    labelValue1: service.srvcTotalChargeAmt,
                    labelText2: 'Plan Discount',
                    labelValue2:
                      service.srvcTotalChargeAmt - service.allowedAmt,
                    labelText3: 'Plan Paid',
                    labelValue3: service.providerPaidAmount,
                  }))}
                />
              </Column>
              <Column className=" flex-grow page-section-36_67 items-stretch">
                <DownloadSummary docURL={docURL} />
                <Spacer size={32} />
                <PayProvider
                  className="large-section"
                  balanceAmount={claimData?.claim?.claimPatientOweAmt}
                />
                <Spacer size={32} />
                <ClaimsHelpCard phoneNumber={phoneNumber} />
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
