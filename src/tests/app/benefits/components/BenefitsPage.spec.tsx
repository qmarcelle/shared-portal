import BenefitsAndCoveragePage from '@/app/benefits/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = async () => {
  const page = await BenefitsAndCoveragePage();
  return render(page);
};

const vRules = {
  user: {
    vRules: {
      dental: true,
      dentalCostsEligible: true,
      enableCostTools: true,
      vision: true,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Balances Page', () => {
  it('should render Dental coverage information on the Benefits & Coverage page', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    const component = await renderUI();

    expect(screen.getByText('Dental')).toBeVisible();
    expect(screen.getByText('Anesthesia')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
  it('should render Vision coverage information on the Benefits & Coverage page', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    mockedAxios.get.mockResolvedValueOnce({
      data: {},
    });

    const component = await renderUI();

    expect(screen.getByText('Vision')).toBeVisible();
    expect(screen.getByText('Visit EyeMed')).toBeVisible();
    expect(
      screen.getByText(
        'We work with EyeMed to provide your vision benefits. To manage your vision plan, visit EyeMed.',
      ),
    ).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });
});
