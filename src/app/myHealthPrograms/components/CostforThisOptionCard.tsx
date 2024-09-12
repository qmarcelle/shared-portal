import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { CostForThisOptionDetails } from '../models/cost_for_this_option_details';

interface CostforOptionProps extends IComponent {
  costForThisOptionDetails: CostForThisOptionDetails;
}
export const CostforThisOptionCard = ({
  costForThisOptionDetails,
}: CostforOptionProps) => {
  return (
    <Card className="my-health-programs-cost-option">
      <Column>
        <Header
          text="Your Cost for This Option"
          type="title-2"
          className="!font-light !text-[26px]/[40px]"
        />
        <Spacer size={16} />
        <Column>
          <TextBox text={costForThisOptionDetails.description} />
          <Spacer size={8} />
          <TextBox
            className="font-bold text-xl"
            text={costForThisOptionDetails.cost}
          />
        </Column>
      </Column>
    </Card>
  );
};
