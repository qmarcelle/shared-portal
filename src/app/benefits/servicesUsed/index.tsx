'use client';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
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
import { ServicesUsedItem } from '@/models/app/servicesused_details';
import { UIUser } from '@/models/app/uiUser';
import { MedicalServicesWrapper } from '../components/MedicalServices';

type ServicesUsedProps = {
  users: UIUser[] | undefined;
  services: Map<string, ServicesUsedItem[]> | undefined;
  phoneNumber: string;
};

const ServicesUsed = ({ users, services, phoneNumber }: ServicesUsedProps) => {
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
            {services && users ? (
              <MedicalServicesWrapper
                className="large-section"
                members={users.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                initSelectedMemberId={users[0].id}
                medicalServiceDetailsUsed={services}
                phoneNumber={phoneNumber}
              />
            ) : (
              <ErrorInfoCard
                className="mt-2"
                errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
              />
            )}
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
              link="/claims"
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
