import {
  getLoggedInMember,
  getMemberAndDependents,
} from '@/actions/memberDetails';
import { auth } from '@/auth';
import { withMemberCk } from '@/utils/withMemberCk';
import { Metadata } from 'next';
import ManageMyPolicy from '.';

export const metadata: Metadata = {
  title: 'ManageMyPolicy',
};

const UpdateSocialSecurityNumberPage = async () => {
  const session = await auth();
  const isImpersonating = session?.user?.impersonated || false;
  const [loggedInMember, members] = await Promise.all([
    getLoggedInMember(),
    withMemberCk(getMemberAndDependents),
  ]);
  return (
    <ManageMyPolicy
      isImpersonating={isImpersonating}
      loggedInMember={loggedInMember}
      members={members}
    />
  );
};

export default UpdateSocialSecurityNumberPage;
