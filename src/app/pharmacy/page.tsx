import { formatPharmacyClaims } from '@/utils/pharmacy_claims_formatter';
import { Metadata } from 'next';
import Pharmacy from '.';
import { getFormularyDetails } from './actions/getFormularyDetails';
import { getPharmacyClaims } from './actions/getPharmacyClaims';

export const metadata: Metadata = {
  title: 'Pharmacy Page',
};

const PharmacyPage = async () => {
  const [result, claimsData] = await Promise.all([
    getFormularyDetails(),
    getPharmacyClaims(),
  ]);

  const pharmacyClam = claimsData?.data!.pharmacyClaims?.pharmacyClaim;
  const claims = formatPharmacyClaims(pharmacyClam);

  return <Pharmacy data={result.data!} claims={claims} />;
};

export default PharmacyPage;
