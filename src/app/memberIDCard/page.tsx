'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { MemberIDCardInfo } from './components/MemberIDCardInfo';
import { PlanInfo } from './components/PlanInfo';

const GlobalIDCard = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Header className="pl-3" type="title-1" text="ID Card" />
        <section className="md:flex md:flex-row items-start ">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MemberIDCardInfo />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <PlanInfo />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default GlobalIDCard;
