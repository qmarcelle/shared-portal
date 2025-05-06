import FullAndBasicAccessOption from '@/app/(protected)/(common)/member/personalRepresentativeAccess/components/FullAndBasicAccessOption';
import { AccessType } from '@/app/(protected)/(common)/member/personalRepresentativeAccess/journeys/EditLevelOfAccess';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = (selectedValue: AccessType) =>
  render(
    <FullAndBasicAccessOption accessType={selectedValue} isMaturedMinor />,
  );
describe('Full And Basics Access Option', () => {
  it('should render the UI correctly for true', () => {
    const component = renderUI('basic');
    expect(screen.getByText('Grant Basic Access to Chris Hall'));
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render the UI correctly for false', () => {
    const component = renderUI('full');
    expect(
      screen.getByText(
        'HIPAA Authorization for Full Portal Access and Interoperability APIs',
      ),
    );
    expect(screen.getByText('Personal Representative Full Access'));
    expect(
      screen.getByText(
        'Demographic and contact information related to you and your family;',
      ),
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
