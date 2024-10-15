import PrescriptionDrugs from '@/app/benefits/prescriptionDrugs/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
const renderUI = () => {
  return render(<PrescriptionDrugs />);
};
describe('Prescription Drugs Detail', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should render UI correctly', () => {
    const component = renderUI();
    expect(screen.getByText('Prescription Drugs')).toBeInTheDocument();
    expect(screen.getByText('Benefit Level 1'));
    expect(screen.queryAllByText('[Services performed by ...]')).toHaveLength(
      2,
    );
    expect(screen.getByText('Benefit Level 2')).toBeInTheDocument();

    expect(
      screen.getByText(
        'Benefit Level 1 Prescription Drugs, Generic x1 In-Network:',
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$15 Copay')).toHaveLength(2);
    expect(
      screen.getByText(
        'Benefit Level 2 Prescription Drugs, Generic x1 In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Prescription Drugs, Generic x1 Out-of-Network:'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('40$ Coinsurance after you pay deductible'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Prescription Drugs, Preferred Brand x1 In-Network:',
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$50 Copay')).toHaveLength(2);
    expect(
      screen.getByText(
        'Benefit Level 2 Prescription Drugs, Preferred Brand x1 In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryAllByText('40% Coinsurance after you pay deductible'),
    ).toHaveLength(2);
    expect(
      screen.getByText(
        'Prescription Drugs, Preferred Brand x1 Out-of-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Benefit Level 1 Prescription Drugs, Non-Preferred Brand x1 In-Network:',
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByText('$65 Copay')).toHaveLength(2);
    expect(
      screen.getByText(
        'Benefit Level 2 Prescription Drugs, Non-Preferred Brand x1 In-Network:',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Prescription Drugs, Non-Preferred Brand x1 Out-of-Network:',
      ),
    ).toBeInTheDocument();

    //Find Drugs Cost & Coverage
    // expect(screen.getByText('Find Drugs Cost & Coverage')).toBeInTheDocument();
    // expect(
    //   screen.getByText(
    //     'Your pharmacy benefits are managed by CVS Caremark. You can estimate drug costs and view your coverage at caremark.com.',
    //   ),
    // ).toBeInTheDocument();

    //get Help
    expect(screen.getByText('Get Help with Benefits')).toBeInTheDocument();
    expect(
      screen.getByText('if you need help, please help reach out to us.You can'),
    ).toBeInTheDocument();
    expect(screen.getByText('start a chat')).toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
