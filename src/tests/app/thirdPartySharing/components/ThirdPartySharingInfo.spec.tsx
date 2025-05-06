import { ThirdPartySharingInfo } from '@/app/(protected)/(common)/member/thirdPartySharing/components/ThirdPartySharingInfo';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<ThirdPartySharingInfo />);
};

describe('Third Party Sharing Info Component', () => {
  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Linked Apps & Websites' });
    screen.getByText(
      'Below are the apps and websites you’re sharing your information with.',
    );

    expect(component.baseElement).toMatchSnapshot();
  });
});
