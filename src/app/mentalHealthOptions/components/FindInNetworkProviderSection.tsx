import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { ReactNode } from 'react';
import FindCare from '../../../../public/assets/Find-Care.svg';

interface FindInNetworkProviderSectionProps extends IComponent {
  icon?: ReactNode;
}
export const FindInNetworkProviderSection = ({
  icon = <Image src={FindCare} className="w-[40px] h-[40px]" alt="FindCare" />,
}: FindInNetworkProviderSectionProps) => {
  return (
    <Card className="large-section">
      <div>
        <Row className="align-top">
          {icon}
          <Spacer axis="horizontal" size={16} />
          <p className="font-bold" style={{ color: 'var(--primary-color)' }}>
            Find an In-network Provider
          </p>
        </Row>
        <Spacer size={8} />
        <TextBox text="Find a high-quality provider for either in-person or virtual telehealth appointments."></TextBox>
      </div>
    </Card>
  );
};
