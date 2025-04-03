import { auth } from '@/auth';
import { checkPersonalRepAccess } from '@/utils/getRole';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CommunicationSettings from '.';
import { getCommunicationSettingsData } from './actions/getCommunicationSettingsData';

export const metadata: Metadata = {
  title: 'Communication Settings',
};

const CommunicationSettingsPage = async () => {
  const session = await auth();
  const userRole = session?.user.currUsr.role;
  if (userRole && !checkPersonalRepAccess(userRole)) {
    redirect('/dashboard');
  } else {
    const result = await getCommunicationSettingsData();
    return <CommunicationSettings data={result.data!} />;
  }
};

export default CommunicationSettingsPage;
