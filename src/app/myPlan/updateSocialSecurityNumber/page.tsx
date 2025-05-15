import { auth } from '@/auth';
import { Metadata } from 'next';
import UpdateSocialSecurityNumber from '.';
import { getMemberSSNData } from './actions/getMemberSSNData';

export const metadata: Metadata = {
  title: 'UpdateSocialSecurityNumber',
};

const UpdateSocialSecurityNumberPage = async () => {
  const session = await auth();
  const isImpersonated = session!.user.impersonated;
  const result = await getMemberSSNData();
  return (
    <UpdateSocialSecurityNumber
      data={result.data!}
      isImpersonated={isImpersonated}
    />
  );
};

export default UpdateSocialSecurityNumberPage;
