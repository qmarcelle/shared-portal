/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable quotes */
'use client';

import { Checkbox } from '@/components/foundation/Checkbox';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const RequestTypeStep = ({ errors, setValue, watch }: any) => {
  const checkboxes = [
    {
      id: 'notOnList',
      label:
        "I need a drug that is not on the plan's list of covered drugs (formulary exception).",
    },
    {
      id: 'removedFromList',
      label:
        "I have been using a drug that was previously included on the plan's list of covered drugs, but is being removed or was removed from this list during the plan year (formulary exception).",
    },
    {
      id: 'priorAuthorization',
      label:
        'I request prior authorization for the drug my prescriber has prescribed.',
    },
    {
      id: 'tryAnotherDrug',
      label:
        'I request an exception to the requirement that I try another drug before I get the drug my prescriber prescribed (formulary exception).',
    },
    {
      id: 'quantityLimit',
      label:
        "I request an exception to the plan's limit on the number of pills (quantity limit) I can receive so that I can get the number of pills my prescriber prescribed (formulary exception).",
    },
    {
      id: 'lowerCopayment',
      label:
        'My drug plan charges a higher copayment for the drug my prescriber prescribed than it charges for another drug that treats my condition, and I want to pay the lower copayment (tiering exception).',
    },
    {
      id: 'copaymentTierChange',
      label:
        'I have been using a drug that was previously included on a lower copayment tier, but is being moved to or was moved to a higher copayment tier (tiering exception).',
    },
    {
      id: 'higherCopayment',
      label:
        'My drug plan charged me a higher copayment for a drug than it should have.',
    },
    {
      id: 'reimbursement',
      label:
        'I want to be reimbursed for a covered prescription drug that I paid for out of pocket.',
    },
  ];

  // Watch the entire requestType object
  const requestTypeValues = watch!('requestType', {});

  // Compute the selected labels dynamically
  const selectedRequestTypes = checkboxes
    .filter((checkbox) => requestTypeValues[checkbox.id])
    .map((checkbox) => checkbox.label);

  // Update the aggregated field in the form state
  setValue('selectedRequestTypes', selectedRequestTypes);

  return (
    <div className="formBoundary" style={{ padding: '16px' }}>
      <div className="p-2 bg-primary">
        <TextBox
          className="text-white"
          text="Type of Coverage Determination Request"
        />
      </div>
      <Spacer size={16} />
      <div>
        {checkboxes.map((checkbox) => (
          <Checkbox
            key={checkbox.id}
            label={checkbox.label}
            onChange={(checked: boolean) =>
              setValue(`requestType.${checkbox.id}`, checked)
            }
            checked={!!requestTypeValues[checkbox.id]} // Use watched values
            className={'forms-checkbox-container'}
            checkProps={'forms-checkbox'}
            classProps={'forms-checkbox-label'}
          />
        ))}
      </div>
      {errors?.requestType && (
        <p className="text-red-500">{errors.requestType.message}</p>
      )}
    </div>
  );
};

export default RequestTypeStep;
