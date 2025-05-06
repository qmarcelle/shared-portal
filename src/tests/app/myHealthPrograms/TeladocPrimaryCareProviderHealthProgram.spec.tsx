import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocPrimaryCareProvider,
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
      primary360Eligible: false,
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

describe('TeladocPrimaryCareProviderHealthProgram', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Health Primary Care Provider',
    });
    screen.getByText(
      'With Primary 360, you can talk to a board-certified primary care doctor by video or phone, seven days a week.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network & covered by your plan');
    screen.getByText('See a PCP as early as the next day');
    screen.getByText('Downloadable app, call or video chat available');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('Depending on the type of visit, you can expect to pay:');
    screen.getByText('$99 or less');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Annual checkups and preventive care');
    screen.getByText('Prescriptions');
    screen.getByText('Lab orders and recommended screenings');
    screen.getByText('Referrals to in-network specialists');
    screen.getByText(
      'Support with long-term conditions like diabetes, hypertension and mental health',
    );
    expect(component).toMatchSnapshot();
  });
  it('should redirect to SSO link on click of Use Teladoc Health button', async () => {
    const component = renderUI();
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.primary360Eligible = true;
    mockAuth.mockResolvedValueOnce(vRules);

    const button = screen.getByRole('button', {
      name: 'Use Teladoc Health',
    });

    fireEvent.click(button);

    expect(setHref).toHaveBeenCalledWith('/sso/launch?PartnerSpId=teladoc.com');

    expect(component).toMatchSnapshot();
  });
});
