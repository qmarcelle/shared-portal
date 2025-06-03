# Single Sign-On (SSO) Module

This module provides a comprehensive solution for handling Single Sign-On (SSO) with various healthcare service providers.

## Architecture

The SSO module follows an object-oriented approach with a clear separation of concerns:

1. **Provider Classes**: Each SSO provider has its own implementation class that extends a base provider class.
2. **Service Layer**: Business logic is encapsulated in service classes.
3. **Factory Pattern**: A factory class creates and manages provider instances.
4. **Configuration**: SSO settings are centralized in configuration files.

## Components

### Provider Structure

- **BaseProvider**: Abstract base class that all providers extend
- **Provider Implementations**: Classes for each specific SSO provider
- **ProviderFactory**: Factory class for creating provider instances

### Services

- **SSOService**: Core service for SSO operations
- **URLService**: Service for generating SSO URLs

### Configuration

- **config.ts**: Central configuration for all SSO providers
- **ssoConstants.ts**: Constants used across the SSO module

## Usage

### Basic SSO Operation

```typescript
import { URLService } from '@/app/sso';

// Generate an SSO URL
const ssoUrl = await URLService.generateSSOUrl('teladoc', '');

// Redirect to the SSO URL
window.location.href = ssoUrl;
```

### Custom Parameters

```typescript
import { SSOService } from '@/app/sso';

// Generate parameters for a provider
const member = await getMemberInfo();
const params = await SSOService.generateParameters('cvs-caremark', member, {
  target: 'refillRx',
});
```

### Provider Support Check

```typescript
import { SSOService } from '@/app/sso';

// Check if a provider supports drop-off SSO
const supportsDropOff = SSOService.supportsDropOff('teladoc');
```

## Extending the SSO Module

### Adding a New Provider

1. Create a parameter interface in `models/types.ts`
2. Create a provider implementation in `providers/implementations/`
3. Register the provider in the `ProviderFactory`
4. Add provider configuration in `config.ts`

Example new provider:

```typescript
// 1. Define parameters interface
export interface NewProviderParameters extends BaseSSOParameters {
  clientId?: string;
  groupId?: string;
}

// 2. Create provider implementation
export default class NewProvider extends BaseProvider {
  constructor() {
    super('new-provider', 'New Provider Name');
  }

  async generateParameters(
    member: LoggedInMember,
    searchParams?: Record<string, string>,
  ): Promise<NewProviderParameters> {
    return this.withErrorHandling(async () => {
      // Generate parameters
      return {
        subject: member.userId,
        clientId: 'client-123',
      };
    });
  }

  supportsDropOff(): boolean {
    return true;
  }
}

// 3. Register provider in ProviderFactory.ts
import NewProvider from './implementations/NewProvider';

const providers = {
  // ...existing providers
  NewProviderImpl: new NewProvider(),
};
```

## API Reference

### SSOService

- `performDropOffSSO(providerId: string): Promise<string>`
- `generateParameters(providerId: string, member: LoggedInMember, searchParams?: Record<string, string>): Promise<Map<string, string>>`
- `supportsDropOff(providerId: string): boolean`
- `getProviderName(providerId: string): string`

### URLService

- `generateDropOffSSOUrl(providerId: string, searchParams?: Record<string, string>): Promise<string>`
- `buildDirectSSOUrl(searchParams: string): string`
- `generateSSOUrl(providerId: string, searchParamsString: string, searchParams?: Record<string, string>): Promise<string>`
