import { HealthProgramsResources } from '@/app/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.SilverFit,
      )}
    />,
  );
};

describe('Silver&Fit Fitness Program', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Silver&Fit Fitness Program',
    });
    screen.getByText(
      'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
    );
    screen.getByRole('button', {
      name: 'Use Silver&Fit',
    });
    screen.getByText('In-network & covered by your plan at no extra cost');
    screen.getByText('Discounted fitness memberships');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('You can expect to pay:');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Weight loss');
    screen.getByText('Getting fit');
    screen.getByText('At-home fitness');
    screen.getByText('Gym memberships');
    screen.getByText('Fitness tracking');
    expect(component).toMatchSnapshot();
  });
});
