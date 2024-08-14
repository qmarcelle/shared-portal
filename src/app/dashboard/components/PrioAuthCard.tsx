import Image from 'next/image';
import MedicalIcon from '../../../../../public/assets/medical.svg';
import { IComponent } from '../../../../components/IComponent';
import { Card } from '../../../../components/foundation/Card';
import { Spacer } from '../../../../components/foundation/Spacer';
import { StatusLabel } from '../../../../components/foundation/StatusLabel';

interface PriorAuthCardProps extends IComponent {
  priorAuthType: 'Medical' | 'Pharmacy' | 'Dental';
  priorAuthName: string;
  dateOfVisit: string;
  priorAuthStatus: 'Processed' | 'Denied' | 'Pending' | 'Approved';
  member: string;
}

export const PriorAuthCard = ({
  member,
  dateOfVisit,
  priorAuthStatus,
  priorAuthName,
  priorAuthType,
}: PriorAuthCardProps) => {
  function getSuccessStatus() {
    if (priorAuthStatus == 'Approved' || priorAuthStatus == 'Processed') {
      return 'success';
    } else if (priorAuthStatus == 'Denied') {
      return 'error';
    } else {
      return 'neutral';
    }
  }

  return (
    <Card
      className="cursor-pointer"
      type="elevated"
      key={priorAuthName + priorAuthType}
    >
      <div className=" flex-row align-top m-4">
        <div className="flex">
          <Image src={MedicalIcon} className="icon" alt="Medical" />
          <Spacer axis="horizontal" size={8} />
          <span className="font-bold" style={{ color: 'var(--primary-color)' }}>
            {priorAuthName}
          </span>
        </div>
        <Spacer size={16} />
        <div className="flex flex-col items-start">
          <StatusLabel label={priorAuthStatus} status={getSuccessStatus()} />
          <Spacer size={8} />
          <span className="body-1">
            Visited on {dateOfVisit}, For {member}
          </span>
        </div>
      </div>
    </Card>
  );
};
