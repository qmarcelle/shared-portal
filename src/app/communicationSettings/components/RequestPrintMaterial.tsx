import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { InlineLink } from '@/components/foundation/InlineLink';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface RequestPrintMaterialProps extends IComponent {
  phoneNumber: string;
}

export const RequestPrintMaterialSection = ({
  className,
  phoneNumber,
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
          className="py-0"
          display="inline"
          text="If you need to request paper copies, please"
        />
        <InlineLink className="inline py-0" label="start a chat" />
        <TextBox display="inline" text={`or call us at `} />
        <span className="whitespace-nowrap">{`${phoneNumber}`} </span>
      </div>
    </Card>
  );
};
