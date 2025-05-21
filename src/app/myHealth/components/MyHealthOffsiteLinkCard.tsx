import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { extrenalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';

import Image from 'next/image';

interface MyHealthOffsiteLinkCardProps extends IComponent {
  icon: string;
  title: string;
  description: string;
  url: string;
}

export const MyHealthOffsiteLinkCard = ({
  icon,
  title,
  description,
  url,
}: MyHealthOffsiteLinkCardProps) => {
  return (
    <Card className="large-section skip-underscore">
      <Column>
        <Row>
          <Image className="size-10" src={icon} alt="" />
          <section className="flex justify-start self-start my-health-link">
            <RichText
              spans={[
                <Row
                  className="body-1 flex-grow md:!flex !block align-top mt-4 ml-2"
                  key={1}
                >
                  <AppLink
                    label={title}
                    className="link hover:!underline caremark !flex pt-0 pl-0"
                    url={url}
                    icon={<Image src={extrenalIcon} alt="" />}
                  />
                </Row>,
              ]}
            />
          </section>
        </Row>
        <Spacer size={8} />
        <TextBox className="body-1 ml-11" text={description} />
      </Column>
    </Card>
  );
};
