import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Link from 'next/link';

export const AmplifyHealthAppInformation = () => {
  return (
    <section className="px-[10px]">
      <section className="md:flex md:flex-row">
        <Spacer axis="horizontal" size={32} />
        <Column>
          <Image
            className="min-h-[280px] self-center md:self-end object-cover sm:self-auto basis-1/2 min-w-0"
            src="/assets/amplify_health_app_get_care.png"
            alt="Amplify Health Get Care"
            fill
            style={{ width: 'auto', height: 'auto' }}
          />
        </Column>
        <Spacer axis="horizontal" size={32} />
        <Column className="max-w-[100%] px-8 pt-5 md:px-0 md:pl-0 md:max-w-[65%]">
          <Header className="title-2" text="Bring Your Advisors With You" />
          <Spacer size={16}></Spacer>
          <TextBox text="Use the AmplifyHealth app to connect with your health advisors and access your benefits. Getting started is easy. You'll use the same login information you use to access your account at bcbst.com." />
          <Spacer size={32}></Spacer>
          <Row className="justify-start">
            <Link href="https://apps.apple.com/us/app/amplifyhealth/id6444489335">
              <img
                src="/assets/apple_store.svg"
                alt="Download on the Apple App Store"
                width={120}
                height={40}
              />
            </Link>
            <Link
              className="pl-[10px]"
              href="https://play.google.com/store/apps/details?id=com.bcbst.amplify&hl=en_US"
            >
              <img
                src="/assets/google_play.svg"
                alt="Get it on Google Play"
                width={120}
                height={40}
              />
            </Link>
          </Row>
        </Column>
      </section>
    </section>
  );
};
