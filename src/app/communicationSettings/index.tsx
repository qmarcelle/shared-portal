'use client';

import { ContactInformationSection } from '@/app/communicationSettings/components/ContactInformation';
import { EditAlertPreferncesSection } from '@/app/communicationSettings/components/EditAlertPreferences';
import { RequestPrintMaterialSection } from '@/app/communicationSettings/components/RequestPrintMaterial';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { ProfileSettingsAppData } from '../profileSettings/models/app/profileSettingsAppData';

export type ProfileSettingsProps = {
  data: ProfileSettingsAppData;
};

const CommunicationSettings = ({ data }: ProfileSettingsProps) => {
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
              phone={data.phone}
              email={data.email}
            />
            <RequestPrintMaterialSection className="large-section" />
          </Column>
          <Column className="page-section-63_33 items-stretch">
            <EditAlertPreferncesSection
              className="large-section"
              isTextAlert={true}
              isEmailAlert={false}
              isPlanInfo={false}
              isClaimsInfo={false}
              isHealthInfo={false}
            />
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default CommunicationSettings;
