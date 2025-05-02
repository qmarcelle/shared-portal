import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getMemberAndDependents } from '@/actions/memberDetails';
import { otherHealthInsuranceData } from '@/actions/reportOtherInsuranceDetails';
import { auth } from '@/auth';
import { Metadata } from 'next';
import ReportOtherHealthInsurance from '.';
import { getOtherInsuranceData } from './actions/getInsuranceDetails';

export const metadata: Metadata = {
  title: 'ReportOtherHealthInsurance',
};

const OtherHealthInsurancePage = async () => {
  const session = await auth();
  console.log('before loggedinuser', session?.user.currUsr.plan?.memCk);
  const loggedinuser = await getLoggedInUserInfo(
    session?.user.currUsr.plan?.memCk ?? '',
  );
  const response = await otherHealthInsuranceData(loggedinuser);
  const otherInsuranceResponse = await getOtherInsuranceData(loggedinuser);
  const members = await getMemberAndDependents(
    session!.user.currUsr!.plan!.memCk,
  );
  return (
    <ReportOtherHealthInsurance
      data={response}
      cobData={otherInsuranceResponse.data!}
      membersData={members}
    />
  );
};

export default OtherHealthInsurancePage;
