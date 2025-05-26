import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { LabelledData } from '../../components/LabelledData';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  dependent:
    | NonNullable<NonNullable<IHBCSchema['removeDeps']>['dependents']>[number]
    | undefined;
};

export const RemoveDependentDataViewer = ({ dependent }: Props) => {
  if (!dependent) {
    return <></>;
  }
  return (
    <Column>
      <LabelledData label="First Name" value={dependent.firstName} />
      <LabelledData label="Last Name" value={dependent.lastName} />
      <LabelledData label="MI" value={dependent.mi} />
      <LabelledData label="Date Of Birth" value={dependent.dob} />
      <LabelledData
        label="Termination Date"
        value={dependent.terminationDate}
      />
      <LabelledData
        label="Termination Reason"
        value={dependent.terminationReason}
      />
      <Divider />
    </Column>
  );
};
