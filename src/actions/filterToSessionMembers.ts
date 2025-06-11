import { auth } from '@/auth';
import 'server-only';
import { getLoggedInUserInfo } from './loggedUserInfo';

export const filterToSessionMembers = async (memberCks: string[]) => {
  const session = await auth();
  const loggedInUserInfo = await getLoggedInUserInfo(
    session!.user!.currUsr!.plan!.memCk,
  );
  const sessionMembers = loggedInUserInfo.members.map((member) =>
    member.memberCk.toString(),
  );
  return memberCks.filter((memberCk) => sessionMembers.includes(memberCk));
};
