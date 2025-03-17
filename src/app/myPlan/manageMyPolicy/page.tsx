import { Metadata } from 'next';
import ManageMyPolicy from '.';

export const metadata: Metadata = {
  title: 'ManageMyPolicy',
};

const UpdateSocialSecurityNumberPage = async () => {
  return <ManageMyPolicy />;
};

export default UpdateSocialSecurityNumberPage;
