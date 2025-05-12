# PingOne Integration

## Overview

The PingOne integration provides device profiling and risk assessment capabilities for our authentication system. It helps detect suspicious login attempts and enhances security by analyzing device fingerprints and user behavior.

## Key Components

### 1. `setupPingOne.ts`

Located at: `/new_portal/app/(protected)/amplify/member/pingOne/setupPingOne.ts`

This module provides three main functions:

- **`onPingOneSignalsReady`**: Listens for the PingOne SDK initialization event
- **`initPingOne`**: Initializes the PingOne SDK with environment configuration
- **`getPingOneData`**: Retrieves risk assessment data from the PingOne SDK

### 2. Integration with Login Flow

The PingOne integration is used during the login process to:

1. Initialize device profiling when the application loads
2. Collect device data during login attempts
3. Send this data to the authentication API for risk assessment

## Implementation Details

### SDK Initialization

The PingOne SDK is initialized client-side when the application loads. It sets up device identification and begins collecting telemetry data.

```typescript
// Example initialization
initPingOne();
```

### Data Collection During Login

During login, the `getPingOneData()` function is called to retrieve the device profile data, which is then sent along with login credentials:

```typescript
// From loginStore.ts
const pingOneData = await getPingOneData();
      
const response = await loginAction({
  username: state.username,
  password: state.password,
  pingOneData: pingOneData ?? undefined,
});
```

## Configuration

The PingOne integration uses the following environment variables:

- `NEXT_PUBLIC_ENV_ID`: The PingOne environment ID

## Security Considerations

- The PingOne SDK runs entirely client-side and collects device information
- No sensitive user data is collected by the SDK
- All communication with PingOne services is encrypted

## Troubleshooting

Common issues:

1. PingOne SDK not loading: Check browser console for network errors
2. Data collection failures: Verify that `initPingOne()` is called before attempting to get data
3. Risk assessment not working: Ensure environment variables are correctly configured

## Future Enhancements

- Add support for additional PingOne risk signals
- Implement adaptive authentication based on risk scores
- Integrate with fraud detection systems