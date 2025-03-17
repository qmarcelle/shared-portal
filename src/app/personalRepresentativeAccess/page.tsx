import { Metadata } from 'next';
import PersonalRepresentativeAccess from '.';
import { getPersonalRepresentativeData } from './actions/getPersonalRepresentativeData';

export const metadata: Metadata = {
  title: 'My Plan',
};

const PersonalRepresentativePage = async () => {
  const representativeDetails = await getPersonalRepresentativeData();
  return (
    <PersonalRepresentativeAccess
      representativeDetails={representativeDetails?.data}
    />
  );
};

export default PersonalRepresentativePage;
