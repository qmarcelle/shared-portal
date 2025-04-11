# IHBC Form Component Implementation Guide

## Overview

This guide outlines how to leverage existing components from the shared portal for implementing the IHBC change form. Using these pre-built components ensures UI consistency, reduces development time, and follows established patterns.

## Component Categories

### Form Elements

| Component       | Usage in IHBC Form                     | Key Props                                                                        |
| --------------- | -------------------------------------- | -------------------------------------------------------------------------------- |
| `TextField`     | Member information, contact details    | `label`, `value`, `onChange`, `error`, `required`                                |
| `Dropdown`      | Plan selection, coverage options       | `options`, `selectedValue`, `onChange`                                           |
| `CalendarField` | Event dates, qualifying event dates    | `label`, `valueCallback`, `minDate`, `maxDate`, `minDateErrMsg`, `maxDateErrMsg` |
| `Radio`         | Event type selection, option selection | `selected`, `label`, `value`, `callback`                                         |
| `TextBox`       | Informational text, descriptions       | `text`                                                                           |
| `Title`         | Section headers, subsection titles     | `text`                                                                           |

### Layout Components

| Component      | Usage in IHBC Form              | Key Props                       |
| -------------- | ------------------------------- | ------------------------------- |
| `Section`      | Form sections, logical grouping | `children`                      |
| `Card`         | Info blocks, alerts             | `type`, `className`, `children` |
| `Row`/`Column` | Form layout structure           | `children`, `className`         |
| `AlertBar`     | Validation errors, messages     | `alerts`                        |

### Feedback Components

| Component  | Usage in IHBC Form                   | Key Props                       |
| ---------- | ------------------------------------ | ------------------------------- |
| `AlertBar` | Validation errors, date restrictions | `alerts: string[]`              |
| `Card`     | Info messages with icons             | `type: "elevated"`, `className` |

## Component Reuse Opportunities

After reviewing the codebase, the following opportunities for component reuse have been identified:

### Welcome and Information Sections

| Current Component     | Recommended Component                 | Benefits                                                              |
| --------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `welcome-message.tsx` | `WelcomeBanner.tsx` or `InfoCard.tsx` | Consistent styling, built-in icon support, better responsive behavior |
| Custom info blocks    | `InfoCard.tsx`                        | Standardized information presentation                                 |
| Help sections         | `GetHelpSection.tsx`                  | Consistent help UI across portal                                      |

### Navigation and Form Structure

| Current Component        | Recommended Component | Benefits                                                           |
| ------------------------ | --------------------- | ------------------------------------------------------------------ |
| `form-tabs.tsx` (custom) | `BreadCrumb.tsx`      | Better step navigation, consistent with portal navigation patterns |
| Custom accordions        | `Accordion.tsx`       | Standardized expand/collapse behavior                              |
| Manual validation UI     | `ErrorCard.tsx`       | Consistent error presentation                                      |

### Dependent Management

| Current Component     | Recommended Component     | Benefits                                               |
| --------------------- | ------------------------- | ------------------------------------------------------ |
| Custom dependent rows | `UpdateRowWithStatus.tsx` | Built-in status handling, consistent styling           |
| Manual add/remove UI  | `StepUpDown.tsx`          | Standardized counter interface                         |
| Custom dropdowns      | `RichDropDown.tsx`        | Enhanced selection options with icons and descriptions |

### Plan Selection

| Current Component | Recommended Component       | Benefits                             |
| ----------------- | --------------------------- | ------------------------------------ |
| Custom plan cards | `AccordionListCard.tsx`     | Consistent expandable card interface |
| Plan selection UI | `PlanSwitcherComponent.tsx` | Complete plan selection experience   |
| Custom filter UI  | `Filter.tsx`                | Standardized filtering options       |

## Component Replacement Guide

Here are specific code examples for replacing custom components with shared portal components:

### Replace Custom Welcome Message

**Current Implementation:**

```tsx
// src/app/forms/ihbc/change-form/components/welcome-message.tsx
export function WelcomeMessage() {
  // ...
  return (
    <div className="bg-white p-6 mb-6 rounded-md shadow-sm">
      <h2 className="text-xl font-bold mb-4">Welcome, {subscriberName}</h2>
      {/* Conditional content based on group number */}
    </div>
  );
}
```

**Recommended Implementation:**

