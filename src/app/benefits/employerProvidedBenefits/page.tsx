import { auth } from '@/auth';
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
      visibilityRules={session?.user.vRules}
    />
  );
};

export default Page;
