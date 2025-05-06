import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ServicesUsedItem } from '@/models/app/servicesused_details';

interface MedicalServicesUsedChartProps {
  medicalServiceDetails: ServicesUsedItem[];
}
export const MedicalServicesUsedChart = ({
  medicalServiceDetails,
}: MedicalServicesUsedChartProps) => {
  return (
    <div className="flex flex-col">
      <Spacer size={32} />
      {medicalServiceDetails &&
        medicalServiceDetails
          .slice(0, medicalServiceDetails.length)
          .map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <div>
              <Row key={index}>
                <Column>
                  <TextBox
                    className="font-bold"
                    text={String(item.spentAmount) ?? '--'}
                  />
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
    </div>
  );
};
