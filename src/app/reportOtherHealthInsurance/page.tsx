import { memberData } from '@/actions/AddMemberDetails';
import { Metadata } from 'next';
import ReportOtherHealthInsurance from '.';

export const metadata: Metadata = {
  title: 'ReportOtherHealthInsurance',
};

const OtherHealthInsurancePage = async () => {
  const memberDetails = await memberData();
  return <ReportOtherHealthInsurance data={memberDetails} />;
};

export default OtherHealthInsurancePage;
