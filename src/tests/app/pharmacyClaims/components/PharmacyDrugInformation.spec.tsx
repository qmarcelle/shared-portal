import { PharmacyDrugInformation } from '@/app/(main)/pharmacyClaims/components/PharmacyDrugInformation';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <PharmacyDrugInformation
      drugInformation={[
        {
          name: 'Trulipsum',
          daysSupply: 30,
          quantity: 30,
          strengthMG: 25,
          form: 'Capsule',
        },
      ]}
    />,
  );
};

describe('PharmacyDrugInformation', () => {
  it('should render UI correctly', async () => {
    const component = renderUI();

    screen.getByRole('heading', { name: 'Drug Information' });
    screen.getByText('Trulipsum 25MG');

    //check that accordion is not open at first
    let informationBody = screen.queryByText('Strength');
    expect(informationBody).not.toBeInTheDocument();

    //check that accordion opens when clicked
    fireEvent.click(screen.getByText('Trulipsum 25MG'));
    informationBody = screen.getByText('Strength');
    expect(informationBody).toBeInTheDocument();

    //check that it closes when clicked again
    fireEvent.click(screen.getByText('Trulipsum 25MG'));
    informationBody = screen.queryByText('Strength');
    expect(informationBody).not.toBeInTheDocument();

    expect(component.baseElement).toMatchSnapshot();
  });
});
