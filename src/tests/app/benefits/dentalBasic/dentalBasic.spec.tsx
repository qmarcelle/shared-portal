import DentalBasic from '@/app/benefits/dentalBasic/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
const renderUI = () => {
  return render(<DentalBasic />);
};

describe('DentalBasic', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    expect(screen.getByText('Dental Basic')).toBeVisible();
    // Query for multiple elements based on benefit titles
    const dentureRepair = screen.queryAllByText(
      /Denture Repair, Full or Partial/i,
    );
    expect(dentureRepair.length).toBe(2);

    const estheticCoated = screen.queryAllByText(
      /Esthetic Coated Stainless Steel Crown/i,
    );
    expect(estheticCoated.length).toBe(2);

    const coinsuranceText = screen.queryAllByText(
      '20% Coinsurance after you pay the deductible',
    );
    expect(coinsuranceText.length).toBe(16);

    const note1 = screen.queryAllByText('1 in a 24 month period');
    expect(note1.length).toBe(1);

    const note2 = screen.queryAllByText(
      '1 in a 36 month period, for primary teeth, limits with stainless steel crowns',
    );
    expect(note2.length).toBe(2);
    expect(screen.getByAltText('link')).toBeInTheDocument();
    expect(screen.getAllByText('Dental Balance'));
    expect(screen.getByText('Deductible')).toBeVisible();
    expect(screen.getByText('Out-of-Pocket')).toBeVisible();
    expect(screen.getByText('Services Used')).toBeVisible();
    expect(screen.getByText('90.0')).toBeVisible();
    screen.getByText('Member :');
    screen.getAllByText('Chris Hall');
    const baseUrl = window.location.origin;
    expect(
      screen.getAllByRole('link', {
        name: 'View Balances',
      })[0],
    ).toHaveProperty('href', `${baseUrl}/balances`);
    expect(
      screen.getAllByRole('link', {
        name: 'View Spending Accounts',
      })[0],
    ).toHaveProperty('href', `${baseUrl}/spendingAccounts`);

    expect(component.baseElement).toMatchSnapshot();
  });
});
