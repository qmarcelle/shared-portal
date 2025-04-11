'use client';

/**
 * IHBC Change Form Components
 *
 * This file contains all the section components for the IHBC change form.
 * Each section corresponds to a step in the multi-step form process.
 *
 * Key implementation notes:
 * - Form state is managed with Zustand via useFormStore
 * - Form validation uses Zod schemas defined in lib/schemas.ts
 * - Each section should save data to the store when values change
 *
 * TODO: Complete implementation of DependentsSection, BenefitsSection, and TerminatePolicySection
 * TODO: Review PersonalInfoSection for compatibility with updated schema
 * TODO: Add comprehensive unit and integration tests for all form sections
 */

import { Checkbox } from '@/components/foundation/Checkbox';
import { Dropdown } from '@/components/foundation/Dropdown';
import { TextField } from '@/components/foundation/TextField';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { submitApplication } from '../actions/actions';
import { useEffectiveDateOptions } from '../hooks/hooks';
import { useFormStore } from '../stores/stores';

// UI Components (these would typically be imported from your UI component library)
export const FormField = ({
  name,
  label,
  type = 'text',
  required = false,
  children,
  disabled = false,
  className = '',
  placeholder = '',
  min = '',
  max = '',
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  min?: string;
  max?: string;
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

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
  const value = watch(name);
  const { ref, ...rest } = register(name);

  // For checkboxes, use foundation Checkbox
  if (type === 'checkbox') {
    return (
      <Checkbox
        label={label}
        checked={value}
        onChange={(checked) => rest.onChange?.({ target: { value: checked } })}
        disabled={disabled}
        className={className}
        required={required}
        error={!!error}
        errorMessage={error}
      />
    );
  }

  // For select fields, use foundation Dropdown
  if (type === 'select') {
    const items =
      React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          return {
            label: String(child.props.children),
            value: String(child.props.value),
          };
        }
        return null;
      })?.filter(
        (item): item is { label: string; value: string } => item !== null,
      ) || [];

    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <Dropdown
          items={items}
          initialSelectedValue={String(value || '')}
          onSelectCallback={(selectedValue) => {
            rest.onChange?.({ target: { value: selectedValue } });
          }}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // For date fields, keep native input as TextField doesn't support date
  if (type === 'date') {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="date"
          {...rest}
          ref={ref}
          min={min}
          max={max}
          placeholder={placeholder}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required={required}
          disabled={disabled}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // For all other fields, use foundation TextField
  return (
    <TextField
      label={label}
      type={type as 'text' | 'password' | 'email' | 'number'}
      value={value}
      valueCallback={(val) => rest.onChange?.({ target: { value: val } })}
      hint={placeholder}
      className={className}
      errors={error ? [error] : null}
      disabled={disabled}
      maxValue={type === 'number' ? Number(max) : undefined}
      minValue={type === 'number' ? Number(min) : undefined}
    />
  );
};

// Replace ExpansionPanel with foundation Accordion
export const ExpansionPanel = ({
  title,
  expanded,
  onChange,
  children,
}: {
  title: string;
  expanded: boolean;
  onChange: (expanded: boolean) => void;
  children: React.ReactNode;
}) => (
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

    {expanded && <div className="border-t border-gray-200 p-4">{children}</div>}
  </div>
);

// Change Selections Section
export function ChangeSelectionsSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
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
      <h2 className="text-2xl font-bold mb-4">
        What changes would you like to make?
      </h2>
      <p className="text-gray-600 mb-6">
        Select all that apply. You will only see sections relevant to your
        selections.
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
            <label className="block text-sm font-medium text-gray-700">
              Group Number:
            </label>
            <div className="mt-1 py-2 px-3 bg-gray-100 rounded-md">
              {useFormStore.getState().meta.groupNumber || 'Not specified'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subscriber ID:
            </label>
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
  const [contactExpanded, setContactExpanded] = useState(
    !!changePhone || !!changeEmail,
  );
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
  }, [
    updatePersonalInfo,
    changeName,
    changeAddress,
    changePhone,
    changeEmail,
    changeTobaccoUse,
  ]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update Personal Information</h2>
      <p className="text-gray-600 mb-6">
        Select the information you would like to update and provide the new
        details.
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
                      {...register('personalInfo.primaryApplicantTobaccoUse')}
                      value="true"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('personalInfo.primaryApplicantTobaccoUse')}
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
                      {...register('personalInfo.spouseTobaccoUse')}
                      value="true"
                      className="h-4 w-4 text-blue-600 border-gray-300"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      {...register('personalInfo.spouseTobaccoUse')}
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

