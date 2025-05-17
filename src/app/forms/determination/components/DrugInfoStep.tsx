import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DrugInfoStep = ({ register, errors }: any) => {
  return (
    <div className="formBoundary" style={{ padding: '16px' }}>
      <div className="p-2 bg-primary">
        <TextBox
          className="text-white"
          text="Name of prescription drug you are requesting"
        />
      </div>
      <Spacer size={32} />

      <TextField
        label="Drug Name"
        required={true}
        otherProps={register('drugName', {
          required: 'Drug Name is required',
        })}
        errors={
          errors.drugName?.message ? [String(errors.drugName.message)] : null
        }
      />

      <Spacer size={16} />

      <TextField
        label="Drug Strength"
        required={true}
        otherProps={register('drugStrength', {
          required: 'Drug strength is required',
        })}
        errors={
          errors.drugStrength?.message
            ? [String(errors.drugStrength.message)]
            : null
        }
      />

      <Spacer size={16} />

      <TextField
        label="Quantity Requested Per Month"
        otherProps={register('quantityRequested')}
        errors={
          errors.quantityRequested?.message
            ? [String(errors.quantityRequested.message)]
            : null
        }
      />

      <Spacer size={32} />

      <TextBox
        className="required-indicator"
        text="Indicates required fields"
        isRequiredLabel={true}
      />
    </div>
  );
};

export default DrugInfoStep;
