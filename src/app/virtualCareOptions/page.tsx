/**
 * virtualCareOptions
 * Virtual care options
 */
export const metadata = {
  title: 'Virtual care options | Consumer Portal',
  description: 'Virtual care options'
};

'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { VirtualMentalHealthCareSection } from '../../app/mentalHealthOptions/components/VirtualMentalHealthCareSection';
import { OtherBenefits } from './components/OtherBenefits';

const VirtualCareOptions = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="mb-0 title-1" text="Virtual Care Options" />
        <Spacer size={16} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <TextBox
              className="body-1 mb-0"
              text="The options below offer quick, high-quality care for a range of non-emergency needs. You can also search for in-network providers that offer in-person and virtual visits with our Find Care tool."
            ></TextBox>
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
            <TextBox
              className="title-2"
              text="Virtual Mental Health Care"
            ></TextBox>
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
                  },
                  {
                    healthcareType: 'Physical Therapy',
                    icon: 'HingeHealthIcon',
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
                  },
                  {
                    healthcareType: 'Primary Care',
                    icon: 'BlueTennesseIcon',
                    healthCareName:
                      'Blue of Tennessee Medical Centers Virtual Visits ',
                    description:
                      'At Blue of Tennessee Medical Centers, you can see a primary care provider, some specialists and get urgent care help. You can even get help with your health plan.',
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
            options={[
              {
                id: '1',
                title: 'Teladoc Health Second Opinion Advice & Support',
                description:
                  'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost. ',
                url: 'null',
              },
              {
                id: '2',
                title: 'CareTN One-on-One Health Support ',
                description:
                  'The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
                url: 'null',
              },
              {
                id: '3',
                title: 'Healthy Maternity',
                description:
                  'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy. ',
                url: 'null',
              },
              {
                id: '4',
                title: 'Test',
                description: 'THis is test card.',
                url: 'null',
              },
            ]}
          />
        </section>
      </Column>
    </main>
  );
};

export default VirtualCareOptions;
