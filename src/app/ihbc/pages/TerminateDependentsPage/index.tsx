import { Button } from '@/components/foundation/Button';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { HighlightedHeader } from '../../components/HighlightedHeader';
import { IHBCSchema } from '../../rules/schema';
import { useNavigationStore } from '../../stores/navigationStore';
import { useRemoveDependentsStore } from '../../stores/removeDependentsStore';
import { useSelectiveValidation } from '../../utils/useSelectiveValidation';
import { RemoveDependentForm } from './RemoveDependentForm';

export const TerminateDependentsPage = () => {
  const [
    removeDependents,
    removeSpouse,
    toggleRemoveDependents,
    toggleRemoveSpouse,
  ] = useRemoveDependentsStore((state) => [
    state.removeDependents,
    state.removeSpouse,
    state.toggleRemoveDependents,
    state.toggleRemoveSpouse,
  ]);
  const { control, unregister } = useFormContext<IHBCSchema>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'removeDeps.dependents',
  });

  const isValid = useSelectiveValidation<IHBCSchema>('removeDeps');

  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);

  function addMore() {
    append({
      firstName: '',
      lastName: '',
      dob: '',
      terminationDate: '',
      mi: '',
      terminationReason: '',
    });
  }
  return (
    <Column className="gap-2">
      <HighlightedHeader text="Terminate Dependents" />
      <TextBox text="You may term a spouse and/or dependent(s) on your coverage. Termination and/or cancellation requests will be effective on the requested effective date. If you have questions, please contact 1-800-845-2738." />
      <Column>
        <Checkbox
          value="spouse"
          selected={removeSpouse == true}
          callback={() => {
            unregister('removeDeps.spouse');
            toggleRemoveSpouse();
          }}
          label="Remove Spouse"
        />
        {removeSpouse && (
          <div className="ml-10">
            <RemoveDependentForm type="spouse" formId={0} />
          </div>
        )}
      </Column>
      <Checkbox
        value="deps"
        selected={removeDependents == true}
        callback={() => {
          unregister('removeDeps.dependents');
          toggleRemoveDependents();
          if (removeDependents == false) {
            addMore();
          }
        }}
        label="Remove Dependent"
      />
      {removeDependents && (
        <Column className="gap-2">
          <ul className="flex flex-col gap-8 ml-10">
            {fields.map((field, index) => (
              <Column key={field.id} className="gap-2">
                {index != 0 && <Divider className="mb-4" />}
                <RemoveDependentForm key={field.id} formId={index} />
                {index != 0 && (
                  <Button
                    className="w-fit self-end"
                    callback={() => remove(index)}
                    label="Clear Dependent Information"
                  />
                )}
              </Column>
            ))}
          </ul>
          <Button
            callback={addMore}
            className="w-fit self-center"
            label="Remove Additional Dependent"
          />
        </Column>
      )}
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
