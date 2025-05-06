import { IComponent } from '@/components/IComponent';
import { Accordion } from '@/components/foundation/Accordion';
import { Card } from '@/components/foundation/Card';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Down from 'down.svg';
import Up from 'up.svg';

export const ChooseMentalHealthProvider = ({ className }: IComponent) => {
  return (
    <Card className={className}>
      <div className="flex flex-col">
        <Header
          className="title-2"
          text="Choosing a Mental Health Provider"
        ></Header>
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="You can speak with a therapist or a psychiatrist (a medical doctor that can prescribe medicine). Or try a self-guided program with personalized recommendations."
        ></TextBox>
        <Spacer size={16} />
        <Accordion
          className="px-2 py-4"
          label="About Psychiatrists"
          initialOpen={false}
          type="card"
          openIcon={
            <Image className="pl-2 w-6" src={Down} alt="Down Chevron"></Image>
          }
          closeIcon={
            <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
          }
          child={
            <TextBox text="If you are looking for medication evaluation or help with ongoing medication management, schedule a visit with a psychiatrist (MD/DO). Psychiatrists are medical doctors who may or may not provide talk therapy."></TextBox>
          }
        ></Accordion>
        <Divider />
        <Accordion
          className="px-2 py-4"
          label="About Therapists"
          initialOpen={false}
          type="card"
          openIcon={
            <Image className="pl-2 w-6" src={Down} alt="Down Chevron"></Image>
          }
          closeIcon={
            <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
          }
          child={
            <TextBox
              text={
                'If you are looking for talk therapy and counseling, talk to a therapist. There are different types, such as psychologists and licensed social workers, marriage and family therapists and counselors. The difference is in their level of training and the problems they specialize in handling.'
              }
            ></TextBox>
          }
        ></Accordion>
      </div>
    </Card>
  );
};