```tsx
// src/app/forms/ihbc/change-form/components/welcome-message.tsx
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
// OR
import { InfoCard } from '@/components/composite/InfoCard';
import { Title } from '@/components/foundation/Title';
import { TextBox } from '@/components/foundation/TextBox';

export function WelcomeMessage() {
  const { meta } = useFormStore();
  const { data: subscriber } = useSubscriberData();

  if (!subscriber) return null;

  const subscriberName = `${subscriber.firstName} ${subscriber.lastName}`;

  // Option 1: Using WelcomeBanner
  return (
    <WelcomeBanner
      title={`Welcome, ${subscriberName}`}
      subtitle={
        meta.groupNumber === '129800'
          ? 'Plan changes related to qualifying events will be effective based on the event date.'
          : 'Plan changes will be effective on the 1st day of the following month.'
      }
    />
  );

  // Option 2: Using InfoCard
  return (
    <InfoCard>
      <Title text={`Welcome, ${subscriberName}`} />
      <TextBox text="You can make benefit changes, update personal information..." />
      {meta.groupNumber === '129800' && (
        <TextBox text="Plan changes related to qualifying events will be effective based on the event date." />
      )}
    </InfoCard>
  );
}
```

### Replace Form Tabs

**Current Implementation:**

```tsx
// Custom tabs with manual styling
export function FormTabs({ tabs, activeTabIndex, setActiveTabIndex }) {
  // ...
  return (
    <Section>
      <ProgressBar height={4} completePercent={completePercent} />
      <Row className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {/* Custom tab rendering */}
        </nav>
      </Row>
    </Section>
  );
}
```

**Recommended Implementation:**

```tsx
import { BreadCrumb } from '@/components/composite/BreadCrumb';
import { ProgressBar } from '@/components/foundation/ProgressBar';
import { Section } from '@/components/foundation/Section';

export function FormTabs({ tabs, activeTabIndex, setActiveTabIndex }) {
  const router = useRouter();
  const completionStatus = useFormCompletion();

  // Calculate progress
  const completedSteps = Object.values(completionStatus).filter(Boolean).length;
  const totalSteps = Object.keys(completionStatus).length;
  const completePercent = (completedSteps / totalSteps) * 100;

  // Convert tabs to breadcrumb format
  const breadcrumbItems = tabs
    .filter((tab) => tab.isEnabled())
    .map((tab, index) => ({
      text: tab.label,
      url: tab.path,
      isActive: index === activeTabIndex,
      isComplete: completionStatus[tab.section],
      callback: () => {
        setActiveTabIndex(index);
        router.push(tab.path);
      },
    }));

  return (
    <Section>
      <ProgressBar height={4} completePercent={completePercent} />
      <BreadCrumb items={breadcrumbItems} />
    </Section>
  );
}
```

### Replace Dependent Management UI

**Current Implementation:**

```tsx
// Custom dependent UI with manual add/remove
{
  watch('dependents.add.dependents')?.map((dep: Dependent, index: number) => (
    <div key={dep.id || index} className="p-4 border rounded-md mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">Dependent #{index + 1}</h3>
        <button
          type="button"
          className="text-red-600"
          onClick={() => removeDependent(dep.id || '')}
        >
          Remove
        </button>
      </div>
      {/* Form fields */}
    </div>
  ));
}
```

**Recommended Implementation:**

