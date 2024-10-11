import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { CVSCareMarkDetails } from '../models/caremark_details';

interface CVSCaremarkCardProps extends IComponent, CVSCareMarkDetails {}

export const CVSCaremarkCard = ({
  className,
  serviceIcon,
  serviceLabel,
}: CVSCaremarkCardProps) => {
  return (
    <Card className={`cursor-pointer ${className}`} type="elevated">
      <Row className="p-2">
        {serviceIcon}
        <TextBox
          text={serviceLabel}
          className="inline my-auto ml-4 font-bold primary-color p-2"
        />
      </Row>
    </Card>
  );
};
