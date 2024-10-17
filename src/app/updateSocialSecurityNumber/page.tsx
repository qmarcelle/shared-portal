import { Metadata } from 'next';
import UpdateSocialSecurityNumber from '.';

export const metadata: Metadata = {
  title: 'UpdateSocialSecurityNumber',
};

const UpdateSocialSecurityNumberPage = async () => {
  return <UpdateSocialSecurityNumber />;
};

export default UpdateSocialSecurityNumberPage;
