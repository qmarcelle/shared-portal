/**
 * authDetail
 * Auth detail
 */
export const metadata = {
  title: 'Auth detail | Consumer Portal',
  description: 'Auth detail'
};

import { ClaimStatus } from '@/app/(protected)/(common)/member/authDetail/models/claim-status';
import { ClaimType } from '@/app/(protected)/(common)/member/authDetail/models/claim-type';
import { PriorAuthDetailsSection } from '@/components/composite/PriorAuthDetailSection';

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
