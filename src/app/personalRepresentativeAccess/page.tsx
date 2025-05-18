import { auth } from '@/auth';
import { checkPersonalRepAccess } from '@/utils/getRole';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PersonalRepresentativeAccess from '.';
import { getPersonalRepresentativeData } from './actions/getPersonalRepresentativeData';

export const metadata: Metadata = {
  title: 'Personal Representative Access',
};

const PersonalRepresentativePage = async () => {
  const session = await auth();
  const userRole = session?.user.currUsr.role;
  const isImpersonated = session!.user.impersonated;
  if (userRole && !checkPersonalRepAccess(userRole)) {
    redirect('/dashboard');
  } else {
    const representativeDetails = await getPersonalRepresentativeData();
    return (
      <PersonalRepresentativeAccess
        representativeDetails={representativeDetails?.data}
        isImpersonated={isImpersonated}
      />
    );
  }
};

export default PersonalRepresentativePage;
