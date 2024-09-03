import { HealthProgramsResources } from '@/app/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.QuestSelect,
      )}
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
    expect(component).toMatchSnapshot();
  });
});
