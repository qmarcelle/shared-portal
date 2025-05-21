import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';

import Image from 'next/image';

interface ShopOverCounterItemsCardProps extends IComponent {
  icon: string;
  title: string;
  description: string;
  url: string;
}

export const ShopOverCounterItemsCard = ({
  icon,
  title,
  description,
  url,
}: ShopOverCounterItemsCardProps) => {
  return (
    <Card className="large-section skip-underscore">
      <Column>
        <Image className="size-10 block md:hidden" src={icon} alt="" />

        <Row>
          <Image
            className="size-10 mt-3 mr-2 hidden md:block"
            src={icon}
            alt=""
          />
          <section className="flex justify-start self-start my-health-link">
            <RichText
              spans={[
                <Row
                  className="body-1 flex-grow md:!flex !block align-top mt-4"
                  key={1}
                >
                  <a className="!flex pt-0 pl-0 ml-2" href={url}>
                    {' '}
                    <p className="font-bold primary-color">{title}</p>
                    <Image
                      src={extrenalIcon}
                      className="link flex ml-2"
                      alt=""
                    />
                  </a>
                </Row>,
              ]}
            />
          </section>
        </Row>
        <TextBox className="body-1 md:ml-14 ml-2" text={description} />
      </Column>
    </Card>
  );
};
