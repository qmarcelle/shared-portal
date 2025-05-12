# Authentication Flow Overview

## Core Authentication Flows

### 1. Login Flow

**Path:** `/new_portal/app/(public)/login/`

The login flow handles user authentication through the following steps:

1. User enters username and password
2. Client collects device data via PingOne
3. Credentials and device data are sent to authentication service
4. Server validates credentials and assesses risk
5. On success: User is redirected to dashboard
6. On failure: Error message is displayed
7. On MFA required: User is directed to MFA flow

### 2. Multi-Factor Authentication (MFA)

**Path:** `/new_portal/app/(public)/login/components/MfaComponent.tsx`

The MFA flow supports multiple authentication methods:

1. User selects MFA method (SMS, email, authenticator app)
2. System sends verification code or prompts for authenticator code
3. User enters verification code
4. System validates code
5. On success: User is redirected to dashboard
6. On failure: Error message is displayed with retry option

### 3. Email Verification

**Path:** `/new_portal/app/(public)/login/components/LoginEmailVerification.tsx`

Email verification is used for:

1. New account registration
2. Email address changes
3. Security verification

The process includes:

1. System sends verification code to user's email
2. User enters verification code
3. System validates code
4. On success: User continues to next step (login or dashboard)
5. On failure: Error message is displayed with retry option

### 4. Password Reset

**Path:** `/new_portal/app/(public)/login/components/ResetPasswordComponent.tsx`

The password reset flow:

1. User requests password reset
2. System sends verification code to user's email
3. User enters verification code
4. User creates new password
5. System updates password
6. User is redirected to login

## Integration Components

### PingOne Integration

**Path:** `/new_portal/app/(protected)/amplify/member/pingOne/setupPingOne.ts`

PingOne provides device profiling and risk assessment:

1. Device fingerprinting
2. Risk score calculation
3. Anomaly detection

For detailed information, see [PingOne Integration](./pingone-integration.md).

## State Management

Authentication state is managed using Zustand stores:

1. **`loginStore.ts`**: Handles login credentials and API interactions
2. **`mfaStore.ts`**: Manages MFA device selection and verification
3. **`verifyEmailStore.ts`**: Controls email verification process
4. **`passwordResetStore.ts`**: Manages password reset flow

## Error Handling

The authentication system handles various error scenarios:

1. Invalid credentials
2. Account lockout
3. Network issues
4. MFA verification failures
5. Session expiration

Errors are displayed to users with appropriate guidance for resolution.

## Security Considerations

1. All API requests use HTTPS
2. Credentials are never stored in local storage
3. Session tokens have appropriate expiration
4. PingOne provides additional security through device profiling
5. Multiple failed attempts trigger account protection measures