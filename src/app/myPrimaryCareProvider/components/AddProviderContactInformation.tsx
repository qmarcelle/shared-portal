import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { AddProviderContactInfoDetails } from '../models/add_provider_contact_info';
import { AddProviderInfoItem } from './AddProviderInfoItem';

interface AddProviderContactInformationProps extends IComponent {
  icon?: JSX.Element;
  addProviderContactInfoDetails: AddProviderContactInfoDetails[];
}

export const AddProviderContactInformation = ({
  addProviderContactInfoDetails,
}: AddProviderContactInformationProps) => {
  return (
    <Column>
      {addProviderContactInfoDetails.slice(0, 5).map((item) => (
        <AddProviderInfoItem
          key={item.providerMemberName}
          addProviderInfo={item}
        />
      ))}
      <Spacer size={16} />
    </Column>
  );
};
