// components/insurance-form/special-enrollment-section.tsx
'use client';

import { FormField } from '@/components/ui/form-field';
import { useBenefitsStore, useMetaStore } from '@/lib/insurance/stores';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export function SpecialEnrollmentSection() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { specialEnrollment, updateSpecialEnrollment } = useBenefitsStore();
  const { meta } = useMetaStore();
  const [effectiveDateOptions, setEffectiveDateOptions] = useState<Array<{value: string, label: string}>>([]);
  
  // Watch for event type and date changes
  const eventType = watch('specialEnrollment.eventType');
  const eventDate = watch('specialEnrollment.eventDate');
  
  // Load initial values
  useEffect(() => {
    if (specialEnrollment) {
      setValue('specialEnrollment.eventType', specialEnrollment.eventType);
      setValue('specialEnrollment.eventDate', specialEnrollment.eventDate);
      setValue('specialEnrollment.effectiveDate', specialEnrollment.effectiveDate);
    }
  }, [specialEnrollment, setValue]);
  
  // Generate effective date options based on event type and date
  useEffect(() => {
    if (!eventType || !eventDate) {
      setEffectiveDateOptions([]);
      return;
    }
    
    const options: Array<{value: string, label: string}> = [];
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const submittedDate = today;
    
    // Calculate first day of next month after event
    const firstDayNextMonth = new Date(eventDateObj.getFullYear(), eventDateObj.getMonth() + 1, 1);
    
    // Calculate standard effective date based on submission date
    let standardEffDate;
    if (submittedDate.getDate() <= 15) {
      // If submitted on 1-15, effective 1st of next month
      standardEffDate = new Date(submittedDate.getFullYear(), submittedDate.getMonth() + 1, 1);
    } else {
      // If submitted on 16-31, effective 1st of second month
      standardEffDate = new Date(submittedDate.getFullYear(), submittedDate.getMonth() + 2, 1);
    }
    
    // Add options based on event type (following the complex business rules)
    switch(eventType) {
      case 'Loss of Coverage':
        if (submittedDate <= eventDateObj) {
          // If app submitted on or before event date
          options.push({
            value: formatDate(firstDayNextMonth),
            label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`
          });
        } else {
          // If app submitted after event date
          options.push({
            value: formatDate(firstDayNextMonth),
            label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`
          });
          options.push({
            value: formatDate(standardEffDate),
            label: `Standard date (${formatDateForDisplay(standardEffDate)})`
          });
        }
        break;
        
      case 'Birth/Adoption/Foster Care':
        // Event date option
        options.push({
          value: formatDate(eventDateObj),
          label: `Date of event (${formatDateForDisplay(eventDateObj)})`
        });
        
        // First day of month after event
        options.push({
          value: formatDate(firstDayNextMonth),
          label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`
        });
        
        // Standard effective date
        options.push({
          value: formatDate(standardEffDate),
          label: `Standard date (${formatDateForDisplay(standardEffDate)})`
        });
        break;
        
      case 'Marriage':
        if (submittedDate.getTime() === eventDateObj.getTime()) {
          // If app submitted on event date
          options.push({
            value: formatDate(firstDayNextMonth),
            label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`
          });
        } else {
          // If app submitted after event date
          const firstDayAfterSubmission = new Date(submittedDate.getFullYear(), submittedDate.getMonth() + 1, 1);
          options.push({
            value: formatDate(firstDayAfterSubmission),
            label: `1st day of month after submission (${formatDateForDisplay(firstDayAfterSubmission)})`
          });
        }
        break;
        
      // Additional cases for other event types
      // ...
    }
    
    setEffectiveDateOptions(options);
  }, [eventType, eventDate]);
  
  // Helper function to format date for API
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };
  
  // Helper function to format date for display
  const formatDateForDisplay = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; // MM/DD/YYYY
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Special Enrollment Information</h2>
      
      {meta.groupNumber === '129800' ? (
        <p className="text-gray-600 mb-6">
          You have indicated that you would like to add a spouse, add a dependent(s), and/or make a change in your medical coverage. 
          Please select the reason for the change, the date of your event, as well as the preferred effective date of the change below.
        </p>
      ) : (
        <p className="text-gray-600 mb-6">
          You may add a spouse and/or dependent(s) to your coverage. Dependent additions will be effective on the 1st day of the 
          following month in which the application is submitted.
        </p>
      )}
      
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Select Event Type:</label>
          
          <div className="space-y-2">
            <FormField
              name="specialEnrollment.eventType"
              label="Loss of Minimum Essential Health Insurance Coverage"
              type="radio"
              value="Loss of Coverage"
            />
            
            <FormField
              name="specialEnrollment.eventType"
              label="Birth/Adoption/Placement in Foster Care"
              type="radio"
              value="Birth/Adoption/Foster Care"
            />
            
            <FormField
              name="specialEnrollment.eventType"
              label="Recently Married"
              type="radio"
              value="Marriage"
            />
            
            <FormField
              name="specialEnrollment.eventType"
              label="Permanently Moved to a New Address"
              type="radio"
              value="Permanent Move"
            />
            
            <FormField
              name="specialEnrollment.eventType"
              label="Loss of Dependent(s) through Divorce, Legal Separation, or Death"
              type="radio"
              value="Loss of Dependent"
            />
            
            <FormField
              name="specialEnrollment.eventType"
              label="Gain Dependent(s) through a Child Support Order or Other Court Order"
              type="radio"
              value="Gain Dependent"
            />
          </div>
        </div>
        
        <FormField
          name="specialEnrollment.eventDate"
          label="Enter the Date of Your Event"
          type="date"
          required={!!eventType}
        />
        
        {effectiveDateOptions.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Effective Date:</label>
            
            {effectiveDateOptions.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`effectiveDate-${option.value}`}
                  {...register("specialEnrollment.effectiveDate")}
                  value={option.value}
                  className="h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor={`effectiveDate-${option.value}`} className="ml-2">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}