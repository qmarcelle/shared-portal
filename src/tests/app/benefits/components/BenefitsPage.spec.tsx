import BenefitsAndCoveragePage from '@/app/(common)/myplan/benefits/page';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const renderUI = async () => {
  const page = await BenefitsAndCoveragePage();
  return render(page);
};

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
});
