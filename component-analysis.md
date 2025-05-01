# Component Analysis Report

## Overview

This report catalogs React components in the codebase and identifies potential duplicates or related components that could be consolidated during the Next.js 14 App Router refactoring process.

## Component Statistics

- **Foundation Components**: 50 components
- **Composite Components**: 41 components
- **Client Components**: 1 component
- **Server Components**: 1 component
- **Root-level Components**: 3 components

## Potential Duplicate Components

### Text Input Components

- TextField.tsx
- TextBox.tsx
- TextArea.tsx
  _Reason: Similar text input functionality_

### Search Components

- SearchField.tsx
- SearchTypeAhead.tsx
  _Reason: Search functionality overlap_

### Modal Components

- AppModal.tsx
- SideBarModal.tsx
- ChildAppModalBody.tsx
  _Reason: Modal UI components_

### Link Components

- AppLink.tsx
- HeaderLink.tsx
- InlineLink.tsx
  _Reason: Link functionality overlap_

### Header Components

- Header.tsx
- SiteHeader.tsx
- StiteHeaderServerWrapper.tsx (Note: possible typo in name)
  _Reason: Header UI components_

### Site Header Sections

- SiteHeaderNavSection.tsx
- SiteHeaderSubNavSection.tsx
- SiteHeaderSubNavItemSection.tsx
- SiteHeaderMenuSection.tsx
  _Reason: Related header section components_

### Error UI Components

- ErrorCard.tsx
- ErrorInfoCard.tsx
- ErrorDisplaySlide.tsx
  _Reason: Error display functionality_

### Info Card Components

- InfoCard.tsx
- DocumentInfoCard.tsx
  _Reason: Informational card UI_

### Modal Slide Components

- InitModalSlide.tsx
- InputModalSlide.tsx
- SelectModalSlide.tsx
- ChangeAuthDeviceSlide.tsx
- ConfirmTermsSlide.tsx
- ErrorDisplaySlide.tsx
- SuccessSlide.tsx
  _Reason: Modal slide UI components_

### List Card Components

- AccordionListCard.tsx
- TransactionListCard.tsx
  _Reason: List display cards_

### Item Components

- ClaimItem.tsx
- OnMyPlanItem.tsx
- TransactionItem.tsx
- ProfileHeaderCardItem.tsx
  _Reason: Item display components_

### Menu Navigation Components

- menuNavigation.tsx
- menuNavigationTermedPlan.tsx
  _Reason: Menu navigation functionality with specific variant_

### Profile Header Components

- ProfileHeaderCard.tsx
- ProfileHeaderCardItem.tsx
  _Reason: Profile header UI components_

### OnMyPlan Components

- OnMyPlanComponent.tsx
- OnMyPlanItem.tsx
  _Reason: OnMyPlan feature related components_

### Transaction Components

- TransactionItem.tsx
- TransactionListCard.tsx
  _Reason: Transaction display components_

### Claims Components

- ClaimItem.tsx
- ClaimsPageInformation.tsx
- ClaimsHelpCard.tsx
  _Reason: Claims related components_

## Recommendations

1. **Naming Conventions**: Standardize component naming patterns. For example, use consistent suffixes like "Card", "Item", etc.

2. **Component Consolidation**: Consider refactoring similar components into single, customizable components:

   - Merge text input components with prop-based variations
   - Create a unified Modal system with different presentation modes
   - Standardize the Header component hierarchy

3. **Type Safety**: Add stronger TypeScript interfaces for component props to ensure consistency

4. **Fix Typos**: Correct "StiteHeaderServerWrapper" to "SiteHeaderServerWrapper"

5. **Next.js App Router Strategy**: When migrating to Next.js 14 App Router:
   - Divide components into Client and Server components
   - Leverage the dynamic segments for tenant-specific overrides
   - Use the central routes registry for navigation consistency

This analysis aligns with the routing refactor plans in the routing-refactor.md document, particularly with dynamic routing and tenant-specific component variations.
