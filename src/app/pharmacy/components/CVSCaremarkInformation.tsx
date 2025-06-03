import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { ReactNode } from 'react';
import { CVSCareMarkDetails } from '../models/caremark_details';
import { CVSCaremarkCard } from './CVSCareMarkCards';

interface CVSCaremarkInformationCardProps extends IComponent {
  icon?: ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkIcon: ReactNode;
  services: CVSCareMarkDetails[];
  linkCallBack?: () => void;
}

export const CVSCaremarkInformationCard = ({
  title,
  description,
  icon,
  linkIcon,
  linkText,
  services,
}: CVSCaremarkInformationCardProps) => {
  return (
    <Column>
      <Spacer size={32} />
      <Card className="p-4 md:p-10">
        <Column>
          <Column className="block md:hidden">{icon}</Column>

          <Row className="justify-between mt-2 md:mt-16 lg:mt-0">
            <Column>
              <Spacer size={8} />
              <Header type="title-2" text={title} />
              <Spacer size={8} />
              <TextBox className="body-1" text={description} />
            </Column>
            <Column className="hidden md:block">{icon}</Column>
          </Row>
          <Spacer size={32} />
          <Row>
            <div className="flex flex-wrap gap-4">
              {services.map((item, index) => (
                <CVSCaremarkCard
                  key={index}
                  className=" flex-1 basis-1/2 md:basis-2/6 p-2 overflow-hidden"
                  serviceIcon={item.serviceIcon}
                  serviceLabel={item.serviceLabel}
                  url={item.url}
                />
              ))}
            </div>
          </Row>
          <Spacer size={32} />

          <AppLink
            className="!flex p-0"
            label={linkText}
            icon={linkIcon}
            callback={() => null}
            url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`}
          />
        </Column>
      </Card>
    </Column>
  );
};
