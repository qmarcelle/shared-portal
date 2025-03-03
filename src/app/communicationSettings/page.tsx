import { Metadata } from 'next';
import CommunicationSettings from '.';
import { getCommunicationSettingsData } from './actions/getCommunicationSettingsData';

export const metadata: Metadata = {
  title: 'Communication Settings',
};

const CommunicationSettingsPage = async () => {
  const result = await getCommunicationSettingsData();
  return <CommunicationSettings data={result.data!} />;
};

export default CommunicationSettingsPage;
