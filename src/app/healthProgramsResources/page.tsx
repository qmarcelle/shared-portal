'use client';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { VirtualMentalHealthCareSection } from '../../app/mentalHealthOptions/components/VirtualMentalHealthCareSection';

const healthProgramsResources = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="mt-4" text="Health Programs & Resources" />
        <div className="w-3/4">
          <Spacer size={16} />
          <TextBox
            className="mt-4 inline w-2/3"
            text="Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable."
          ></TextBox>
          <AppLink
            label="View all your plan benefits here"
            displayStyle="inline-flex"
            className="pr-0"
          />
          .
        </div>
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <VirtualMentalHealthCareSection
              mentalHealthCareOptions={[
                {
                  healthcareType: 'Advice & Support',
                  icon: 'Alight',
                  healthCareName: 'Alight Second Opinion Advice & Support',
                  description:
                    'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost.',
                  link: 'Learn More About Alight',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Speaking with an expert about your diagnosis',
                    'Rare or life-threatening condition support',
                    'Considering risky or complicated treatment',
                    'Compare costs of treatment or tests',
                  ],
                },
                {
                  healthcareType: 'Advice & Support',
                  icon: 'CareTN',
                  healthCareName: 'CareTN One-on-One Health Support ',
                  description:
                    // eslint-disable-next-line quotes
                    'Did you know you can talk to your very own care team? The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
                  link: 'Learn More About CareTN',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Living with long-term health conditions',
                    'Diabetes',
                    'Respiratory health',
                    'Mental health',
                  ],
                },
                {
                  healthcareType: 'Blood Pressure',
                  icon: 'TelaDoc',
                  healthCareName:
                    'Teladoc Health Blood Pressure Management Program',
                  description:
                    // eslint-disable-next-line quotes
                    'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
                  link: 'Learn More About Blood Pressure Management',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'High blood pressure management',
                    'Meal planning',
                    'Building healthy habits',
                  ],
                },
              ]}
            />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <VirtualMentalHealthCareSection
              mentalHealthCareOptions={[
                {
                  healthcareType: 'Diabetes',
                  icon: 'TelaDoc',
                  healthCareName: 'Teladoc Health Diabetes Management Program',
                  description:
                    // eslint-disable-next-line quotes
                    'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
                  link: 'Learn More About Diabetes Management',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Living with diabetes',
                    'Receiving diabetes supplies',
                    'Monitoring glucose',
                    'Building healthy habits',
                  ],
                },
                {
                  healthcareType: 'Diabetes',
                  icon: 'TelaDoc',
                  healthCareName: 'Teladoc Health Diabetes Prevention Program',
                  description:
                    // eslint-disable-next-line quotes
                    'Get a personal action plan, health coaching and a smart scale at no extra cost.',
                  link: 'Learn More About Diabetes Prevention',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Viewing weight trends',
                    'Expert coaching and advice',
                    'Sharing reports with the doctor',
                    'Personalized eating tips',
                  ],
                },
                {
                  healthcareType: 'Fitness',
                  icon: 'SilverFit',
                  healthCareName: 'Silver&Fit Fitness Program ',
                  description:
                    // eslint-disable-next-line quotes
                    'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
                  link: 'Learn More About Silver&Fit',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Weight loss',
                    'Getting fit',
                    'At-home fitness',
                    'Gym memberships',
                  ],
                },
              ]}
            />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <VirtualMentalHealthCareSection
              mentalHealthCareOptions={[
                {
                  healthcareType: 'Lab Testing',
                  icon: 'QuestSelect',
                  healthCareName: 'QuestSelect Low-Cost Lab Testing',
                  description:
                    // eslint-disable-next-line quotes
                    'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
                  link: 'Learn More About QuestSelect',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Blood samples',
                    'Urine samples',
                    'Throat cultures',
                    'And more',
                  ],
                },
                {
                  healthcareType: 'Mental Health',
                  icon: 'AbleToIcon',
                  healthCareName: 'AbleTo',
                  description:
                    // eslint-disable-next-line quotes
                    'AbleTo&apos;s personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.',
                  link: 'Learn More About AbleTo',
                  itemDataTitle: 'Generally good for:',
                  itemData: ['Anxiety', 'Depression', 'Grief', 'Stress'],
                },
                {
                  healthcareType: 'Mental Health',
                  icon: 'TelaDoc',
                  healthCareName: 'Teladoc Mental Health',
                  description:
                    // eslint-disable-next-line quotes
                    'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere.',
                  link: 'Learn More About Teladoc Mental Health',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Anxiety, stress, feeling overwhelmed',
                    'Relationship conflicts',
                    'Depression',
                    'Trauma and PTSD',
                  ],
                },
              ]}
            />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <VirtualMentalHealthCareSection
              mentalHealthCareOptions={[
                {
                  healthcareType: 'Physical Therapy',
                  icon: 'HingeHealth',
                  healthCareName: 'Hinge Health Back & Joint Care',
                  description:
                    // eslint-disable-next-line quotes
                    'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
                  link: 'Learn More About Hinge Health',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Back pain',
                    'Wrist and ankle pain',
                    'Pelvic pain and incontinence',
                    'Neck and shoulder pain',
                  ],
                },
                {
                  healthcareType: 'Pregnancy',
                  icon: 'HealthyMaternity',
                  healthCareName: 'Healthy Maternity',
                  description:
                    // eslint-disable-next-line quotes
                    'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
                  link: 'Learn More About Healthy Maternity',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Maternity Support',
                    'Advice from a registered nurse',
                    'Pregnancy health advice',
                    'Immunization needs and schedules',
                  ],
                },
                {
                  healthcareType: 'Primary Care',
                  icon: 'TelaDoc',
                  healthCareName: 'Teladoc Health Primary Card Provider',
                  description:
                    'With Primary 360, you can talk to a board-certified primary acre doctor by video or phone seven days a week.',
                  link: 'Learn More About Teladoc Health Primary Care',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Annual checkups and preventive care',
                    'Prescriptions',
                    'Lab orders and recommended screenings',
                    'Referrals to in-network specialists',
                  ],
                },
              ]}
            />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <VirtualMentalHealthCareSection
              mentalHealthCareOptions={[
                {
                  healthcareType: 'Primary Care',
                  icon: 'Sanitas',
                  healthCareName:
                    'Blue of Tennessee Medical Centers Virtual Visits',
                  description:
                    // eslint-disable-next-line quotes
                    'At Blue of Tennessee Medical Centers, you can see a primary care provider, some specialists and get urgent help. You can even get help with your help plan.',
                  link: 'Learn More About Blue of Tennessee Medical Centers',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Primary Care visits',
                    'Urgent Care (rashes, fever, migraines, diarrhea)',
                    'Get support for a health condition',
                    'Get help with your health plan',
                  ],
                },
                {
                  healthcareType: 'Urgent Care',
                  icon: 'TelaDoc',
                  healthCareName: 'Teladoc Health General & Urgent Care',
                  description:
                    // eslint-disable-next-line quotes
                    'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
                  link: 'Learn More About Teladoc Health Urgent Care',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Allergies, cold, fever or flu',
                    'Skin condition (rashes or insect bites)',
                    'Urinary tract infections',
                    'Constipation or diarrhea',
                  ],
                },
                {
                  healthcareType: 'Urgent Care',
                  healthCareName: 'Talk to a Nurse',
                  description:
                    // eslint-disable-next-line quotes
                    'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care.',
                  link: 'Learn More About Nurseline',
                  itemDataTitle: 'Generally good for:',
                  itemData: [
                    'Assessing symptoms and advice',
                    'General health information',
                    'Education and support on conditions or procedures',
                    'Help making decisions for surgery or other treatments ',
                  ],
                },
              ]}
            />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default healthProgramsResources;
