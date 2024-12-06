import { formatCurrency } from '@/utils/currency_formatter';
import { ArcElement, Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { Column } from '../../../components/foundation/Column';
import { Spacer } from '../../../components/foundation/Spacer';

ChartJS.register;
{
  ArcElement;
}

interface WellnessRewardsChartProps {
  maxAmount: number;
  earnedAmount: number;
  color1: string;
  color2: string;
}

const Options = {
  cutout: '87%',
  borderWidth: 0,
};

export const WellnessRewardsChart = ({
  maxAmount,
  earnedAmount,
  color1,
  color2,
}: WellnessRewardsChartProps) => {
  const data = {
    datasets: [
      {
        data: [maxAmount - earnedAmount, earnedAmount],
        backgroundColor: [color1, color2],
      },
    ],
  };
  return (
    <Column className="chartSection">
      <div className="text-center absolute doughnutTextWellness pl-3 w-48">
        <div className="flex flex-col justify-between pl-3 chartText">
          <p>You&apos;ve earned</p>
          <p className="font-bold">{formatCurrency(earnedAmount) ?? '--'}</p>
          <p>of {formatCurrency(maxAmount) ?? '--'} Quarterly Max</p>
        </div>
      </div>
      <Spacer size={8} />
      <Doughnut
        data={data}
        options={Options}
        className="spendingSummaryChart"
      />
      <Spacer size={32} />
    </Column>
  );
};
