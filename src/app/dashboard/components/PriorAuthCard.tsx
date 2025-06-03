import { getAuthStatus } from '@/app/priorAuthorization/utils/authStatus';
import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { StatusLabel } from '@/components/foundation/StatusLabel';
import { encrypt } from '@/utils/encryption';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MedicalIcon from '../../../../public/assets/medical.svg';
import { DashboardPriorAuthDetails } from '../models/priorAuth_details';

interface PriorAuthCardProps extends IComponent {
  priorAuth: DashboardPriorAuthDetails;
}

export const PriorAuthCard = ({ priorAuth }: PriorAuthCardProps) => {
  const router = useRouter();
  const navigateToPriorAuthDetails = (referenceId: string) => {
    const encryptedReferenceID = encrypt(referenceId);
    router.push(
      `/priorAuthorization/authDetails?referenceId=${encryptedReferenceID}`,
    );
  };

  return (
    <Card
      className="cursor-pointer"
      type="elevated"
      key={priorAuth.referenceId}
      tabIndex={0}
      onClick={() => navigateToPriorAuthDetails(priorAuth.referenceId ?? '')}
    >
      <div className=" flex-row align-top m-4">
        <div className="flex">
          <Image src={MedicalIcon} className="icon" alt="Medical" />
          <Spacer axis="horizontal" size={8} />
          <span className="font-bold" style={{ color: 'var(--primary-color)' }}>
            {priorAuth.priorAuthName}
          </span>
        </div>
        <Spacer size={16} />
        <div className="flex flex-col items-start">
          <StatusLabel
            label={priorAuth.priorAuthStatus}
            status={getAuthStatus(priorAuth.priorAuthStatus)}
          />
          <Spacer size={8} />
          <span className="body-1">
            Visited on {priorAuth.dateOfVisit}, For {priorAuth.member}
          </span>
        </div>
      </div>
    </Card>
  );
};
