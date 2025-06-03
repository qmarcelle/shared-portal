import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ReactNode } from 'react';

type IconCardProps = {
  text: string;
  prefixIcon?: ReactNode;
} & IComponent;

export const IconCard: React.FC<IconCardProps> = ({
  text,
  className,
  prefixIcon,
}) => {
  return (
    <Card type="neutral" className={` neutral container ${className}`}>
      <Row className="flex flex-row align-top m-4">
        {prefixIcon && prefixIcon}
        <Spacer axis="horizontal" size={8} />
        <Row className="flex flex-col flex-grow">
          <p className="body-1">{text}</p>
        </Row>
      </Row>
    </Card>
  );
};
