import { getServerSideUserId } from '@/utils/server_session';
import { SecuritySettings } from '../../(main)/security/components/SecuritySettingsComponent';

const SecurityPage = async () => {
  return <SecuritySettings username={await getServerSideUserId()} />;
};

export default SecurityPage;
