import { Button } from '@/components/foundation/Button';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import getCounties from '../../actions/getCounties';
import { HighlightedHeader } from '../../components/HighlightedHeader';
import { Table } from '../../components/Table';
import { LoggedInMemberContext } from '../../providers/loggedInMemberProvider';
import { getAvailRelationships } from '../../rules/relationships';
import { IHBCSchema } from '../../rules/schema';
import { useBenefitSelectionStore } from '../../stores/benefitSelectionStore';
import { useNavigationStore } from '../../stores/navigationStore';
import { useSelectiveValidation } from '../../utils/useSelectiveValidation';

export const ChangeDependentsPage = () => {
  const {
    control,
    register,
    watch,
    formState: { isValid, errors },
    getValues,
    setValue,
  } = useFormContext<IHBCSchema>();

  const addDeps = getValues('addDeps');
  const county = getValues('addDeps.county');
  const dependents = getValues('addDeps.dependents')!;
  const existingDeps = getValues('addDeps.existingDeps')!;
  const loggedInMember = useContext<LoggedInMember>(LoggedInMemberContext);

  const [
    medicalPlan,
    plans,
    selectedMedicalPlan,
    loadAllDentalVisionPlans,
    loadMedicalPlans,
  ] = useBenefitSelectionStore((state) => [
    state.medicalPlan,
    state.plans,
    state.selectedMedicalPlan,
    state.loadAllDentalVisionPlans,
    state.loadMedicalPlans,
    state.updateMedicalPlan,
  ]);

  useEffect(() => {
    loadMedicalPlans(county, dependents, existingDeps, loggedInMember);
    loadAllDentalVisionPlans(county, dependents, existingDeps, loggedInMember);
    console.log(
      'medicalPlan',
      medicalPlan,
      'plans',
      plans,
      'selectedMedicalPlan',
      selectedMedicalPlan,
    );
  }, [dependents]);

  console.error('Field Errors', errors);
  const valid = useSelectiveValidation<IHBCSchema>('addDeps.existingDeps');

  const member = useContext(LoggedInMemberContext);

  const [counties, setCounties] = useState<string[]>([]);
  const zipCode = watch('addDeps.zip');

  useEffect(() => {
    setValue('addDeps.zip', member.homeAddress.zipcode);
  }, []);

  useEffect(() => {
    if (zipCode?.length == 5) {
      loadCounties();
    } else {
      if (counties.length > 0) {
        setCounties([]);
      }
    }
  }, [zipCode]);

  async function loadCounties() {
    const result = await getCounties(zipCode);
    if (result) {
      if (
        result.find(
          (item) =>
            item.toLowerCase() == member.homeAddress.county.toLowerCase(),
        )
      ) {
        setValue('addDeps.county', toPascalCase(member.homeAddress.county));
      }
      setCounties(result);
    }
  }

  const [goBackWard, goForward] = useNavigationStore((state) => [
    state.goBackWard,
    state.goForward,
  ]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addDeps.dependents',
  });

  const { fields: existingDepsFields, remove: removeExistingDep } =
    useFieldArray({
      control,
      name: 'addDeps.existingDeps',
    });

  const generateItemBuilder = <
    T extends keyof Omit<NonNullable<IHBCSchema['addDeps']>, 'county' | 'zip'>,
  >(
    depType: T,
  ) => {
    // eslint-disable-next-line react/display-name
    return (
      item: NonNullable<
        NonNullable<NonNullable<IHBCSchema['addDeps']>>['dependents']
      >[number],
      index: number,
    ) => {
      return (
        <tr className="relative">
          <td>
            <TextField
              label={undefined}
              disabled={item.relationship.toLowerCase() == 'self'}
              otherProps={register(`addDeps.${depType}.${index}.firstName`)}
            />
          </td>
          <td>
            <CalendarField
              label={undefined}
              disabled={item.relationship.toLowerCase() == 'self'}
              otherProps={register(`addDeps.${depType}.${index}.dob`)}
              isSuffixNeeded={true}
              initValue={getValues(`addDeps.${depType}.${index}.dob`)}
            />
          </td>
          <td>
            <Dropdown
              disabled={item.relationship.toLowerCase() == 'self'}
              initialSelectedValue={
                getValues(`addDeps.${depType}.${index}.relationship`) ?? '0'
              }
              items={[
                { label: 'Select Relationship', value: '0' },
                ...getAvailRelationships(),
                ...(item.relationship.toLowerCase() == 'self'
                  ? [
                      {
                        label: 'Self',
                        value: 'Self',
                      },
                    ]
                  : []),
              ]}
              onSelectCallback={(val) => {
                register(`addDeps.${depType}.${index}.relationship`).onChange({
                  target: {
                    name: `addDeps.${depType}.${index}.relationship`,
                    value: val,
                  },
                });
              }}
            />
          </td>
          <td>
            <Dropdown
              disabled={item.relationship.toLowerCase() == 'self'}
              initialSelectedValue={
                getValues(`addDeps.${depType}.${index}.gender`) ?? '0'
              }
              items={[
                { label: 'Select Gender', value: '0' },
                { label: 'Male', value: 'M' },
                { label: 'Female', value: 'F' },
              ]}
              onSelectCallback={(val) => {
                register(`addDeps.${depType}.${index}.gender`).onChange({
                  target: {
                    name: `addDeps.${depType}.${index}.gender`,
                    value: val,
                  },
                });
              }}
            />
          </td>
          <td>
            <Dropdown
              initialSelectedValue={item.tobaccoUse ?? '0'}
              items={[
                { label: 'Select Tobacco Use', value: '0' },
                { label: 'Yes', value: 'Y' },
                { label: 'No', value: 'N' },
              ]}
              onSelectCallback={(val) => {
                register(`addDeps.${depType}.${index}.tobaccoUse`).onChange({
                  target: {
                    name: `addDeps.${depType}.${index}.tobaccoUse`,
                    value: val,
                  },
                });
              }}
            />
          </td>
          {item.relationship.toLowerCase() != 'self' && (
            <Button
              callback={() =>
                depType == 'dependents'
                  ? remove(index)
                  : removeExistingDep(index)
              }
              className="w-fit"
              type="ghost"
              label="Remove"
            />
          )}
        </tr>
      );
    };
  };

  return (
    <Column className="gap-4">
      <HighlightedHeader text="Change My Benefits" />
      <TextBox text="You have indicated that you would like to change your benefits. You can select a different medical coverage that has a lower or higher deductible, copays, out of pocket maximums, or premium or add/remove dental or vision coverage. Before you begin making plan selections, let's determine who will be covered on the plan." />
      <TextBox text="Where do you live?" />
      <Row className="gap-4 justify-around">
        <div>
          <TextField
            className="w-fit"
            label="Zip Code"
            otherProps={register('addDeps.zip')}
          />
        </div>
        <div className="shrink-0">
          <Dropdown
            label="County"
            initialSelectedValue={
              getValues('addDeps.county') ?? 'Select County'
            }
            items={[
              { label: 'Select County', value: 'Select County' },
              ...counties.map((item) => ({ label: item, value: item })),
            ]}
            onSelectCallback={(val) => {
              register('addDeps.county').onChange({
                target: {
                  name: 'addDeps.county',
                  value: val,
                },
              });
            }}
          />
        </div>
      </Row>
      <TextBox text="Who's covered as of the requested effective date?" />
      <Table<
        NonNullable<NonNullable<IHBCSchema['addDeps']>['dependents']>[number]
      >
        header={
          <tr className="text-left bg-primary text-white">
            <th>First Name</th>
            <th>Date of Birth</th>
            <th>Relationship</th>
            <th>Gender</th>
            <th>Tobacco Use?</th>
          </tr>
        }
        items={fields}
        preItems={existingDepsFields.map(generateItemBuilder('existingDeps'))}
        itemBuilder={generateItemBuilder('dependents')}
      />

      <Button
        callback={() =>
          append({
            firstName: '',
            dob: '',
            //@ts-ignore
            gender: '0',
            relationship: '0',
            tobaccoUse: '0',
          })
        }
        className="w-fit"
        label="Cover Additional Dependent"
      />

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
