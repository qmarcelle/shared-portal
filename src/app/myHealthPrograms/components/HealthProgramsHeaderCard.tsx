import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Button } from '@/components/foundation/Button';
import Image from 'next/image';
import { IComponent } from '@/components/IComponent';
import { ReactNode } from 'react';
import { HealthProgramHeaderCardDetails } from '../models/health_program_header_card_details';

interface HealthProgramHeaderProps extends IComponent {
  icon?: ReactNode;
  healthProgramHeaderDetails: HealthProgramHeaderCardDetails;
}

export const HealthProgramsHeaderCard = ({
  icon = <Image alt="external icon" src={externalOffsiteWhiteIcon} />,
  healthProgramHeaderDetails,
}: HealthProgramHeaderProps) => {
  return (
    <Row className="justify-between mt-16 lg:mt-0">
      <Column className="pl-3 my-health-programs-header">
        <Spacer size={8} />
        <Header type="title-1" text={healthProgramHeaderDetails.title} />
        <Spacer size={8} />
        <TextBox
          className="body-1"
          text={healthProgramHeaderDetails.description}
        />
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text={healthProgramHeaderDetails.serviceDesc}
        />
        <Spacer size={23} />
        <Button
          icon={icon}
          label={healthProgramHeaderDetails.buttonText}
          className="my-health-programs-header-button"
          callback={() => {
            window.location.href =
              healthProgramHeaderDetails.redirectLink ?? ' ';
          }}
        />
      </Column>
      <Column>
        <Image
          src={healthProgramHeaderDetails.icon}
          className="size-100"
          alt="Info"
        />
      </Column>
    </Row>
  );
};
