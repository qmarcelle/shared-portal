'use client';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DrugInfoStep = ({ register, errors, setValue, watch }: any) => {
  const purchasedDrug = watch('purchasedDrug', false);
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
      <TextBox
        type="body-1"
        className="mr-2"
        text="Have you purchased the drug pending appeal?"
      />
      <Dropdown
        items={[
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ]}
        initialSelectedValue={''}
        onSelectCallback={(value: string) =>
          setValue('purchasedDrug', value === 'true')
        }
        className="input"
        maxWidth={'100%'}
        iconAlignment="right"
        scrollThreshold={20}
      />

      {purchasedDrug && (
        <>
          <Spacer size={16} />
          <CalendarField
            label="Date Purchased"
            type="date"
            valueCallback={(value: string) => {
              setValue('datePurchased', value);
            }}
            errors={
              errors.datePurchased?.message
                ? [String(errors.datePurchased.message)]
                : null
            }
            isSuffixNeeded={true}
            maxWidth={'12rem'}
            required={true}
          />

          <TextField
            label="Amount Paid $"
            required={true}
            otherProps={register('amountPaid', {
              required: 'Amount paid is required',
            })}
            errors={
              errors.amountPaid?.message
                ? [String(errors.amountPaid.message)]
                : null
            }
            maxWidth={'12rem'}
          />
          <Spacer size={16} />

          <TextField
            label="Name and telephone number of pharmacy"
            required={true}
            otherProps={register('pharmacyInfo', {
              required: 'Pharmacy information is required',
            })}
            errors={
              errors.pharmacyInfo?.message
                ? [String(errors.pharmacyInfo.message)]
                : null
            }
            maxWidth={'80%'}
          />
        </>
      )}

      {errors.purchasedDrug?.message && (
        <>
          <Spacer size={16} />
          <TextBox
            className="text-red-500"
            text={String(errors.purchasedDrug.message)}
          />
        </>
      )}
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
