import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { decrypt } from '@/utils/encryption';
import { logger } from '@/utils/logger';
import { Metadata } from 'next';
import ClaimDetails from '.';
import { getClaimDetailsData } from '../actions/getClaimsDetails';
import { getDocumentURL } from '../actions/getDocumentURL';

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
  const result = await getClaimDetailsData(decodeURIComponent(id), claimType);

  const session = await auth();
  const memberDetails = await getLoggedInMember(session);
  const docUrl = await getDocumentURL(
    decrypt(decodeURIComponent(id)),
    memberDetails?.subscriberId,
    session?.user.id || '',
  );
  logger.info('[CLAIMS] docURL :: ', docUrl);
  return <ClaimDetails claimData={result.data!} docURL={docUrl} />;
};

export default ClaimsDetailPage;
