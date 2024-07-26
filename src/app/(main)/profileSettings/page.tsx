'use client';

import { ProfileInformationCard } from '@/app/(main)/profileSettings/components/ProfileInformationCard';
import { ProfileSettingsSection } from '@/app/(main)/profileSettings/components/ProfileSettingsSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

const ProfileSettings = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Header className="pl-3" type="title-1" text="Profile Settings" />
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ProfileInformationCard
              name="Chris Hall"
              DOB="01/01/1978"
              phoneNumber="(123) 456-7890"
              email="chall123@gmail.com"
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <ProfileSettingsSection />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default ProfileSettings;
