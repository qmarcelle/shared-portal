import { EditLevelOfAccess } from '@/app/personalRepresentativeAccess/journeys/EditLevelOfAccess';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Edit Level Of Access Component', () => {
  it('should render the UI correctly', () => {
    const component = render(
      <EditLevelOfAccess
        memberName="Chris"
        pageIndex={0}
        currentAccessType="full"
        isMaturedMinor
      />,
    );
    expect(screen.getByText('Edit Level Of Access')).toBeInTheDocument();
    expect(screen.getByText('Full Access')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your Representative will have access to all documents and claims, even those with sensitive information',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Basic Access')).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
