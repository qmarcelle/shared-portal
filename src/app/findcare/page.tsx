import { Metadata } from 'next';
import FindCare from '.';
import { getFindCareData } from './actions/getFindCareData';

export const metadata: Metadata = {
  title: 'FindCare',
};

const FindCarePage = async () => {
  const findCareData = await getFindCareData();
  return <FindCare findCareData={findCareData.data!} />;
};

export default FindCarePage;
