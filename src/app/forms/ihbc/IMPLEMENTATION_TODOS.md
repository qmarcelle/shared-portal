# IHBC Change Form Implementation TODOs

This document provides a comprehensive overview of all remaining implementation tasks for the IHBC Change Form, organized by priority and component. These TODOs are derived from the business requirements specified in the Comprehensive Business Rules document.

## CRITICAL Priority Items

These items must be addressed before the form can be considered functional and secure.

### Dependencies and Setup

- [ ] Fix missing Zod dependency - add to package.json
- [ ] Fix dependency errors with @hookform/resolvers/zod and react-error-boundary
- [ ] Implement full Zod schema integration for form validation

### Data Security

- [ ] Implement proper data sanitization before persistence (for PII/PHI)
- [ ] Add encryption for sensitive data stored in browser
- [ ] Enhance data security with encryption for all persisted data
- [ ] Add data masking for all PII/PHI in local storage
- [ ] Implement storage timeout and automatic purging of sensitive data
- [ ] Add audit logging for all data access and modifications

### Server Integration

- [ ] Implement actual database integration for storing form data
- [ ] Add proper security checks and input validation
- [ ] Implement audit logging for compliance
- [ ] Implement actual database save operation with transaction support
- [ ] Add integration with document storage service for PDFs
- [ ] Implement secure PDF generation and storage

### Validation

- [ ] Implement complete validation for all form sections
- [ ] Implement dependent eligibility validation
  - Date of birth validation for child age limits (under 26 for most dependents)
  - Special handling for disabled adult dependents
  - Validation preventing duplicate SSNs across dependents
  - Documentation requirements for certain dependent types
  - Group-specific dependent eligibility rules
- [ ] Implement special enrollment enhancements
  - Documentation requirement validation for each event type
  - Effective date calculation based on event type and group rules
  - Validation that qualifying event matches the changes being made
  - Group-specific qualifying event options and constraints
- [ ] Implement form-level validation
  - Cross-section validation for interdependent fields
  - Validation for mutually exclusive options
  - Maximum field lengths across all sections
  - Group-specific validation rules
  - Proper error message formatting with specific guidance
- [ ] Implement real validation functions
  - Replace placeholder validation functions with actual implementations
  - Use Zod schemas for validation and error generation
  - Add specific error messages with suggested corrections
  - Field-level and form-level validation

### API Integration

- [ ] Implement API integration to fetch actual plan options from backend
- [ ] Implement group-specific plan filters and options

### Testing

- [ ] Add tests for group-specific termination rules (group 129800 has different constraints)

## HIGH Priority Items

These items are important for proper functionality but can be addressed after the critical items.

### Form Navigation and UX

- [ ] Add autosave functionality with optimistic UI updates
- [ ] Implement group-specific form layout variations
- [ ] Replace mock schema with actual Zod schema implementation
- [ ] Implement context-aware validation based on form section
- [ ] Add custom validation messages for business-specific rules
- [ ] Implement additional tabs:
  - Dependents tab with conditional enabling
  - Benefits tab with plan selection options
  - Special Enrollment tab for qualifying events
  - Review & Submit tab with summary
  - Termination tab for policy cancellation
- [ ] Implement form navigation enhancements:
  - "Save and Exit" functionality
  - Confirmation dialog when leaving with unsaved changes
  - Form recovery for browser crashes or session timeouts
  - Detailed validation error summary

### Store Enhancements

- [ ] Implement proper data versioning to handle form structure changes
- [ ] Add automatic conflict resolution for concurrent edits
- [ ] Implement more secure ID generation
  - Avoids collisions even with high concurrent users
  - Not sequentially predictable for security
  - Includes group-specific prefixing based on business rules
- [ ] Implement selection rule enhancements:
  - Group-specific selection options and constraints
  - Automatic selection of required sections based on qualifying events
  - Special enrollment period validation and tracking
  - Selection restriction based on subscriber status and previous changes
- [ ] Implement dependent management enhancements:
  - Support for dependent eligibility verification workflow
  - Special handling for dependents with active claims
  - Integration with premium calculation based on dependent count
  - Proper validation for adding/removing dependents mid-benefit period
- [ ] Implement additional section validation:
  - Deep validation of each section's required fields
  - Cross-section validation for interdependent data
  - Group-specific section completion rules
  - Special validation for conditional fields

### Component Enhancements

- [ ] Implement age validation for dependents - child dependents must be under 26 years old
- [ ] Add validation to prevent duplicate SSNs across all dependents
- [ ] Implement tobacco use surcharge calculation integration with premium calculation hook
- [ ] Implement Remove Dependents section with similar structure to Add Dependents
- [ ] Add field for reason for removal and effective date of removal
- [ ] Implement the following business rules in DependentsSection:
  - Allow maximum of 9 dependents total (1 spouse + 8 children or 9 children)
  - Validate dependent eligibility based on relationship
  - Handle special rules for disabled dependents over 26
  - Implement removing dependent functionality
