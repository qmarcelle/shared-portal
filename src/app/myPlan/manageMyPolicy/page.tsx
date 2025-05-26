import {
  getLoggedInMember,
  getMemberAndDependents,
} from '@/actions/memberDetails';
import { withMemberCk } from '@/utils/withMemberCk';
import { Metadata } from 'next';
import ManageMyPolicy from '.';

export const metadata: Metadata = {
  title: 'ManageMyPolicy',
};

const UpdateSocialSecurityNumberPage = async () => {
  const [loggedInMember, members] = await Promise.all([
    getLoggedInMember(),
    withMemberCk(getMemberAndDependents),
  ]);
  return <ManageMyPolicy loggedInMember={loggedInMember} members={members} />;
};

export default UpdateSocialSecurityNumberPage;
