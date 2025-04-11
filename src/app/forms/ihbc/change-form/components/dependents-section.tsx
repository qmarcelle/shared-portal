// src/app/forms/ihbc/change-form/components/dependents-section.tsx
'use client';

import { FormField } from '@/components/composite/FormField';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { StepUpDown } from '@/components/foundation/StepUpDown';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Dependent } from '../../lib/schemas';
import { useFormStore } from '../stores/stores';

/**
 * DependentsSection Component
 *
 * Handles adding and removing dependents from insurance coverage.
 *
 * TODO: [HIGH] Implement age validation for dependents - child dependents must be under 26 years old
 * TODO: [HIGH] Add validation to prevent duplicate SSNs across all dependents
 * TODO: [HIGH] Implement tobacco use surcharge calculation integration with premium calculation hook
 * TODO: [MEDIUM] Add warning when removing a dependent that has active claims
 * TODO: [MEDIUM] Add date of birth validation to ensure it's not in the future
 * TODO: [LOW] Implement address inheritance option (use subscriber address for dependents)
 */
export function DependentsSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { dependents, updateDependents, addDependent, removeDependent } =
    useFormStore();
  const [showSpouseSection, setShowSpouseSection] = useState(false);
  const [showDependentsSection, setShowDependentsSection] = useState(false);
  const [dependentCount, setDependentCount] = useState(0);

  // Watch for changes to add/remove toggles
  const addSpouse = watch('dependents.add.addSpouse');
  const addMoreDependents = watch('dependents.add.addDependents');
  const removeSpouse = watch('dependents.remove.removeSpouse');
  const removeMoreDependents = watch('dependents.remove.removeDependents');

  // Update section visibility when checkbox values change
  useEffect(() => {
    setShowSpouseSection(!!addSpouse);
    setShowDependentsSection(!!addMoreDependents);
  }, [addSpouse, addMoreDependents]);

  // Initialize form values from store
  useEffect(() => {
    if (dependents?.add) {
      setValue('dependents.add.addSpouse', dependents.add.addSpouse);
      setValue('dependents.add.addDependents', dependents.add.addDependents);
      if (dependents.add.spouse) {
        setShowSpouseSection(true);
        Object.entries(dependents.add.spouse).forEach(([key, value]) => {
          setValue(`dependents.add.spouse.${key}`, value);
        });
      }
      if (dependents.add.dependents?.length) {
        setShowDependentsSection(true);
        setDependentCount(dependents.add.dependents.length);
        dependents.add.dependents.forEach((dep, index) => {
          Object.entries(dep).forEach(([key, value]) => {
            setValue(`dependents.add.dependents[${index}].${key}`, value);
          });
        });
      }
    }

    // TODO: [HIGH] Implement similar code for remove dependents section
    // The remove dependents section should show existing dependents with checkboxes
    // and capture reason for removal
  }, [dependents, setValue]);

  // Function to add a new dependent
  const handleAddDependent = () => {
    const newDependent = {
      id: `dep-${Date.now()}`,
      lastName: '',
      firstName: '',
      middleInitial: '',
      dateOfBirth: '',
      ssn: '',
      gender: '',
      tobaccoUse: false,
      relationship: '',
    };

    addDependent(newDependent);

    // Get current dependents array length
    const currentLength = watch('dependents.add.dependents')?.length || 0;
    setDependentCount(currentLength + 1);

    // Check if we reached the maximum (9 dependents)
    if (currentLength >= 9) {
      // Disable add button or show message
      return;
    }

    // Add to form
    setValue(`dependents.add.dependents[${currentLength}]`, newDependent);
  };

  // Function to remove the last dependent
  const handleRemoveLastDependent = () => {
    const currentDependents = watch('dependents.add.dependents');
    if (!currentDependents || currentDependents.length === 0) {
      return;
    }

    const lastDependent = currentDependents[currentDependents.length - 1];
    removeDependent(lastDependent.id || '');
    setDependentCount(currentDependents.length - 1);
  };

  /**
   * TODO: [HIGH] Implement the following business rules:
   * 1. Allow maximum of 9 dependents total (1 spouse + 8 children or 9 children)
   * 2. Validate dependent eligibility based on relationship
   * 3. Handle special rules for disabled dependents over 26
   * 4. Implement removing dependent functionality
   */

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Dependents</h2>

      {/* Add Spouse Section */}
      <div className="mb-8">
        <FormField
          name="dependents.add.addSpouse"
          label="Add Spouse"
          type="checkbox"
        />

        {showSpouseSection && (
          <Card type="elevated" className="mt-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="dependents.add.spouse.lastName"
                label="Last Name"
                required
              />
              <FormField
                name="dependents.add.spouse.firstName"
                label="First Name"
                required
              />
              <FormField
                name="dependents.add.spouse.middleInitial"
                label="Middle Initial"
                className="col-span-1"
              />
              <FormField
                name="dependents.add.spouse.dateOfBirth"
                label="Date of Birth"
                type="date"
                required
              />
              <FormField
                name="dependents.add.spouse.ssn"
                label="SSN/TIN (Optional)"
                placeholder="XXX-XX-XXXX"
              />
              <FormField
                name="dependents.add.spouse.gender"
                label="Gender"
                type="select"
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </FormField>
              <FormField
                name="dependents.add.spouse.tobaccoUse"
                label="Tobacco Use"
                type="select"
                required
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </FormField>
            </div>
          </Card>
        )}
      </div>

      {/* Add Dependents Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <FormField
            name="dependents.add.addDependents"
            label="Add Dependents"
            type="checkbox"
          />

          {showDependentsSection && (
            <StepUpDown
              label="Number of Dependents"
              value={dependentCount}
              minValue={0}
              maxValue={9}
              valueCallback={(newValue) => {
                if (newValue > dependentCount) {
                  handleAddDependent();
                } else if (newValue < dependentCount) {
                  handleRemoveLastDependent();
                }
              }}
            />
          )}
        </div>

        {showDependentsSection && (
          <div className="mt-4 space-y-4">
            {watch('dependents.add.dependents')?.map(
              (dep: Dependent, index: number) => (
                <Card key={dep.id || index} type="elevated" className="p-4">
                  <div>
                    <div className="border-b pb-2 mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Dependent #{index + 1}</h3>
                        <Button
                          type="secondary"
                          style="button"
                          label="Remove"
                          callback={() => removeDependent(dep.id || '')}
                        />
                      </div>
                      {dep.firstName && dep.lastName && (
                        <div className="text-gray-600 text-sm mt-1">
                          {dep.firstName} {dep.lastName}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        name={`dependents.add.dependents[${index}].lastName`}
                        label="Last Name"
                        required
                      />
                      <FormField
                        name={`dependents.add.dependents[${index}].firstName`}
                        label="First Name"
                        required
                      />
                      <FormField
                        name={`dependents.add.dependents[${index}].middleInitial`}
                        label="Middle Initial"
                      />
                      <FormField
                        name={`dependents.add.dependents[${index}].dateOfBirth`}
                        label="Date of Birth"
                        type="date"
                        required
                      />
                      <FormField
                        name={`dependents.add.dependents[${index}].ssn`}
                        label="SSN/TIN (Optional)"
                        placeholder="XXX-XX-XXXX"
                      />
                      <FormField
                        name={`dependents.add.dependents[${index}].gender`}
                        label="Gender"
                        type="select"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </FormField>
                      <FormField
                        name={`dependents.add.dependents[${index}].relationship`}
                        label="Relationship"
                        type="select"
                        required
                      >
                        <option value="">Select</option>
                        <option value="Natural Child/Stepchild">
                          Natural Child/Stepchild
                        </option>
                        <option value="Adopted/Legal Guardian">
                          Adopted/Legal Guardian
                        </option>
                        <option value="Other">Other</option>
                      </FormField>
                      {watch(
                        `dependents.add.dependents[${index}].relationship`,
                      ) === 'Other' && (
                        <FormField
                          name={`dependents.add.dependents[${index}].relationshipOther`}
                          label="Please Specify"
                          required
                        />
                      )}
                      <FormField
                        name={`dependents.add.dependents[${index}].tobaccoUse`}
                        label="Tobacco Use"
                        type="select"
                        required
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </FormField>
                    </div>
                  </div>
                </Card>
              ),
            )}

            {(!watch('dependents.add.dependents') ||
              watch('dependents.add.dependents').length < 9) && (
              <Button
                type="primary"
                style="button"
                label="Add Additional Dependent"
                callback={handleAddDependent}
              />
            )}
          </div>
        )}
      </div>

      {/* TODO: [HIGH] Implement Remove Dependents section with similar structure to Add Dependents */}
      {/* TODO: [HIGH] Add field for reason for removal and effective date of removal */}
      {/* TODO: [MEDIUM] Implement warning for removing dependents in middle of benefit period */}
    </div>
  );
}
