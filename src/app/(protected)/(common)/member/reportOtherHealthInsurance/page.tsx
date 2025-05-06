import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { otherHealthInsuranceData } from '@/actions/reportOtherInsuranceDetails';
import { auth } from '@/app/(system)/auth';
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
  return (
    <ReportOtherHealthInsurance
      data={response}
      cobData={otherInsuranceResponse.data!}
    />
  );
};

export default OtherHealthInsurancePage;
