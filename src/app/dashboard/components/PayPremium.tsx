import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ReactNode } from 'react';

interface PayPremiumProps extends IComponent {
  dueDate: string;
  amountDue: number;
  icon?: ReactNode;
}

export const PayPremiumSection = ({
  dueDate,
  amountDue,
  className,
  icon = <img alt="external icon" src={externalOffsiteWhiteIcon} />,
}: PayPremiumProps) => {
  return (
    <Card className={className}>
      <div>
        <h2 className="title-2">Pay Premium</h2>
        <Spacer size={32} />
        <Row>
          <TextBox text="Payment Due Date" />
          <p className="body-bold ml-auto">{dueDate}</p>
        </Row>
        <Spacer size={12} />
        <Row>
          <TextBox text="Amount Due" />
          <p className="body-bold ml-auto">${amountDue}</p>
        </Row>
        <Spacer size={32} />
        <Button icon={icon} label="View or Pay Premium" callback={() => null} />
      </div>
    </Card>
  );
};
