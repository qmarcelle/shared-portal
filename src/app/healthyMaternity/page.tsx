/**
 * healthyMaternity
 * Healthy maternity
 */
export const metadata = {
  title: 'Healthy maternity | Consumer Portal',
  description: 'Healthy maternity'
};

'use client';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import healthSupport from '../../../public/assets/health_support.svg';
import maternity from '../../../public/assets/maternity_breast_pump.svg';
import primaryCare from '../../../public/assets/primary_care.svg';
import healthyMaternityVideo from '../../../public/assets/video_healthy_maternity.jpg';
import AboutEnrollment from './components/AboutEnrollment';
import EnrollmentForm from './components/EnrollmentForm';
import HealthyMaternityMobileApp from './components/HealthyMaternityMobileApp';
import { ProgramBenefits } from './components/ProgramBenefits';
import WellframeSection from './components/WellframeSection';

const HealthyMaternity = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center page">
        <Spacer size={32} />
        <Column className="app-content app-base-font-color">
          <Header className="pl-3" type="title-1" text="Healthy Maternity" />
          <Spacer size={3} />
          <TextBox
            className="pl-3 body-1 m-4 ml-0 mb-0 md:w-2/3"
            text="This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy."
          />
          <Spacer size={3} />
          <TextBox
            className="pl-3 body-1 m-4 ml-0 mb-5 md:w-2/3"
            text="You can enroll in our Healthy Maternity Program as soon as you find out you’re pregnant, at no cost to you."
          />
          <Button
            label="Enroll in Health Maternity"
            className="ml-3 my-health-programs-header-button"
            callback={() => {}}
          />
          <Spacer size={45} />
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow page-section-63_33 items-stretch">
              <ProgramBenefits
                benefits={[
                  {
                    benefitIcon: (
                      <Image src={maternity} alt="Maternity Breast Pump Icon" />
                    ),
                    benefitCopy:
                      'Enroll within the first 20 weeks of your pregnancy to qualify for a free breast pump.',
                    benefitLabel: 'Free Breast Pump',
                  },
                  {
                    benefitIcon: (
                      <Image src={primaryCare} alt="Primary Care Icon" />
                    ),
                    benefitCopy:
                      'Our nurses provide expert advice for high-risk care, lactation counseling, postpartum emotional support and more.',
                    benefitLabel: 'One-on-One Support',
                  },
                  {
                    benefitIcon: (
                      <Image src={healthSupport} alt="Health Support Icon" />
                    ),
                    benefitCopy:
                      // eslint-disable-next-line quotes
                      "We'll work with your doctors to ensure you're getting everything you need during and after your pregnancy.",
                    benefitLabel: 'Part of Your Care Team',
                  },
                ]}
              />
              <Spacer size={32} />
              <HealthyMaternityMobileApp />
            </Column>
          </section>
        </Column>
      </div>

      <WelcomeBanner
        name=""
        className=""
        body={
          <>
            <TextBox
              text="What Members Are Saying"
              type="title-2"
              className="mb-3 mt-5 mx-auto"
            />
            <TextBox
              className="mb-3 mx-auto"
              text="Watch the video to learn more about the Healthy Maternity program."
            />
            <Spacer size={12} />
            <Image
              src={healthyMaternityVideo}
              alt="Healthy Maternity Video Icon"
              className="mx-auto pb-7"
            />
          </>
        }
      />
      <div className="flex flex-col justify-center items-center page">
        <Column className="app-content app-base-font-color">
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow page-section-36_67 items-stretch">
              <AboutEnrollment />
            </Column>
            <Column className="page-section-63_33  items-stretch">
              <EnrollmentForm accessCode="BlueAccess" />
            </Column>
          </section>
          <Spacer size={21} />
          <Divider />
          <section>
            <WellframeSection />
          </section>
        </Column>
      </div>
    </>
  );
};

export default HealthyMaternity;
