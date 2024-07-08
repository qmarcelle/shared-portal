import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  CostBreakdown,
  CostBreakdownProps,
} from '@/components/composite/CostBreakdown';

const renderUI = ({
  amountBilled,
  planPaid,
  otherInsurancePaid,
  yourCost,
  planDiscount,
}: CostBreakdownProps) => {
  return render(
    <CostBreakdown
      amountBilled={amountBilled}
      planPaid={planPaid}
      otherInsurancePaid={otherInsurancePaid}
      yourCost={yourCost}
      planDiscount={planDiscount}
    />,
  );
};
describe('CostBreakdown', () => {
  it('CostBreakdown', () => {
    const cost: CostBreakdownProps = {
      amountBilled: 263.0,
      planPaid: 187.94,
      otherInsurancePaid: 0.74,
      yourCost: 0.0,
    };
    const component = renderUI(cost);
    expect(screen.getByText('--')).toBeVisible();
    expect(screen.getByText('$0.00')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
