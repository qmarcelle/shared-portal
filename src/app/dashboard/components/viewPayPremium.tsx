import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import Image from 'next/image';

interface ViewPayPremiumProps extends IComponent {
  label: string;
  subLabelOne: string;
  subLabelTwo: string;
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  primaryButtonCallback?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  secondaryButtonCallback?: () => any;
}

export const ViewPayPremium = ({
  label,
  subLabelOne,
  subLabelTwo,
  primaryButtonLabel,
  secondaryButtonLabel,
  primaryButtonCallback,
  secondaryButtonCallback,
}: ViewPayPremiumProps) => {
  return (
    <section id="modal-premium" className="flex flex-col items-center p-7">
      <Column className="flex flex-col items-center">
        <Header type="title-2" text={label} />
        <Spacer size={16} />
        <TextBox className="text-center" text={subLabelOne} />
        <Spacer size={16} />
        <TextBox className="text-center" text={subLabelTwo} />
        <Spacer size={16} />
        <Row className="flex w-full justify-between">
          <Button
            label={primaryButtonLabel}
            type="secondary"
            callback={primaryButtonCallback}
          />
          <Spacer axis="horizontal" size={24} />
          <Button
            icon={<Image alt="external icon" src={externalOffsiteWhiteIcon} />}
            className="font-bold active"
            label={secondaryButtonLabel}
            type="primary"
            callback={secondaryButtonCallback}
          />
        </Row>
      </Column>
    </section>
  );
};
