import { MyHealthOffsiteLinkCard } from '@/app/myHealth/Components/MyHealthOffsiteLinkCard';
import { biometricScreeningIcon } from '@/components/foundation/Icons';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <MyHealthOffsiteLinkCard
      icon={biometricScreeningIcon}
      title="Schedule a Biometric Screening"
      description="We will help you schedule this important health screening and walk you through the steps to prepare for your doctor visit."
      url=""
    />,
  );
};

describe('MyHealthOffsiteLinkCard', () => {
  it('should render the  Biometric UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Schedule a Biometric Screening');
    screen.getByText(
      'We will help you schedule this important health screening and walk you through the steps to prepare for your doctor visit.',
    );
    expect(component).toMatchSnapshot();
  });
});