- [ ] Add premium calculation based on dependent count and tobacco use
- [ ] Implement plan comparison feature to compare up to 3 plans side-by-side
- [ ] Implement dental plan selection section
- [ ] Implement vision plan selection section
- [ ] Implement plan availability filtering based on subscriber zip code and group number
- [ ] Implement metal tier filtering option (Bronze, Silver, Gold, Platinum)
- [ ] Implement special logic for grandfathered plans and limited enrollment periods
- [ ] Implement different premium calculations based on group rules

### Schema Improvements

- [ ] Add schema improvements:
  - Replace "any" types with proper type definitions
  - Add explicit refinement for mutual exclusivity rules
  - Implement group-specific schema variations
  - Add validation for dependent relationships and eligibility
- [ ] Implement personal info enhancements:
  - Add name change reason and documentation requirement
  - Implement SSN/TIN validation with proper format
  - Add validation for tobacco use date (should be within past 12 months)
  - Implement preferred language and communication preference options
- [ ] Implement benefits schema enhancements:
  - Add validation for plan availability based on group number and service area
  - Implement network/tier selection validation
  - Add validation for metal tier selection options
  - Implement voluntary benefits selection (life, disability, etc.)
- [ ] Implement termination schema enhancements:
  - Add date validation for termination (must be last day of month, future date)
  - Implement validation for notice period requirements (30 days for voluntary)
  - Add validation for new coverage details when "Obtained Other Coverage"
  - Implement acknowledgments validation for different termination reasons
- [ ] Implement type definition enhancements:
  - Remove any "any" types and replace with proper typed definitions
  - Add proper JSDoc comments for all type definitions
  - Implement proper typing for form state transitions
  - Add discriminated unions for conditional form sections

### Server Actions

- [ ] Add error handling with specific error types
- [ ] Add audit logging for all save operations
- [ ] Implement email notifications with submission details
- [ ] Add audit logging for compliance purposes
- [ ] Implement real operations in submitApplication:
  - Save the form data to a database with proper transaction handling
  - Upload the PDF to a document storage service with security controls
  - Send notifications/emails to both the user and administrators
  - Log the submission for compliance and auditing
  - Implement workflow routing based on form content
- [ ] Implement actual database save operation for saveFormProgress
- [ ] Implement actual database delete/archive operation for deleteApplication
- [ ] Add authorization check before deletion
- [ ] Ensure generateConfirmationNumber creates truly unique IDs by checking against existing IDs

### Testing

- [ ] Add tests for COBRA eligibility notification requirements
- [ ] Test PDF generation of termination forms
- [ ] Add date validation tests:
  - Test end-of-month termination rule (terminations must be on the last day of month)
  - Test special handling for mid-month termination for qualifying events
  - Test prevention of termination during premium grace period
- [ ] Add tests for acknowledgment scenarios:
  - Test different acknowledgment requirements based on termination reason
  - Test specific language requirements for different group numbers
  - Test conditional acknowledgments for dependents
- [ ] Add tests for business rules:
  - Test different termination constraints based on policy type
  - Test prorated premium calculation for mid-period terminations
  - Test handling of pending authorization requests during termination
  - Test retention policy validation (some groups require 12-month retention)

## MEDIUM Priority Items

These items improve usability and maintainability but are not critical for initial functionality.

### UI/UX Enhancements

- [ ] Add form analytics tracking for user progression
- [ ] Implement accessible keyboard navigation
- [ ] Add plan details modal with complete coverage information
- [ ] Implement network provider search integration
- [ ] Add warning when removing a dependent that has active claims
- [ ] Add date of birth validation to ensure it's not in the future
- [ ] Add warning for removing dependents in middle of benefit period
- [ ] Add voluntary benefits section (life, disability, etc.)
- [ ] Implement warning for plan changes outside of enrollment period
- [ ] Add sticky help panel with context-sensitive assistance
- [ ] Implement persistent premium calculation summary

### Schema and Validation Improvements

- [ ] Add localization support for validation messages
- [ ] Implement address enhancements:
  - Add ZIP code validation specific to covered service areas
  - Add county auto-detection based on ZIP code
  - Implement address standardization/verification
  - Add special handling for foreign addresses

### Server Actions

- [ ] Implement throttling to prevent abuse in saveApplicationDraft
- [ ] Add validation for file size and content
- [ ] Implement rate limiting for submissions
- [ ] Add throttling to prevent excessive saves in saveFormProgress
- [ ] Implement conflict resolution for concurrent edits
- [ ] Implement soft delete instead of hard delete
- [ ] Add audit logging for deletions
- [ ] Improve error messages to be more user-friendly
- [ ] Add localization support for error messages
- [ ] Consider using a more robust ID generation library
- [ ] Add group-specific prefixes to confirmation numbers

### Testing

- [ ] Add tests for termination with active claims
- [ ] Test API integration for termination submission
- [ ] Add tests for new coverage scenarios:
  - Test validation of coverage overlap periods
  - Test special handling for Medicare transition
  - Test employer information requirement for group-to-group transitions

