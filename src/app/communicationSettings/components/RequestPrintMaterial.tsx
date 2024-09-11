import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { InlineLink } from '@/components/foundation/InlineLink';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface RequestPrintMaterialProps extends IComponent {}

export const RequestPrintMaterialSection = ({
  className,
}: RequestPrintMaterialProps) => {
  return (
    <Card className={className}>
      <div>
        <Header text="Request Print Material" type="title-2" />
        <Spacer size={12} />
        <Row>
          <TextBox text="Your claim summaries are paperless by default, unless you've opted into paper copies." />
        </Row>
        <Spacer size={18} />
        <TextBox
          className="inline"
          text="If you need to request paper copies, please"
        />
        <InlineLink className="inline py-0" label="contact us" />
        <TextBox
          className="inline"
          text="or call us using the Member Service number on the back of your Member ID card."
        />
      </div>
    </Card>
  );
};
