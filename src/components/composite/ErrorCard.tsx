import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import AlertIcon from '../../../public/assets/alert_gray.svg';

type ErrorMfaCardProps = {
  errorText: string;
} & IComponent;

export const ErrorCard: React.FC<ErrorMfaCardProps> = ({
  errorText,
  className,
}) => {
  return (
    <Card type="neutral" className={` neutral container ${className}`}>
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
