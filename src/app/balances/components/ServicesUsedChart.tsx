import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { formatCurrency } from '@/utils/currency_formatter';
import { Spacer } from '../../../components/foundation/Spacer';
import { ServicesUsed } from '../../../models/app/servicesused_details';

interface ServicesUsedChartProps {
  label: string;
  serviceDetails: ServicesUsed[];
}

export const ServicesUsedChart = ({
  label,
  serviceDetails,
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
                <TextBox
                  className="font-bold"
                  text={formatCurrency(item.spentAmount) ?? '--'}
                />
                <TextBox type="body-2" text="Used" />
              </Column>
              <TextBox
                className="ml-5"
                text={
                  (formatCurrency(item.limitAmount) ?? '--') +
                  ' ' +
                  item.serviceName
                }
              />
            </Row>
            <Spacer size={16} />
            <Divider />
            <Spacer size={16} />
          </div>
        ))}
      <Spacer size={8} />
    </div>
  );
};
