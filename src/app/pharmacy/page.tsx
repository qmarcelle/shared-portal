import { formatPharmacyClaims } from '@/utils/pharmacy_claims_formatter';
import { Metadata } from 'next';
import Pharmacy from '.';
import { getFormularyDetails } from './actions/getFormularyDetails';
import { getPharmacyClaims } from './actions/getPharmacyClaims';
import { hipaaFindConsent } from './actions/hippaConsent';

export const metadata: Metadata = {
  title: 'Pharmacy Page',
};

const PharmacyPage = async () => {
  const [result, claimsData, hippaConsent] = await Promise.all([
    getFormularyDetails(),
    getPharmacyClaims(),
    hipaaFindConsent(),
  ]);

  const pharmacyClam = claimsData?.data!.pharmacyClaims?.pharmacyClaim;
  const claims = formatPharmacyClaims(pharmacyClam);

  let consent: string = 'insert';
  let hasUserConsent = hippaConsent.data?.consent ?? false;

  if (hippaConsent.status != 200 && hippaConsent.data?.consent == null) {
    consent = 'error';
  }
  if (hippaConsent.data?.consent && hippaConsent.data?.termDate) {
    const today: Date = new Date();
    const termDate: Date = new Date(hippaConsent.data?.termDate);
    if (today.getTime() > termDate.getTime()) {
      hasUserConsent = false;
      consent = 'update';
    }
  }

  return (
    <Pharmacy
      data={result.data!}
      claims={claims}
      hasUserConsent={hasUserConsent}
      consent={consent}
    />
  );
};

export default PharmacyPage;
