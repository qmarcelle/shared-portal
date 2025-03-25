import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import {
  benefitsCoverage,
  claimsBenefitsCoverage,
  planDocuments,
  priorAuthorizations,
  spendingAccounts,
  spendingSummary,
} from '@/components/foundation/Icons';

export const ViewOtherPlanInformation = () => {
  const ViewOtherPlanInformationDetails = [
    {
      label: 'Benefits & Coverage',
      // eslint-disable-next-line quotes
      description: "View what's covered under your plan.",
      iconName: benefitsCoverage,
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
      link: '/priorAuth',
    },
    {
      label: 'Spending Accounts',
      description: 'Check your HSA, HRA or FSA accounts.',
      iconName: spendingAccounts,
      link: '/spendingAccount',
    },
    {
      label: 'Spending Summary',
      description:
        'Your annual statement shows claims we received and processed.',
      iconName: spendingSummary,
      link: '/spendingSummary',
    },
    {
      label: 'Plan Documents',
      description: 'Your important plan documents.',
      iconName: planDocuments,
      link: '/planDocuments',
    },
  ];

  return (
    <Column>
      {ViewOtherPlanInformationDetails.map((item) => {
        return (
          <InfoCard
            key={item.label}
            label={item.label}
            icon={item.iconName}
            body={item.description}
            link={item.link}
          />
        );
      })}
    </Column>
  );
};
