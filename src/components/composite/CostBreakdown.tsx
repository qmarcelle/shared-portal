import { formatCurrency } from '@/utils/currency_formatter';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { Header } from '../foundation/Header';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

export interface CostBreakdownProps {
  amountBilled: number;
  planDiscount?: number;
  planPaid: number;
  otherInsurancePaid: number;
  yourCost: number;
}

export const CostBreakdown = ({
  amountBilled,
  planDiscount,
  planPaid,
  otherInsurancePaid,
  yourCost,
}: CostBreakdownProps) => {
  return (
    <section>
      <Card className="small-section">
        <Column className="flex flex-col">
          <Header className="title-2" text="Cost Breakdown" />
          <Spacer size={32} />
          <Row className="justify-between py-1">
            <TextBox text="Amount Billed" />
            <TextBox text={formatCurrency(amountBilled) ?? '--'} />
          </Row>
          <Row className="justify-between py-1">
            <TextBox text="Plan Discount" />
            <TextBox text={formatCurrency(planDiscount) ?? '--'} />
          </Row>
          <Row className="justify-between py-1">
            <TextBox text="Plan Paid" />
            <TextBox text={formatCurrency(planPaid) ?? '--'} />
          </Row>
          <Row className="justify-between py-1">
            <TextBox className="body-1" text="Other Insurance Paid" />
            <TextBox text={formatCurrency(otherInsurancePaid) ?? '--'} />
          </Row>
          <Spacer size={24} />
          <Divider />
          <Spacer size={24} />
          <Row className="justify-between py-1">
            <TextBox className="font-bold" text="Your Share of the Cost" />
            <TextBox text={formatCurrency(yourCost) ?? '--'} />
          </Row>
        </Column>
      </Card>
    </section>
  );
};
