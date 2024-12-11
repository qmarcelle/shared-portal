import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TalkToNurse,
      )}
    />,
  );
};

describe('TalkToNurseHealthProgram', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Talk to a Nurse',
    });
    screen.getByText(
      'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care.',
    );
    screen.getByText(
      'Please note, nurses cannot prescribe medications. You can call anytime at',
    );
    screen.getByText('1-800-818-8581,');
    screen.getByText('1-800-308-7231.');
    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network & covered by your plan with no cost to you');
    screen.getByText('Connect anytime 24/7');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('You can expect to pay:');
    screen.getByText('$0');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Assessing symptoms and advice');
    screen.getByText('General health information');
    screen.getByText('Education and support on conditions or procedures');
    screen.getByText('Help making decisions for surgery or other treatments');
    expect(component).toMatchSnapshot();
  });
});
