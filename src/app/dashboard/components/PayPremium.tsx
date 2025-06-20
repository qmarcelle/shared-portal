import { IComponent } from '@/components/IComponent';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { ReactNode } from 'react';
import { ViewPayPremium } from './viewPayPremium';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { payMyPremiumMedicareEligible } from '@/visibilityEngine/computeVisibilityRules';

interface PayPremiumProps extends IComponent {
  dueDate: string;
  amountDue: number;
  icon?: ReactNode;
  visibilityRules?:VisibilityRules;
}

export const PayPremiumSection = ({
  dueDate,
  amountDue,
  className,
  visibilityRules,
  icon = <Image alt="external icon" src={externalOffsiteWhiteIcon} />,
}: PayPremiumProps) => {
  const { showAppModal,dismissModal } = useAppModalStore();  
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
        {!payMyPremiumMedicareEligible(visibilityRules) ? (
                <Button icon={icon} label="View or Pay Premium" callback={() => null} />
        ): (
        <Button
          icon={icon}
          label="View or Pay Premium"
          callback={() =>
            showAppModal({
              content: 
                      <ViewPayPremium
                        key="first"
                        label="Open External Website"
                        subLabelOne="Use this service as an easy and secure way to pay your premium with a debit card or electronic check. Setup recurring bank drafts, manage future payments, and view payment history."
                        subLabelTwo="By continuing, you agree to leave the BlueCross website and view the content of an external website. If you choose not to leave the BlueCross website, simply cancel."
                        primaryButtonLabel="Cancel"
                        secondaryButtonLabel="Continue"
                        primaryButtonCallback={dismissModal}
                        secondaryButtonCallback={dismissModal}
                      />,
            })
          }
        />)
        }
      </div>
    </Card>
  );
};
