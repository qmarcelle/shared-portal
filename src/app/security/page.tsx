import { auth } from '@/auth';
import { checkPersonalRepAccess } from '@/utils/getRole';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SecuritySettings } from './components/SecuritySettingsComponent';

export const metadata: Metadata = {
  title: 'Security Settings',
};

const SecurityPage = async () => {
  const session = await auth();
  const userRole = session?.user.currUsr.role;
  if (userRole && !checkPersonalRepAccess(userRole)) {
    redirect('/dashboard');
  } else {
    return (
      session?.user && (
        <SecuritySettings
          username={session.user.id}
          isImpersonated={session.user.impersonated}
        />
      )
    ); //TODO this needs to check for visibility by PZN once implemented.
  }
};

export default SecurityPage;
