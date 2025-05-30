'use client';
import { VirtualMentalHealthCareSection } from '@/app/mentalHealthOptions/components/VirtualMentalHealthCareSection';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { isPrimaryCarePhysicianEligible } from '@/visibilityEngine/computeVisibilityRules';
import FindCare from '../../../../public/assets/find_care_search.svg';
import { AboutPrimaryCareProvider } from './components/AboutPrimaryCareProvider';
import { PrimaryCareProvider } from './components/PrimaryCareProvider';
import { PrimaryCareOptionsData } from './model/app/primary_care_options_data';

export type PrimaryCareOptionsProps = { data: PrimaryCareOptionsData };
const PrimaryCareOptions = ({ data }: PrimaryCareOptionsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className="mb-0" text="Primary Care Options" />
        <Spacer size={16} />
        <TextBox
          className="body-1 mb-0"
          text="Learn more about Primary Care Providers and view your options."
        ></TextBox>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            {isPrimaryCarePhysicianEligible(data.visibilityRules) && (
              <PrimaryCareProvider
                className="large-section"
                providerDetails={data.primaryCareProvider}
                label="Primary Care Provider"
                linkLabel="View or Update Primary Care Provider"
                title="My Primary Care Provider"
              />
            )}
            <AboutPrimaryCareProvider className="large-section" />
          </Column>

          <Column className=" flex-grow page-section-36_67 items-stretch">
            <InfoCard
              icon={FindCare}
              label="Find an In-network Provider"
              body="Find a high-qualitys provider for either in-person or virtual telehealth appointments."
              link={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&alternateText=Find a PCP&isPCPSearchRedirect=true&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_PCP_SSO_TARGET}`}
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
                ]}
              />
            </Row>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default PrimaryCareOptions;
