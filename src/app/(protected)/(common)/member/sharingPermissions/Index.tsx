'use client';

import { SharingAndPermissionsInfo } from '@/app/(protected)/(common)/member/sharingPermissions/components/SharingAndPermissionsInfo';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { UserRole } from '@/userManagement/models/sessionUser';
export type SharingAndPermissionsPageProps = {
  userRole: UserRole | undefined;
};
const SharingAndPermissionsPage = ({
  userRole,
}: SharingAndPermissionsPageProps) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <div className="flex flex-col app-content">
        <Spacer size={32} />
        <section className="flex justify-start self-start">
          <Header type="title-1" text="Sharing & Permissions" />
        </section>
        <section className="flex flex-col flex-grow page-section-63_33 items-stretch ">
          <SharingAndPermissionsInfo userRole={userRole} />
        </section>
      </div>
    </div>
  );
};

export default SharingAndPermissionsPage;
