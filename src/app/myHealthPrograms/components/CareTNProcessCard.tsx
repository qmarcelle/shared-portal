import { AccessCode } from '@/components/composite/AccessCode';
import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { externalOffsiteWhiteIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import qrCodeFPO from '../../../../public/assets/fpo_qr_code.jpg';
import numberStepOne from '../../../../public/assets/number_step_one.svg';
import numberStepThree from '../../../../public/assets/number_step_three.svg';
import numberStepTwo from '../../../../public/assets/number_step_two.svg';
import wellframeLogo from '../../../../public/assets/wellframe.svg';

export type CareTNProcessCardProps = {
  accessCodeData: string;
};

const CareTNProcessCard = ({ accessCodeData }: CareTNProcessCardProps) => {
  return (
    <section>
      <Column className="md:ml-10 p-5">
        <Header text="Get Started with CareTN in 3 Easy Steps" type="title-2" />
        <Spacer size={32} />
        <section className="md:flex md:flex-row">
          <Column>
            <Image src={numberStepOne} alt="numberStepOne" />
            <Spacer size={16} />
          </Column>
          <Spacer size={32} axis="horizontal" />
          <Column>
            <TextBox text="Download the App" className="font-bold text-lg" />
            <Spacer size={8} />
            <TextBox text="Scan the QR Code with your smartphone’s camera." />
            <Column className="w-[94px]">
              <Spacer size={8} />
              <Button
                icon={
                  <Image alt="external icon" src={externalOffsiteWhiteIcon} />
                }
                className="w-[270px] block md:max-2xl:hidden"
                label="Download CareTN"
                callback={() => {}}
              />
              <Image
                src={qrCodeFPO}
                alt="QRCode"
                className="hidden md:max-2xl:block"
              />
            </Column>
          </Column>
        </section>
        <Spacer size={32} />
        <Divider />
        <Spacer size={32} />
        <section className="md:flex md:flex-row">
          <Column>
            <Image src={numberStepTwo} alt="numberStepTwo" />
            <Spacer size={16} />
          </Column>
          <Spacer size={32} axis="horizontal" />
          <Column>
            <TextBox text="Enter Access Code" className="font-bold text-lg" />
            <Spacer size={8} />
            <TextBox text="Open the app on your device, tap “Sign-up” and enter your access code." />
            <Spacer size={8} />
            <AccessCode accessCodeData={accessCodeData} />
          </Column>
        </section>
        <Spacer size={32} />
        <Divider />
        <Spacer size={32} />
        <section className="md:flex md:flex-row">
          <Column>
            <Image src={numberStepThree} alt="numberStepthree" />
            <Spacer size={16} />
          </Column>
          <Spacer size={32} axis="horizontal" />
          <Column>
            <TextBox text="Register In The App" className="font-bold text-lg" />
            <Spacer size={8} />
            <TextBox text="Follow the directions to register in the CareTN app." />
          </Column>
        </section>
        <Spacer size={32} />
      </Column>
      <Divider />
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
      <Spacer size={32} />
    </section>
  );
};

export default CareTNProcessCard;
