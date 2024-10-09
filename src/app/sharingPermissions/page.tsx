'use client';

import { SharingAndPermissionsInfo } from '@/app/sharingPermissions/components/SharingAndPermissionsInfo';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

const SharingAndPermissionsPage = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <div className="flex flex-col app-content">
        <Spacer size={32} />
        <section className="flex justify-start self-start px-4">
          <Header type="title-1" text="Sharing & Permissions" />
        </section>
        <section className="flex flex-col flex-grow page-section-63_33 items-stretch ">
          <SharingAndPermissionsInfo />
        </section>
      </div>
    </div>
  );
};

export default SharingAndPermissionsPage;
