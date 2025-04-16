import {
  benefits,
  claimsBenefitsCoverage,
  planDocuments,
  priorAuthorizations,
  spendingAccounts,
  spendingSummary,
} from '@/components/foundation/Icons';

export const CommercialPlanInformation = [
  {
    label: 'Benefits & Coverage',
    // eslint-disable-next-line quotes
    description: "View what's covered under your plan.",
    iconName: benefits,
    link: '/member/myplan/benefits',
  },
  {
    label: 'Claims',
    description: 'Search for claims and view details or submit a claim.',
    iconName: claimsBenefitsCoverage,
    link: '/member/myplan/claims',
  },
  {
    label: 'Prior Authorizations',
    description: 'Check the status of your prior authorizations.',
    iconName: priorAuthorizations,
    link: '/member/myplan/priorauthorizations',
  },
  {
    label: 'Spending Accounts',
    description: 'Check your HSA, HRA or FSA accounts.',
    iconName: spendingAccounts,
    link: '/member/myplan/spendingaccounts',
  },
  {
    label: 'Spending Summary',
    description:
      'Your annual statement shows claims we received and processed.',
    iconName: spendingSummary,
    link: '/member/myplan/spendingsummary',
  },
  {
    label: 'Plan Documents',
    description: 'Your important plan documents.',
    iconName: planDocuments,
    link: '/member/myplan/benefits/plandocuments',
  },
];
