import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { ProviderContactInfoDetails } from '../models/provider_contact_info_details';
import { DependentProviderInfoItem } from './DependentProviderInfoItem';

interface ProviderContactInformationProps extends IComponent {
  icon?: JSX.Element;
  providerContactInfoDetails: ProviderContactInfoDetails[];
}

export const ProviderContactInformation = ({
  providerContactInfoDetails,
}: ProviderContactInformationProps) => {
  return (
    <Column>
      {providerContactInfoDetails.slice(0, 5).map((item) => (
        <DependentProviderInfoItem key={item.memberName} providerInfo={item} />
      ))}
      <Spacer size={16} />
    </Column>
  );
};