```tsx
import { UpdateRowWithStatus } from '@/components/composite/UpdateRowWithStatus';
import { StepUpDown } from '@/components/foundation/StepUpDown';

// For dependent count management
<StepUpDown
  label="Number of Dependents"
  initialValue={dependentCount}
  minValue={0}
  maxValue={9}
  onIncrease={() => handleAddDependent()}
  onDecrease={() => handleRemoveLastDependent()}
/>;

// For dependent display and management
{
  watch('dependents.add.dependents')?.map((dep: Dependent, index: number) => (
    <UpdateRowWithStatus
      key={dep.id || index}
      title={`Dependent #${index + 1}`}
      subtitle={`${dep.firstName} ${dep.lastName}`}
      status="Added"
      onDelete={() => removeDependent(dep.id || '')}
    >
      {/* Form fields remain the same */}
    </UpdateRowWithStatus>
  ));
}
```

### Replace Plan Selection UI

**Current Implementation:**

```tsx
// Custom plan cards
{
  planOptions.map((plan) => (
    <Card
      key={plan.id}
      type="elevated"
      className={`cursor-pointer transition-all ${
        selectedPlanId === plan.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => togglePlanDetails(plan.id)}
    >
      {/* Plan details */}
    </Card>
  ));
}
```

**Recommended Implementation:**

```tsx
import { AccordionListCard } from '@/components/composite/AccordionListCard';
// OR for full implementation
import { PlanSwitcherComponent } from '@/components/composite/PlanSwitcherComponent';

// Option 1: Using AccordionListCard
{
  planOptions.map((plan) => (
    <AccordionListCard
      key={plan.id}
      title={plan.name}
      subtitle={`${plan.type} - $${plan.premium}/month`}
      isSelected={selectedPlanId === plan.id}
      onSelect={() => setValue('planSelection.selectedPlanId', plan.id)}
      expanded={expandedPlanId === plan.id}
      onToggleExpand={() => togglePlanDetails(plan.id)}
    >
      {/* Plan details content */}
    </AccordionListCard>
  ));
}

// Option 2: Using PlanSwitcherComponent for complete functionality
<PlanSwitcherComponent
  plans={planOptions.map((plan) => ({
    id: plan.id,
    name: plan.name,
    type: plan.type,
    premium: plan.premium,
    details: {
      deductible: plan.deductible,
      outOfPocketMax: plan.outOfPocketMax,
      // Map other details
    },
  }))}
  selectedPlanId={selectedPlanId}
  onPlanSelect={(planId) => setValue('planSelection.selectedPlanId', planId)}
/>;
```

## Implementation Examples

### Special Enrollment Section

```tsx
'use client';

import { CalendarField } from '@/components/foundation/CalendarField';
import { AlertBar } from '@/components/foundation/AlertBar';
import { Section } from '@/components/foundation/Section';
import { Row } from '@/components/foundation/Row';
import { Column } from '@/components/foundation/Column';
import { Title } from '@/components/foundation/Title';
import { Card } from '@/components/foundation/Card';
import { TextBox } from '@/components/foundation/TextBox';
import { Radio } from '@/components/foundation/Radio';
import { alertBlueIcon } from '@/components/foundation/Icons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface SpecialEnrollmentData {
  eventType: string;
  eventDate: string;
  effectiveDate: string;
}

export function SpecialEnrollmentSection() {
  const { watch, setValue } = useFormContext();
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

  return (
    <Section>
      <div className="w-full">
        <Title text="Special Enrollment Information" />

        <Card type="elevated" className="mb-4">
          <Row>
            <Image src={alertBlueIcon} alt="info" className="size-6 mr-2" />
            <TextBox text="Please select the reason for the change..." />
          </Row>
        </Card>

        {validationErrors.length > 0 && <AlertBar alerts={validationErrors} />}

        <div className="space-y-6">
          {/* Event Type Selection */}
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

          {/* Event Date Selection */}
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

          {/* Effective Date Selection */}
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
```

## Best Practices

1. **Component Usage**

   - Use `Section` for main form sections
   - Use `Card` with `type="elevated"` for info messages
   - Use `Row` and `Column` for layout structure
   - Use `AlertBar` for validation messages
   - Use `Radio` for option selection
   - Use `CalendarField` for date inputs
   - Use shared composite components whenever possible instead of creating custom implementations

2. **Form State Management**

   - Use `react-hook-form` for form state
   - Use `watch` to track field changes
   - Use `setValue` for controlled inputs
   - Use local state for UI-specific state (validation errors, computed options)

3. **Date Handling**

   - Use business rules to determine min/max dates
   - Provide clear error messages for date restrictions
   - Calculate effective dates based on event type and date
   - Format dates consistently using helper functions
   - Use `CalendarField` for all date inputs to ensure consistent behavior

4. **Validation**

   - Validate dates against business rules
   - Show validation errors using `AlertBar`
   - Disable invalid date selections using min/max props
   - Provide clear error messages
   - Consider using `ErrorCard` for section-specific validation errors

5. **Layout Structure**
   - Use semantic HTML structure
   - Use consistent spacing with utility classes
   - Group related fields within `Section`
   - Use `Card` for visual separation
   - Use `AccordionListCard` for expandable content sections

## Integration with Form Architecture

1. **Client Components**

   - Mark form sections with `'use client'`
   - Use hooks for form state and validation
   - Handle user interactions and updates
   - Import components directly from the foundation or composite directories

2. **Component Composition**

   - Use foundation components for UI elements
   - Combine layout components for structure
   - Add feedback components for user interaction
   - Use composite components for complex UI patterns

3. **State Management**

   - Use form context for form state
   - Use local state for UI elements
   - Update parent components through callbacks
   - Follow consistent patterns for form state updates

4. **Validation Flow**
   - Validate on field change
   - Show immediate feedback
   - Prevent invalid submissions
   - Use shared error presentation components

## Refactoring Strategy

When replacing custom components with shared portal components:

1. **Start incrementally** - Replace one component at a time, testing thoroughly
2. **Focus on high-value targets** - Prioritize components with complex behavior
3. **Maintain consistent imports** - Import directly from foundation/composite directories
4. **Preserve business logic** - Keep existing validation and business rules
5. **Update tests** - Ensure tests are updated to match new component structure

## Testing Guidelines

1. **Component Testing**

   - Test form validation rules
   - Verify date calculations
   - Check error message display
   - Validate option generation

2. **Integration Testing**

   - Test form submission flow
   - Verify state updates
   - Check cross-field validation

3. **UI Testing**
   - Test responsive layout
   - Verify accessibility
   - Check error states
