import { getPlanInformationData } from '@/actions/getPlanMemberDetails';
import { auth } from '@/auth';
import { Metadata } from 'next';
import ShareMyInformation from '.';

export const metadata: Metadata = {
  title: 'Share My Information',
};

const ShareMyInformationPage = async () => {
  const session = await auth();
  const planInfo = await getPlanInformationData();
  const isImpersonated = session!.user.impersonated;
  return (
    <ShareMyInformation data={planInfo?.data} isImpersonated={isImpersonated} />
  );
};

export default ShareMyInformationPage;
