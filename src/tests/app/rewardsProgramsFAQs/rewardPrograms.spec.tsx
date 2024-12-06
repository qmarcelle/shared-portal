import RewardProgramsFaqs from '@/app/myHealth/rewardsProgramsFAQs/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<RewardProgramsFaqs />);
};

describe('PharmacyDrugInformation', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    screen.getByRole('heading', { name: 'Rewards Program FAQs' });
    screen.getByText(
      'If you need help, call [1-800-000-000] or email help@bcbstrewards.com.',
    );
    screen.getByText('About The Rewards Programs');
    screen.queryAllByText('50 Points');
    screen.queryByText('Personal Health Assessment (PHA)');
    screen.queryByText(
      'Take your assessment first to start earning rewards points',
    );

    screen.getByText('How much can my family earn?');
    //check that accordion is not open at first
    let informationBody = screen.queryByText(
      'You and your spouse (if covered) can earn up to $100 each quarter, and a maximum of $400 for each of you per calendar year.',
    );
    expect(informationBody).not.toBeInTheDocument();

    //check that accordion opens when clicked
    fireEvent.click(screen.getByText('How much can my family earn?'));
    informationBody = screen.getByText(
      'You and your spouse (if covered) can earn up to $100 each quarter, and a maximum of $400 for each of you per calendar year.',
    );
    expect(informationBody).toBeInTheDocument();

    //check that it closes when clicked again
    fireEvent.click(screen.getByText('How much can my family earn?'));
    informationBody = screen.queryByText(
      'You and your spouse (if covered) can earn up to $100 each quarter, and a maximum of $400 for each of you per calendar year.',
    );
    expect(informationBody).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
