import { MemberPriorAuthDetail } from '@/app/priorAuthorization/models/priorAuthData';
import { usePriorAuthStore } from '@/app/priorAuthorization/store/priorAuthStore'; // Adjust the path as needed
import { getAuthStatus } from '@/app/priorAuthorization/utils/authStatus';
import { mapToDashboardAuth } from '@/app/priorAuthorization/utils/priorAuthMapper';
import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { StatusLabel } from '@/components/foundation/StatusLabel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MedicalIcon from '../../../../public/assets/medical.svg';

interface PriorAuthCardProps extends IComponent {
  priorAuth: MemberPriorAuthDetail;
}

export const PriorAuthCard = ({ priorAuth }: PriorAuthCardProps) => {
  const router = useRouter();
  const priorAuthStore = usePriorAuthStore();
  const navigateToPriorAuthDetails = () => {
    priorAuthStore.setSelectedPriorAuth(priorAuth);
    router.push('/priorAuthorization/authDetails');
  };

  const dashboardAuth = mapToDashboardAuth(priorAuth);

  return (
    <Card
      className="cursor-pointer"
      type="elevated"
      key={dashboardAuth.referenceId}
      tabIndex={0}
      onClick={navigateToPriorAuthDetails}
    >
      <div className=" flex-row align-top m-4">
        <div className="flex">
          <Image src={MedicalIcon} className="icon" alt="Medical" />
          <Spacer axis="horizontal" size={8} />
          <span className="font-bold" style={{ color: 'var(--primary-color)' }}>
            {dashboardAuth.priorAuthName}
          </span>
        </div>
        <Spacer size={16} />
        <div className="flex flex-col items-start">
          <StatusLabel
            label={dashboardAuth.priorAuthStatus}
            status={getAuthStatus(dashboardAuth.priorAuthStatus)}
          />
          <Spacer size={8} />
          <span className="body-1">
            Visited on {dashboardAuth.dateOfVisit}, For {dashboardAuth.member}
          </span>
        </div>
      </div>
    </Card>
  );
};
