import { CalendarField } from '@/components/foundation/CalendarField';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { useFormContext } from 'react-hook-form';
import { TerminatePolicyEnum } from '../../models/terminatePolicyEnum';
import { IHBCSchema } from '../../rules/schema';

type Props = {
  formId: number;
  type?: 'medical' | 'dental' | 'vision';
  selections: TerminatePolicyEnum[];
  updateSelections: (val: TerminatePolicyEnum) => void;
};

export const CancelPolicyForm = ({
  formId,
  type,
  selections,
  updateSelections,
}: Props) => {
  const {
    register,
    formState: { errors },
    getValues,
  } = useFormContext<IHBCSchema>();

  return (
    <>
      {selections.includes(TerminatePolicyEnum.cancelMedicalPolicy) &&
        type &&
        type == 'medical' && (
          <Column className="gap-2">
            {/* {type && type == 'medical' && ( */}
            <Row className="gap-6">
              <CalendarField
                otherProps={register(
                  `terminatePolicy.cancelMedicalPolicy.terminationDate`,
                )}
                label="Requested Cancellation Date:"
                isSuffixNeeded={true}
                initValue={getValues(
                  `terminatePolicy.cancelMedicalPolicy.terminationDate`,
                )}
                errors={[
                  errors.terminatePolicy?.cancelMedicalPolicy?.terminationDate
                    ?.message,
                ]}
              />
              <Column className="w-full">
                <TextField
                  otherProps={register(
                    `terminatePolicy.cancelMedicalPolicy.terminationReason`,
                  )}
                  label={`Reason For Medical Cancellation :`}
                  errors={[
                    errors.terminatePolicy?.cancelMedicalPolicy
                      ?.terminationReason?.message,
                  ]}
                />
              </Column>
            </Row>

            <Row className="gap-6">
              <Checkbox
                value="keepdentalvisionpolicy"
                selected={selections.includes(
                  TerminatePolicyEnum.keepDentalVisionPolicy,
                )}
                callback={() => {
                  // unregister('removeDeps.spouse');
                  updateSelections(TerminatePolicyEnum.keepDentalVisionPolicy);
                  if (
                    selections.includes(TerminatePolicyEnum.cancelVisionPolicy)
                  )
                    updateSelections(TerminatePolicyEnum.cancelVisionPolicy);
                  if (
                    selections.includes(TerminatePolicyEnum.cancelDentalPolicy)
                  )
                    updateSelections(TerminatePolicyEnum.cancelDentalPolicy);
                }}
                label="Keep Dental/Vision Policy"
              />
            </Row>
            <Row className="gap-6">
              <TextBox text="A new policy will be issued for spouse/dependents active on the policy. A new ID card will be mailed." />
            </Row>
          </Column>
        )}
      {selections.includes(TerminatePolicyEnum.cancelDentalPolicy) &&
        type &&
        type == 'dental' && (
          <Column className="gap-2">
            <Row className="gap-6">
              <CalendarField
                otherProps={register(
                  `terminatePolicy.cancelDentalPolicy.terminationDate`,
                )}
                label="Requested Cancellation Date:"
                isSuffixNeeded={true}
                initValue={getValues(
                  `terminatePolicy.cancelDentalPolicy.terminationDate`,
                )}
                errors={[
                  errors.terminatePolicy?.cancelDentalPolicy?.terminationDate
                    ?.message,
                ]}
              />
              <Column className="w-full">
                <TextField
                  otherProps={register(
                    `terminatePolicy.cancelDentalPolicy.terminationReason`,
                  )}
                  label={`Reason For Dental Cancellation :`}
                  errors={[
                    errors.terminatePolicy?.cancelDentalPolicy
                      ?.terminationReason?.message,
                  ]}
                />
              </Column>
            </Row>
          </Column>
        )}
      {selections.includes(TerminatePolicyEnum.cancelVisionPolicy) &&
        type &&
        type == 'vision' && (
          <Column className="gap-2">
            <Row className="gap-6">
              <CalendarField
                otherProps={register(
                  `terminatePolicy.cancelVisionPolicy.terminationDate`,
                )}
                label="Requested Cancellation Date:"
                isSuffixNeeded={true}
                initValue={getValues(
                  `terminatePolicy.cancelVisionPolicy.terminationDate`,
                )}
                errors={[
                  errors.terminatePolicy?.cancelVisionPolicy?.terminationDate
                    ?.message,
                ]}
              />
              <Column className="w-full">
                <TextField
                  otherProps={register(
                    `terminatePolicy.cancelVisionPolicy.terminationReason`,
                  )}
                  label={`Reason For Vision Cancellation :`}
                  errors={[
                    errors.terminatePolicy?.cancelVisionPolicy
                      ?.terminationReason?.message,
                  ]}
                />
              </Column>
            </Row>
          </Column>
        )}
    </>
  );
};
