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
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const ViewOtherPlanInformationDetails = [
  {
    label: 'Benefits & Coverage',
    description: 'View what&apos;s covered under your plan.',
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

const renderUI = () => {
  return render(
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
    </Column>,
  );
};

describe('View Other Plan Information', () => {
  it('should render UI correctly', () => {
    const component = renderUI();

    screen.getByText('Benefits & Coverage');
    screen.getByText('View what&apos;s covered under your plan.');
    expect(component.baseElement).toMatchSnapshot();

    screen.getByText('Claims');
    screen.getByText('Search for claims and view details or submit a claim.');
    expect(component.baseElement).toMatchSnapshot();

    screen.getByText('Prior Authorizations');
    screen.getByText('Check the status of your prior authorizations.');
    expect(component.baseElement).toMatchSnapshot();

    screen.getByText('Spending Accounts');
    screen.getByText('Check your HSA, HRA or FSA accounts.');
    expect(component.baseElement).toMatchSnapshot();

    screen.getByText('Spending Summary');
    screen.getByText(
      'Your annual statement shows claims we received and processed.',
    );
    expect(component.baseElement).toMatchSnapshot();

    screen.getByText('Plan Documents');
    screen.getByText('Your important plan documents.');
    expect(component.baseElement).toMatchSnapshot();
  });
});
