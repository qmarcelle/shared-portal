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
    <>
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
      </section>
    </>
  );
};
