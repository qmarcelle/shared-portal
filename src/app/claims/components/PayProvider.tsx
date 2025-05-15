import { Checkbox } from '@/components/foundation/Checkbox';
import { formatCurrency } from '@/utils/currency_formatter';
import Image from 'next/image';
import { useState } from 'react';
import { IComponent } from '../../../components/IComponent';
import { Button } from '../../../components/foundation/Button';
import { Card } from '../../../components/foundation/Card';
import { Row } from '../../../components/foundation/Row';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import infoIcon from '/public/assets/info.svg';

interface PayProviderProps extends IComponent {
  balanceAmount: number;
}

export const PayProvider = ({ balanceAmount, className }: PayProviderProps) => {
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleCheckboxChange = (newValue: boolean) => {
    setIsPaid(newValue);
    setError(undefined); // Clear any previous errors
  };

  const handlePayProvider = () => {
    if (isPaid && balanceAmount > 0) {
      setError('Cannot mark as paid when there is a balance');
      return;
    }
    // TODO: Implement payment logic
  };

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
          <Checkbox
            id="mark-as-paid-checkbox"
            label="Mark as Paid"
            checked={isPaid}
            onChange={handleCheckboxChange}
            error={!!error}
            errorMessage={error}
            required={false}
          />
          <Image
            alt="Mark as paid information"
            title="Check this box if you have already paid this provider"
            src={infoIcon}
            aria-label="Information about marking as paid"
          />
        </Row>
        <Spacer size={12} />
        <Button
          label="Pay This Provider"
          callback={isPaid && balanceAmount > 0 ? undefined : handlePayProvider}
        />
      </div>
    </Card>
  );
};
