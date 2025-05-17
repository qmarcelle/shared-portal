'use client';

import { CalendarField } from '@/components/foundation/CalendarField';
import { Checkbox } from '@/components/foundation/Checkbox';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextArea } from '@/components/foundation/TextArea';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdditionalInfoStep = ({ setValue, watch, errors, register }: any) => {
  const expeditedValue = watch!('expeditedDecision', false);

  return (
    <div className="formBoundary" style={{ padding: '16px' }}>
      <strong>
        <TextBox
          className="body-1"
          text="Important Note: Expedited Decisions"
        />
      </strong>
      <Spacer size={16} />
      <TextBox
        className="body-1"
        text="If you or your prescriber believes that waiting 7 days for a standard decision could seriously harm your life, health, or ability to regain maximum function, you can ask for an expedited (fast) decision. If your prescriber indicates that waiting 7 days could seriously harm your health, we will automatically give you a decision within 72 hours. If you do not obtain your prescriber's support for an expedited appeal, we will decide if your case requires a fast decision. You cannot request an expedited appeal if you are asking us to pay you back for a drug you already received."
      />
      <Spacer size={16} />
      <Checkbox
        id="expeditedDecision"
        label="CHECK THIS BOX IF YOU BELIEVE YOU NEED A DECISION WITHIN 24 HOURS."
        onChange={(value) => setValue('expeditedDecision', value)}
        checked={!!expeditedValue}
        className={'forms-checkbox-container'}
        checkProps={'forms-checkbox'}
        classProps={'forms-checkbox-label'}
      />
      <Spacer size={16} />
      <strong>
        <TextBox
          className="body-1"
          text="If you have a supporting statement from your prescriber, attach it to this request."
        />
      </strong>
      <Spacer size={16} />
      <RichText
        spans={[
          <strong key="1">Please explain your reasons for appealing.</strong>,
          ' Attach additional pages, if necessary. Attach any additional information you believe may help your case, such as a statement from your prescriber and relevant medical records. You may want to refer to the explanation we provided in the Notice of Denial of Medicare Prescription Drug Coverage.',
        ]}
      />
      <Spacer size={16} />
      <TextBox
        className="body-1"
        text="Additional information we should consider"
      />
      <TextArea
        placeholder=""
        onChange={(event) =>
          setValue('additionalInfo', event.target.value.toString())
        }
      />
      <Spacer size={8} />
      <div className="p-2 bg-primary">
        <TextBox
          className="text-white"
          text="Signature of person requesting the appeal (the enrollee, or the enrollee's prescriber or representative):"
        />
      </div>
      <Spacer size={16} />

      <TextField
        label="Signature"
        required={true}
        otherProps={register('signature', {
          required: 'signature is required',
        })}
        errors={errors.signature ? [errors.signature.message] : null}
        maxWidth={'60%'}
      />
      <Spacer size={16} />
      <CalendarField
        label="Date"
        type="date"
        valueCallback={(value: string) => {
          setValue('signatureDate', value);
        }}
        errors={
          errors.signatureDate?.message
            ? [String(errors.signatureDate.message)]
            : null
        }
        isSuffixNeeded={true}
        maxWidth={'12rem'}
        required={true}
      />
    </div>
  );
};

export default AdditionalInfoStep;
