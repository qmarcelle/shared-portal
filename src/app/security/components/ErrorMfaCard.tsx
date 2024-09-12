import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import AlertIcon from '../../../../public/assets/Alert-Gray1.svg';

type ErrorMfaCardProps = {
  errorText: string;
} & IComponent;

export const ErrorMfaCard: React.FC<ErrorMfaCardProps> = ({
  errorText,
  className,
}) => {
  return (
    <Card className={`neutral container ${className}`}>
      <Row className="flex flex-row align-top m-4">
        <Image src={AlertIcon} className="icon" alt="alert" />
        <Spacer axis="horizontal" size={8} />
        <Row className="flex flex-col flex-grow">
          <p className="body-1">{errorText}</p>
        </Row>
      </Row>
    </Card>
  );
};
