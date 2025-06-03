import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { ListOrder } from '@/components/foundation/ListOrder';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Link from 'next/link';
import careTNDevice from '../../../../public/assets/caretn_device.png';

const HealthyMaternityMobileApp = () => {
  return (
    <>
      <Card className="large-section overlap-bottom">
        <section className="md:flex md:flex-row">
          <Image src={careTNDevice} alt="" />
          <Spacer size={16} />
          <Column>
            <Header
              text="Healthy Maternity & CareTN Mobile App"
              type="title-2"
            />
            <Spacer size={16} />
            <TextBox text="Once you've enrolled, download the CareTN app. You can use the app to message a maternity nurse and access program resources." />
            <ListOrder
              title="In the app you can:"
              itemData={[
                'Learn about eating healthy for you and your baby',
                'Track doctor visits and set reminders',
                'Get information on immunizations and when to schedule them',
                'Connect with maternity nurse',
              ]}
            />
            <Spacer size={32} />
            <section className="justify-start flex flex-row">
              <Link href="https://apps.apple.com/us/app/amplifyhealth/id6444489335">
                <Image src={appleStoreLogo} alt="" />
              </Link>
              <Link
                className="pl-[10px]"
                href="https://play.google.com/store/apps/details?id=com.bcbst.amplify&hl=en_US"
              >
                <Image src={playStoreLogo} alt="" />
              </Link>
            </section>
          </Column>
        </section>
      </Card>
    </>
  );
};

export default HealthyMaternityMobileApp;
