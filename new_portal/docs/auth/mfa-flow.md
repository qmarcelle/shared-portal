# Multi-Factor Authentication (MFA) Flow

## Overview

The Multi-Factor Authentication (MFA) flow provides an additional layer of security during the login process. After a user successfully authenticates with their username and password, they may be required to complete a second verification step using one of several available MFA methods.

## Flow Components

### 1. MFA Selection

**Path:** `/new_portal/app/(public)/login/components/MfaSelection.tsx`

This component allows users to:
- View available MFA methods linked to their account
- Select their preferred method for this login session
- Request a new verification code if needed

### 2. MFA Verification

Multiple components handle different MFA methods:

- **SMS/Email OTP**: `/new_portal/app/(public)/login/components/OtherMfaEntry.tsx`
- **Authenticator App**: `/new_portal/app/(public)/login/components/AuthenticatorAppMfa.tsx`

### 3. Error Handling

Special error components handle edge cases:
- **Multiple Failed Attempts**: `/new_portal/app/(public)/login/components/MultipleAttemptsErrorComponent.tsx`
- **Security Code Multiple Attempts**: `/new_portal/app/(public)/login/components/MFASecurityCodeMultipleAttemptComponent.tsx`

## MFA Methods

### SMS Verification
1. User selects SMS verification
2. System sends a one-time code to user's registered phone
3. User enters the code
4. System validates the code
5. On success: User completes login
6. On failure: Error message is displayed with retry option

### Email Verification
1. User selects email verification
2. System sends a one-time code to user's registered email
3. User enters the code
4. System validates the code
5. On success: User completes login
6. On failure: Error message is displayed with retry option

### Authenticator App
1. User selects authenticator app verification
2. User opens their authenticator app (Google Authenticator, Microsoft Authenticator, etc.)
3. User enters the current code from the app
4. System validates the code
5. On success: User completes login
6. On failure: Error message is displayed with retry option

## State Management

MFA state is managed in the `mfaStore.ts` Zustand store:

**Path:** `/new_portal/app/(public)/login/stores/mfaStore.ts`

This store handles:
- Available MFA devices
- Selected MFA method
- Verification code entry
- API interactions for validation
- Error states

## Server Actions

MFA verification is processed by server actions:

**Path:** `/new_portal/app/(public)/login/actions/mfa.ts`

These actions:
1. Receive the verification code and device selection
2. Validate the code against the authentication service
3. Return success or failure with appropriate messages
4. Handle session creation on successful verification

## Security Considerations

1. Verification codes have short expiration times (typically 5-10 minutes)
2. Multiple failed attempts may trigger temporary account lockouts
3. Users can report suspicious MFA requests
4. All MFA interactions are logged for security auditing

## Edge Cases

The MFA system handles several edge cases:

1. **Lost access to MFA device**: Users can contact support for account recovery
2. **Multiple failed attempts**: Temporary lockout with clear instructions
3. **Network issues during verification**: Graceful error handling with retry options
4. **Session expiration during MFA**: User is redirected to start of login flow