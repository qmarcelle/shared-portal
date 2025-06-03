'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { getHingeHealthLink } from '@/visibilityEngine/computeVisibilityRules';
import { Session } from 'next-auth';
import { VirtualMentalHealthCareSection } from '../../app/mentalHealthOptions/components/VirtualMentalHealthCareSection';
import { HealthProgramType } from '../myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { OtherBenefits } from './components/OtherBenefits';
const urlRedirect = '/member/myhealth/healthprograms/';

export type VirtualCareOptionsProps = { sessionData?: Session | null };

const VirtualCareOptions = ({ sessionData }: VirtualCareOptionsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header className="mb-0 title-1" text="Virtual Care Options" />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <RichText
              className="sectionWidthVirtualCare"
              spans={[
                <>
                  <span>
                    The options below offer quick, high-quality care for a range
                    of non-emergency needs. You can also search for in-network
                    providers that offer in-person and virtual visits with
                    our{' '}
                  </span>
                  <span className="link" key={1}>
                    <a
                      className="body-bold"
                      href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}`}
                    >
                      Find Care tool.
                    </a>
                  </span>
                </>,
              ]}
            />
            <Spacer size={16} />
            <TextBox
              className="body-2 mb-0"
              text="In case of a medical emergency, call 911. In case of a mental health crisis, call 988."
            ></TextBox>
          </Column>
          <Spacer size={32} />

          <Row className=" flex-grow page-section-36_67 items-stretch">
            <div></div>
          </Row>
        </section>

        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow items-stretch">
            <Spacer size={32} />
            <Row className="flex-grow items-stretch gap-4 flex-wrap">
              <VirtualMentalHealthCareSection
                mentalHealthCareOptions={[
                  {
                    healthcareType: 'Mental Health',
                    icon: 'TelaDoc',
                    healthCareName: 'Teladoc Mental Health',
                    description:
                      'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere. ',
                    link: 'Learn More About Teladoc Mental Health',
                    itemDataTitle: 'Generally good for:',
                    itemData: [
                      'Anxiety, stress, feeling overwhelmed',
                      'Relationship conflicts',
                      'Depression',
                      'Trauma and PTSD',
                    ],
                    redirectLink: () => {
                      return `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_TELADOC}`;
                    },
                    sessionData: sessionData,
                  },
                  {
                    healthcareType: 'Mental Health',
                    icon: 'AbleToIcon',
                    healthCareName: 'AbleTo',
                    description:
                      // eslint-disable-next-line quotes
                      "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need",
                    link: 'Learn More About AbleTo',
                    itemDataTitle: 'Generally good for:',
                    itemData: ['Anxiety', 'Depression', 'Grief', 'Stress'],
                    redirectLink: () => {
                      return process.env.NEXT_PUBLIC_ABLETO ?? '';
                    },
                    sessionData: sessionData,
                  },
                  {
                    healthcareType: 'Physical Therapy',
                    icon: 'HingeHealth',
                    healthCareName: 'Hinge Health Back & Joint Care',
                    description:
                      'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
                    link: 'Learn More About Hinge Health',
                    itemDataTitle: 'Generally good for:',
                    itemData: [
                      'Back pain',
                      'Wrist and ankle pain',
                      'Pelvic pain and incontinence',
                      'Neck and shoulder pain',
                    ],
                    redirectLink: getHingeHealthLink,
                    sessionData: sessionData,
                  },
                  {
                    healthcareType: 'Primary Care',
                    icon: 'TelaDoc',
                    healthCareName: 'Teladoc Health Primary Care Provider',
                    description:
                      'With Primary 360, you can talk to a board-certified primary care doctor by video or phone, seven days a week.',
                    link: 'Learn More About Teladoc Health Primary Care',
                    itemDataTitle: 'Generally good for:',
                    itemData: [
                      'Annual checkups and preventive care',
                      'Prescriptions',
                      'Lab orders and recommended screenings ',
                      'Referrals to in-network specialists ',
                    ],
                    redirectLink: () => {
                      return `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_TELADOC}`;
                    },
                    sessionData: sessionData,
                  },
                  {
                    healthcareType: 'Urgent Care',
                    icon: 'TelaDoc',
                    healthCareName: 'Teladoc Health General & Urgent Care',
                    description:
                      'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
                    link: 'Learn More About Teladoc Health Urgent Care',
                    itemDataTitle: 'Generally good for:',
                    itemData: [
                      'Allergies, cold, fever or flu',
                      'Skin condition (rashes or insect bites)',
                      'Urinary tract infections',
                      'Constipation or diarrhea ',
                    ],
                    redirectLink: () => {
                      return `/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_TELADOC}`;
                    },
                    sessionData: sessionData,
                  },
                  {
                    healthcareType: 'Urgent Care',
                    healthCareName: 'Talk to a Nurse',
                    description:
                      'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care. ',
                    link: 'Learn More About Nurse Chat',
                    itemDataTitle: 'Generally good for:',
                    itemData: [
                      'Assessing symptoms and advice',
                      'General health information',
                      'Education and support on conditions or procedures',
                      'Help making decisions for surgery or other treatments ',
                    ],
                    sessionData: sessionData,
                  },
                ]}
              />
            </Row>
          </Column>
        </section>
        <Spacer size={32} />
        <Header text="Other Benefits" />
        <Spacer size={32} />
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
      </Column>
    </main>
  );
};

export default VirtualCareOptions;
