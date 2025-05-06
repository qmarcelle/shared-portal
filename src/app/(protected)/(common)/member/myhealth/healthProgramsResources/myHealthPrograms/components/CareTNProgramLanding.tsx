import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Link from 'next/link';
import { CareTNHeaderCard } from './CareTNHeaderCard';
import CareTNProcessCard from './CareTNProcessCard';
import CareTNProgramBenefits from './CareTNProgramBenefits';

export type CareTNProgramLandingProps = {
  accessCodeData: string;
};
const CareTNProgramLanding = ({
  accessCodeData,
}: CareTNProgramLandingProps) => {
  return (
    <Column className="app-content app-base-font-color md:pr-0 md:pl-0 pl-7 pr-7">
      <Spacer size={64} />
      <CareTNHeaderCard />
      <Spacer size={32} />
      <CareTNProgramBenefits />
      <Card className="large-section">
        <section className="md:flex md:flex-row">
          <Image src="/assets/caretn_device.png" alt="careTN" />
          <Spacer size={16} />
          <Column>
            <Header text="We're Here to Help" type="title-2" />
            <Spacer size={16} />
            <TextBox text="Message your care team anytime it's convenient for you. Got a question at 3 a.m.? Let us know — don't let it slip your mind. If you contact us after hours, we'll get back to you the next business day." />
            <Spacer size={32} />
            <section className="justify-start md:flex md:flex-row">
              <Link href="https://apps.apple.com/us/app/amplifyhealth/id6444489335">
                <Image
                  src="/assets/apple_store.svg"
                  alt="Download Amplify App from AppStore"
                />
              </Link>
              <Link
                className="pl-[10px]"
                href="https://play.google.com/store/apps/details?id=com.bcbst.amplify&hl=en_US"
              >
                <Image
                  src="/assets/google_play.svg"
                  alt="Download Amplify App from PlayStore"
                />
              </Link>
            </section>
          </Column>
        </section>
      </Card>
      <Spacer size={32} />
      <CareTNProcessCard accessCodeData={accessCodeData} />
    </Column>
  );
};

export default CareTNProgramLanding;
