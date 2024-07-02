import { IComponent } from '../../../components/IComponent';
import { AppLink } from '../../../components/foundation/AppLink';
import { Card } from '../../../components/foundation/Card';
import { Circle } from '../../../components/foundation/Circle';
import { Header } from '../../../components/foundation/Header';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import { SpendingChart } from './SpendingChart';

interface SpendingSummarySectionProps extends IComponent {
  dateOfAccessingPortal: string;
  amountPaid: number;
  amountSaved: number;
  totalBilledAmount: number;
  amountSavedPercentage: number;
  color1: string;
  color2: string;
}

export const SpendingAccountSummary = ({
  className,
  dateOfAccessingPortal,
  amountPaid,
  totalBilledAmount,
  amountSaved,
  amountSavedPercentage,
  color1,
  color2,
}: SpendingSummarySectionProps) => {
  return (
    <Card className={className}>
      <div>
        <Header text="Spending Summary" type="title-2" />
        <Spacer size={18} />
        <Row>
          <TextBox text="As of" />
          <Spacer axis="horizontal" size={8} />
          <p>{dateOfAccessingPortal}</p>
        </Row>
        <Spacer size={18} />
        <SpendingChart
          color1={color1}
          color2={color2}
          totalAmount={totalBilledAmount}
          percentageAmountSaved={amountSavedPercentage}
        ></SpendingChart>
        <Row>
          <Circle
            width={20}
            height={20}
            color="#005EB9"
            radius={50}
            top={3}
            right={0}
          />
          <TextBox text="You Paid" className="ml-2" />
          <p className="font-bold ml-auto">${amountPaid}</p>
        </Row>
        <Spacer size={18} />
        <Row>
          <Circle
            width={20}
            height={20}
            color="#5DC1FD"
            radius={50}
            top={3}
            right={0}
          />
          <TextBox text="You Saved" className="ml-2" />
          <p className="font-bold ml-auto">${amountSaved}</p>
        </Row>
        <Spacer size={32} />
        <AppLink label="View Spending Summary" />
      </div>
    </Card>
  );
};
