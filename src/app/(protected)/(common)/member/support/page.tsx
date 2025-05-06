import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/app/(system)/auth';
import { Metadata } from 'next';
import Support from '.';
import { getSupportData } from './actions/getSupportData';

export const metadata: Metadata = {
  title: 'Support',
};

const SupportPage = async () => {
  const result = await getSupportData();
  const quantumHealthEligGroups = '130430,82039,130504,90750,82025';
  const session = await auth();
  const memberDetails = await getLoggedInMember(session);

  const quantumHealthEnabled = quantumHealthEligGroups
    .split(',')
    .includes(memberDetails.groupId);
  return (
    <Support data={result.data!} quantumHealthEnabled={quantumHealthEnabled} />
  );
};

export default SupportPage;
