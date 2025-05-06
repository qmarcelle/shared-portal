import { auth } from '@/app/(system)/auth';
import { Metadata } from 'next';
import MyHealthProgramsResources from '.';

export const metadata: Metadata = {
  title: 'My Health Programs Resources',
};

const MyHealthProgramsResourcesPage = async () => {
  const session = await auth();
  return <MyHealthProgramsResources visibilityRules={session?.user.vRules} />;
};

export default MyHealthProgramsResourcesPage;