// Special Enrollment Section
export function SpecialEnrollmentSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { specialEnrollment, updateSpecialEnrollment } = useFormStore();
  const [error, setError] = useState<string | null>(null);

  // Watch for changes in form values
  const eventType = watch('specialEnrollment.eventType');
  const eventDate = watch('specialEnrollment.eventDate');
  const effectiveDate = watch('specialEnrollment.effectiveDate');
  const documentation = watch('specialEnrollment.documentation');

  // Use the custom hook to get effective date options
  const { effectiveDateOptions, isLoading } = useEffectiveDateOptions(
    eventType,
    eventDate,
  );

  // Update form values from store on initial load
  useEffect(() => {
    if (specialEnrollment) {
      setValue('specialEnrollment.eventType', specialEnrollment.eventType);
      setValue('specialEnrollment.eventDate', specialEnrollment.eventDate);
      setValue(
        'specialEnrollment.effectiveDate',
        specialEnrollment.effectiveDate,
      );
      setValue(
        'specialEnrollment.documentation',
        specialEnrollment.documentation || 'Not Applicable',
      );
    }
  }, [setValue, specialEnrollment]);

  // Update store when form values change
  useEffect(() => {
    if (eventType && eventDate && effectiveDate) {
      updateSpecialEnrollment({
        eventType,
        eventDate,
        effectiveDate,
        documentation,
      });
    }
  }, [
    updateSpecialEnrollment,
    eventType,
    eventDate,
    effectiveDate,
    documentation,
  ]);

  // Calculate date constraints based on event type
  const getDateConstraints = useCallback(() => {
    if (!eventType) return { min: '', max: '' };

    const today = new Date();
    const formatDate = (date: Date): string => date.toISOString().split('T')[0];

    switch (eventType) {
      case 'Birth/Adoption/Foster Care':
      case 'Marriage':
      case 'Loss of Dependent':
      case 'Gain Dependent': {
        // These events must be within the last 60 days
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(today.getDate() - 60);
        return {
          min: formatDate(sixtyDaysAgo),
          max: formatDate(today),
        };
      }
      case 'Loss of Coverage':
      case 'Permanent Move': {
        // These events can be 60 days in the past or 60 days in the future
        const sixtyDaysAgo = new Date();
        const sixtyDaysFuture = new Date();
        sixtyDaysAgo.setDate(today.getDate() - 60);
        sixtyDaysFuture.setDate(today.getDate() + 60);
        return {
          min: formatDate(sixtyDaysAgo),
          max: formatDate(sixtyDaysFuture),
        };
      }
      default:
        return { min: '', max: '' };
    }
  }, [eventType]);

  const dateConstraints = getDateConstraints();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Special Enrollment Information
      </h2>
      <p className="text-gray-600 mb-6">
        Special enrollment periods allow you to enroll in or make changes to
        your health coverage outside of the annual open enrollment period when
        certain life events occur.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          name="specialEnrollment.eventType"
          label="Qualifying Life Event"
          type="select"
          required
        >
          <option value="">Select event type</option>
          <option value="Loss of Coverage">Loss of Coverage</option>
          <option value="Birth/Adoption/Foster Care">
            Birth/Adoption/Foster Care
          </option>
          <option value="Marriage">Marriage</option>
          <option value="Permanent Move">Permanent Move</option>
          <option value="Loss of Dependent">Loss of Dependent</option>
          <option value="Gain Dependent">Gain Dependent</option>
        </FormField>

        {eventType && (
          <FormField
            name="specialEnrollment.eventDate"
            label="Date of Event"
            type="date"
            required
            min={dateConstraints.min}
            max={dateConstraints.max}
          />
        )}
      </div>

      {eventType && eventDate && (
        <>
          <div className="mb-6">
            <FormField
              name="specialEnrollment.effectiveDate"
              label="Coverage Effective Date"
              type="select"
              required
              disabled={isLoading || effectiveDateOptions.length === 0}
            >
              <option value="">Select effective date</option>
              {effectiveDateOptions.map((date: string) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </option>
              ))}
            </FormField>
            {effectiveDateOptions.length === 0 && !isLoading && eventDate && (
              <p className="mt-1 text-amber-600">
                No valid effective dates available. Please check your event
                date.
              </p>
            )}
          </div>

          <div className="mb-6">
            <FormField
              name="specialEnrollment.documentation"
              label="Documentation Status"
              type="select"
              required
            >
              <option value="Will Upload Later">
                I will upload documentation later
              </option>
              <option value="Will Mail Later">
                I will mail documentation later
              </option>
              <option value="Not Applicable">
                Not applicable for this event
              </option>
            </FormField>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">
              Documentation Required
            </h3>
            <p className="text-blue-700 mb-2">
              Please note that documentation will be required to verify your
              qualifying life event:
            </p>
            <ul className="list-disc list-inside text-blue-700">
              {eventType === 'Loss of Coverage' && (
                <li>Letter from previous insurer with coverage end date</li>
              )}
              {eventType === 'Birth/Adoption/Foster Care' && (
                <li>Birth certificate or adoption/foster care documentation</li>
              )}
              {eventType === 'Marriage' && <li>Marriage certificate</li>}
              {eventType === 'Permanent Move' && (
                <li>
                  Proof of previous and current address (utility bill, lease,
                  etc.)
                </li>
              )}
              {(eventType === 'Loss of Dependent' ||
                eventType === 'Gain Dependent') && (
                <li>Legal documentation showing dependent status change</li>
              )}
            </ul>
          </div>
        </>
      )}

      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
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
  const [success, setSuccess] = useState<{
    confirmationNumber: string;
    pdfUrl?: string;
  } | null>(null);

  const { getFormData } = useFormStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setError(
        'You must accept the terms and conditions to submit the application.',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let formData = getFormData();

      // Ensure applicationId is always a string (not undefined)
      if (!formData.meta.applicationId) {
        formData = {
          ...formData,
          meta: {
            ...formData.meta,
            applicationId: `app-${Date.now()}`,
          },
        };
      }

      const result = await submitApplication(formData);

      if (result.success) {
        setSuccess({
          confirmationNumber: result.confirmationNumber || '',
          pdfUrl: result.pdfUrl,
        });

        // Clear any previous errors
        setError(null);
      } else {
        setError(
          result.message || 'Failed to submit application. Please try again.',
        );
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get all form data for summary
  const formData = getFormData();
  const {
    selections,
    personalInfo,
    dependents,
    benefits,
    specialEnrollment,
    terminatePolicy,
  } = formData;

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  // If submission was successful, show confirmation
  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-md text-center">
        <div className="bg-white p-6 rounded-md shadow-sm mb-6">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Submission Successful!
          </h2>
          <p className="text-gray-700 mb-6">
            Your insurance change request has been submitted successfully.
            Please save your confirmation number for future reference.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-lg font-medium mb-1">Confirmation Number:</p>
            <p className="text-xl font-bold text-blue-700">
              {success.confirmationNumber}
            </p>
          </div>

          {success.pdfUrl && (
            <div className="mb-6">
              <a
                href={success.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Download PDF
              </a>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            A confirmation email has been sent to your registered email address.
          </p>

          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-lg font-medium mb-4">Review Your Changes</h3>
      <p className="text-gray-600 mb-6">
        Please review the information below to ensure it&apos;s correct before
        submitting your application.
      </p>

      {/* Selected Changes Summary */}
      <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-4">Selected Changes</h3>
        <ul className="list-disc list-inside space-y-2">
          {selections.changePersonalInfo && (
            <li>Change Personal Information</li>
          )}
          {selections.addDependents && <li>Add Dependents</li>}
          {selections.removeDependents && <li>Remove Dependents</li>}
          {selections.changeBenefits && <li>Change Benefits</li>}
          {selections.terminatePolicy && <li>Terminate Policy</li>}
        </ul>
      </div>

      {/* Personal Information Changes */}
      {selections.changePersonalInfo && personalInfo && (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-4">
            Personal Information Changes
          </h3>

          {personalInfo.changeName && (
            <div className="mb-4">
              <h4 className="font-medium">Name Change</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Current Name</p>
                  <p>
                    {personalInfo.currentName?.firstName}{' '}
                    {personalInfo.currentName?.middleInitial}{' '}
                    {personalInfo.currentName?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">New Name</p>
                  <p>
                    {personalInfo.newName?.firstName}{' '}
                    {personalInfo.newName?.middleInitial}{' '}
                    {personalInfo.newName?.lastName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {personalInfo.changeAddress && (
            <div className="mb-4">
              <h4 className="font-medium">Address Change</h4>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Residence Address</p>
                <p>{personalInfo.residenceAddress?.street}</p>
                <p>
                  {personalInfo.residenceAddress?.city},{' '}
                  {personalInfo.residenceAddress?.state}{' '}
                  {personalInfo.residenceAddress?.zip}
                </p>
                <p>{personalInfo.residenceAddress?.county} County</p>
              </div>

              {!personalInfo.mailingAddressSameAsResidence &&
                personalInfo.mailingAddress && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Mailing Address</p>
                    <p>{personalInfo.mailingAddress.street}</p>
                    <p>
                      {personalInfo.mailingAddress.city},{' '}
                      {personalInfo.mailingAddress.state}{' '}
                      {personalInfo.mailingAddress.zip}
                    </p>
                    <p>{personalInfo.mailingAddress.county} County</p>
                  </div>
                )}
            </div>
          )}

          {personalInfo.changePhone && personalInfo.primaryPhone && (
            <div className="mb-4">
              <h4 className="font-medium">Phone Change</h4>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Primary Phone ({personalInfo.primaryPhone.type})
                </p>
                <p>{personalInfo.primaryPhone.number}</p>
              </div>

              {personalInfo.secondaryPhone && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Secondary Phone ({personalInfo.secondaryPhone.type})
                  </p>
                  <p>{personalInfo.secondaryPhone.number}</p>
                </div>
              )}
            </div>
          )}

          {personalInfo.changeEmail && (
            <div className="mb-4">
              <h4 className="font-medium">Email Change</h4>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Email Address</p>
                <p>{personalInfo.email}</p>
              </div>
            </div>
          )}

          {personalInfo.changeTobaccoUse && (
            <div className="mb-4">
              <h4 className="font-medium">Tobacco Use</h4>
              <div className="mt-2">
                <p>
                  {personalInfo.tobaccoUse
                    ? 'Yes, I use tobacco products'
                    : 'No, I do not use tobacco products'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dependent Changes */}
      {(selections.addDependents || selections.removeDependents) &&
        dependents && (
          <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
            <h3 className="text-lg font-medium mb-4">Dependent Changes</h3>

            {/* Added Dependents */}
            {selections.addDependents && dependents.add && (
              <div className="mb-6">
                <h4 className="font-medium mb-2">Added Dependents</h4>

                {dependents.add.addSpouse && dependents.add.spouse && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="font-medium">Spouse</p>
                    <p>
                      {dependents.add.spouse.firstName}{' '}
                      {dependents.add.spouse.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date of Birth:{' '}
                      {formatDate(dependents.add.spouse.dateOfBirth)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Gender: {dependents.add.spouse.gender}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tobacco Use:{' '}
                      {dependents.add.spouse.tobaccoUse ? 'Yes' : 'No'}
                    </p>
                  </div>
                )}

                {dependents.add.addDependents &&
                  dependents.add.dependents.length > 0 && (
                    <>
                      <p className="font-medium mt-4 mb-2">Other Dependents</p>
                      {dependents.add.dependents.map(
                        (dep: any, index: number) => (
                          <div
                            key={index}
                            className="border-t border-gray-200 pt-4 mb-4"
                          >
                            <p>
                              {dep.firstName} {dep.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Date of Birth: {formatDate(dep.dateOfBirth)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Gender: {dep.gender}
                            </p>
                            <p className="text-sm text-gray-500">
                              Relationship:{' '}
                              {dep.relationship === 'Other'
                                ? dep.relationshipOther
                                : dep.relationship}
                            </p>
                            <p className="text-sm text-gray-500">
                              Tobacco Use: {dep.tobaccoUse ? 'Yes' : 'No'}
                            </p>
                          </div>
                        ),
                      )}
                    </>
                  )}
              </div>
            )}

            {/* Removed Dependents */}
            {selections.removeDependents && dependents.remove && (
              <div>
                <h4 className="font-medium mb-2">Removed Dependents</h4>

                {dependents.remove.removeSpouse && dependents.remove.spouse && (
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="font-medium">Spouse</p>
                    <p>{dependents.remove.spouse.name}</p>
                    <p className="text-sm text-gray-500">
                      Reason: {dependents.remove.spouse.reason}
                    </p>
                  </div>
                )}

                {dependents.remove.removeDependents &&
                  dependents.remove.dependents.length > 0 && (
                    <>
                      <p className="font-medium mt-4 mb-2">Other Dependents</p>
                      {dependents.remove.dependents.map(
                        (dep: any, index: number) => (
                          <div
                            key={index}
                            className="border-t border-gray-200 pt-4 mb-4"
                          >
                            <p>{dep.name}</p>
                            <p className="text-sm text-gray-500">
                              Reason: {dep.reason}
                            </p>
                          </div>
                        ),
                      )}
                    </>
                  )}
              </div>
            )}
          </div>
        )}

      {/* Benefit Changes */}
      {selections.changeBenefits && benefits && (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-4">Benefit Changes</h3>

          {benefits.changeMedicalPlan && (
            <div className="mb-4">
              <h4 className="font-medium">Medical Plan Change</h4>
              <p className="mt-1">New Plan: {benefits.medicalPlanId}</p>
            </div>
          )}

          {benefits.changeDentalPlan && (
            <div className="mb-4">
              <h4 className="font-medium">Dental Plan Change</h4>
              <p className="mt-1">New Plan: {benefits.dentalPlanId}</p>
            </div>
          )}

          {benefits.changeVisionPlan && (
            <div className="mb-4">
              <h4 className="font-medium">Vision Plan Change</h4>
              <p className="mt-1">New Plan: {benefits.visionPlanId}</p>
            </div>
          )}
        </div>
      )}

      {/* Special Enrollment Information */}
      {specialEnrollment && (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-4">
            Special Enrollment Information
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Qualifying Life Event</p>
              <p>{specialEnrollment.eventType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Event Date</p>
              <p>{formatDate(specialEnrollment.eventDate)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Effective Date</p>
              <p>{formatDate(specialEnrollment.effectiveDate)}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Documentation</p>
              <p>{specialEnrollment.documentation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Terminate Policy */}
      {selections.terminatePolicy && terminatePolicy && (
        <div className="bg-gray-50 p-6 rounded-md border border-gray-200 mb-6">
          <h3 className="text-lg font-medium mb-4">Policy Termination</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Reason for Termination</p>
              <p>
                {terminatePolicy.reason === 'Other'
                  ? terminatePolicy.reasonDetails
                  : terminatePolicy.reason}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Effective Date</p>
              <p>{formatDate(terminatePolicy.effectiveDate)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
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
            I have read and agree to the terms and conditions. I understand that
            by submitting this form, I am electronically signing this
            application, and that my changes will be processed according to the
            effective dates shown above.
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
