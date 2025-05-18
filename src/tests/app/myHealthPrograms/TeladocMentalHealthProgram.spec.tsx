import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocMentalHealth,
      )}
      sessionData={null}
    />,
  );
};
const vRules = {
  user: {
    currUsr: {
      plan: {
        memCk: '123456',
      },
    },
    vRules: {
      myStrengthCompleteEligible: false,
      terminated: false,
      wellnessOnly: false,
      fsaOnly: false,
      vision: true,
      futureEffective: false,
      katieBeckNoBenefitsElig: false,
    },
  },
};
jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

// @ts-ignore
delete window.location;
// @ts-ignore
window.location = new URL('https://localhost');
const setHref = jest
  .spyOn(window.location, 'href', 'set')
  .mockImplementation(() => {});
process.env.NEXT_PUBLIC_IDP_TELADOC = 'teladoc.com';

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
  it('should redirect to SSO link on click of Use Teladoc Health button', async () => {
    const component = renderUI();
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.myStrengthCompleteEligible = true;
    mockAuth.mockResolvedValueOnce(vRules);

    const button = screen.getByRole('button', {
      name: 'Use Teladoc Health',
    });

    fireEvent.click(button);

    expect(setHref).toHaveBeenCalledWith('/sso/launch?PartnerSpId=teladoc.com');

    expect(component).toMatchSnapshot();
  });
});
