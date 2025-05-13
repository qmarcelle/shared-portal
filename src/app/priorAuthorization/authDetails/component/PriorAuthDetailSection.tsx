import { MemberPriorAuthDetail } from '@/app/priorAuthorization/models/priorAuthData';
import { Column } from '../../../../components/foundation/Column';
import { Spacer } from '../../../../components/foundation/Spacer';
import { IComponent } from '../../../../components/IComponent';
import { PriorAuthDetailItem } from './PriorAuthDetailItem';

interface priorauthDetailsProps extends IComponent {
  priorAuthDetail: MemberPriorAuthDetail;
}

export const PriorAuthDetailsSection = ({
  priorAuthDetail,
}: priorauthDetailsProps) => {
  return (
    <Column className="max-sm:m-4">
      <PriorAuthDetailItem authInfo={priorAuthDetail} />
      <Spacer size={16} />
    </Column>
  );
};
