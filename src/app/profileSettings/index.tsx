'use client';
import { ProfileInformationCard } from '@/app/profileSettings/components/ProfileInformationCard';
import { ProfileSettingsSection } from '@/app/profileSettings/components/ProfileSettingsSection';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { ProfileSettingsAppData } from './models/app/profileSettingsAppData';

export type ProfileSettingsProps = {
  data: ProfileSettingsAppData;
};
const ProfileSettings = ({ data }: ProfileSettingsProps) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" text="Profile Settings" />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ProfileInformationCard
              name={data.memberDetails.fullName}
              DOB={data.memberDetails.dob}
              phoneNumber={data.phone}
              email={data.email}
              visibilityRules={data.visibilityRules}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <ProfileSettingsSection visibilityRules={data.visibilityRules} />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default ProfileSettings;
