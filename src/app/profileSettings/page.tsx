import { Metadata } from 'next';
import ProfileSettings from '.';
import { getProfileSettingsData } from './actions/getProfileSettingsData';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

const ProfileSettingsPage = async () => {
  const result = await getProfileSettingsData();
  return <ProfileSettings data={result.data!} />;
};

export default ProfileSettingsPage;
