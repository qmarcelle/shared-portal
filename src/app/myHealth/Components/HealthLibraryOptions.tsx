import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { MyHealthWellnessHealthLibInfo } from '../models/myheath_wellness_healthlib_options';
import { externalIcon } from '@/components/foundation/Icons';
import Image from 'next/image';
import { Row } from '@/components/foundation/Row';
import { MyHealthCard } from './MyHealthCard';
import { RichText } from '@/components/foundation/RichText';
import { useEffect, useState } from 'react';

interface MyHealthOptionsProps extends IComponent {
  options: MyHealthWellnessHealthLibInfo[];
}

export const HealthLibraryOptions = ({
  className,
  options,
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
                <AppLink
                  label="Visit The Health Library"
                  className="link hover:!underline caremark !flex pt-0 pl-0"
                  url="https://www.healthwise.net/bcbst/Content/CustDocument.aspx?XML=STUB.XML&XSL=CD.FRONTPAGE.XSL&sv=831a539d-ef9f-8c40-5170-bd8216690f89"
                  icon={<Image src={externalIcon} alt="external" />}
                />
              </Row>,
            ]}
          />
        </section>
      </Column>
    </Card>
  );
};
