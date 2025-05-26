import { Button } from '@/components/foundation/Button';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { useFormContext } from 'react-hook-form';
import { HighlightedHeader } from '../../components/HighlightedHeader';
import { TerminatePolicyEnum } from '../../models/terminatePolicyEnum';
import { IHBCSchema } from '../../rules/schema';
import { useNavigationStore } from '../../stores/navigationStore';
import { useTerminatePolicyStore } from '../../stores/terminatePolicyStore';
import { CancelPolicyForm } from './CancelPolicyForm';
import { TerminatePolicyForm } from './TerminatePolicyForm';

export const TerminatePolicyPage = () => {
  const [allowedSelections, selections, updateSelections] =
    useTerminatePolicyStore((state) => [
      state.allowedSelections,
      state.selections,
      state.updateSelections,
    ]);

  //Form Validation
  const {
    control,
    unregister,
    formState: { isValid },
  } = useFormContext<IHBCSchema>();

  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);

  return (
    <Column className="gap-2">
      <HighlightedHeader text="Terminate Policy" />
      <TextBox text="if you would like to cancel your coverage, please complete the below information, You may cancel your medical policy and continue to keep your dental and/or vision policy.Or you can choose to cancel your dental or vision policy and keep your medical policy , " />
      <Column>
        <Checkbox
          value="terminateprimaryapplicant"
          selected={selections.includes(
            TerminatePolicyEnum.terminatePrimaryApplicant,
          )}
          callback={
            allowedSelections.includes(
              TerminatePolicyEnum.terminatePrimaryApplicant,
            )
              ? () => {
                  {
                    unregister('terminatePolicy.terminatePrimaryApplicant');
                    updateSelections(
                      TerminatePolicyEnum.terminatePrimaryApplicant,
                    );
                  }
                }
              : undefined
          }
          label="Terminate Primary Applicant"
        />
        {selections.includes(TerminatePolicyEnum.terminatePrimaryApplicant) && (
          <div className="ml-10">
            <TerminatePolicyForm type="terminateprimaryapplicant" formId={0} />
          </div>
        )}
      </Column>
      <Column>
        <Checkbox
          value="cancelmedicalpolicy"
          selected={selections.includes(
            TerminatePolicyEnum.cancelMedicalPolicy,
          )}
          callback={
            allowedSelections.includes(TerminatePolicyEnum.cancelMedicalPolicy)
              ? () => {
                  {
                    unregister('terminatePolicy.cancelMedicalPolicy');
                    updateSelections(TerminatePolicyEnum.cancelMedicalPolicy);
                  }
                }
              : undefined
          }
          label="Cancel Medical Policy (Coverage will be cancelled for all members)"
        />
        {selections.includes(TerminatePolicyEnum.cancelMedicalPolicy) && (
          <div className="ml-10">
            <CancelPolicyForm
              type="medical"
              formId={0}
              selections={selections}
              updateSelections={updateSelections}
            />
          </div>
        )}
      </Column>
      <Column>
        <Checkbox
          value="canceldentalpolicy"
          selected={selections.includes(TerminatePolicyEnum.cancelDentalPolicy)}
          callback={
            allowedSelections.includes(TerminatePolicyEnum.cancelDentalPolicy)
              ? () => {
                  {
                    unregister('terminatePolicy.cancelDentalPolicy');
                    updateSelections(TerminatePolicyEnum.cancelDentalPolicy);
                  }
                }
              : undefined
          }
          label="Cancel Dental Policy (Coverage will be cancelled for all members)"
        />
        {selections.includes(TerminatePolicyEnum.cancelDentalPolicy) && (
          <div className="ml-10">
            <CancelPolicyForm
              type="dental"
              formId={1}
              selections={selections}
              updateSelections={updateSelections}
            />
          </div>
        )}
      </Column>
      <Column>
        <Checkbox
          value="cancelvisionpolicy"
          selected={selections.includes(TerminatePolicyEnum.cancelVisionPolicy)}
          callback={
            allowedSelections.includes(TerminatePolicyEnum.cancelVisionPolicy)
              ? () => {
                  {
                    unregister('terminatePolicy.cancelVisionPolicy');
                    updateSelections(TerminatePolicyEnum.cancelVisionPolicy);
                  }
                }
              : undefined
          }
          label="Cancel Vision Policy (Coverage will be cancelled for all members)"
        />
        {selections.includes(TerminatePolicyEnum.cancelVisionPolicy) && (
          <div className="ml-10">
            <CancelPolicyForm
              type="vision"
              formId={2}
              selections={selections}
              updateSelections={updateSelections}
            />
          </div>
        )}
      </Column>
      <Row className="justify-between">
        <Button className="w-fit" callback={goBackWard} label="Back" />
        <Button
          className="w-fit"
          callback={isValid ? goForward : undefined}
          label="Next"
        />
      </Row>
    </Column>
  );
};
