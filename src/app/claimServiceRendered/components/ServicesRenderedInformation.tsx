import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { formatCurrency } from '@/utils/currency_formatter';

interface ServicesRenderedInformationProps extends IComponent {
  serviceCode?: string;
  subLabel: string;
  subLabelValue: number;
  label1: string;
  value1: number;
  label2: string;
  value2: number;
  label3: string;
  value3: number;
}

export const ServicesRenderedInformation = ({
  serviceCode,
  subLabel,
  subLabelValue,
  label1,
  label2,
  label3,
  value1,
  value2,
  value3,
}: ServicesRenderedInformationProps) => {
  return (
    <Column className="flex flex-col">
      {serviceCode != null && (
        <TextBox
          className="body-1"
          text={`Service Code: ${serviceCode}`}
        ></TextBox>
      )}
      <Spacer size={32} />
      <Row className="justify-between">
        <TextBox className="float-left" text={label1} />
        <TextBox
          className="float-right"
          text={formatCurrency(value1) ?? '--'}
        />
      </Row>
      <Spacer size={12} />
      <Divider />
      <Spacer size={12} />
      <Row className="justify-between">
        <TextBox text={label2} />
        <TextBox text={formatCurrency(value2) ?? '--'} />
      </Row>
      <Spacer size={12} />
      <Row className="justify-between">
        <TextBox text={label3} />
        <TextBox text={formatCurrency(value3) ?? '--'} />
      </Row>
      <Spacer size={12} />
      <Divider />
      <Spacer size={12} />
      <Row className="justify-between">
        <TextBox className="font-bold" text={subLabel} />
        <TextBox
          className="font-bold"
          text={formatCurrency(subLabelValue) ?? '--'}
        />
      </Row>
    </Column>
  );
};
