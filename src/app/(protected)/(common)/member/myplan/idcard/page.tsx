import { Metadata } from 'next';
import GlobalIDCard from '.';
import { getMemberIdCardData } from './actions/getMemberIdCard';

export const metadata: Metadata = {
  title: 'ID Card',
};

const MemberIdCardPage = async () => {
  const result = await getMemberIdCardData();
  return <GlobalIDCard data={result.data!} />;
};

export default MemberIdCardPage;
