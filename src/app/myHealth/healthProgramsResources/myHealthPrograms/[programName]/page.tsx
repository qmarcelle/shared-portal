import { Metadata } from 'next';
import MyHealthPrograms from '..';
import { getAccessCodeDetails } from '../actions/getCareTNAccessCode';

export const metadata: Metadata = {
  title: 'My Health Programs',
};

const MyHealthProgramsPage = async () => {
  const result = await getAccessCodeDetails();
  return <MyHealthPrograms data={result.data!} />;
};

export default MyHealthProgramsPage;
