import { HealthProgramsResources } from '@/app/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocHealthDiabetesPrevention,
      )}
    />,
  );
};

describe('Teladoc Health Diabetes Prevention', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Health Diabetes Prevention Program',
    });
    screen.getByText(
      'Get a personal action plan, health coaching and a smart scale at no extra cost.',
    );
    screen.getByText(
      // eslint-disable-next-line quotes
      "The first time using this service, you'll need to create an account.",
    );

    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('If eligible, covered by your plan at no extra cost');
    screen.getByText('Dedicated expert coaching support');
    screen.getByText('Programs for healthy habits');
    screen.getByText('Free smart scale');

    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('If eligible, you can expect to pay:');

    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Viewing weight trends');
    screen.getByText('Expert coaching and advice');
    screen.getByText('Sharing reports with the doctor');
    screen.getByText('Personalized eating tips');
    screen.getByText('Setting goals and tracking progress');
    screen.getByText('Logging food');

    expect(component).toMatchSnapshot();
  });
});
