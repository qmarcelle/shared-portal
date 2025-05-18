import { HealthProgramsResources } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/components/HealthProgramsResources';
import { HealthProgramType } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';
import { healthProgramsandResourcesDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/models/health_programs_resources';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <HealthProgramsResources
      healthProgramDetails={healthProgramsandResourcesDetails.get(
        HealthProgramType.TeladocHealthGeneralUrgentCare,
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
      teladocEligible: false,
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

describe('TeladocHealthGeneralUrgentCareHealthProgram', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Teladoc Health General & Urgent Care',
    });
    screen.getByText(
      'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
    );
    screen.getByText(
      'The first time using this service, you’ll need to create an account.',
    );
    screen.getByRole('heading', {
      name: 'Why Use This Option',
    });
    screen.getByText('In-network & covered by your plan');
    screen.getByText('Available anytime 24/7');
    screen.getByText('Less expensive than urgent care or the ER');
    screen.getByText('Downloadable app, call or video chat available');
    screen.getByRole('heading', {
      name: 'Your Cost for This Option',
    });
    screen.getByText('Depending on the type of visit, you can expect to pay:');
    screen.getByText('$55 or less');
    screen.getByRole('heading', {
      name: 'This Option is Generally Good for:',
    });
    screen.getByText('Allergies, cold, fever or flu');
    screen.getByText('Skin condition (rashes or insect bites)');
    screen.getByText('Urinary tract infections');
    screen.getByText('Constipation or diarrhea');
    screen.getByText('Arthritis');
    screen.getByText('Earaches');
    screen.getByText('Nausea or vomiting');
    screen.getByText('Pink eye');
    screen.getByText('Sunburn');
    screen.getByText('Sore throat');
    screen.getByText('Backache');
    screen.getByText('Food poisoning');
    screen.getByText('Nasal congestion');
    expect(component).toMatchSnapshot();
  });
  it('should redirect to SSO link on click of Use Teladoc Health button', async () => {
    const component = renderUI();
    const mockAuth = jest.requireMock('src/auth').auth;
    vRules.user.vRules.teladocEligible = true;
    mockAuth.mockResolvedValueOnce(vRules);

    const button = screen.getByRole('button', {
      name: 'Use Teladoc Health',
    });

    fireEvent.click(button);

    expect(setHref).toHaveBeenCalledWith('/sso/launch?PartnerSpId=teladoc.com');

    expect(component).toMatchSnapshot();
  });
});
