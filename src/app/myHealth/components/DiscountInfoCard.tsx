import { Row } from '@/components/foundation/Row';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { TextBox } from '../../../components/foundation/TextBox';
import { DiscountCardsInfo } from '../models/DiscountCards_Info';

interface DiscountInfoCardProps extends IComponent, DiscountCardsInfo {}

const openDocument = (url: string) => {
  window.open(url, '_blank');
};

export const DiscountInfoCard = ({
  icon,
  cardLink,
  url,
  className,
}: DiscountInfoCardProps) => {
  return (
    <Card className={`${className}`} onClick={() => openDocument(url)}>
      <Row>
        {icon}
        <TextBox text={cardLink} className="inline my-auto ml-4" />
      </Row>
    </Card>
  );
};
