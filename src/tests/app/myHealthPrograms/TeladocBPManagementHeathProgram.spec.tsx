import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocBP,
      )}
    />,
  );
};

describe('Teladoc Health Blood Pressure Management Program', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Health Blood Pressure Management Program',
    });
    screen.getByText(
      'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('button', {
      name: 'Use Teladoc Health',
    });
    screen.getByText('If eligible, covered by your plan at no extra cost');
    screen.getByText('Personalized tips, action plans and 1-on-1 coaching');
    screen.getByText('Free smart blood pressure monitor');
    screen.getByText('Tips on nutrition, activity and more');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText(
      'If you have been diagnosed with high blood pressure, you can expect to pay:',
    );
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('High blood pressure management');
    screen.getByText('Meal planning');
    screen.getByText('Building healthy habits');

    expect(component).toMatchSnapshot();
  });
});
