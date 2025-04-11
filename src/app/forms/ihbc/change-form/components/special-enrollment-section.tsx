// src/app/forms/ihbc/change-form/components/special-enrollment-section.tsx
'use client';

import { AlertBar } from '@/components/foundation/AlertBar';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { alertBlueIcon } from '@/components/foundation/Icons';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Section } from '@/components/foundation/Section';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormStore } from '../stores/stores';

interface SpecialEnrollmentData {
  eventType: string;
  eventDate: string;
  effectiveDate: string;
}

const eventTypeOptions = [
  {
    value: 'Loss of Coverage',
    label: 'Loss of Minimum Essential Health Insurance Coverage',
  },
  {
    value: 'Birth/Adoption/Foster Care',
    label: 'Birth/Adoption/Placement in Foster Care',
  },
  { value: 'Marriage', label: 'Recently Married' },
  { value: 'Permanent Move', label: 'Permanently Moved to a New Address' },
  {
    value: 'Loss of Dependent',
    label: 'Loss of Dependent(s) through Divorce, Legal Separation, or Death',
  },
  {
    value: 'Gain Dependent',
    label:
      'Gain Dependent(s) through a Child Support Order or Other Court Order',
  },
];

export function SpecialEnrollmentSection() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { specialEnrollment, updateSpecialEnrollment } = useFormStore();
  const { meta } = useFormStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [effectiveDateOptions, setEffectiveDateOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Watch for event type and date changes
  const eventType = watch('specialEnrollment.eventType');
  const eventDate = watch('specialEnrollment.eventDate');

  // Calculate min/max dates based on business rules
  const minDate = new Date();
  minDate.setMonth(minDate.getMonth() - 3); // 3 months ago
  const maxDate = new Date(); // Today

  // Load initial values
  useEffect(() => {
    if (specialEnrollment) {
      setValue('specialEnrollment.eventType', specialEnrollment.eventType);
      setValue('specialEnrollment.eventDate', specialEnrollment.eventDate);
      setValue(
        'specialEnrollment.effectiveDate',
        specialEnrollment.effectiveDate,
      );
    }
  }, [specialEnrollment, setValue]);

  // Validate dates and update effective date options
  const validateDates = () => {
    const newErrors: string[] = [];

    if (eventDate) {
      const selectedDate = new Date(eventDate);
      if (selectedDate < minDate) {
        newErrors.push('Event date must be within the last 3 months');
      } else if (selectedDate > maxDate) {
        newErrors.push('Event date cannot be in the future');
      }
    }

    setValidationErrors(newErrors);
  };

  useEffect(() => {
    validateDates();
  }, [eventDate]);

  // Generate effective date options based on event type and date
  useEffect(() => {
    if (!eventType || !eventDate) {
      setEffectiveDateOptions([]);
      return;
    }

    const options: Array<{ value: string; label: string }> = [];
    const today = new Date();
    const eventDateObj = new Date(eventDate);
    const submittedDate = today;

    // Calculate first day of next month after event
    const firstDayNextMonth = new Date(
      eventDateObj.getFullYear(),
      eventDateObj.getMonth() + 1,
      1,
    );

    // Calculate standard effective date based on submission date
    let standardEffDate;
    if (submittedDate.getDate() <= 15) {
      standardEffDate = new Date(
        submittedDate.getFullYear(),
        submittedDate.getMonth() + 1,
        1,
      );
    } else {
      standardEffDate = new Date(
        submittedDate.getFullYear(),
        submittedDate.getMonth() + 2,
        1,
      );
    }

    // Add options based on event type
    switch (eventType) {
      case 'Loss of Coverage':
        if (submittedDate <= eventDateObj) {
          options.push({
            value: formatDate(firstDayNextMonth),
            label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`,
          });
        } else {
          options.push({
            value: formatDate(firstDayNextMonth),
            label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`,
          });
          options.push({
            value: formatDate(standardEffDate),
            label: `Standard date (${formatDateForDisplay(standardEffDate)})`,
          });
        }
        break;

      case 'Birth/Adoption/Foster Care':
        options.push({
          value: formatDate(eventDateObj),
          label: `Date of event (${formatDateForDisplay(eventDateObj)})`,
        });
        options.push({
          value: formatDate(firstDayNextMonth),
          label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`,
        });
        options.push({
          value: formatDate(standardEffDate),
          label: `Standard date (${formatDateForDisplay(standardEffDate)})`,
        });
        break;

      case 'Marriage':
        if (submittedDate.getTime() === eventDateObj.getTime()) {
          options.push({
            value: formatDate(firstDayNextMonth),
            label: `1st day of month after event (${formatDateForDisplay(firstDayNextMonth)})`,
          });
        } else {
          const firstDayAfterSubmission = new Date(
            submittedDate.getFullYear(),
            submittedDate.getMonth() + 1,
            1,
          );
          options.push({
            value: formatDate(firstDayAfterSubmission),
            label: `1st day of month after submission (${formatDateForDisplay(firstDayAfterSubmission)})`,
          });
        }
        break;
    }

    setEffectiveDateOptions(options);
  }, [eventType, eventDate]);

  // Helper functions for date formatting
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (date: Date): string => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <Section>
      <div className="w-full">
        <Title text="Special Enrollment Information" />

        <Card type="elevated" className="mb-4">
          <Row>
            <Image src={alertBlueIcon} alt="info" className="size-6 mr-2" />
            <TextBox
              text={
                meta.groupNumber === '129800'
                  ? 'You have indicated that you would like to add a spouse, add a dependent(s), and/or make a change in your medical coverage. Please select the reason for the change, the date of your event, as well as the preferred effective date of the change below.'
                  : 'You may add a spouse and/or dependent(s) to your coverage. Dependent additions will be effective on the 1st day of the following month in which the application is submitted.'
              }
            />
          </Row>
        </Card>

        {validationErrors.length > 0 && <AlertBar alerts={validationErrors} />}

        <div className="space-y-6">
          <div className="space-y-3">
            {eventTypeOptions.map((option) => (
              <Radio
                key={option.value}
                selected={eventType === option.value}
                label={option.label}
                value={option.value}
                callback={(value) =>
                  setValue('specialEnrollment.eventType', value)
                }
              />
            ))}
          </div>

          {eventType && (
            <Row>
              <Column>
                <CalendarField
                  label="Event Date"
                  valueCallback={(value) =>
                    setValue('specialEnrollment.eventDate', value)
                  }
                  minDate={minDate}
                  maxDate={maxDate}
                  minDateErrMsg="Event date must be within the last 3 months"
                  maxDateErrMsg="Event date cannot be in the future"
                />
              </Column>
            </Row>
          )}

          {effectiveDateOptions.length > 0 && (
            <div className="space-y-3">
              <Title text="Select Effective Date" />
              {effectiveDateOptions.map((option) => (
                <Radio
                  key={option.value}
                  selected={
                    watch('specialEnrollment.effectiveDate') === option.value
                  }
                  label={option.label}
                  value={option.value}
                  callback={(value) =>
                    setValue('specialEnrollment.effectiveDate', value)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
