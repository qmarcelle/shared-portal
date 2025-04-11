# Insurance Health Benefits Change (IHBC) Form

This module provides a comprehensive form for managing insurance health benefits changes, including personal information updates, dependent management, plan selection, and policy termination.

## Features

- Multi-step form with progress tracking
- Form validation using Zod schemas
- Autosave functionality
- Form analytics tracking
- Accessibility support
- Form state persistence
- Keyboard navigation
- Save & Exit functionality

## Usage

```tsx
import { FormLayout } from '@portal/ihbc-form';

export default function YourPage() {
  return <FormLayout>{/* Your form content */}</FormLayout>;
}
```

## Components

The form is composed of several sections:

- Personal Information
- Dependent Management
- Benefits Selection
- Special Enrollment
- Policy Termination
- Review & Submit

## Configuration

The form behavior can be customized through the following configuration options:

- Group-specific validation rules
- Custom plan options
- Special enrollment periods
- Termination rules

## Development

To modify or extend the form:

1. Update schemas in `lib/schemas.ts`
2. Add new components in `change-form/components/`
3. Update form sections in `change-form/[step]/`
4. Add new validation rules in `lib/validation.ts`

## Testing

Run tests with:

```bash
npm test -- --testPathPattern=forms/ihbc
```

## Dependencies

Required peer dependencies:

- react ^18.3.1
- react-dom ^18.3.1
- next 14.2.4

Core dependencies:

- @hookform/resolvers ^5.0.1
- zod ^3.24.2
- zustand ^4.5.6
- react-error-boundary ^5.0.0
- react-hook-form ^7.55.0
