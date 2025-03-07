'use client';

import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { FormRequestCard } from './components/FormRequestCard';

const RequestForm = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <div className="flex flex-col app-content">
        <Spacer size={32} />
        <section className="flex justify-start self-start">
          <Header type="title-1" text="1095-B Form Request" />
        </section>
        <section className="flex flex-col flex-grow page-section-63_33 items-stretch ">
          <FormRequestCard />
        </section>
      </div>
    </div>
  );
};

export default RequestForm;
