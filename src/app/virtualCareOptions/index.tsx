'use client';

import { VirtualMentalHealthCareSection } from '@/app/mentalHealthOptions/components/VirtualMentalHealthCareSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { VirtualCareOption } from './actions/getVirtualCareOptions';
import { OtherBenefits } from './components/OtherBenefits';

export interface VirtualCareOptionsProps {
  virtualCareOptions: VirtualCareOption[];
}

const VirtualCareOptions = ({
  virtualCareOptions,
}: VirtualCareOptionsProps) => {
  // Filter options based on server-side visibility rules
  const filteredOptions = virtualCareOptions.filter(
    (option) => option.isVisible,
  );

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
                    sessionData: null,
                  },
                  {
                    healthcareType: 'Mental Health',
                    icon: 'AbleToIcon',
                    healthCareName: 'AbleTo',
                    description:
                      "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need",
                    link: 'Learn More About AbleTo',
                    itemDataTitle: 'Generally good for:',
                    itemData: ['Anxiety', 'Depression', 'Grief', 'Stress'],
                    redirectLink: () => {
                      return process.env.NEXT_PUBLIC_ABLETO ?? '';
                    },
                    sessionData: null,
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
                    redirectLink: () => {
                      return process.env.NEXT_PUBLIC_HINGE_HEALTH ?? '';
                    },
                    sessionData: null,
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
                    sessionData: null,
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
            options={filteredOptions}
          />
        </section>
      </Column>
    </main>
  );
};

export default VirtualCareOptions;
