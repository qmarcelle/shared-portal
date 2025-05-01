import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClaimsPage } from '../components/ClaimsPage';
import { ClaimType } from '../models/app/ClaimType';

export const metadata: Metadata = {
  title: 'Claims | Member Portal',
  description: 'View and manage your claims',
};

interface Props {
  params: {
    type: string;
  };
}

export default function ClaimsTypePage({ params }: Props) {
  const type = params.type;
  const validTypes: string[] = Object.values(ClaimType).map<string>(
    (t: ClaimType): string => t.toLowerCase(),
  );

  if (!validTypes.includes(type.toLowerCase())) {
    notFound();
  }

  return <ClaimsPage claimType={type as ClaimType} />;
}
