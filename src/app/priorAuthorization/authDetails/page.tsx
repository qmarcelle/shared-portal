import { PriorAuthDetailsSection } from '@/app/priorAuthorization/authDetails/component/PriorAuthDetailSection';
import { invokePhoneNumberAction } from '@/app/profileSettings/actions/profileSettingsAction';
import { decrypt } from '@/utils/encryption';
import { populatePriorAuthDetails } from './action/getPriorAuthDetail';

const priorAuthDetailPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const referenceId = searchParams.referenceId;
  const phoneNumber = await invokePhoneNumberAction();
  const priorAuthDetail = await populatePriorAuthDetails(decrypt(referenceId));
  return (
    <section className="">
      <PriorAuthDetailsSection
        priorAuthDetail={priorAuthDetail}
        contact={phoneNumber}
      />
    </section>
  );
};

export default priorAuthDetailPage;
