import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { HealthProgramDetails } from '../models/health_program_details';
import { HealthProgramHeaderCardDetails } from '../models/health_program_header_card_details';
import { CostforThisOptionCard } from './CostforThisOptionCard';
import { GoodforThisOptionCard } from './GoodforThisOptionCard';
import { HealthProgramsHeaderCard } from './HealthProgramsHeaderCard';
import { WhyUseThisOptionCard } from './WhyUseThisOptionCard';
import { Session } from 'next-auth';

interface HealthProgramsResourcesProps extends IComponent {
  healthProgramDetails?: HealthProgramDetails;
  sessionData: Session | null;
}

export const HealthProgramsResources = ({
  healthProgramDetails,
  sessionData,
}: HealthProgramsResourcesProps) => {
  return (
    <Column className="app-content app-base-font-color">
      <Spacer size={64} />
      <HealthProgramsHeaderCard
        sessionData={sessionData}
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
              healthProgramDetails?.costForThisOptionDetails ?? []
            }
          />
        </Column>
        <Column className=" flex-grow page-section-36_67 items-stretch md:ml-4">
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
