import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.QuestSelect,
      )}
      sessionData={null}
    />,
  );
};

describe('Quest Select', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'QuestSelect Low-Cost Lab Testing',
    });
    screen.getByText(
      'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );

    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network with your plan*');
    screen.getByText('Pay lowest price in network for labs');
    screen.getByText(
      'No need to change your doctor — just show your QuestSelect card',
    );
    screen.getByText('Get access to your lab results online');

    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('Your lab benefits will apply when using QuestSelect.');

    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Blood samples');
    screen.getByText('Urine samples');
    screen.getByText('Throat cultures');
    screen.getByText('And more');

    expect(component).toMatchSnapshot();
  });
});
