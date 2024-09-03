import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { CostForThisOptionDetails } from '../models/cost_for_this_option_details';
import { HealthProgramDetails } from '../models/health_program_details';
import { HealthProgramHeaderCardDetails } from '../models/health_program_header_card_details';
import { CostforThisOptionCard } from './CostforThisOptionCard';
import { GoodforThisOptionCard } from './GoodforThisOptionCard';
import { HealthProgramsHeaderCard } from './HealthProgramsHeaderCard';
import { WhyUseThisOptionCard } from './WhyUseThisOptionCard';

interface HealthProgramsResourcesProps extends IComponent {
  healthProgramDetails?: HealthProgramDetails;
}

export const HealthProgramsResources = ({
  healthProgramDetails,
}: HealthProgramsResourcesProps) => {
  return (
    <Column className="app-content app-base-font-color">
      <Spacer size={64} />
      <HealthProgramsHeaderCard
        healthProgramHeaderDetails={
          healthProgramDetails?.healthProgramHeaderDetails ??
          ({} as HealthProgramHeaderCardDetails)
        }
      />
      <Spacer size={16} />
      <section className="flex flex-row items-start app-body">
        <Column className="flex-grow page-section-63_33 items-stretch">
          <WhyUseThisOptionCard
            whyThisOptionDetails={
              healthProgramDetails?.whyUseThisOptionDetails ?? []
            }
            programType={healthProgramDetails?.programType}
          />
          <CostforThisOptionCard
            costForThisOptionDetails={
              healthProgramDetails?.costForThisOptionDetails ??
              ({} as CostForThisOptionDetails)
            }
          />
        </Column>
        <Column className=" flex-grow page-section-36_67 items-stretch ml-2">
          <GoodforThisOptionCard
            goodforThisOptionDetails={
              healthProgramDetails?.goodForOptionDetails ?? []
            }
          />
        </Column>
      </section>
    </Column>
  );
};
