import { BalanceSection } from '@/app/benefits/balances/components/BalanceSection';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <BalanceSection
      title="Dental Balance"
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
      deductibleLimit={undefined}
      deductibleSpent={undefined}
      onSelectedMemberChange={() => {}}
      outOfPocketLimit={undefined}
      outOfPocketSpent={undefined}
      selectedMemberId="43"
      serviceDetailsUsed={[
        {
          limitAmount: '2000',
          spentAmount: '90.0',
          serviceName: 'Annual Maximum Basic and Major Coverage',
        },
        {
          limitAmount: '2000',
          spentAmount: '0.0',
          serviceName: 'Ortho Lifetime Maximum',
        },
      ]}
      balancesFlag={true}
      contact="1-800-565-9000"
    />,
  );
};

describe('DentalBalance', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Deductible')).toBeVisible();
    expect(screen.getByText('Out-of-Pocket')).toBeVisible();
    expect(screen.getByText('Services Used')).toBeVisible();
    expect(screen.getByText('90.0')).toBeVisible();
    expect(
      screen.getByText('Annual Maximum Basic and Major Coverage'),
    ).toBeVisible();
    expect(screen.getByText('Ortho Lifetime Maximum')).toBeVisible();

    expect(component).toMatchSnapshot();
  });
});
