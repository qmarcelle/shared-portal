import { WellnessInfo } from '@/app/myHealth/components/WellnessInfo';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <WellnessInfo
      header="Active Rewards - Employer Provided Reward"
      subHeader="Wellness Rewards"
      bodyText="Complete wellness tasks to earn rewards provided by your employer."
      buttonText="Learn More"
      className="section"
    />,
  );
};

describe('WellnessInfoSection', () => {
  it('should render the UI correctly for Active Rewards - Employer Provided Reward', async () => {
    const component = renderUI();
    expect(
      screen.getByText('Active Rewards - Employer Provided Reward'),
    ).toBeVisible();
    expect(screen.getByText('Wellness Rewards')).toBeVisible();
    expect(
      screen.getByText(
        'Complete wellness tasks to earn rewards provided by your employer.',
      ),
    ).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
