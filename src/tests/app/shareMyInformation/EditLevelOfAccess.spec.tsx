import {
  AccessType,
  EditLevelOfAccess,
} from '@/app/personalRepresentativeAccess/journeys/EditLevelOfAccess';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Edit Level Of Access Component', () => {
  const renderUI = (page: number, type: string, access: AccessType) =>
    render(
      <EditLevelOfAccess
        memberName="Chris"
        pageIndex={page}
        targetType={type}
        currentAccessType={access}
      />,
    );
  it('should render the UI correctly for subscriber', () => {
    const component = renderUI(0, 'subscriber', 'full');
    expect(screen.getByText('Edit Level Of Access')).toBeInTheDocument();
    expect(screen.getByText('Full Sharing')).toBeInTheDocument();
    expect(
      screen.getByText(
        'They won’t be able to see documents or claims with sensitive information.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Basic Sharing')).toBeInTheDocument();
    expect(
      screen.queryByText('They won’t see any documents and claims.'),
    ).not.toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render the UI correctly for subscriber', () => {
    const component = renderUI(0, 'dependant', 'basic');
    expect(screen.getByText('Edit Level Of Access')).toBeInTheDocument();
    expect(screen.getByText('Full Sharing')).toBeInTheDocument();
    expect(
      screen.getByText(
        'They won’t be able to see documents or claims with sensitive information.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('to remove the subscriber’s access.'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Basic Sharing')).toBeInTheDocument();
    expect(
      screen.getByText('They won’t see any documents and claims.'),
    ).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render the UI correctly for HIPPA page for full', () => {
    const component = renderUI(1, 'subscriber', 'full');
    expect(
      screen.getByText('HIPAA Authorization for Full Portal Access'),
    ).toBeInTheDocument();
    const saveButton = screen.getByText('Save Permissions');
    fireEvent.click(saveButton);
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render the UI correctly for HIPPA page for Basic', () => {
    const component = renderUI(1, 'subscriber', 'basic');
    expect(
      screen.getByText('HIPAA Authorization for Basic Portal Access'),
    ).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render the UI correctly for Success page', () => {
    const component = renderUI(2, 'dependant', 'full');
    expect(screen.getByText('Level Of Access Saved')).toBeInTheDocument();
    expect(component.baseElement).toMatchSnapshot();
  });
});
