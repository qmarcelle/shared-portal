import { auth } from '@/auth';
import { Metadata } from 'next';
import ProfileSettings from '.';
import { getProfileSettingsData } from './actions/getProfileSettingsData';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

const ProfileSettingsPage = async () => {
  const session = await auth();
  const result = await getProfileSettingsData();
  return (
    <ProfileSettings
      data={result.data!}
      userRole={session?.user.currUsr.role}
    />
  );
};

export default ProfileSettingsPage;
