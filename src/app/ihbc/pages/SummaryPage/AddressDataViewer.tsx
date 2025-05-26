import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { LabelledData } from '../../components/LabelledData';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  address:
    | NonNullable<
        NonNullable<IHBCSchema['changePersonalInfo']>['changeAddress']
      >['residence']
    | NonNullable<
        NonNullable<IHBCSchema['changePersonalInfo']>['changeAddress']
      >['billing'];
};

export const AddressDataViewer = ({ address }: Props) => {
  if (!address) {
    return <></>;
  }
  return (
    <Column>
      <LabelledData label="Street" value={address?.street} />
      <LabelledData label="City" value={address?.city} />
      <LabelledData label="State" value={address?.state} />
      <LabelledData label="Zip" value={address?.zip} />
      <LabelledData label="County" value={(address as any)?.county} />
      <Divider />
    </Column>
  );
};
