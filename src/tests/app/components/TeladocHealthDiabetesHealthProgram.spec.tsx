import { HealthProgramsResources } from '@/app/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocHealthDiabetesManagement,
      )}
    />,
  );
};

describe('TeladocHealthDiabetesHealthProgram', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Health Diabetes Management Program',
    });
    screen.getByText(
      'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost to you.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('If eligible, covered by your plan at no extra cost');
    screen.getByText('Personalized tips, action plans and coaching');
    screen.getByText('Free smart meter and unlimited strips and lancets');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText(
      'If you have been diagnosed with type 1 or type 2 diabetes, you can expect to pay:',
    );
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Living with diabetes');
    screen.getByText('Receiving diabetes supplies');
    screen.getByText('Monitoring glucose');
    screen.getByText('Building healthy habits');
    expect(component).toMatchSnapshot();
  });
});
