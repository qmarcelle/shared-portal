import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import AlertIcon from '../../../../public/assets/Alert-Gray1.svg';

export const DisableMFAWarning = () => {
  return (
    <Card className="neutral container">
      <Row className="flex flex-row align-top m-4">
        <Image src={AlertIcon} className="icon" alt="alert" />
        <Spacer axis="horizontal" size={8} />
        <Row className="flex flex-col flex-grow">
          <p className="body-1 font-bold">MFA is turned off.</p>
          <p className="body-1">
            Set up at least one method to add more security to your account.
          </p>
        </Row>
      </Row>
    </Card>
  );
};