## LOW Priority Items

These items enhance the user experience but can be implemented after the form is functional.

### UI/UX Improvements

- [ ] Add print-friendly version of the form
- [ ] Add accessibility features like screen reader announcements
- [ ] Implement address inheritance option (use subscriber address for dependents)
- [ ] Add "Save for Later" functionality to bookmark plans of interest

### Server Actions

- [ ] Add data compression for large form states
- [ ] Add recovery option for recently deleted applications
- [ ] Add error grouping by form section

## Component-Specific TODOs

### DependentsSection

- [ ] Implement age validation for dependents - child dependents must be under 26 years old (HIGH)
- [ ] Add validation to prevent duplicate SSNs across all dependents (HIGH)
- [ ] Implement tobacco use surcharge calculation integration with premium calculation hook (HIGH)
- [ ] Add warning when removing a dependent that has active claims (MEDIUM)
- [ ] Add date of birth validation to ensure it's not in the future (MEDIUM)
- [ ] Implement address inheritance option (use subscriber address for dependents) (LOW)
- [ ] Implement similar code for remove dependents section (HIGH)
- [ ] Implement business rules:
  - Allow maximum of 9 dependents total (1 spouse + 8 children or 9 children) (HIGH)
  - Validate dependent eligibility based on relationship (HIGH)
  - Handle special rules for disabled dependents over 26 (HIGH)
  - Implement removing dependent functionality (HIGH)
- [ ] Implement Remove Dependents section with similar structure to Add Dependents (HIGH)
- [ ] Add field for reason for removal and effective date of removal (HIGH)
- [ ] Implement warning for removing dependents in middle of benefit period (MEDIUM)

### PlanSelectionSection

- [ ] Implement API integration to fetch actual plan options from backend (CRITICAL)
- [ ] Implement group-specific plan filters and options (CRITICAL)
- [ ] Add premium calculation based on dependent count and tobacco use (HIGH)
- [ ] Implement plan comparison feature to compare up to 3 plans side-by-side (HIGH)
- [ ] Add plan details modal with complete coverage information (MEDIUM)
- [ ] Implement network provider search integration (MEDIUM)
- [ ] Add "Save for Later" functionality to bookmark plans of interest (LOW)
- [ ] Implement business rules:
  - Plan availability filtering based on subscriber zip code and group number (HIGH)
  - Metal tier filtering option (Bronze, Silver, Gold, Platinum) (HIGH)
  - Special logic for grandfathered plans and limited enrollment periods (HIGH)
  - Different premium calculations based on group rules (HIGH)
- [ ] Implement dental plan selection section (HIGH)
- [ ] Implement vision plan selection section (HIGH)
- [ ] Add voluntary benefits section (life, disability, etc.) (MEDIUM)
- [ ] Implement warning for plan changes outside of enrollment period (MEDIUM)

### FormLayout

- [ ] Fix dependency errors with @hookform/resolvers/zod and react-error-boundary (CRITICAL)
- [ ] Implement full Zod schema integration for form validation (CRITICAL)
- [ ] Add autosave functionality with optimistic UI updates (HIGH)
- [ ] Implement group-specific form layout variations (HIGH)
- [ ] Add form analytics tracking for user progression (MEDIUM)
- [ ] Implement accessible keyboard navigation (MEDIUM)
- [ ] Add print-friendly version of the form (LOW)
- [ ] Replace mock schema with actual Zod schema implementation (HIGH)
- [ ] Implement context-aware validation based on form section (HIGH)
- [ ] Add custom validation messages for business-specific rules (HIGH)
- [ ] Implement tabs:
  - Dependents tab with conditional enabling (HIGH)
  - Benefits tab with plan selection options (HIGH)
  - Special Enrollment tab for qualifying events (HIGH)
  - Review & Submit tab with summary (HIGH)
  - Termination tab for policy cancellation (HIGH)
- [ ] Implement form navigation enhancements:
  - "Save and Exit" functionality (HIGH)
  - Confirmation dialog when leaving with unsaved changes (HIGH)
  - Form recovery for browser crashes or session timeouts (HIGH)
  - Detailed validation error summary (HIGH)
- [ ] Add sticky help panel with context-sensitive assistance (MEDIUM)
- [ ] Implement persistent premium calculation summary (MEDIUM)
- [ ] Add accessibility features like screen reader announcements (LOW)

## Known Linter Errors to Fix

- Cannot find module 'zod' or its corresponding type declarations
- Cannot find module '@hookform/resolvers/zod' or its corresponding type declarations
- Cannot find module 'react-error-boundary' or its corresponding type declarations
- Cannot find module 'jest-axe' or its corresponding type declarations

## Dependency Installation Requirements

The following dependencies need to be installed:

```bash
npm install zod @hookform/resolvers/zod react-error-boundary jest-axe
```

---

This TODO list should be regularly updated as tasks are completed and new requirements are identified. All team members should reference this document when working on the IHBC Change Form implementation.
