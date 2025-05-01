import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface BalanceChartProps {
  label: string;
  spentAmount: number | undefined;
  limitAmount: number | undefined;
}

export const BalanceChart = ({
  label,
  spentAmount,
  limitAmount,
}: BalanceChartProps) => {
  function getNullBalanceAmount() {
    return (
      <Card backgroundColor="rgba(0,0,0,0.05)">
        <Column className="m-4">
          <Row>
            <TextBox
              className="body-1 "
              text={`You do not have any ${label} amounts.`}
            />
          </Row>
        </Column>
      </Card>
    );
  }
  function getBalanceAmount() {
    return (
      <div>
        {spentAmount !== undefined && limitAmount && (
          <ProgressBar
            height={10}
            completePercent={(spentAmount / limitAmount) * 100}
          />
        )}
        <Spacer size={8} />
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="font-bold">${spentAmount}</p>
            <p>Spent</p>
          </div>
          <div className="flex flex-col">
            <p>${limitAmount}</p>
            <p>Limit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <p
        className={`${spentAmount !== undefined ? 'underline decoration-dashed underline-offset-4' : ''} app-underline body-1`}
      >
        {label}
      </p>
      <Spacer size={16} />
      {spentAmount !== undefined && limitAmount
        ? getBalanceAmount()
        : getNullBalanceAmount()}
    </div>
  );
};
