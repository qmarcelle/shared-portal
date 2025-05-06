'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { MemberIDCardInfo } from './components/MemberIDCardInfo';
import { PlanInfo } from './components/PlanInfo';
import { IdCardData } from './model/app/idCardData';

export type GlobalIDCardProps = {
  data: IdCardData;
};
const GlobalIDCard = ({ data }: GlobalIDCardProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Header type="title-1" text="ID Card" />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MemberIDCardInfo
              svgFrontData={data.idCardSvgFrontData}
              svgBackData={data.idCardSvgBackData}
              memberDetails={data.memberDetails}
            />
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
