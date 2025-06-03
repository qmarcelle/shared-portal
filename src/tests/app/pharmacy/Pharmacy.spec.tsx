import Pharmacy from '@/app/pharmacy';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <Pharmacy
      data={{
        formularyURL: null,
        visibilityRules: undefined,
      }}
      claims={[]}
    />,
  );
};

describe('PharmacyBanner', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Pharmacy')).toBeVisible();

    expect(
      screen.getByText(/Your prescription and medical plan work together./i),
    ).toBeInTheDocument();
    expect(screen.getByText(/CVS Caremark/i)).toBeInTheDocument();
    expect(
      screen.getByText(/helps manage your pharmacy benefits/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/but you don’t have to go to a CVS retail pharmacy./i),
    ).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
