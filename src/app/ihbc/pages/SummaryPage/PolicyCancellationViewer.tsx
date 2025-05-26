import { Column } from '@/components/foundation/Column';
import { LabelledData } from '../../components/LabelledData';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  policy: NonNullable<
    NonNullable<IHBCSchema>['terminatePolicy']
  >['terminatePrimaryApplicant'];
};

export const PolicyCancellationViewer = ({ policy }: Props) => {
  if (!policy) {
    return <></>;
  }
  return (
    <Column>
      <LabelledData label="Termination Date" value={policy.terminationDate} />
      <LabelledData
        label="Termination Reason"
        value={policy.terminationReason}
      />
    </Column>
  );
};
