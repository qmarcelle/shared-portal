'use client';
import { MemberPriorAuthDetail } from '@/app/priorAuthorization/models/priorAuthData';
import { Column } from '../../../../components/foundation/Column';
import { Spacer } from '../../../../components/foundation/Spacer';
import { IComponent } from '../../../../components/IComponent';
import { usePriorAuthStore } from '../../store/priorAuthStore';
import { PriorAuthDetailItem } from './PriorAuthDetailItem';

interface priorAuthDetailsProps extends IComponent {
  priorAuthDetail: MemberPriorAuthDetail | null;
  contact: string;
}

export const PriorAuthDetailsSection = ({
  priorAuthDetail,
  contact,
}: priorAuthDetailsProps) => {
  const { selectedPriorAuth } = usePriorAuthStore();
  console.log(
    'PriorAuthDetailsSection - selectedPriorAuth:',
    JSON.stringify(selectedPriorAuth),
  );
  console.log(
    'PriorAuthDetailsSection - priorAuthDetail:',
    JSON.stringify(priorAuthDetail),
  );
  return (
    <Column className="max-sm:m-4">
      <PriorAuthDetailItem
        authInfo={selectedPriorAuth ?? priorAuthDetail ?? null}
        contact={contact}
      />
      <Spacer size={16} />
    </Column>
  );
};
