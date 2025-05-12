'use client';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  biometricScreeningIcon,
  fitLogo,
  fitnessLogo,
  healthAssessmentIcon,
  interactiveProgramsIcon,
  nutritionLogo,
  personalCareLogo,
  primaryVisionLogo,
  transportationLogo,
  wellnessPointsIcon,
  wellTunedBlogIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import healthSupportIcon from '@/public/assets/health_support.svg';
import healthSurveyIcon from '@/public/assets/health_survey.svg';
import {
  isBiometricScreening,
  isBlue365FitnessYourWayEligible,
  isBlueCareEligible,
  isChipRewardsEligible,
  isHealthProgamAndResourceEligible,
  isHealthyMaternity,
  isMemberWellnessCenterEligible,
  isPrimaryCarePhysicianEligible,
  isQuestSelectEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { PrimaryCareProvider } from '../findcare/primaryCareOptions/components/PrimaryCareProvider';
import {
  BLUE_365_DEEPLINK_MAP,
  BLUE_365_FITNESS,
  BLUE_365_FOOTWEAR,
  BLUE_365_HEARING_VISION,
  BLUE_365_NUTRITION,
  BLUE_365_PERSONAL_CARE,
  BLUE_365_TRAVEL,
} from '../sso/ssoConstants';
import { OtherBenefits } from '../virtualCareOptions/components/OtherBenefits';
import { HealthLibraryOptions } from './components/HealthLibraryOptions';
import { MemberDiscounts } from './components/MemberDiscounts';
import { MemberWellnessCenterOptions } from './components/MemberWellnessCenterOptions';
import { MyHealthOffsiteLinkCard } from './components/MyHealthOffsiteLinkCard';
import { WellnessRewards } from './components/WellnessRewards';
import { HealthProgramType } from './healthProgramsResources/myHealthPrograms/models/health_program_type';
import { MyHealthData } from './models/app/my_health_data';
const urlRedirect = '/member/myhealth/healthprograms/';

const memberWellnessCenterDetails = [
  {
    id: '1',
    title: 'Your Health Assessment',
    description:
      'Your personal health assessment is the starting point for your wellness program, and the key to helping us provide a more personalized experience for you.',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`,
    icon: healthAssessmentIcon,
  },
  {
    id: '2',
    title: 'Earn Wellness Points',
    description:
      'Choose from a variety of activities, including tracking your steps, completing the wellness class form, or running a 5K.',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`,
    icon: wellnessPointsIcon,
  },
  {
    id: '3',
    title: 'Interactive Programs',
    description:
      'Set a goal and create healthy habits to achieve your goal. Programs include staying tobacco free, maintaining a healthy weight, and more!',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`,
    icon: interactiveProgramsIcon,
  },
];

const healthLibraryDetails = [
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

const discountCardDetails = [
  {
    id: '1',
    icon: <Image src={fitnessLogo} alt="Footwear Icon" className="inline" />,
    cardLink: 'Apparel & Footwear',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_FOOTWEAR)!))}`,
  },
  {
    id: '2',
    icon: <Image src={fitLogo} alt="Fitness Icon" className="inline" />,
    cardLink: 'Fitness',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_FITNESS)!))}`,
  },
  {
    id: '3',
    icon: (
      <Image src={primaryVisionLogo} alt="Vision Icon" className="inline" />
    ),
    cardLink: 'Hearing & Vision',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_HEARING_VISION)!))}`,
  },
  {
    id: '4',
    icon: <Image src={nutritionLogo} alt="Nutrition Icon" className="inline" />,
    cardLink: 'Nutrition',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_NUTRITION)!))}`,
  },
  {
    id: '5',
    icon: (
      <Image src={transportationLogo} alt="Travel Icon" className="inline" />
    ),
    cardLink: 'Travel',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_TRAVEL)!))}`,
  },
  {
    id: '6',
    icon: (
      <Image src={personalCareLogo} alt="Personal Icon" className="inline" />
    ),
    cardLink: 'Personal Care',
    url: `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_PERSONAL_CARE)!))}`,
  },
];

