import Pharmacy from '@/app/pharmacy/pharmacyBluecare/page';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(<Pharmacy />);
};

describe('Pharmacy Benefits', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'Pharmacy Benefits' });
    screen.getAllByText(
      'You have a pharmacy card just for your prescription drugs. Here are some helpful things to know:',
    );
    screen.getAllByText(
      'Coverage and claims for prescriptions are managed by your pharmacy benefit manager. That’s an independent company that specializes in these services.',
    );
    expect(
      screen.getAllByRole('link', {
        name: 'visit TennCare’s site for more info external',
      })[0],
    ).toHaveProperty(
      'href',
      'https://www.tn.gov/tenncare/members-applicants/pharmacy.html',
    );
    expect(component).toMatchSnapshot();
  });
});
