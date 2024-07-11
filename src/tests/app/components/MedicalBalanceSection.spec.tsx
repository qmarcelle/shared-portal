import { render, screen } from '@testing-library/react';
import { MedicalBalanceSection } from '../../../app/dashboard/components/MedicalBalanceSection';

const renderUI = () => {
  return render(
    <MedicalBalanceSection
      className="large-section"
      members={[
        {
          label: 'Chris Hall',
          value: '0',
        },
        {
          label: 'Megan Chaler',
          value: '43',
        },
      ]}
      balanceNetworks={[
        {
          label: 'In-Network',
          value: '0',
        },
        { label: 'Out-of-Network', value: '1' },
      ]}
      deductibleLimit={2000}
      deductibleSpent={1800}
      onSelectedMemberChange={() => {}}
      onSelectedNetworkChange={() => {}}
      outOfPocketLimit={3000}
      outOfPocketSpent={1500}
      selectedMemberId="43"
      selectedNetworkId="1"
    />,
  );
};

describe('MedicalBalanceSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Medical & Pharmacy Balance' });
    screen.getByText('Member :');
    screen.getAllByText('Megan Chaler');
    screen.getByText('Network Status :');
    screen.getAllByText('Out-of-Network');
    screen.getByText('Deductible');
    screen.getAllByLabelText('bar chart');
    screen.getAllByText('Spent');
    screen.getAllByText('Limit');
    screen.getByText('View All Balances');

    expect(component).toMatchSnapshot();
  });
});
