import { getServerSideUserId } from '@/utils/server_session';
import { SecuritySettings } from '../../security/components/SecuritySettingsComponent';

const SecurityPage = async () => {
  return <SecuritySettings username={await getServerSideUserId()} />;
};

export default SecurityPage;
