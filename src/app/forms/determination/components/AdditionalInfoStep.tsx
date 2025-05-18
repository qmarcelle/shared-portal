'use client';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Spacer } from '@/components/foundation/Spacer';
import { TextArea } from '@/components/foundation/TextArea';
import { TextBox } from '@/components/foundation/TextBox';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdditionalInfoStep = ({ setValue, watch }: any) => {
  const expeditedValue = watch!('expeditedDecision', false);

  return (
    <div className="formBoundary" style={{ padding: '16px' }}>
      <div className="p-2 bg-primary">
        <TextBox className="text-white" text="Additional Information" />
      </div>
      <Spacer size={32} />
      <TextBox
        type="body-1"
        className="font-bold"
        text="Additional information we should consider"
      />
      <TextArea
        placeholder=""
        onChange={(event) =>
          setValue('additionalInfo', event.target.value.toString())
        }
        className="min-h-20 formBoundary"
      />

      <TextBox
        type="body-1"
        text="Important Note: Expedited Decisions"
        className="font-bold"
      />
      <Spacer size={16} />
      <TextBox
        className="body-1"
        text="Do you or your prescriber believe that waiting 72 hours or more for a decision could seriously harm your life, health, or ability to regain maximum function?"
      />
      <Spacer size={16} />
      <Checkbox
        id="expeditedDecision"
        label="CHECK THIS BOX IF YOU BELIEVE YOU NEED A DECISION WITHIN 24 HOURS. Please follow the supporting information instructions below."
        onChange={(value) => setValue('expeditedDecision', value)}
        checked={!!expeditedValue}
        className={'forms-checkbox-container'}
        checkProps={'forms-checkbox'}
        classProps={'forms-checkbox-label'}
      />
    </div>
  );
};

export default AdditionalInfoStep;
