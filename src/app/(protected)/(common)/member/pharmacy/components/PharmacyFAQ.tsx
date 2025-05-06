import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { IComponent } from '@/components/IComponent';
import { Accordion } from '@/components/foundation/Accordion';
import { Column } from '@/components/foundation/Column';
import { downIcon, upIcon } from '@/components/foundation/Icons';
import { FAQDetails } from '../models/faq_details';
import { PharmacyFAQInformation } from './PharmacyFAQInformation';

interface PharmacyFAQProps extends IComponent {
  serviceTitle: string;
  services: FAQDetails[];
}

export const PharmacyFAQ = ({ serviceTitle, services }: PharmacyFAQProps) => {
  return (
    <Column>
      <TextBox type="title-2" text={serviceTitle} />
      <Spacer size={16} />
      {services.slice(0, services.length).map((item, index) => (
        <Column key={index}>
          <Column className="items-stretch">
            <Accordion
              className="px-2 py-2"
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
                <PharmacyFAQInformation
                  answerline1={item.answerline1}
                  answerline2={item.answerline2}
                />
              }
            ></Accordion>
            {index != services.length - 1 && <Divider />}
          </Column>
        </Column>
      ))}
      <Spacer size={32} />
    </Column>
  );
};
