'use client';

import { ContactInformationSection } from '@/app/(main)/communicationSettings/components/ContactInformation';
import { EditAlertPreferncesSection } from '@/app/(main)/communicationSettings/components/EditAlertPreferences';
import { RequestPrintMaterialSection } from '@/app/(main)/communicationSettings/components/RequestPrintMaterial';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

const CommunicationSettings = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex justify-start self-start">
          <Header text="Communication Settings" />
        </section>
        <Spacer size={32}></Spacer>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <ContactInformationSection
              className="large-section"
              phone="(123) 456-7890"
              email="chall123@gmail.com"
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
