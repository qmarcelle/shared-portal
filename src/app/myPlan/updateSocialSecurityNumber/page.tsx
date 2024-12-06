import { Metadata } from 'next';
import UpdateSocialSecurityNumber from '.';
import { getMemberSSNData } from './actions/getMemberSSNData';

export const metadata: Metadata = {
  title: 'UpdateSocialSecurityNumber',
};

const UpdateSocialSecurityNumberPage = async () => {
  const result = await getMemberSSNData();
  return <UpdateSocialSecurityNumber data={result.data!} />;
};

export default UpdateSocialSecurityNumberPage;
