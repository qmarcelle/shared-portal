'use client';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ChooseMentalHealthProvider } from './components/ChooseMentalHealthProviderSection';
import { FindInNetworkProviderSection } from './components/FindInNetworkProviderSection';
import { VirtualMentalHealthCareSection } from './components/VirtualMentalHealthCareSection';

const MentalHealthOptions = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="m-4 mb-0" text="Mental Health Options" />
        <Spacer size={16} />
        <TextBox
          className="body-1 m-4 mb-0"
          text="Learn more about Mental Health Providers and view your options."
        ></TextBox>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ChooseMentalHealthProvider className="large-section" />
          </Column>

          <Column className=" flex-grow page-section-36_67 items-stretch">
            <FindInNetworkProviderSection />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body m-4">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <Spacer size={32} />
            <TextBox
              className="title-2"
              text="Virtual Mental Health Care"
            ></TextBox>
            <Spacer size={32} />
            <Row className="flex-grow page-section-63_33 items-stretch">
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
                ]}
              />
            </Row>
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default MentalHealthOptions;
