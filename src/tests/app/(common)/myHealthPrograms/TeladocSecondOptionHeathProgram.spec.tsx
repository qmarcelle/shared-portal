import { HealthProgramsResources } from '@/app/(protected)/(common)/member/myhealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/(protected)/(common)/member/myhealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/(protected)/(common)/member/myhealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocSecondOption,
      )}
    />,
  );
};

describe('TeladocSecondOption', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Second Opinion Advice & Support',
    });
    screen.getByText(
      'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network & covered by your plan at no cost');
    screen.getByText(
      'Start your case by phone, online or on the Teladoc Health app',
    );

    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('You can expect to pay:');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Confirming a diagnosis');
    screen.getByText('Deciding on a treatment plan');
    screen.getByText('Getting expert guidance on a surgery');
    screen.getByText(
      'Providing answers to your questions about your diagnosis or recommended treatment',
    );
    expect(component).toMatchSnapshot();
  });
});
