import { HealthProgramsResources } from '@/app/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.HingeHealth,
      )}
    />,
  );
};

describe('Hinge Health Back & Joint Care', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Hinge Health Back & Joint Care',
    });
    screen.getByText(
      'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('button', {
      name: 'Use Hinge Health',
    });
    screen.getByText('In-network & no cost to you');
    screen.getByText('Self-guided or coaching options available');
    screen.getByText('Downloadable app available');
    screen.getByText('Support in pain management');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('Depending on the type of visit, you can expect to pay:');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Back pain');
    screen.getByText('Wrist and ankle pain');
    screen.getByText('Pelvic pain and incontinence');
    screen.getByText('Neck and shoulder pain');
    screen.getByText('Pelvic strengthening');
    screen.getByText('Thighs and knee pain');
    screen.getByText('Shin and calve pain');
    screen.getByText('Feet pain');

    expect(component).toMatchSnapshot();
  });
});
