'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  biometricScreeningIcon,
  dentalHealthLibraryIcon,
  healthAssessmentIcon,
  interactiveProgramsIcon,
  wellnessPointsIcon,
  wellTunedBlogIcon,
} from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import healthSupportIcon from '@/public/assets/health_support.svg';
import healthSurveyIcon from '@/public/assets/health_survey.svg';
import { PrimaryCareProvider } from '../findcare/primaryCareOptions/components/PrimaryCareProvider';
import { HealthLibraryOptions } from './components/HealthLibraryOptions';
import { MemberWellnessCenterOptions } from './components/MemberWellnessCenterOptions';
import { MyHealthOffsiteLinkCard } from './components/MyHealthOffsiteLinkCard';
import { MyHealthData } from './models/app/my_health_data';

export type MyHealthProps = {
  data: MyHealthData;
};
const MyHealth = ({ data }: MyHealthProps) => {
  const MemberWellnessCenterDetails = [
    {
      id: '1',
      title: 'Your Health Assessment',
      description:
        'Your personal health assessment is the starting point for your wellness program, and the key to helping us provide a more personalized experience for you.',
      url: '#path-1',
      icon: healthAssessmentIcon,
    },
    {
      id: '2',
      title: 'Earn Wellness Points',
      description:
        'Choose from a variety of activities, including tracking your steps, completing the wellness class form, or running a 5K.',
      url: '#path-1',
      icon: wellnessPointsIcon,
    },
    {
      id: '3',
      title: 'Interactive Programs',
      description:
        'Set a goal and create healthy habits to achieve your goal. Programs include staying tobacco free, maintaining a healthy weight, and more!',
      url: '#path-1',
      icon: interactiveProgramsIcon,
    },
  ];
  const HealthLibraryDetails = [
    {
      id: '1',
      title: 'Learning Center',
      description:
        'Get more information about specific health terms, topics and conditions to better manage your health.',
      url: '#path-1',
      icon: null,
    },
    {
      id: '2',
      title: 'Interactive Tools',
      description:
        'Our personal calculators and short quizzes make it easier for you to learn more about your health from knowing your BMI to managing stress.',
      url: '#path-1',
      icon: null,
    },
    {
      id: '3',
      title: 'Health Videos',
      description:
        'Find out about health-related topics with our extensive selection of videos featuring general wellness, specific conditions and more.',
      url: '#path-1',
      icon: null,
    },
    {
      id: '4',
      title: 'Symptom Checker',
      description:
        'Get more reliable information about the symptom you’re experiencing to help find the care you need.',
      url: '#path-1',
      icon: null,
    },
    {
      id: '5',
      title: 'Manage Your Diabetes',
      description:
        'Get the information you need and stay up-to-date on tests using our resources to help manage your diabetes.',
      url: '#path-1',
      icon: null,
    },
    {
      id: '6',
      title: 'Decision Support',
      description:
        'We’ll help you get the facts, ask the right questions and weigh your options before making any health decision, big or small.',
      url: '#path-1',
      icon: null,
    },
  ];
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <PrimaryCareProvider
              className="large-section"
              providerDetails={data.primaryCareProvider}
              label="Primary Care Provider"
              linkLabel="View or Update Primary Care Provider"
              title="My Primary Care Provider"
            />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <Column>
              <MyHealthOffsiteLinkCard
                icon={healthSurveyIcon}
                title="Fill-out The Health History & Needs Survey"
                description="Help us get a clear picture of your health needs. We need this info once a year from all our members. Please take a few minutes to complete this survey."
                url={
                  process.env.NEXT_PUBLIC_FILL_OUT_THE_HEALTH_HISTORY_URL ?? ''
                }
              />
              <MyHealthOffsiteLinkCard
                icon={healthSupportIcon}
                title="Get One-on-One Health Support"
                description="We offer a health program that’s designed just for you. Whether you need support for healthy living or help with a long- or short-term illness or injury, you can rely on us."
                url={
                  process.env.NEXT_PUBLIC_ONE_ON_ONE_HEALTH_SUPPORT_URL ?? ''
                }
              />
            </Column>
          </Column>
        </section>
        <Spacer size={64} />
        <Header text="Other Programs & Resources" type="title-1" />
        <Spacer size={32} />
        <section>
          <MyHealthOffsiteLinkCard
            icon={wellTunedBlogIcon}
            title="WellTuned Blog"
            description="Visit our WellTuned blog to stay up-to-date on health and wellness news, health care developments and tips for managing your health."
            url={process.env.NEXT_PUBLIC_WELLTUNED_BLOCK_URL ?? ''}
          />
        </section>
        <section>
          <HealthLibraryOptions
            className="large-section"
            options={HealthLibraryDetails}
          />
        </section>
        <section>
          <MyHealthOffsiteLinkCard
            icon={biometricScreeningIcon}
            title="Schedule a Biometric Screening"
            description="We'll help you schedule this important health screening and walk you through the steps to prepare for your doctor visit."
            url=""
          />
        </section>
        <section>
          <MemberWellnessCenterOptions
            className="large-section"
            options={MemberWellnessCenterDetails}
          />
        </section>

        <section>
          <MyHealthOffsiteLinkCard
            icon={dentalHealthLibraryIcon}
            title="Dental Health Library"
            description="Check dental symptoms and get your dental questions answered."
            url=""
          />
        </section>
      </Column>
    </main>
  );
};

export default MyHealth;
