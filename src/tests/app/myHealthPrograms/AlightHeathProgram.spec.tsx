import { HealthProgramsResources } from '@/app/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.Alight,
      )}
    />,
  );
};

describe('AlightSecondOption', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Alight Second Opinion Advice & Support',
    });
    screen.getByText(
      'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network & covered by your plan at no cost to you');
    screen.getByText(
      'Earn a $400 gift card if your doctor has suggested certain surgeries',
    );
    screen.getByText('Call, chat or email available');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('You can expect to pay:');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Speaking with an expert about your diagnosis');
    screen.getByText('Rare or life-threatening condition support');
    screen.getByText('Considering risky or complicated treatment');
    screen.getByText('Compare costs of treatment or tests');
    expect(component).toMatchSnapshot();
  });
});
