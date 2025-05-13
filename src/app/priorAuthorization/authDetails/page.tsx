import { PriorAuthDetailsSection } from '@/app/priorAuthorization/authDetails/component/PriorAuthDetailSection';
import { populatePriorAuthDetails } from '../actions/memberPriorAuthorization';

const priorAuthDetailPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const referenceId = searchParams.referenceId;
  const priorAuthDetail = await populatePriorAuthDetails(referenceId);
  return (
    <section className="">
      <PriorAuthDetailsSection priorAuthDetail={priorAuthDetail} />
    </section>
  );
};

export default priorAuthDetailPage;
