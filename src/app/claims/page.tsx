import { Metadata } from 'next';
import SubmitClaim from '.';

export const metadata: Metadata = {
  title: 'Submit a claim',
};

const SubmitClaimPage = async () => {
  return <SubmitClaim />;
};

export default SubmitClaimPage;
