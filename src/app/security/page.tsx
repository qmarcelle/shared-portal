import { auth } from '@/auth';
import { SecuritySettings } from './components/SecuritySettingsComponent';

const SecurityPage = async () => {
  const session = await auth();

  return session?.user && <SecuritySettings username={session.user.id} />; //TODO this needs to check for visibility by PZN once implemented.
};

export default SecurityPage;
