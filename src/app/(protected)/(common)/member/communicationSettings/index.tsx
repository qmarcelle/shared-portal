'use client';

import { ContactInformationSection } from '@/app/(protected)/(common)/member/communicationSettings/components/ContactInformation';
import { EditAlertPreferncesSection } from '@/app/(protected)/(common)/member/communicationSettings/components/EditAlertPreferences';
import { RequestPrintMaterialSection } from '@/app/(protected)/(common)/member/communicationSettings/components/RequestPrintMaterial';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { CommunicationSettingsAppData } from './models/app/communicationSettingsAppData';

export type CommunicationSettingsProps = {
  data: CommunicationSettingsAppData;
};

const CommunicationSettings = ({ data }: CommunicationSettingsProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <section className="flex justify-start self-start">
          <Header className="pl-3" text="Communication Settings" />
        </section>
        <Spacer size={32}></Spacer>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <ContactInformationSection
              className="large-section"
              phone={data.mobileNumber}
              email={data.emailAddress}
            />
            <RequestPrintMaterialSection className="large-section" />
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <EditAlertPreferncesSection
              className="large-section"
              alertPreferenceData={{
                emailAddress: data.emailAddress,
                mobileNumber: data.mobileNumber,
                visibilityRules: data.visibilityRules,
                tierOne: data.tierOne,
                tierOneDescriptions: data.tierOneDescriptions,
                dutyToWarn: data.dutyToWarn,
              }}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default CommunicationSettings;
