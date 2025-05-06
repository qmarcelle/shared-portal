import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Spacer } from '@/components/foundation/Spacer';

interface BalanceChartProps {
  label: string;
  spentAmount: number;
  limitAmount: number;
}

export const BalanceChart = ({
  label,
  spentAmount,
  limitAmount,
}: BalanceChartProps) => {
  return (
    <div className="flex flex-col">
      <p className="underline decoration-dashed underline-offset-4 app-underline body-1">
        {label}
      </p>
      <Spacer size={16} />
      <ProgressBar
        height={10}
        completePercent={(spentAmount / limitAmount) * 100}
        ariaLabel={`$${spentAmount} used of $${limitAmount}`}
      />
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
};
