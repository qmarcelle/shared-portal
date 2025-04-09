import {
  benefits,
  claimsBenefitsCoverage,
  planDocuments,
  priorAuthorizations,
} from '@/components/foundation/Icons';

export const BlueCarePlanInformation = [
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
    label: 'Member Handbook',
    description:
      'Look in your member handbook to find your plan details and to help you get the most from your benefits.',
    iconName: planDocuments,
    link: '/url',
  },
];
