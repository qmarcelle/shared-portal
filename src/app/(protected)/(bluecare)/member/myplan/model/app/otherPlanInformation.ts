import {
  benefits,
  claimsBenefitsCoverage,
  planDocuments,
  priorAuthorizations,
  spendingAccounts,
} from '@/components/foundation/Icons';

export const OtherPlanInformation = [
  {
    label: 'Benefits & Coverage',
    // eslint-disable-next-line quotes
    description: "View what's covered under your plan.",
    iconName: benefits,
    link: '/benefits',
  },
  {
    label: 'Claims',
    description: 'Search for claims and view details or submit a claim.',
    iconName: claimsBenefitsCoverage,
    link: '/claims',
  },
  {
    label: 'Prior Authorizations',
    description: 'Check the status of your prior authorizations.',
    iconName: priorAuthorizations,
    link: '/priorAuthorization',
  },
  {
    label: 'Spending Accounts',
    description: 'Check your HSA, HRA or FSA accounts.',
    iconName: spendingAccounts,
    link: '/spendingAccounts',
  },
  {
    label: 'Plan Documents',
    description: 'Your important plan documents.',
    iconName: planDocuments,
    link: '/benefits/planDocuments',
  },
];
