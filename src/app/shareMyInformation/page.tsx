import { getPlanInformationData } from '@/actions/getPlanMemberDetails';
import { Metadata } from 'next';
import ShareMyInformation from '.';

export const metadata: Metadata = {
  title: 'Share My Information',
};

const ShareMyInformationPage = async () => {
  const planInfo = await getPlanInformationData();
  return <ShareMyInformation data={planInfo?.data} />;
};
export default ShareMyInformationPage;
