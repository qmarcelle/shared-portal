'use client';
import { GetHelpSection } from '@/components/composite/GetHelpSection';
import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  claimsBenefitsCoverage,
  searchCareLogo,
} from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { MedicalServices } from '../components/MedicalServices';

const ServicesUsed = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Spacer size={32} />
      <Column className="app-content app-base-font-color">
        <Header className=" mb-0" text="Services Used" />
        <Spacer size={8} />
        <TextBox
          className="body-1  mb-0 w-2/3"
          text="Below is a list of common services, the maximum amount covered by your plan and how many you've used."
        ></TextBox>
        <Spacer size={8} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MedicalServices
              className="large-section"
              members={[
                {
                  label: 'Chris Hall',
                  value: '43',
                },
                {
                  label: 'Megan Chaler',
                  value: '0',
                },
              ]}
              onSelectedMemberChange={() => {}}
              selectedMemberId="43"
              medicalServiceDetailsUsed={[
                {
                  limitAmount: 1,
                  spentAmount: 0,
                  serviceName: 'Visit Benefit Period - Mammogram',
                },
                {
                  limitAmount: 1,
                  spentAmount: 0,
                  serviceName: 'Annual OB-Gyn Exam Per Calendar Year',
                },
                {
                  limitAmount: 32,
                  spentAmount: 60,
                  serviceName:
                    'Visits Per Benefit Period -- Chiropractic Services',
                },
                {
                  limitAmount: 0,
                  spentAmount: 260,
                  serviceName:
                    'Visits Per Calendar Year -Outpatient/In Home Private Duty Nursing',
                },
                {
                  limitAmount: 0,
                  spentAmount: 60,
                  serviceName:
                    'Days Per Calendar Year - Skilled Nursing Facility & Rehabilitation',
                },
                {
                  limitAmount: 0,
                  spentAmount: 4,
                  serviceName: 'Injections Per Year -- Trigger Point Injection',
                },
                {
                  limitAmount: 0,
                  spentAmount: 60,
                  serviceName: 'Visits Per Benefit Period -- Acupuncture',
                },
                {
                  limitAmount: 0,
                  spentAmount: 60,
                  serviceName:
                    'Visits per Benefit Period -- Occupational Therapy',
                },
                {
                  limitAmount: 0,
                  spentAmount: 60,
                  serviceName: 'Visits per Benefit Period -- Speech Therapy',
                },
                {
                  limitAmount: 0,
                  spentAmount: 60,
                  serviceName: 'Visits per Benefit Period -- Pulmonary Therapy',
                },
                {
                  limitAmount: 0,
                  spentAmount: 60,
                  serviceName: 'Visits per Benefit Period -- Cardiac Rehab',
                },
                {
                  limitAmount: 0,
                  spentAmount: 1,
                  serviceName:
                    ' Exam Per Calendar Year - Wellcare Age 6 and Above',
                },
                {
                  limitAmount: 0,
                  spentAmount: 8,
                  serviceName: 'Visits Per Year - Tobacco Cessation Counseling',
                },
                {
                  limitAmount: 0.0,
                  spentAmount: 10000,
                  serviceName:
                    'Per Benefit Period - Organ Transplant -Travel, Meals & Lodging',
                },
                {
                  limitAmount: 0.0,
                  spentAmount: 10000,
                  serviceName: 'Lifetime Maximum - Infertility Treatment',
                },
                {
                  limitAmount: 0,
                  spentAmount: 75000,
                  serviceName:
                    'Lifetime Limit - Services for Gender Transformations',
                },
                {
                  limitAmount: 0,
                  spentAmount: 10000,
                  serviceName: 'Lifetime Maximum -- Excess Skin Removal',
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <InfoCard
              label="Find Care & Estimate Costs"
              body="Find a health care provider near you, or plan your upcoming care costs before you make an appointment."
              icon={searchCareLogo}
              link="/findcare"
            ></InfoCard>
            <InfoCard
              label="Claims"
              body="Search for claims and view details or submit a claim."
              icon={claimsBenefitsCoverage}
              link="/claimSnapshotList"
            ></InfoCard>
            <GetHelpSection
              linkURL={'Benefits & Coverage FAQ.'}
              headerText={'Get Help with Services Used'}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default ServicesUsed;
