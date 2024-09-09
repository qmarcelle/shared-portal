import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
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
    <Column className="md:m-2 m-4">
      <Row className="md:hidden">
        <Column className="mt-8">
          <Image
            src={healthProgramHeaderDetails.icon}
            className="size-100"
            alt="Info"
          />
        </Column>
      </Row>
      <Row className="justify-between mt-2 md:mt-16 lg:mt-0">
        <Column className="max-w-2xl ">
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
        <Column className="hidden md:block">
          <Image
            src={healthProgramHeaderDetails.icon}
            className="size-100 "
            alt="Info"
          />
        </Column>
      </Row>
    </Column>
  );
};
