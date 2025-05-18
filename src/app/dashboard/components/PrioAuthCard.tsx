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
  priorauth: DashboardPriorAuthDetails;
}

export const PriorAuthCard = ({ priorauth }: PriorAuthCardProps) => {
  function getAuthStatus() {
    switch (priorauth.priorAuthStatus) {
      case 'Processed':
        return 'success';
      case 'Paid':
        return 'success';
      case 'Denied':
        return 'error';
      case 'Pending':
        return 'neutral';
      case 'Partial Approval':
        return 'partialapproval';
      case 'Approved':
        return 'success';
      default:
        return 'empty';
    }
  }
  const router = useRouter();
  const navigateToPriorAuthDetails = (referenceId: string) => {
    const encrptedReferenceID = encrypt(referenceId);
    router.push(
      `/priorAuthorization/authDetails?referenceId=${encrptedReferenceID}`,
    );
  };

  return (
    <Card
      className="cursor-pointer"
      type="elevated"
      key={priorauth.priorAuthName + priorauth.priorAuthType}
      tabIndex={0}
      onClick={() => navigateToPriorAuthDetails(priorauth.referenceId ?? '')}
    >
      <div className=" flex-row align-top m-4">
        <div className="flex">
          <Image src={MedicalIcon} className="icon" alt="Medical" />
          <Spacer axis="horizontal" size={8} />
          <span className="font-bold" style={{ color: 'var(--primary-color)' }}>
            {priorauth.priorAuthName}
          </span>
        </div>
        <Spacer size={16} />
        <div className="flex flex-col items-start">
          <StatusLabel
            label={priorauth.priorAuthStatus}
            status={getAuthStatus()}
          />
          <Spacer size={8} />
          <span className="body-1">
            Visited on {priorauth.dateOfVisit}, For {priorauth.member}
          </span>
        </div>
      </div>
    </Card>
  );
};
