'use client';

import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { envelopeIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
const PlanDocuments = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <section className="ml-4">
          <Title
            className="title-1"
            aria-label="Plan Documents"
            text="Plan Documents"
          />
          <Spacer size={16} />
          <TextBox
            className="max-w-[650px]"
            text="We’ve put together quick-reference guides that explain your plan
            details and help you get the most from your benefits."
          />
        </section>
        <Spacer size={16} />
        <InfoCard
          icon={envelopeIcon}
          label={'Request Printed Material'}
          body={'Ask us to mail your plan documents to you.'}
          link={''}
        />
        <Spacer size={32} />
      </Column>
    </main>
  );
};

export default PlanDocuments;
