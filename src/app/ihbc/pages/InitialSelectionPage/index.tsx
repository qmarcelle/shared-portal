import { Button } from '@/components/foundation/Button';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { InitialSelectionEnum } from '../../models/InitialSelectionEnum';
import { DependentsContext } from '../../providers/dependentsProvider';
import { IHBCSchema } from '../../rules/schema';
import { useInitialSelectionStore } from '../../stores/initialSelectionStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useSelectiveValidation } from '../../utils/useSelectiveValidation';
import { ChangePersonalInfoForm } from './ChangePersonalInfoForm';

const InitialSelectionPage = () => {
  const [allowedSelections, selections, updateSelections] =
    useInitialSelectionStore((state) => [
      state.allowedSelections,
      state.selections,
      state.updateSelections,
    ]);

  const [goForward] = useNavigationStore((state) => [state.goForward]);

  const { unregister, setValue } = useFormContext<IHBCSchema>();

  const isValid = useSelectiveValidation<IHBCSchema>('changePersonalInfo');

  const { members } = useContext(DependentsContext);

  useEffect(() => {
    if (!selections.includes(InitialSelectionEnum.changeMyBenefits)) {
      unregister('addDeps');
    } else {
      setValue(
        'addDeps.existingDeps',
        members.map((item) => ({
          firstName: `${item.firstName}`,
          dob: item.dob,
          relationship: item.relationship == 'M' ? 'Self' : '0',
          tobaccoUse: '0' as const,
          gender: item.gender == 'M' ? ('M' as const) : ('F' as const),
        })),
        {
          shouldValidate: false,
        },
      );
    }
  }, [selections]);

  return (
    <Column className="gap-4">
      <div className="p-2 bg-primary">
        <TextBox
          className="text-white"
          text="What changes would you like to make? Check all that apply."
        />
      </div>
      <Column className="gap-2">
        <Checkbox
          value="termPolicy"
          callback={
            allowedSelections.includes(InitialSelectionEnum.terminatePolicy)
              ? () => updateSelections(InitialSelectionEnum.terminatePolicy)
              : undefined
          }
          selected={selections.includes(InitialSelectionEnum.terminatePolicy)}
          label="Terminate Policy"
        />
        <Checkbox
          value="addDeps"
          callback={
            allowedSelections.includes(InitialSelectionEnum.addDeps)
              ? () => updateSelections(InitialSelectionEnum.addDeps)
              : undefined
          }
          selected={selections.includes(InitialSelectionEnum.addDeps)}
          label="Add Dependents"
        />
        <Checkbox
          value="termDeps"
          callback={
            allowedSelections.includes(InitialSelectionEnum.terminateDeps)
              ? () => updateSelections(InitialSelectionEnum.terminateDeps)
              : undefined
          }
          selected={selections.includes(InitialSelectionEnum.terminateDeps)}
          label="Terminate Dependents"
        />
        <Checkbox
          value="changBenefits"
          callback={
            allowedSelections.includes(InitialSelectionEnum.changeMyBenefits)
              ? () => updateSelections(InitialSelectionEnum.changeMyBenefits)
              : undefined
          }
          selected={selections.includes(InitialSelectionEnum.changeMyBenefits)}
          label="Change My Benefits"
        />
        <div>
          <Checkbox
            value="changPernslInfo"
            callback={
              allowedSelections.includes(
                InitialSelectionEnum.changePersonalInfo,
              )
                ? () => {
                    {
                      unregister('changePersonalInfo');
                      updateSelections(InitialSelectionEnum.changePersonalInfo);
                    }
                  }
                : undefined
            }
            selected={selections.includes(
              InitialSelectionEnum.changePersonalInfo,
            )}
            label="Change Personal Information"
          />
          {selections.includes(InitialSelectionEnum.changePersonalInfo) && (
            <ChangePersonalInfoForm />
          )}
        </div>
      </Column>
      <Button
        className="w-fit self-end"
        callback={selections.length > 0 && isValid ? goForward : undefined}
        label="Next"
      />
    </Column>
  );
};

export default InitialSelectionPage;
