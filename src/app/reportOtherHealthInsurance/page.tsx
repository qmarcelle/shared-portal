import { otherHealthInsuranceData } from '@/actions/reportOtherInsuranceDetails';
import { Metadata } from 'next';
import ReportOtherHealthInsurance from '.';

export const metadata: Metadata = {
  title: 'ReportOtherHealthInsurance',
};

const OtherHealthInsurancePage = async () => {
  const response = await otherHealthInsuranceData();
  return <ReportOtherHealthInsurance data={response} />;
};

export default OtherHealthInsurancePage;
