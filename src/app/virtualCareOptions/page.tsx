import { auth } from '@/auth';
import { Metadata } from 'next';
import VirtualCareOptions from '.';

export const metadata: Metadata = {
  title: 'VirtualCareOptions',
};

const VirtualCareOptionsPage = async () => {
  const session = await auth();

  // Move visibility rules evaluation to server-side
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const visibilityRules = (session as any)?.visibilityRules;

  // Calculate DPP eligibility on server-side
  const isDPPEligible = !!(
    visibilityRules &&
    visibilityRules.diabetesPreventionEligible &&
    visibilityRules.teladocEligible &&
    !visibilityRules.fsaOnly &&
    !visibilityRules.terminated &&
    !visibilityRules.wellnessOnly &&
    visibilityRules.groupRenewalDateBeforeTodaysDate
  );

  return (
    <VirtualCareOptions sessionData={session} isDPPEligible={isDPPEligible} />
  );
};

export default VirtualCareOptionsPage;
