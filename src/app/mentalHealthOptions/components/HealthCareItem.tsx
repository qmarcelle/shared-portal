import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { ListOrder } from '@/components/foundation/ListOrder';
import { Row } from '@/components/foundation/Row';
import { Spacer, SpacerX } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import ableToIcon from '../../../../public/assets/able_to.svg';
import alightIcon from '../../../../public/assets/alight.svg';
import blueTennesseIcon from '../../../../public/assets/blueTennesee.svg';
import careTNIcon from '../../../../public/assets/caretn.svg';
import healthyMaternityIcon from '../../../../public/assets/healthy_maternity.svg';
import hingeHealthIcon from '../../../../public/assets/hinge_health.svg';
import questSelectIcon from '../../../../public/assets/quest_select.svg';
import sanitasIcon from '../../../../public/assets/sanitas_bot.svg';
import silverFitIcon from '../../../../public/assets/silver_fit.svg';
import teladocIcon from '../../../../public/assets/teladoc_health.svg';
import { VirtualHealthCareDetails } from '../models/mental_health_care_options_details';

interface HealthCareItemProps extends IComponent {
  healthCareInfo: VirtualHealthCareDetails;
  itemData: string[];
  itemDataTitle: string;
  url?: string;
}

export const HealthCareItem = ({
  healthCareInfo,
  onClick,
  itemDataTitle,
  itemData,
  url,
}: HealthCareItemProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getHealthIcon() {
    if (healthCareInfo.icon == 'TelaDoc') {
      return teladocIcon;
    } else if (healthCareInfo.icon == 'AbleToIcon') {
      return ableToIcon;
    } else if (healthCareInfo.icon == 'Sanitas') {
      return sanitasIcon;
    } else if (healthCareInfo.icon == 'Alight') {
      return alightIcon;
    } else if (healthCareInfo.icon == 'CareTN') {
      return careTNIcon;
    } else if (healthCareInfo.icon == 'SilverFit') {
      return silverFitIcon;
    } else if (healthCareInfo.icon == 'QuestSelect') {
      return questSelectIcon;
    } else if (healthCareInfo.icon == 'HingeHealth') {
      return hingeHealthIcon;
    } else if (healthCareInfo.icon == 'HealthyMaternity') {
      return healthyMaternityIcon;
    } else if (healthCareInfo.icon == 'BlueTennesseIcon') {
      return blueTennesseIcon;
    }
  }

  function getDesktopView() {
    return (
      <Row className={'flex flex-col align-top m-4 mt-8'}>
        <TextBox
          className="body-2 px-3 py-1 w-fit border border-current rounded-full mb-4 ml-3"
          text={healthCareInfo.healthcareType}
        ></TextBox>
        {healthCareInfo.icon && (
          <Image
            src={getHealthIcon()}
            className="w-1/2"
            alt={healthCareInfo.icon}
          />
        )}
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
          <AppLink
            className="text-left"
            label={healthCareInfo.link}
            url={healthCareInfo.url}
          />
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
          {healthCareInfo.icon && (
            <Image
              src={getHealthIcon()}
              className="w-1/2"
              alt={healthCareInfo.icon}
            />
          )}
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
            <AppLink
              className="text-left"
              label={healthCareInfo.link}
              url={url}
            />
          </Column>
        </Row>
      </Column>
    );
  }

  return isClient ? (
    <Card
      className={'cursor-pointer ${className} md:w-80'}
      type="elevated"
      onClick={onClick}
    >
      {isMobile ? getMobileView() : getDesktopView()}
    </Card>
  ) : null;
};
