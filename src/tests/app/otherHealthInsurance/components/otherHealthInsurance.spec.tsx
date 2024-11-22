import ReportOtherHealthInsurance from '@/app/reportOtherHealthInsurance';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockMemberDetails = {
  member: [
    {
      id: 1,
      dob: '08/06/1959',
    },
  ],
};
const renderUI = () => {
  return render(
    <>
      <ReportOtherHealthInsurance data={mockMemberDetails.member} />
    </>,
  );
};

describe('OtherHealthInsurance', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Report Other Health Insurance' });

    expect(screen.getByText('Chris Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/1978')).toBeInTheDocument();
    expect(screen.getAllByText('Last Updated: 01/16/2023'));
    expect(
      screen.getByRole('heading', { name: 'About Other Insurance' }),
    ).toBeVisible();
    const updateButtons = screen.getAllByText(/Update/i);
    fireEvent.click(updateButtons[0]);
    await waitFor(() => {
      expect(screen.getAllByText(/Other Health Insurance/i));
    });
    expect(component).toMatchSnapshot();
  });
});
