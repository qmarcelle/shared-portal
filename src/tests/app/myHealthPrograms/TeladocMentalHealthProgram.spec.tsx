import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocMentalHealth,
      )}
    />,
  );
};

describe('Teladoc Mental Health Program', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Mental Health',
    });
    screen.getByText(
      'Speak with a therapist, psychologist or psychiatrist* seven days a week from anywhere.',
    );
    screen.getByText(
      // eslint-disable-next-line quotes
      "The first time using this service, you'll need to create an account.",
    );
    screen.getByRole('button', {
      name: 'Use Teladoc Health',
    });
    screen.getByText('In-network & covered by your plan');
    screen.getByText('Self-guided or live therapy options available');
    screen.getByText('Downloadable app, call or video chat available');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('Initial visit with a psychiatrist:');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Anxiety, stress, feeling overwhelmed');
    screen.getByText('Relationship conflicts');
    screen.getByText('Depression');
    screen.getByText('Trauma and PTSD');
    screen.getByText('Not feeling like yourself');
    screen.getByText('Mood swings');
    screen.getByText('Not wanting to get out of bed');
    screen.getByText('Medication management (Psychiatry only)');

    expect(component).toMatchSnapshot();
  });
});
