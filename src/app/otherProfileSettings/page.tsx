import { auth } from '@/auth';
import { Metadata } from 'next';
import OtherProfileSettings from '.';
import { getOtherProfileSettingsData } from './actions/getOtherProfileSettingsData';

export const metadata: Metadata = {
  title: 'Other Profile Settings',
};

const OtherProfileSettingsPage = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const result = await getOtherProfileSettingsData();
  const session = await auth();
  return <OtherProfileSettings data={result.data!} sessionData={session} />;
};

export default OtherProfileSettingsPage;
