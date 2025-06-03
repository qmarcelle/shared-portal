import Image from 'next/image';
import AlertIcon from '../../../public/assets/alert_gray.svg';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { IComponent } from '../IComponent';

import { Card } from '@/components/foundation/Card';

type ErrorInfoCardProps = {
  errorText: string;
} & IComponent;

export const ErrorInfoCard: React.FC<ErrorInfoCardProps> = ({
  errorText,
  className,
}) => {
  return (
    <Card className={`neutral container ${className}`}>
      <Row className="flex flex-row align-top m-4">
        <Image src={AlertIcon} className="icon" alt="" />
        <Spacer axis="horizontal" size={8} />
        <Row className="flex flex-col flex-grow">
          <p className="body-1">{errorText}</p>
        </Row>
      </Row>
    </Card>
  );
};
