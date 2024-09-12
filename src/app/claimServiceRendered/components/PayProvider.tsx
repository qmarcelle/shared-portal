import { Checkbox } from '@/components/foundation/Checkbox';
import { formatCurrency } from '@/utils/currency_formatter';
import Image from 'next/image';
import infoIcon from '../../../../public/assets/info.svg';
import { IComponent } from '../../../components/IComponent';
import { Button } from '../../../components/foundation/Button';
import { Card } from '../../../components/foundation/Card';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';

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
          <Image alt="info icon" src={infoIcon} />
        </Row>
        <Spacer size={12} />
        <Button label="Pay This Provider" callback={() => null} />
      </div>
    </Card>
  );
};
