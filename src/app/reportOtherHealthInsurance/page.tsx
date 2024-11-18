import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { AddMemberDetails } from '@/models/add_member_details';
import { logger } from '@/utils/logger';
import { Metadata } from 'next';
import ReportOtherHealthInsurance from '.';

export const metadata: Metadata = {
  title: 'ReportOtherHealthInsurance',
};

const OtherHealthInsurancePage = async () => {
  try {
    const memberDetails = await auth();
    const result = await getLoggedInUserInfo(
      `${memberDetails?.user.currUsr?.plan.memCk}`,
    );
    const response: AddMemberDetails[] = result.members
      .filter((member) => member.memRelation === 'M')
      .map((member, index) => ({
        dob: member.birthDate,
        id: index,
      }));
    return <ReportOtherHealthInsurance data={response} />;
  } catch (error) {
    logger.error('loggedInUserInfo failure', error);
    throw error;
  }
};

export default OtherHealthInsurancePage;
