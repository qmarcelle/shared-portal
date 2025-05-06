import { auth } from '@/app/(system)/auth';
import { Metadata } from 'next';
import SharingAndPermissionsPage from './Index';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

const SharingPermissionsPage = async () => {
  const session = await auth();
  const userRole = session?.user.currUsr.role;
  return <SharingAndPermissionsPage userRole={userRole} />;
};

export default SharingPermissionsPage;
