'use client';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import FindCare from '../../../public/assets/Find-Care.svg';
import { VirtualMentalHealthCareSection } from '../mentalHealthOptions/components/VirtualMentalHealthCareSection';
import { AboutPrimaryCareProvider } from './components/AboutPrimaryCareProvider';
import { PrimaryCareProvider } from './components/PrimaryCareProvider';

const PrimaryCareOptions = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="m-4 mb-0" text="Primary Care Options" />
        <Spacer size={16} />
        <TextBox
          className="body-1 m-4 mb-0"
          text="Learn more about Primary Care Providers and view your options."
        ></TextBox>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <PrimaryCareProvider
              className="large-section"
              memberName="John Hopkins"
              label="Primary Care Provider"
              address="John Hopkins Medical Center 123 Street Address Road City Town, TN 12345"
              linkLabel="View or Update Primary Care Provider"
              primaryPhoneNumber="(123) 456-7890"
              title="My Primary Care Provider"
            />
            <AboutPrimaryCareProvider className="large-section" />
          </Column>

          <Column className=" flex-grow page-section-36_67 items-stretch">
            <InfoCard
              icon={FindCare}
              label="Find an In-network Provider"
              body="Find a high-quality provider for either in-person or virtual telehealth appointments."
            />
          </Column>
        </section>
        <section className="flex flex-row items-start app-body m-4">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <Spacer size={32} />
            <TextBox className="title-2" text="Virtual Primary Care"></TextBox>
            <Spacer size={32} />
            <Row className="flex-grow page-section-63_33 items-stretch">
              <VirtualMentalHealthCareSection
                mentalHealthCareOptions={[
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
                ]}
              />
            </Row>
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default PrimaryCareOptions;
