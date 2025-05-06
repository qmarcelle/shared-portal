import { getServerSideUserId } from '@/utils/server_session';
import { Metadata } from 'next';
import { SecuritySettings } from '../../(commo../(common)/security/components/SecuritySettingsComponent';

export const metadata: Metadata = {
  title: 'Security Settings',
};

const SecurityPage = async () => {
  return (
    <section className="px-4">
      <SecuritySettings username={await getServerSideUserId()} />
    </section>
  );
};

export default SecurityPage;
