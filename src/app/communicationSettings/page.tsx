import { Metadata } from 'next';
import CommunicationSettings from '.';
import { getProfileSettingsData } from '../profileSettings/actions/getProfileSettingsData';

export const metadata: Metadata = {
  title: 'Communication Settings',
};

const CommunicationSettingsPage = async () => {
  const result = await getProfileSettingsData();
  return <CommunicationSettings data={result.data!} />;
};

export default CommunicationSettingsPage;
