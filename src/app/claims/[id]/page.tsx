import { Metadata } from 'next';
import ClaimDetails from '.';
import { getClaimDetailsData } from '../actions/getClaimsDetails';

export const metadata: Metadata = {
  title: 'Claim Detail',
};

const ClaimsDetailPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string };
}) => {
  const { id } = params;
  const claimType = searchParams.type;
  const result = await getClaimDetailsData(id, claimType);
  return <ClaimDetails data={result.data!} />;
};

export default ClaimsDetailPage;
