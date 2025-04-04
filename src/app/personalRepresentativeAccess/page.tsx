import { Metadata } from 'next';
import PersonalRepresentativeAccess from '.';
import { getPersonalRepresentativeData } from './actions/getPersonalRepresentativeData';

export const metadata: Metadata = {
  title: 'Personal Representative Access',
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
