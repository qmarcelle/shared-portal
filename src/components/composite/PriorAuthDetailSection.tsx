import { PriorAuthDetailsStatus } from '../../app/authDetail/models/priorAuthDetailStatus';
import { AuthItem } from '../composite/AuthItem';
import { Column } from '../foundation/Column';
import { Spacer } from '../foundation/Spacer';
import { IComponent } from '../IComponent';

interface priorauthDetailsProps extends IComponent {
  priorauthDetails: PriorAuthDetailsStatus[];
}

export const PriorAuthDetailsSection = ({
  priorauthDetails,
}: priorauthDetailsProps) => {
  return (
    <Column className="max-sm:m-4">
      {priorauthDetails.slice(0, 5).map((item) => (
        <AuthItem key={item.priorAuthDetailStatus} authInfo={item} />
      ))}
      <Spacer size={16} />
    </Column>
  );
};
