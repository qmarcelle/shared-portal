import { IComponent } from '@/components/IComponent';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { payMyPremiumMedicareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ViewPayPremium } from './viewPayPremium';

interface PayPremiumProps extends IComponent {
  dueDate: string;
  amountDue: string;
  icon?: ReactNode;
  visibilityRules?: VisibilityRules;
}

export const PayPremiumSection = ({
  dueDate,
  amountDue,
  className,
  visibilityRules,
  icon = <Image alt="" src={externalOffsiteWhiteIcon} />,
}: PayPremiumProps) => {
  const { showAppModal, dismissModal } = useAppModalStore();
  const router = useRouter();
  return (
    <Card className={className}>
      <>
        <h2 className="title-2">Pay Premium</h2>
        <Spacer size={32} />
        {dueDate || amountDue ? (
          <div>
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
              <Button
                icon={icon}
                label="View or Pay Premium"
                callback={() => {
                  router.push(
                    '/sso/launch?PartnerSpId=' +
                      process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA,
                  );
                }}
              />
            ) : (
              <Button
                icon={icon}
                label="View or Pay Premium"
                callback={() =>
                  showAppModal({
                    content: (
                      <ViewPayPremium
                        key="first"
                        label="Open External Website"
                        subLabelOne="Use this service as an easy and secure way to pay your premium with a debit card or electronic check. Setup recurring bank drafts, manage future payments, and view payment history."
                        subLabelTwo="By continuing, you agree to leave the BlueCross website and view the content of an external website. If you choose not to leave the BlueCross website, simply cancel."
                        primaryButtonLabel="Cancel"
                        secondaryButtonLabel="Continue"
                        primaryButtonCallback={dismissModal}
                        secondaryButtonCallback={dismissModal}
                      />
                    ),
                    modalType: 'alternate',
                  })
                }
              />
            )}
          </div>
        ) : (
          <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
        )}
      </>
    </Card>
  );
};
