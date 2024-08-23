import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import SanitasIcon from '../../../../public/assets/Sanitas-BoT.svg';
import AbleToIcon from '../../../../public/assets/ableTo.svg';
import TelaDocIcon from '../../../../public/assets/teladoc_health.svg';
import { IComponent } from '../../../components/IComponent';
import { AppLink } from '../../../components/foundation/AppLink';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { ListOrder } from '../../../components/foundation/ListOrder';
import { Row } from '../../../components/foundation/Row';
import { Spacer, SpacerX } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import { VirtualHealthCareDetails } from '../models/mental_health_care_options_details';

interface HealthCareItemProps extends IComponent {
  healthCareInfo: VirtualHealthCareDetails;
  itemData: string[];
  itemDataTitle: string;
}

export const HealthCareItem = ({
  healthCareInfo,
  onClick,
  className,
  itemDataTitle,
  itemData,
}: HealthCareItemProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getHealthIcon() {
    if (healthCareInfo.icon == 'TelaDoc') {
      return TelaDocIcon;
    } else if (healthCareInfo.icon == 'AbleToIcon') {
      return AbleToIcon;
    } else if (healthCareInfo.icon == 'Sanitas') {
      return SanitasIcon;
    }
  }

  function getDesktopView() {
    return (
      <Row className={'flex flex-col align-top m-4 mt-8'}>
        <TextBox
          className="body-2 px-3 py-1 w-fit border border-current rounded-full mb-4"
          text={healthCareInfo.healthcareType}
        ></TextBox>
        <Image
          src={getHealthIcon()}
          className="w-1/2"
          alt={healthCareInfo.icon}
        />
        <Spacer axis="horizontal" size={8} />
        <Column className="flex flex-col flex-grow">
          <TextBox
            className="title-3 !font-bold m-4 mb-0"
            text={healthCareInfo.healthCareName}
          ></TextBox>
          <Spacer size={16} />
          <TextBox
            className="body-1 m-4 mb-0"
            text={healthCareInfo.description}
          ></TextBox>
          <Spacer size={8} />
          <ListOrder title={itemDataTitle} itemData={itemData}></ListOrder>
          <AppLink className="text-left" label={healthCareInfo.link} />
        </Column>
      </Row>
    );
  }

  function getMobileView() {
    return (
      <Column className="m-4">
        <Row className="flex flex-col align-top m-4 mt-8 justify-between">
          <TextBox
            className="body-2 px-3 py-1 w-fit border border-current rounded-full mb-4"
            text="Medical Health"
          ></TextBox>
          <Image
            src={getHealthIcon()}
            className="w-1/2"
            alt={healthCareInfo.icon}
          />
          <SpacerX size={8} />
          <Column className="flex flex-col flex-grow">
            <TextBox
              className="title-3 !font-bold m-4 mb-0"
              text={healthCareInfo.healthCareName}
            ></TextBox>
            <SpacerX size={16} />
            <TextBox
              className="body-1 m-4 mb-0"
              text={healthCareInfo.description}
            ></TextBox>
            <SpacerX size={8} />
            <ListOrder title={itemDataTitle} itemData={itemData}></ListOrder>
            <AppLink className="text-left" label={healthCareInfo.link} />
          </Column>
        </Row>
      </Column>
    );
  }

  return isClient ? (
    <Card
      className={`cursor-pointer ${className} md:w-1/3`}
      type="elevated"
      onClick={onClick}
    >
      {isMobile ? getMobileView() : getDesktopView()}
    </Card>
  ) : null;
};
