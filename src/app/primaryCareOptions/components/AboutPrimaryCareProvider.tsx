import { IComponent } from '@/components/IComponent';
import { Accordion } from '@/components/foundation/Accordion';
import { Card } from '@/components/foundation/Card';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { ListOrder } from '@/components/foundation/ListOrder';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Down from '../../../../public/assets/down.svg';
import Up from '../../../../public/assets/up.svg';

export const AboutPrimaryCareProvider = ({ className }: IComponent) => {
  return (
    <Card className={className}>
      <div className="flex flex-col">
        <Header
          className="title-2"
          text="About Primary Care Providers"
        ></Header>
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="A primary care provider (PCP), a doctor or nurse practitioner that offers routine checkups, vaccines and non-emergency medical care."
        ></TextBox>
        <Spacer size={16} />
        <Accordion
          className="px-2 py-4"
          label="Why See a PCP"
          initialOpen={false}
          type="card"
          openIcon={
            <Image className="pl-2 w-6" src={Down} alt="Down Chevron"></Image>
          }
          closeIcon={
            <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
          }
          child={
            <ListOrder
              title="PCP's are typically the first person you talk to if you have a health concern. They know your health history and act as a hub for all your medical care. You might turn to them for:"
              itemData={[
                'Preventive care (stopping illness before it happens)',
                'Treatment of common illnesses',
                'Early detection of illnesses or conditions such as cancer',
                'Management of long-term conditions',
                'A referral to a medical specialist',
              ]}
            ></ListOrder>
          }
        ></Accordion>
        <Divider />
        <Accordion
          className="px-2 py-4"
          label="Types of PCPs"
          initialOpen={false}
          type="card"
          openIcon={
            <Image className="pl-2 w-6" src={Down} alt="Down Chevron"></Image>
          }
          closeIcon={
            <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
          }
          child={
            <ListOrder
              title="The term primary care provider (PCP) refers to any of the following types of medical professionals:"
              itemData={[
                'Family medicine doctor, all ages',
                'Internal medicine doctor, all',
                'Pediatrician, children',
                'Geriatrician, seniors',
                'Nurse practitioner',
                'Physician assistant',
              ]}
            />
          }
        ></Accordion>
      </div>
    </Card>
  );
};
