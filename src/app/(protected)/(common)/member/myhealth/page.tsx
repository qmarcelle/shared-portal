import { Metadata } from 'next';
import MyHealth from '.';
import { getMyHealthData } from './actions/getMyHealthData';

export const metadata: Metadata = {
  title: 'My Health',
};

const MyHealthPage = async () => {
  const result = await getMyHealthData();
  return <MyHealth data={result.data!} />;
};

export default MyHealthPage;
