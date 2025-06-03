import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { Session } from 'next-auth';
import Image from 'next/image';
import { ReactNode } from 'react';
import { HealthProgramHeaderCardDetails } from '../models/health_program_header_card_details';

interface HealthProgramHeaderProps extends IComponent {
  icon?: ReactNode;
  healthProgramHeaderDetails: HealthProgramHeaderCardDetails;
  sessionData: Session | null;
}

export const HealthProgramsHeaderCard = ({
  icon = <Image alt="" src={externalOffsiteWhiteIcon} />,
  healthProgramHeaderDetails,
  sessionData,
}: HealthProgramHeaderProps) => {
  return (
    <Column className="md:m-2 m-4">
      <Row className="md:hidden">
        <Column className="mt-8">
          {healthProgramHeaderDetails.icon && (
            <img
              src={healthProgramHeaderDetails.icon}
              className="size-100"
              alt=""
            />
          )}
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

          <Column className="w-fit md:w-[83%]">
            <RichText
              type="body-1"
              spans={[healthProgramHeaderDetails.serviceDesc2]}
            />
          </Column>
          {healthProgramHeaderDetails.serviceDesc && <Spacer size={23} />}

          {healthProgramHeaderDetails.buttonText && (
            <Button
              icon={icon}
              label={healthProgramHeaderDetails.buttonText}
              className="my-health-programs-header-button"
              callback={() => {
                window.location.href =
                  healthProgramHeaderDetails.redirectLink?.(sessionData) ?? ' ';
              }}
            />
          )}
        </Column>
        <Column className="hidden md:block">
          {healthProgramHeaderDetails.icon && (
            <img
              src={healthProgramHeaderDetails.icon}
              className="size-100 "
              alt=""
            />
          )}
        </Column>
      </Row>
    </Column>
  );
};
