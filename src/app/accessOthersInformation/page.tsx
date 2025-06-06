import { getPlanInformationData } from '@/actions/getPlanMemberDetails';
import { auth } from '@/auth';
import { checkPersonalRepAccess } from '@/utils/getRole';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AccessOthersInformation from '.';
import { OtherPlanInformationData } from './action/getOtherPlansInfo';

export const metadata: Metadata = {
  title: 'Access Others Information',
};

const AccessOthersInformationPage = async () => {
  const session = await auth();
  const userRole = session?.user.currUsr.role;
  const [accessOtherInformationData, auResp] = await Promise.all([
    getPlanInformationData(),
    OtherPlanInformationData(),
  ]);
  console.log('auResponse', auResp);
  if (userRole && !checkPersonalRepAccess(userRole)) {
    redirect('/dashboard');
  } else {
    return (
      <AccessOthersInformation
        accessOtherInformationDetails={accessOtherInformationData.data}
        isImpersonated={session!.user.impersonated}
        auResp={auResp?.data?.memberDetails}
      />
    );
  }
};

export default AccessOthersInformationPage;
