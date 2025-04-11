// components/insurance-form/dependents-section.tsx
'use client';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { useDependentsStore } from '@/lib/insurance/stores';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export function DependentsSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { dependents, updateDependents, addDependent, removeDependent } = useDependentsStore();
  const [showSpouseSection, setShowSpouseSection] = useState(false);
  const [showDependentsSection, setShowDependentsSection] = useState(false);

  // Watch for changes to add/remove toggles
  const addSpouse = watch('dependents.add.addSpouse');
  const addMoreDependents = watch('dependents.add.addDependents');
  const removeSpouse = watch('dependents.remove.removeSpouse');
  const removeMoreDependents = watch('dependents.remove.removeDependents');

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
        dependents.add.dependents.forEach((dep, index) => {
          Object.entries(dep).forEach(([key, value]) => {
            setValue(`dependents.add.dependents[${index}].${key}`, value);
          });
        });
      }
    }
    
    // Similar code for remove dependents
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
      relationship: ''
    };
    
    addDependent(newDependent);
    
    // Get current dependents array length
    const currentLength = watch('dependents.add.dependents')?.length || 0;
    
    // Check if we reached the maximum (9 dependents)
    if (currentLength >= 9) {
      // Disable add button or show message
      return;
    }
    
    // Add to form
    setValue(`dependents.add.dependents[${currentLength}]`, newDependent);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Dependents</h2>
      
      {/* Add Spouse Section */}
      <div className="mb-8">
        <FormField
          name="dependents.add.addSpouse"
          label="Add Spouse"
          type="checkbox"
          onChange={() => setShowSpouseSection(!showSpouseSection)}
        />
        
        {showSpouseSection && (
          <div className="mt-4 p-4 border rounded-md">
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
          </div>
        )}
      </div>
      
      {/* Add Dependents Section */}
      <div className="mb-8">
        <FormField
          name="dependents.add.addDependents"
          label="Add Dependents"
          type="checkbox"
          onChange={() => setShowDependentsSection(!showDependentsSection)}
        />
        
        {showDependentsSection && (
          <div className="mt-4">
            {watch('dependents.add.dependents')?.map((dep, index) => (
              <div key={dep.id || index} className="p-4 border rounded-md mb-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium">Dependent #{index + 1}</h3>
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeDependent(dep.id)}
                  >
                    Remove
                  </button>
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
                    <option value="Natural Child/Stepchild">Natural Child/Stepchild</option>
                    <option value="Adopted/Legal Guardian">Adopted/Legal Guardian</option>
                    <option value="Other">Other</option>
                  </FormField>
                  {watch(`dependents.add.dependents[${index}].relationship`) === 'Other' && (
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
            ))}
            
            {(!watch('dependents.add.dependents') || watch('dependents.add.dependents').length < 9) && (
              <Button 
                type="button" 
                onClick={handleAddDependent}
              >
                Add Additional Dependent
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Similar code structure for Remove Dependents section */}
    </div>
  );
}