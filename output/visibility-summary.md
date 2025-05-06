# Visibility Rules Usage Analysis

## Summary

- **Total Routes Analyzed**: 9
- **Total Unique Rule Flags**: 24
- **Routes with Visibility Logic**: 9
- **Routes without Visibility Logic**: 67

## Top 10 Most-Used Rule Flags

| Flag                                                 | Usage Count |
| ---------------------------------------------------- | ----------- |
| `isBlueCareEligible`                                 | 6           |
| `isEmboldHealthEligible`                             | 2           |
| `isTeladocPrimary360Eligible`                        | 2           |
| `isNewMentalHealthSupportAbleToEligible`             | 2           |
| `isNewMentalHealthSupportMyStrengthCompleteEligible` | 2           |
| `isHingeHealthEligible`                              | 2           |
| `isNurseChatEligible`                                | 2           |
| `isTeladocEligible`                                  | 2           |
| `isPrimaryCarePhysicianEligible`                     | 1           |
| `isQuantumHealthEligible`                            | 1           |

## Top 5 Rule Combinations

| Combination                                            | Usage Count |
| ------------------------------------------------------ | ----------- |
| `isEmboldHealthEligiblevisibilityRules &&`             | 2           |
| `if vRules.active && vRules.otcEnable`                 | 2           |
| `if vRules.commercial && vRules.bluePerksElig`         | 2           |
| `isEnrollEligiblerules && isBlueCareNotEligiblerules,` | 2           |
| `!isBlueCareEligiblevisibilityRules &&`                | 1           |

## Most Common Eligibility Helpers

| Helper Function                                      | Usage Count |
| ---------------------------------------------------- | ----------- |
| `isBlueCareEligible`                                 | 6           |
| `isEmboldHealthEligible`                             | 2           |
| `isTeladocPrimary360Eligible`                        | 2           |
| `isNewMentalHealthSupportAbleToEligible`             | 2           |
| `isNewMentalHealthSupportMyStrengthCompleteEligible` | 2           |
| `isHingeHealthEligible`                              | 2           |
| `isNurseChatEligible`                                | 2           |
| `isTeladocEligible`                                  | 2           |
| `isPrimaryCarePhysicianEligible`                     | 1           |
| `isQuantumHealthEligible`                            | 1           |

## Routes with Redundant Logic

No routes with redundant logic found.

## Routes with No Visibility Logic

These routes could potentially be moved to a `(public)` group:

- `/1095BFormRequest`
- `/accessOthersInformation`
- `/amplifyHealthSupport`
- `/authDetail`
- `/claim`
- `/claims`
- `/claims/submitAClaim`
- `/communicationSettings`
- `/embed/dxAuth`
- `/embed/logout`
- `/embed/security`
- `/error`
- `/findcare/primaryCareOptions`
- `/healthyMaternity`
- `/inbox`
- `/login`
- `/maintenance`
- `/medicalBenefitDetail`
- `/mentalHealthOptions`
- `/myPrimaryCareProvider`
- `/myhealth`
- `/myhealth/healthProgramsResources`
- `/myhealth/healthProgramsResources/myHealthPrograms`
- `/myhealth/healthprograms/health-library`
- `/myhealth/healthprograms/rewards`
- `/myhealth/healthprograms/wellness-center`
- `/myhealth/rewardsProgramsFAQs`
- `/myplan/benefits/balances`
- `/myplan/benefits/details`
- `/myplan/benefits/employerProvidedBenefits`
- `/myplan/benefits/identityProtectionServices`
- `/myplan/benefits/planDocuments`
- `/myplan/benefits/servicesUsed`
- `/myplan/idcard`
- `/myplan/katieBeckettBankingInfo`
- `/myplan/manageMyPolicy`
- `/myplan/planContactInformation`
- `/myplan/updateSocialSecurityNumber`
- `/otherProfileSettings`
- `/pharmacy`
- `/pharmacy/medicalPrescriptionPaymentPlan`
- `/pharmacy/pharmacyClaims`
- `/planselect/active`
- `/planselect/termed`
- `/priceDentalCare`
- `/priorAuth`
- `/priorAuthorization`
- `/reportOtherHealthInsurance`
- `/searchResults`
- `/security`
- `/shareMyInformation`
- `/sharingPermissions`
- `/spendingAccount`
- `/spendingAccounts`
- `/spendingSummary`
- `/sso/dummy`
- `/sso/launch`
- `/sso/redirect`
- `/support`
- `/support/faq`
- `/support/faqTopics`
- `/support/sendAnEmail`
- `/thirdPartySharing`
- `/transactions`
- `/understandingAccessOnMyPlan`
- `/updateMyPrimaryCareProvider`
- `/virtualCareOptions`

## Optimization Recommendations

### 1. Consider middleware-based route grouping (high impact)

Common rule patterns like "isEmboldHealthEligiblevisibilityRules &&" are used across 2 routes and could be centralized in Next.js middleware.

### 2. Identify public routes for optimization (low impact)

67 routes have no visibility checks. Consider moving them to a (public) group.

### 3. Standardize visibility helper usage (medium impact)

Helper "isBlueCareEligible" is used 6 times. Ensure consistent usage across the codebase.
