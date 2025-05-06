/**
 * benefits/employerProvidedBenefits
 * Employer provided benefits
 */
export const metadata = {
  title: 'Employer provided benefits | Consumer Portal',
  description: 'Employer provided benefits',
};

import { auth } from '@/app/(system)/auth';
import { EmployerProvidedBenfitsPage } from '.';
import { getEmployerProvidedBenefits } from './actions/getEmployerProvidedBenefits';

const Page = async () => {
  const session = await auth();
  const result = await getEmployerProvidedBenefits(
    session!.user.currUsr!.plan!.memCk,
  );
  return (
    <EmployerProvidedBenfitsPage
      benefits={result.data}
      groupId={session?.user.currUsr?.plan!.grpId}
    />
  );
};

export default Page;
