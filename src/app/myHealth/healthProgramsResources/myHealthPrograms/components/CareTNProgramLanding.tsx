import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import appleStoreLogo from '../../../../../../public/assets/apple_store.svg';
import careTNDevice from '../../../../../../public/assets/caretn_device.png';
import playStoreLogo from '../../../../../../public/assets/google_play.svg';
import wellframeLogo from '../../../../../../public/assets/wellframe.svg';
import { CareTNHeaderCard } from './CareTNHeaderCard';
import CareTNProcessCard from './CareTNProcessCard';
import CareTNProgramBenefits from './CareTNProgramBenefits';

export type CareTNProgramLandingProps = {
  accessCodeData: string;
};
const CareTNProgramLanding = ({
  accessCodeData,
}: CareTNProgramLandingProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  function callCareTNSteps() {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
  return (
    <Column className="app-content app-base-font-color md:pr-0 md:pl-0 pl-7 pr-7">
      <Spacer size={64} />
      <CareTNHeaderCard callBackCareTNSteps={() => callCareTNSteps()} />
      <Spacer size={32} />
      <CareTNProgramBenefits />
      <Card className="large-section">
        <section className="md:flex md:flex-row">
          <Image src={careTNDevice} alt="careTN" />
          <Spacer size={16} />
          <Column>
            <Header text="We're Here to Help" type="title-2" />
            <Spacer size={16} />
            <TextBox text="Message your care team anytime it's convenient for you. Got a question at 3 a.m.? Let us know — don't let it slip your mind. If you contact us after hours, we'll get back to you the next business day." />
            <Spacer size={32} />
            <section className="justify-start md:flex md:flex-row">
              <Link href="https://apps.apple.com/us/app/caretn/id1494382785">
                <Image
                  src={appleStoreLogo}
                  alt="Download CareTN from AppStore"
                />
              </Link>
              <Link
                className="pl-[10px]"
                href="https://play.google.com/store/apps/details?id=com.bcbst.wellframe.app"
              >
                <Image
                  src={playStoreLogo}
                  alt="Download CareTN from PlayStore"
                />
              </Link>
            </section>
          </Column>
        </section>
      </Card>
      <Spacer size={32} />
      <div ref={cardRef}>
        <CareTNProcessCard accessCodeData={accessCodeData} />
      </div>
      <Spacer size={16} />
      <section className="md:flex md:flex-row ml-7">
        <Image src={wellframeLogo} alt="wellframe" />
        <Spacer size={16} />
        <Column className="md:p-10">
          <TextBox
            text="Wellframe is an independent company that provides services for BlueCross BlueShield of Tennessee."
            type="body-2"
          />
          <TextBox text="Participation is optional." type="body-2" />
        </Column>
      </section>
      <Spacer size={8} />
    </Column>
  );
};

export default CareTNProgramLanding;
