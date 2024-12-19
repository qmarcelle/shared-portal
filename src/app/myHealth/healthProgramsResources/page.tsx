import { Metadata } from 'next';
import MyHealthProgramsResources from '.';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: 'My Health Programs Resources',
};

const MyHealthProgramsResourcesPage = async () => {
  const session = await auth();
  return <MyHealthProgramsResources visibilityRules={session?.user.vRules} />;
};

export default MyHealthProgramsResourcesPage;
