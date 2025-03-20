import { auth } from '@/auth';
import { checkPersonalRepAccess } from '@/utils/getRole';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AccessOthersInformation from '.';

export const metadata: Metadata = {
  title: 'Access Others Information',
};

const AccessOthersInformationPage = async () => {
  const session = await auth();
  const userRole = session?.user.currUsr.role;
  if (userRole && !checkPersonalRepAccess(userRole)) {
    redirect('/dashboard');
  } else {
    return <AccessOthersInformation />;
  }
};

export default AccessOthersInformationPage;
