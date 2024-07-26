import { ClaimStatus } from '@/app/(main)/authDetail/models/claim-status';
import { ClaimType } from '@/app/(main)/authDetail/models/claim-type';
import { PriorAuthDetailsSection } from '../../../components/composite/PriorAuthDetailSection';

const authDetail = () => {
  return (
    <section className="">
      <PriorAuthDetailsSection
        priorauthDetails={[
          {
            priorAuthDetailType: ClaimType.Medical,
            dateOfVisit: '12/06/2022',
            priorAuthDetailStatus: ClaimStatus.Denied,
            member: 'Chris Hall',
            PriorAuthReferenceId: 'ABC123456789',
            authInfo: [],
            priorAuthDetailName:
              'Continuous Positive Airway Pressure Machine (CPAP)',
            referredName: 'Anand Patel',
          },
        ]}
      />
    </section>
  );
};

export default authDetail;
