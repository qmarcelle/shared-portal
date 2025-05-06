import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

const CareTNProgramBenefits = () => {
  return (
    <section className="md:ml-10 p-5">
      <TextBox text="Program Benefits" type="title-2" />
      <Spacer size={16} />
      <section className="md:flex mf:flex-row">
        <Column className="md:w-[575px]">
          <Image src="/assets/calendar_confirm.svg" alt="" />
          <Spacer size={16} />
          <TextBox text="Make Wellness a Habit" className="font-bold text-lg" />
          <Spacer size={8} />
          <TextBox text="Create reminders about health-related activities so you never miss a beat. Use a daily checklist to make healthy choices part of your routine." />
          <Spacer size={16} />
        </Column>
        <Spacer size={32} axis="horizontal" />
        <Column className="md:w-[575px]">
          <Image src="/assets/primary_care_management.svg" alt="" />
          <Spacer size={16} />
          <TextBox text="One-on-One Support" className="font-bold text-lg" />
          <Spacer size={8} />
          <TextBox text="Get personalized help, health plan information, answers to your questions or just a little encouragement." />
          <Spacer size={16} />
        </Column>
        <Column className="md:w-[575px]">
          <Image src="/assets/desktop_video.svg" alt="" />
          <Spacer size={16} />
          <TextBox
            text="Get Personalized Content"
            className="font-bold text-lg"
          />
          <Spacer size={8} />
          <TextBox text="Watch videos our nurses recommend just for you." />
        </Column>
      </section>
    </section>
  );
};

export default CareTNProgramBenefits;
