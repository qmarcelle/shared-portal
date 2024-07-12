import { auth } from '@/auth';
import { SecuritySettings } from './components/SecuritySettingsComponent';

const SecurityPage = async () => {
  const session = await auth();

  return <SecuritySettings session={session} />;
};

export default SecurityPage;
