'use client';

import { submitApplication } from '@/app/insurance/change-form/actions';
import { useFormStore } from '@/lib/insurance/stores';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// UI Components (these would typically be imported from your UI component library)
const FormField = ({
  name,
  label,
  type = 'text',
  required = false,
  children,
  disabled = false,
  className = '',
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) => {
  const { register, formState: { errors } } = useFormContext();
  
  // Extract error by navigating the nested path
  const getError = (path: string) => {
    let current: any = errors;
    const parts = path.split('.');
    
    for (const part of parts) {
      if (current?.[part]) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    
    return current?.message;
  };
  
  const error = getError(name);
  
  // For checkboxes, render a different layout
  if (type === 'checkbox') {
    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            id={name}
            disabled={disabled}
            className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${error ? 'border-red-500' : ''}`}
            {...register(name)}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={name} className="font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          {error && <p className="mt-1 text-red-600">{error}</p>}
        </div>
      </div>
    );
  }
  
  // For select fields
  if (type === 'select') {
    return (
      <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={name}
          disabled={disabled}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            error ? 'border-red-500' : ''
          }`}
          {...register(name)}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
  
  // For all other field types
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
          error ? 'border-red-500' : ''
        }`}
        {...register(name)}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

const ExpansionPanel = ({
  title,
  expanded = false,
  onChange,
  children,
}: {
  title: string;
  expanded: boolean;
  onChange: (expanded: boolean) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border rounded-md overflow-hidden mb-4">
      <button
        type="button"
        className={`w-full flex justify-between items-center p-4 text-left ${
          expanded ? 'bg-gray-50' : 'bg-white'
        }`}
        onClick={() => onChange(!expanded)}
      >
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        <span className="ml-6 flex-shrink-0">
          {expanded ? (
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </span>
      </button>
      
      {expanded && (
        <div className="border-t border-gray-200 p-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Change Selections Section
export function ChangeSelectionsSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { selections, updateSelections } = useFormStore();
  
  // Watch for changes in selection values
  const changePersonalInfo = watch('selections.changePersonalInfo');
  const addDependents = watch('selections.addDependents');
  const removeDependents = watch('selections.removeDependents');
  const changeBenefits = watch('selections.changeBenefits');
  const terminatePolicy = watch('selections.terminatePolicy');
  
  // Update form values from store on initial load
  useEffect(() => {
    setValue('selections.changePersonalInfo', selections.changePersonalInfo);
    setValue('selections.addDependents', selections.addDependents);
    setValue('selections.removeDependents', selections.removeDependents);
    setValue('selections.changeBenefits', selections.changeBenefits);
    setValue('selections.terminatePolicy', selections.terminatePolicy);
  }, [setValue, selections]);
  
  // Update store when form values change
  useEffect(() => {
    const newSelections = {
      changePersonalInfo,
      addDependents,
      removeDependents,
      changeBenefits,
      terminatePolicy,
    };
    
    updateSelections(newSelections);
  }, [
    updateSelections,
    changePersonalInfo,
    addDependents,
    removeDependents,
    changeBenefits,
    terminatePolicy,
  ]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">What changes would you like to make?</h2>
      <p className="text-gray-600 mb-6">
        Select all that apply. You will only see sections relevant to your selections.
      </p>
      
      <div className="space-y-4 mb-8">
        <FormField
          name="selections.changePersonalInfo"
          label="Change Personal Information"
          type="checkbox"
        />
        
        <FormField
          name="selections.addDependents"
          label="Add Dependents"
          type="checkbox"
          disabled={terminatePolicy}
        />
        
        <FormField
          name="selections.removeDependents"
          label="Remove Dependents"
          type="checkbox"
          disabled={terminatePolicy}
        />
        
        <FormField
          name="selections.changeBenefits"
          label="Change Benefits"
          type="checkbox"
          disabled={terminatePolicy}
        />
        
        <FormField
          name="selections.terminatePolicy"
          label="Terminate Policy"
          type="checkbox"
          disabled={addDependents || removeDependents || changeBenefits}
        />
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Group Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Group Number:</label>
            <div className="mt-1 py-2 px-3 bg-gray-100 rounded-md">
              {useFormStore.getState().meta.groupNumber || 'Not specified'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Subscriber ID:</label>
            <div className="mt-1 py-2 px-3 bg-gray-100 rounded-md">
              {useFormStore.getState().meta.subscriberId || 'Not specified'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Personal Info Section
export function PersonalInfoSection() {
  const { register, watch, setValue } = useFormContext();
  const { personalInfo, updatePersonalInfo } = useFormStore();
  
  // Watch for changes to toggles
  const changeName = watch('personalInfo.changeName');
  const changeAddress = watch('personalInfo.changeAddress');
  const changePhone = watch('personalInfo.changePhone');
  const changeEmail = watch('personalInfo.changeEmail');
  const changeTobaccoUse = watch('personalInfo.changeTobaccoUse');
  
  // Expansion panel states
  const [nameExpanded, setNameExpanded] = useState(!!changeName);
  const [addressExpanded, setAddressExpanded] = useState(!!changeAddress);
  const [contactExpanded, setContactExpanded] = useState(!!changePhone || !!changeEmail);
  const [tobaccoExpanded, setTobaccoExpanded] = useState(!!changeTobaccoUse);
  
  // Update form values from store on initial load
  useEffect(() => {
    if (personalInfo) {
      Object.entries(personalInfo).forEach(([key, value]) => {
        setValue(`personalInfo.${key}`, value);
      });
    }
  }, [setValue, personalInfo]);
  
  // Update store when form values change
  useEffect(() => {
    updatePersonalInfo({
      changeName,
      changeAddress,
      changePhone,
      changeEmail,
      changeTobaccoUse,
    });
  }, [updatePersonalInfo, changeName, changeAddress, changePhone, changeEmail, changeTobaccoUse]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Personal Information</h2>
      <p className="text-gray-600 mb-6">
        Select the information you would like to update and provide the new details.
      </p>
      
      <ExpansionPanel 
        title="Change Name" 
        expanded={nameExpanded}
        onChange={setNameExpanded}
      >
        <FormField
          name="personalInfo.changeName"
          label="I want to change my name"
          type="checkbox"
          className="mb-4"
        />
        
        {changeName && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="personalInfo.firstName"
              label="First Name"
              required={changeName}
            />
            
            <FormField
              name="personalInfo.lastName"
              label="Last Name"
              required={changeName}
            />
            
            <FormField
              name="personalInfo.middleInitial"
              label="Middle Initial"
              className="col-span-2 md:col-span-1"
            />
            
            <div className="col-span-2">
              <FormField
                name="personalInfo.reasonForChange"
                label="Reason for Name Change"
                placeholder="e.g., Marriage, Divorce, Legal Name Change"
              />
            </div>
          </div>
        )}
      </ExpansionPanel>
      
      <ExpansionPanel 
        title="Change Address" 
        expanded={addressExpanded}
        onChange={setAddressExpanded}
      >
        <FormField
          name="personalInfo.changeAddress"
          label="I want to update my address"
          type="checkbox"
          className="mb-4"
        />
        
        {changeAddress && (
          <div>
            <h4 className="font-medium text-lg mb-2">Residence Address</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <FormField
                  name="personalInfo.residenceAddress.street"
                  label="Street Address"
                  required={changeAddress}
                />
              </div>
              
              <FormField
                name="personalInfo.residenceAddress.city"
                label="City"
                required={changeAddress}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="personalInfo.residenceAddress.state"
                  label="State"
                  type="select"
                  required={changeAddress}
                >
                  <option value="">Select a state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  {/* Additional states would be listed here */}
                </FormField>
                
                <FormField
                  name="personalInfo.residenceAddress.zip"
                  label="ZIP Code"
                  required={changeAddress}
                />
              </div>
              
              <FormField
                name="personalInfo.residenceAddress.county"
                label="County"
                required={changeAddress}
              />
            </div>
          </div>
        )}
      </ExpansionPanel>
      
      <ExpansionPanel 
        title="Change Contact Information" 
        expanded={contactExpanded}
        onChange={setContactExpanded}
      >
        <div className="space-y-4">
          <FormField
            name="personalInfo.changePhone"
            label="I want to update my phone number"
            type="checkbox"
            className="mb-2"
          />
          
          {changePhone && (
            <FormField
              name="personalInfo.phone"
              label="New Phone Number"
              placeholder="(555) 555-5555"
              required={changePhone}
              className="mb-4"
            />
          )}
          
          <FormField
            name="personalInfo.changeEmail"
            label="I want to update my email address"
            type="checkbox"
            className="mb-2"
          />
          
          {changeEmail && (
            <FormField
              name="personalInfo.email"
              label="New Email Address"
              type="email"
              placeholder="email@example.com"
              required={changeEmail}
              className="mb-4"
            />
          )}
        </div>
      </ExpansionPanel>
      
      <ExpansionPanel 
        title="Change Tobacco Use" 
        expanded={tobaccoExpanded}
        onChange={setTobaccoExpanded}
      >
        <div className="space-y-4">
          <FormField
            name="personalInfo.changeTobaccoUse"
            label="I want to update tobacco use status"
            type="checkbox"
            className="mb-4"
          />
          
          {changeTobaccoUse && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Applicant Tobacco Use
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("personalInfo.primaryApplicantTobaccoUse")}
                      value="true"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("personalInfo.primaryApplicantTobaccoUse")}
                      value="false"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spouse Tobacco Use
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("personalInfo.spouseTobaccoUse")}
                      value="true"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register("personalInfo.spouseTobaccoUse")}
                      value="false"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </ExpansionPanel>
    </div>
  );
}

// Dependents Section (simplified)
export function DependentsSection() {
  // This would be expanded with add/remove dependents functionality
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Dependents</h2>
      <p className="text-gray-600 mb-6">
        Add or remove dependents from your policy.
      </p>
      
      {/* Add Dependents UI would go here */}
      {/* Remove Dependents UI would go here */}
    </div>
  );
}

// Benefits Section (simplified)
export function BenefitsSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Select Your Plan</h2>
      <p className="text-gray-600 mb-6">
        Choose which benefits you would like to change.
      </p>
      
      {/* Plan selection UI would go here */}
    </div>
  );
}

// Special Enrollment Section (simplified)
export function SpecialEnrollmentSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Special Enrollment Information</h2>
      <p className="text-gray-600 mb-6">
        Please provide information about your qualifying life event.
      </p>
      
      {/* Special enrollment UI would go here */}
    </div>
  );
}

// Terminate Policy Section (simplified)
export function TerminatePolicySection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Terminate Policy</h2>
      <p className="text-gray-600 mb-6">
        Please provide information about your policy termination.
      </p>
      
      {/* Termination UI would go here */}
    </div>
  );
}

// Review Section
export function ReviewSection() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getFormData, setSubmitted } = useFormStore();
  
  const handleSubmit = async () => {
    if (!termsAccepted) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get form data from store
      const formData = getFormData();
      
      // Submit the form
      const result = await submitApplication(formData);
      
      if (result.success) {
        // Update store with submitted status
        setSubmitted();
        
        // Show confirmation modal or redirect to confirmation page
        alert(`Application submitted successfully! Confirmation number: ${result.confirmationNumber}`);
        
        // In a real app, you would redirect to a confirmation page
        // window.location.href = `/insurance/confirmation?id=${formData.meta.applicationId}`;
      } else {
        setError(result.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting your application. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get form data for review
  const formData = getFormData();
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Review Your Changes</h2>
      <p className="text-gray-600 mb-6">Please review your changes before submitting.</p>
      
      {/* Change Sections */}
      <div className="space-y-4 mb-8">
        {formData.selections.changePersonalInfo && formData.personalInfo && (
          <div className="bg-gray-50 p-4 rounded border">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold">Personal Information Changes</h3>
            </div>
            <div className="mt-2">
              {formData.personalInfo.changeName && (
                <p>
                  Name: {formData.personalInfo.firstName} {formData.personalInfo.middleInitial} {formData.personalInfo.lastName}
                </p>
              )}
              {formData.personalInfo.changeAddress && formData.personalInfo.residenceAddress && (
                <p>
                  Address: {formData.personalInfo.residenceAddress.street}, {formData.personalInfo.residenceAddress.city}, {formData.personalInfo.residenceAddress.state} {formData.personalInfo.residenceAddress.zip}
                </p>
              )}
              {formData.personalInfo.changePhone && (
                <p>Phone: {formData.personalInfo.phone}</p>
              )}
              {formData.personalInfo.changeEmail && (
                <p>Email: {formData.personalInfo.email}</p>
              )}
              {formData.personalInfo.changeTobaccoUse && (
                <p>
                  Tobacco Use: 
                  Primary Applicant: {formData.personalInfo.primaryApplicantTobaccoUse ? 'Yes' : 'No'}, 
                  Spouse: {formData.personalInfo.spouseTobaccoUse ? 'Yes' : 'No'}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Other sections would be added here */}
      </div>
      
      {/* Terms & Conditions */}
      <div className="mb-8">
        <div className="flex items-start mb-4">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
            className="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="text-sm">
            I have read and agree to the terms and conditions. I understand that by submitting this form,
            I am electronically signing this application, and that my changes will be processed according
            to the effective dates shown above.
          </label>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </div>
  );
}