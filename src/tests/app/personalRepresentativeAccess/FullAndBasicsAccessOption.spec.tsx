import FullAndBasicAccessOption from '@/app/personalRepresentativeAccess/components/FullAndBasicAccessOption';
import { AccessType } from '@/app/personalRepresentativeAccess/journeys/EditLevelOfAccess';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = (selectedValue: AccessType, isMaturedMinor: boolean) =>
  render(
    <FullAndBasicAccessOption
      accessType={selectedValue}
      isMaturedMinor={isMaturedMinor}
    />,
  );
describe('Full And Basics Access Option', () => {
  it('should render the UI correctly for true', () => {
    const component = renderUI('basic', false);
    expect(screen.getByText('Basic Access'));
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render the UI correctly for false', () => {
    const component = renderUI('full', true);
    expect(screen.getByText('Authorization Form: Full Access +'));
    expect(
      screen.getByText(
        'You are asking BlueCross BlueShield of Tennessee (BlueCross or BCBSTN), and the people and other companies who work with BlueCross, to give your Personal Representative and anyone they choose Full Access to all your health information, including your highly sensitive health information. Full Access means that we can share any information we have about you anywhere in our company with your Personal Representative and anyone they choose. Any part of our company can share your information, including our Member Portal, the BCBSTN mobile application, Member Services and our care coordinators, and we can share it in any way, including through phone, fax, email, and application programming interfaces (APIs). Your Personal Representative may use our interoperability services to share your information with anyone they choose, including third-party applications, health care providers, other health plans, and the people and companies who work with them. By clicking the',
      ),
    );
    expect(component.baseElement).toMatchSnapshot();
  });
});
