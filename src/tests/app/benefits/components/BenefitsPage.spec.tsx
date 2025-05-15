import BenefitsAndCoveragePage from '@/app/benefits/page';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const renderUI = async () => {
  const page = await BenefitsAndCoveragePage();
  return render(page);
};

const vRules = {
  isMskEligible: true,
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          firstName: 'Chris',
          role: UserRole.MEMBER,
          plan: {
            memCk: '123456789',
          },
        },
        vRules: vRules,
      },
    }),
  ),
}));

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Benefits Page', () => {
  it('should display an error if the benefits data is not available', async () => {
    const { getByText } = await renderUI();

    expect(
      getByText(
        'There was a problem loading your benefit information. Please try again later.',
      ),
    ).toBeInTheDocument();
  });

  it('should show Joint Procedure component if MskEligible is true', async () => {
    vRules.isMskEligible = true;
    const component = await renderUI();
    waitFor(() =>
      expect(
        screen.queryByRole('heading', {
          name: 'Call Before Scheduling Your Joint Procedure',
        }),
      ).toBeInTheDocument(),
    );

    waitFor(() =>
      expect(
        screen.queryByText(
          'Your plan requires giving us a call before pursuing knee, hip, or spine procedures. Give us a call at ',
        ),
      ).toBeInTheDocument(),
    );
    expect(component).toMatchSnapshot();
  });

  it('should not show Joint Procedure component if MskEligible is false', async () => {
    vRules.isMskEligible = false;
    const component = await renderUI();
    waitFor(() =>
      expect(
        screen.queryByRole('heading', {
          name: 'Call Before Scheduling Your Joint Procedure',
        }),
      ).not.toBeInTheDocument(),
    );

    waitFor(() =>
      expect(
        screen.queryByText(
          'Your plan requires giving us a call before pursuing knee, hip, or spine procedures. Give us a call at ',
        ),
      ).not.toBeInTheDocument(),
    );
    expect(component).toMatchSnapshot();
  });
});
