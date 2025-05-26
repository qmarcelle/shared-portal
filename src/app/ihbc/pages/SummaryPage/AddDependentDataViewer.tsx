import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { LabelledData } from '../../components/LabelledData';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  dependent: NonNullable<
    NonNullable<IHBCSchema['addDeps']>['dependents']
  >[number];
};

export const AddDependentDataViewer = ({ dependent }: Props) => {
  return (
    <Column>
      <LabelledData label="First name" value={dependent.firstName} />
      <LabelledData label="Date of Birth" value={dependent.dob} />
      <LabelledData label="Relationship" value={dependent.relationship} />
      <LabelledData label="Gender" value={dependent.gender} />
      <LabelledData label="Tobacco Use" value={dependent.tobaccoUse} />
      <Divider />
    </Column>
  );
};
