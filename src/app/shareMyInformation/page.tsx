import { auth } from '@/auth';
import { logger } from '@/utils/logger';
import { Metadata } from 'next';
import ShareMyInformation from '.';
import { getShareMyPlanInformation } from './actions/getShareMyPlanInformation';

export const metadata: Metadata = {
  title: 'Share My Information',
};

const ShareMyInformationPage = async () => {
  const planInfo = await getShareMyPlanInformation();
  logger.info('Get Share My Information Response: ' + planInfo?.data);
  const session = await auth();
  const isImpersonated = session!.user.impersonated;
  return (
    <ShareMyInformation data={planInfo?.data} isImpersonated={isImpersonated} />
  );
};

export default ShareMyInformationPage;
