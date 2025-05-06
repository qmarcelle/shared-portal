import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.AbleTo,
      )}
      sessionData={null}
    />,
  );
};

describe('Quest Select', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'AbleTo',
    });
    screen.getByText(
      'AbleTo’s personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );

    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network & covered by your plan');
    screen.getByText('Self-guided or coaching options available');
    screen.getByText('Work with a therapist or coach');

    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('Depending on your plan, you can expect to pay:');
    screen.getByText('$15 – $300');

    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Anxiety');
    screen.getByText('Depression');
    screen.getByText('Grief');
    screen.getByText('Stress');
    screen.getByText('Loneliness');
    screen.getByText('Social anxiety');
    screen.getByText('Self-care improvement');
    screen.getByText('Anxiety related to chronic pain');
    screen.getByText('Building healthier habits');

    expect(component).toMatchSnapshot();
  });
});
