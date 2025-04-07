import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ServicesUsedItem } from '@/models/app/servicesused_details';

interface ServicesUsedChartProps {
  label: string;
  serviceDetails: ServicesUsedItem[];
  contact: string;
}

export const ServicesUsedChart = ({
  label,
  serviceDetails,
  contact,
}: ServicesUsedChartProps) => {
  return (
    <div className="flex flex-col">
      <p className="underline decoration-dashed underline-offset-4 app-underline body-1">
        {label}
      </p>
      <Spacer size={16} />
      {serviceDetails &&
        serviceDetails.slice(0, serviceDetails.length).map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <div>
            <Row key={index}>
              <Column>
                <TextBox className="font-bold" text={item.spentAmount} />
                <TextBox type="body-2" text="Used" />
              </Column>
              <TextBox className="ml-5" text={item.serviceName} />
            </Row>
            <Spacer size={16} />
            <Divider />
            <Spacer size={16} />
          </div>
        ))}
      <Spacer size={8} />
      <Column>
        <RichText
          type="body-2"
          spans={[
            <span key={0}>
              Services Used is based on your processed items. There may be a
              delay in the Services Used list updating. If you&apos;re unsure if
              a service has been used,{' '}
            </span>,
            <span className="link" key={1}>
              <a> start a chat </a>
            </span>,
            <span key={3}> or call us at [{contact}].</span>,
          ]}
        />
      </Column>
    </div>
  );
};
