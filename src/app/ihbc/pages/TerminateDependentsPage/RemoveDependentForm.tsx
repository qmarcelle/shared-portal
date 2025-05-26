import { CalendarField } from '@/components/foundation/CalendarField';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextField } from '@/components/foundation/TextField';
import { useFormContext } from 'react-hook-form';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  formId: number;
  type?: 'spouse' | 'dep';
};

export const RemoveDependentForm = ({ formId, type }: Props) => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<IHBCSchema>();
  return (
    <Column className="gap-4">
      <Row className="gap-5">
        <TextField
          otherProps={
            type == 'spouse'
              ? register('removeDeps.spouse.lastName')
              : register(`removeDeps.dependents.${formId}.lastName`)
          }
          label="Last Name"
          errors={[
            type == 'spouse'
              ? errors.removeDeps?.spouse?.lastName?.message
              : errors.removeDeps?.dependents?.[formId]?.lastName?.message,
          ]}
        />
        <TextField
          otherProps={
            type == 'spouse'
              ? register('removeDeps.spouse.firstName')
              : register(`removeDeps.dependents.${formId}.firstName`)
          }
          label="First Name"
          errors={[
            type == 'spouse'
              ? errors.removeDeps?.spouse?.firstName?.message
              : errors.removeDeps?.dependents?.[formId]?.firstName?.message,
          ]}
        />
        <TextField
          maxLength={1}
          otherProps={
            type == 'spouse'
              ? register('removeDeps.spouse.mi')
              : register(`removeDeps.dependents.${formId}.mi`)
          }
          label="MI"
          errors={[
            type == 'spouse'
              ? errors.removeDeps?.spouse?.mi?.message
              : errors.removeDeps?.dependents?.[formId]?.mi?.message,
          ]}
        />
      </Row>
      <Row className="gap-5">
        <CalendarField
          otherProps={
            type == 'spouse'
              ? register('removeDeps.spouse.dob')
              : register(`removeDeps.dependents.${formId}.dob`)
          }
          label="Date Of Birth"
          isSuffixNeeded={true}
          initValue={getValues(
            type == 'spouse'
              ? 'removeDeps.spouse.dob'
              : `removeDeps.dependents.${formId}.dob`,
          )}
          errors={[
            type == 'spouse'
              ? errors.removeDeps?.spouse?.dob?.message
              : errors.removeDeps?.dependents?.[formId]?.dob?.message,
          ]}
        />
        <CalendarField
          otherProps={
            type == 'spouse'
              ? register('removeDeps.spouse.terminationDate')
              : register(`removeDeps.dependents.${formId}.terminationDate`)
          }
          label="Requested Terminated Date"
          isSuffixNeeded={true}
          initValue={getValues(
            type == 'spouse'
              ? 'removeDeps.spouse.terminationDate'
              : `removeDeps.dependents.${formId}.terminationDate`,
          )}
          errors={[
            type == 'spouse'
              ? errors.removeDeps?.spouse?.terminationDate?.message
              : errors.removeDeps?.dependents?.[formId]?.terminationDate
                  ?.message,
          ]}
        />
      </Row>
      <TextField
        otherProps={
          type == 'spouse'
            ? register('removeDeps.spouse.terminationReason')
            : register(`removeDeps.dependents.${formId}.terminationReason`)
        }
        label="Reason for Termination"
        errors={[
          type == 'spouse'
            ? errors.removeDeps?.spouse?.terminationReason?.message
            : errors.removeDeps?.dependents?.[formId]?.terminationReason
                ?.message,
        ]}
      />
    </Column>
  );
};
