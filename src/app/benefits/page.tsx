import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { Session } from 'next-auth';
import { invokePhoneNumberAction } from '../profileSettings/actions/profileSettingsAction';
import loadBenefits from './actions/loadBenefits';
import Benefits from './benefits';
import { BenefitsError } from './components/BenefitsError';
import { Delinquent } from './components/Delinquent';
import { getEmployerProvidedBenefits } from './employerProvidedBenefits/actions/getEmployerProvidedBenefits';
import { generateOtherBenefitsForUser } from './utils/createOtherBenefits';

export const metadata: Metadata = {
  title: 'Benefits',
};

const BenefitsAndCoveragePage = async () => {
  try {
    const session: Session | null = await auth();
    let enableEmployerBenefits = false;
    if (session === null) {
      return <BenefitsError />;
    }
    const userInfoData = await getLoggedInUserInfo(
      session!.user!.currUsr!.plan!.memCk,
    );

    const firstMember = userInfoData.members[0];
    const loadBenefitsData = await loadBenefits(firstMember);
    if (
      loadBenefitsData.status !== 200 ||
      loadBenefitsData.data === undefined
    ) {
      return <BenefitsError />;
    }
    const isDelinquent =
      session.user?.currUsr?.plan!.grpId == '127600' &&
      session.user?.vRules?.delinquent;

    if (isDelinquent) {
      return <Delinquent />;
    }

    const phoneNumber = await invokePhoneNumberAction();

    //To check the Eligibility Criteria for Employer Provided Benefits
    const employerProvidedBenefits = await getEmployerProvidedBenefits(
      session!.user.currUsr!.plan!.memCk,
    );
    if (employerProvidedBenefits.data?.length) enableEmployerBenefits = true;
    return (
      <Benefits
        memberInfo={userInfoData.members}
        benefitsBean={loadBenefitsData.data}
        otherBenefitItems={generateOtherBenefitsForUser(
          session.user.vRules!,
          enableEmployerBenefits,
        )}
        userGroupId={userInfoData.groupData.groupID}
        visibilityRules={session.user.vRules}
        phoneNumber={phoneNumber}
        loggedInMemeck={session!.user.currUsr!.plan!.memCk}
      />
    );
  } catch (error) {
    return <BenefitsError />;
  }
};

export default BenefitsAndCoveragePage;
