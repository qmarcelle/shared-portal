import { Accordion } from '@/components/foundation/Accordion';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { downIcon, upIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import { FAQDetails } from '../models/faq_details';
import { FaqCardInformation } from './FaqCardInformation';

interface FaqCardProps extends IComponent {
  services: FAQDetails[] | undefined;
  topicType?: string;
}

export const FaqCard = ({ services }: FaqCardProps) => {
  return (
    services && (
      <Card className="large-section flex flex-row items-start app-body ">
        <Column className="w-[100%]">
          {' '}
          {services.slice(0, services.length).map((item, index) => (
            <Column key={index}>
              <TextBox type="title-2" text={item.serviceTitle} />
              {index == 0 && <Spacer size={16} />}
              <Column className="items-stretch ">
                <Accordion
                  className="px-2 py-2 "
                  label={item.serviceLabel}
                  initialOpen={false}
                  type="card"
                  openIcon={
                    <Image
                      className="pl-2 w-6"
                      src={downIcon}
                      alt="Down Chevron"
                    ></Image>
                  }
                  closeIcon={
                    <Image
                      className="pl-2 w-6"
                      src={upIcon}
                      alt="Up Chevron"
                    ></Image>
                  }
                  child={
                    <FaqCardInformation
                      para1={item.para1}
                      bulletPoints={item.bulletPoints}
                      para2={item.para2}
                    />
                  }
                ></Accordion>
                {index != services.length - 1 && <Divider />}
              </Column>
            </Column>
          ))}
        </Column>
      </Card>
    )
  );
};
