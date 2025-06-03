# SSO Testing Dashboard

This is a comprehensive testing dashboard for the Single Sign-On (SSO) implementation. It provides a user-friendly interface to test all configured SSO providers in one place.

## Features

- **Categorized Providers**: SSO providers are grouped into categories for easier navigation
- **Filterable Interface**: Filter providers by category
- **Deep Links**: Pre-configured deep links for each provider
- **Modern UI**: Card-based layout with clear buttons for each SSO option

## How to Use

1. Navigate to `/sso/dummy` in the portal
2. Select a category from the dropdown to filter providers (or view all)
3. Find the provider you want to test
4. Click on the button for the default SSO experience or any of the specialized deep links
5. The SSO flow will open in a new tab

## Provider Categories

The dashboard organizes providers into the following categories:

- **Healthcare Providers**: Find a Doctor, Teladoc, Eyemed, etc.
- **Pharmacy Services**: CVS Caremark, etc.
- **Health & Wellness**: Blue365, On Life, ChipRewards, etc.
- **Financial Services**: Health Equity, HSA Bank, etc.

## Adding New Providers

When adding a new SSO provider to the system, make sure to add it to the testing dashboard by following these steps:

1. Add the provider ID and its implementation to the SSO system
2. In the `groupProviders` function, add your provider to the appropriate category group
3. If your provider has special deep links, add a conditional section to create those links

Example:

```typescript
// Add to the appropriate category
assignToGroup(process.env.NEXT_PUBLIC_IDP_NEW_PROVIDER || 'new-provider', 2); // Category 2 is Health & Wellness

// If you have special deep links, add a conditional section:
if (id === process.env.NEXT_PUBLIC_IDP_NEW_PROVIDER) {
  links.push(
    {
      name: 'Special Feature',
      url: `/sso/launch?PartnerSpId=${id}&target=special-feature`,
    },
    // ...more links
  );
}
```

## Troubleshooting

If you encounter issues with SSO testing:

1. Ensure you are logged in with a valid member account
2. Check the browser console for any errors
3. Verify that the provider ID and parameters are correct
4. Review the SSO service logs for more detailed error information
