import { CalendarField } from '@/components/foundation/CalendarField';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { useFormContext } from 'react-hook-form';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  formId: number;
  type?: 'terminateprimaryapplicant' | 'cancelpolicy';
};

export const TerminatePolicyForm = ({ formId, type }: Props) => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<IHBCSchema>();

  return (
    <Column className="gap-2">
      <Row className="gap-6">
        <CalendarField
          otherProps={register(
            'terminatePolicy.terminatePrimaryApplicant.terminationDate',
          )}
          label="Termination Effective Date:"
          isSuffixNeeded={true}
          initValue={getValues(
            'terminatePolicy.terminatePrimaryApplicant.terminationDate',
          )}
          errors={[
            errors.terminatePolicy?.terminatePrimaryApplicant?.terminationDate
              ?.message,
          ]}
        />
        <Column className="w-full">
          <Dropdown
            label="Reason For Termination :"
            initialSelectedValue={
              getValues(
                `terminatePolicy.terminatePrimaryApplicant.terminationReason`,
              ) ?? 'Select For Spouse'
            }
            items={[
              {
                label: 'Medicare Eligible',
                value: 'Medicare Eligible',
              },
              {
                label: 'Death',
                value: 'Death',
              },
              {
                label: 'Enrolled in Group Coverage',
                value: 'Enrolled in Group Coverage',
              },
              {
                label: 'Other',
                value: 'Other',
              },
            ]}
            onSelectCallback={(val) => {
              register(
                `terminatePolicy.terminatePrimaryApplicant.terminationReason`,
              ).onChange({
                target: {
                  name: `terminatePolicy.terminatePrimaryApplicant.terminationReason`,
                  value: val,
                },
              });
            }}
          />
        </Column>
      </Row>
    </Column>
  );
};
