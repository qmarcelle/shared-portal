import { auth } from '@/app/(system)/auth';
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
  if (userRole && !checkPersonalRepAccess(userRole)) {
    redirect('/dashboard');
  } else {
    const representativeDetails = await getPersonalRepresentativeData();
    return (
      <PersonalRepresentativeAccess
        representativeDetails={representativeDetails?.data}
      />
    );
  }
};

export default PersonalRepresentativePage;