export type MyHealthProps = { data: MyHealthData };
const MyHealth = ({ data }: MyHealthProps) => {
  const isBlueCareMember = isBlueCareEligible(data.visibilityRules);
  const isBiometricScreeningVisible = isBiometricScreening(
    data.visibilityRules,
  );
  return (
    <main className="flex flex-col justify-center items-center page">
      <WelcomeBanner
        className="px-4"
        titleText=""
        name="My Health"
        body={
          <>
            <RichText
              spans={[
                <>
                  <span>
                    Programs, guides and discounts to help take charge of your
                    health.
                  </span>
                </>,
              ]}
            />
          </>
        }
      />
      <Column className="app-content app-base-font-color">
        {isChipRewardsEligible(data.visibilityRules) && (
          <section>
            <WellnessRewards
              memberRewards={data.memberRewards}
              className="section"
            />
          </section>
        )}

        {isBiometricScreeningVisible && (
          <section>
            <MyHealthOffsiteLinkCard
              icon={biometricScreeningIcon}
              title="Schedule a Biometric Screening"
              description="We'll help you schedule this important health screening and walk you through the steps to prepare for your doctor visit."
              url={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH}&target=schedule`}
            />
          </section>
        )}

        {!isBlueCareMember && (
          <>
            {isMemberWellnessCenterEligible(data.visibilityRules) && (
              <section>
                <MemberWellnessCenterOptions
                  className="large-section"
                  options={memberWellnessCenterDetails}
                />
              </section>
            )}
          </>
        )}
        {isBlue365FitnessYourWayEligible(data.visibilityRules) && (
          <MemberDiscounts
            linkTitle={'View All Member Discounts'}
            showOffsiteIcon={true}
            title={'Member Discounts'}
            copy={
              'Want access to new healthy living discounts every week? Find savings on nutrition programs, fitness accessories, medical supplies and services like hearing aids and LASIK eye surgey.'
            }
            discountCards={discountCardDetails}
            linkURL={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}`}
          />
        )}
        <Spacer size={64} />
        <Header text="Other Programs & Resources" type="title-1" />
        <Spacer size={32} />
        {isHealthProgamAndResourceEligible(data.visibilityRules) && (
          <>
            <section className="flex-row items-start app-body">
              <OtherBenefits
                className="large-section"
                cardClassName="myHealthCard"
                options={[
                  {
                    id: '1',
                    title: 'CareTN One-on-One Health Support ',
                    description:
                      'The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
                    url: `${urlRedirect}caremanagement`,
                  },
                  {
                    id: '2',
                    title: 'Healthy Maternity',
                    description:
                      'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
                    url: `${urlRedirect + HealthProgramType.HealthyMaternity}`,
                    isHidden: !isHealthyMaternity(data.visibilityRules),
                  },
                  {
                    id: '3',
                    title: 'Teladoc Health Blood Pressure Management Program',
                    description:
                      'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
                    url: `${urlRedirect + HealthProgramType.TeladocBP}`,
                  },
                  {
                    id: '4',
                    title: 'Teladoc Health Diabetes Management Program',
                    description:
                      'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
                    url: `${urlRedirect + HealthProgramType.TeladocHealthDiabetesManagement}`,
                  },
                  {
                    id: '5',
                    title: 'Teladoc Health Diabetes Prevention Program',
                    description:
                      'Get a personal action plan, health coaching and a smart scale at no extra cost.',
                    url: `${urlRedirect + HealthProgramType.TeladocHealthDiabetesPrevention}`,
                  },
                  {
                    id: '6',
                    title: 'Teladoc Second Opinion Advice & Support',
                    description:
                      'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
                    url: `${urlRedirect + HealthProgramType.TeladocSecondOption}`,
                  },
                  {
                    id: '7',
                    title: 'QuestSelect™ Low-Cost Lab Testing',
                    description:
                      'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
                    url: `${urlRedirect + HealthProgramType.QuestSelect}`,
                    isHidden: !isQuestSelectEligible(data.visibilityRules),
                  },
                  {
                    id: '8',
                    title: 'Silver&Fit Fitness Program',
                    description:
                      'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
                    url: `${urlRedirect + HealthProgramType.SilverFit}`,
                  },
                ]}
              />
            </section>
          </>
        )}
        {!isBlueCareMember && (
          <section>
            <MyHealthOffsiteLinkCard
              icon={wellTunedBlogIcon}
              title="WellTuned Blog"
              description="Visit our WellTuned blog to stay up-to-date on health and wellness news, health care developments and tips for managing your health."
              url={process.env.NEXT_PUBLIC_WELLTUNED_BLOCK_URL ?? ''}
            />
          </section>
        )}
        <section></section>
        {!isBlueCareMember && (
          <section>
            <HealthLibraryOptions
              className="large-section"
              options={healthLibraryDetails}
            />
          </section>
        )}

        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            {isPrimaryCarePhysicianEligible(data.visibilityRules) && (
              <PrimaryCareProvider
                className="large-section"
                providerDetails={data.primaryCareProvider}
                label="Primary Care Provider"
                linkLabel="View or Update Primary Care Provider"
                title="My Primary Care Provider"
              />
            )}
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            {isBlueCareMember && (
              <Column>
                <MyHealthOffsiteLinkCard
                  icon={healthSurveyIcon}
                  title="Fill-out The Health History & Needs Survey"
                  description="Help us get a clear picture of your health needs. We need this info once a year from all our members. Please take a few minutes to complete this survey."
                  url={
                    process.env.NEXT_PUBLIC_FILL_OUT_THE_HEALTH_HISTORY_URL ??
                    ''
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
            )}
          </Column>
        </section>
        {isBlueCareMember && (
          <section>
            <HealthLibraryOptions
              className="large-section"
              options={healthLibraryDetails}
            />
          </section>
        )}
      </Column>
    </main>
  );
};

export default MyHealth;
