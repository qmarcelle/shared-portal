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
import Image from 'next/image';
import { MyHealthWellnessHealthLibInfo } from '../models/app/myheath_wellness_healthlib_options';
import { MyHealthCard } from './MyHealthCard';

interface MemberWellnessOptionsProps extends IComponent {
  options: MyHealthWellnessHealthLibInfo[];
}

export const MemberWellnessCenterOptions = ({
  className,
  options,
}: MemberWellnessOptionsProps) => {
  return (
    <Column className="mt-16 lg:mt-0">
      <Card className={className}>
        <Column>
          <Header type="title-2" text="Member Wellness Center" />
          <Spacer size={16} />
          <TextBox text="Take a free personal health assessment, track your diet and exercise, sync your fitness apps to earn wellness points and more—all in one secure place." />
          <Spacer size={32} />
          <section className="my-health-image-card">
            {options.map((item) => {
              return (
                <MyHealthCard
                  className="my-health-card-member-wellness"
                  key={item.id}
                  label={item.title}
                  icon={item.icon}
                  body={item.description}
                  link={item.url}
                />
              );
            })}
          </section>

          <Spacer size={8} />

          <section className="flex justify-start self-start my-health-link">
            <RichText
              spans={[
                <Row
                  className="body-1 flex-grow md:!flex !block align-top mt-4 ml-2"
                  key={1}
                >
                  <AppLink
                    label="Visit Member Wellness Center"
                    className="link hover:!underline caremark !flex pt-0 pl-0"
                    url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`}
                    icon={<Image src={externalIcon} alt="" />}
                  />
                </Row>,
              ]}
            />
          </section>
        </Column>
      </Card>
    </Column>
  );
};
