import { PrimaryCareProvider } from '@/app/primaryCareOptions/components/PrimaryCareProvider';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PrimaryCareProvider
      className="large-section"
      memberName="John Hopkins"
      label="Primary Care Provider"
      address="John Hopkins Medical Center 123 Street Address Road City Town, TN 12345"
      linkLabel="View or Update Primary Care Provider"
      primaryPhoneNumber="(123) 456-7890"
      title="My Primary Care Provider"
    />,
  );
};

describe('FindInNetworkProviderSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('John Hopkins');
    screen.getByText('Primary Care Provider');
    screen.getByText(
      'John Hopkins Medical Center 123 Street Address Road City Town, TN 12345',
    );
    screen.getByText('View or Update Primary Care Provider');
    screen.getByText('My Primary Care Provider');
    expect(component).toMatchSnapshot();
  });
});
