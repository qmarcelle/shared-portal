import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { formatCurrency } from '@/utils/currency_formatter';
import { IComponent } from '../../../components/IComponent';

interface PayProviderProps extends IComponent {
  balanceAmount: number;
}

export const PayProvider = ({ balanceAmount, className }: PayProviderProps) => {
  return (
    <Card className={className}>
      <div>
        <TextBox type="title-2" text="Pay This Provider" />
        <Spacer size={12} />
        <Row>
          <TextBox text="Your estimated balance is&nbsp;" />
          <TextBox
            className="font-bold"
            text={formatCurrency(balanceAmount) ?? '--'}
          />
        </Row>
        <Spacer size={5} />
        <Row>
          <Checkbox label="Mark as Paid" />
          <img src="/assets/info.svg" alt="info icon" />
        </Row>
        <Spacer size={12} />
        <Button label="Pay This Provider" callback={() => null} />
      </div>
    </Card>
  );
};
