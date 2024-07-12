import { formatCurrency } from '@/utils/currency_formatter';
import { ArcElement, Chart as ChartJS } from 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { Column } from '../../../components/foundation/Column';
import { Divider } from '../../../components/foundation/Divider';
import { Spacer } from '../../../components/foundation/Spacer';

ChartJS.register;
{
  ArcElement;
}

interface SpendingChartProps {
  totalAmount: number;
  percentageAmountSaved: number;
  color1: string;
  color2: string;
}

const Options = {
  cutout: '87%',
  borderWidth: 0,
};

export const SpendingChart = ({
  totalAmount,
  percentageAmountSaved,
  color1,
  color2,
}: SpendingChartProps) => {
  const data = {
    datasets: [
      {
        data: [100 - percentageAmountSaved, percentageAmountSaved],
        backgroundColor: [color1, color2],
      },
    ],
  };
  return (
    <Column className="chartSection">
      <div className="text-center absolute doughnutText pl-3 w-36">
        <div className="flex flex-col justify-between pl-3 chartText">
          <p>Your plan paid</p>
          <p className="font-bold">{percentageAmountSaved}%</p>
          <p>of your costs</p>
        </div>
        <Spacer size={8} />
        <div className="chartTextDivider">
          <Divider></Divider>
        </div>
        <Spacer size={8} />
        <div className="flex flex-col justify-between pl-3 chartText">
          <p>Total Billed</p>
          <p className="font-bold">{formatCurrency(totalAmount) ?? '--'}</p>
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
