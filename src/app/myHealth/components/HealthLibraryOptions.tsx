import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MyHealthWellnessHealthLibInfo } from '../models/app/myheath_wellness_healthlib_options';
import { MyHealthCard } from './MyHealthCard';

interface MyHealthOptionsProps extends IComponent {
  options: MyHealthWellnessHealthLibInfo[];
  visibilityRule?: VisibilityRules;
}

export const HealthLibraryOptions = ({
  className,
  options,
  visibilityRule,
}: MyHealthOptionsProps) => {
  const [healthLibData, setHealthLibData] = useState(
    [] as Array<Array<MyHealthWellnessHealthLibInfo>>,
  );

  /* Offset decides the no. cards on each row and noOfCards is the total no. of cards.
  Here there will be two rows of 3 cards.
  Pushing each row card data into healthLibInfo as Array and iterating the healthLibInfo to get the card data.*/

  useEffect(() => {
    const healthLibInfo = [];
    const offset: number = 3;
    const noOfCards: number = 6;
    for (let i = 0; i < noOfCards; i += offset) {
      const s = i + offset > noOfCards ? noOfCards : i + offset;
      healthLibInfo.push(options.slice(i, s));
    }
    setHealthLibData(healthLibInfo);
  }, [options]);

  function getLinkForOthers() {
    return (
      <AppLink
        label="Visit The Health Library"
        className="link hover:!underline caremark !flex pt-0 pl-0"
        url={process.env.NEXT_PUBLIC_HEALTH_LIBRARY_URL ?? ''}
        icon={<Image src={externalIcon} alt="" />}
      />
    );
  }

  function getLinkForMyHealthBlueCare() {
    return (
      <AppLink
        label="Visit The Health Library"
        className="link hover:!underline caremark !flex pt-0 pl-0"
        url={process.env.NEXT_PUBLIC_BLUECARE_HEALTH_LIBRARY_URL ?? ''}
        target={'_blank'}
        icon={<Image src={externalIcon} alt="" />}
      />
    );
  }

  return (
    <Card className={className}>
      <Column>
        <Header type="title-2" text="Health Library" />
        <Spacer size={16} />
        <TextBox text="From checking symptoms to answering your health questions, we have a collection of useful tools and resources to help you manage your health." />
        <Spacer size={32} />
        {healthLibData.map((options, index) => {
          return (
            <section className="my-health-image-card" key={index}>
              {options?.map((item, index) => {
                return (
                  <MyHealthCard
                    className="my-health-card-health-library"
                    key={index}
                    label={item.title}
                    icon={item.icon}
                    body={item.description}
                    link={item.url}
                    openInNewWindow={true}
                    visibilityRule={visibilityRule}
                  />
                );
              })}
            </section>
          );
        })}

        <Spacer size={8} />

        <section className="flex justify-start self-start my-health-link">
          <RichText
            spans={[
              <Row
                className="body-1 flex-grow md:!flex !block align-top mt-4 ml-2"
                key={1}
              >
                {isBlueCareEligible(visibilityRule)
                  ? getLinkForMyHealthBlueCare()
                  : getLinkForOthers()}
              </Row>,
            ]}
          />
        </section>
      </Column>
    </Card>
  );
};
