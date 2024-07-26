import { ServicesRenderedInformation } from '@/app/(main)/claimServiceRendered/components/ServicesRenderedInformation';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <ServicesRenderedInformation
      serviceCode="345678"
      subLabel="Your share"
      subLabelValue={30.24}
      label1="Amount Billed"
      label2="Plan Discount"
      label3="Plan Paid"
      value1={145.0}
      value2={114.76}
      value3={0.0}
    />,
  );
};

describe('ServicesRenderedSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.queryByText('Service Code: 345678')).toBeInTheDocument();
    expect(screen.getByText('Your share')).toBeInTheDocument();
    expect(screen.getByText('$30.24')).toBeInTheDocument();
    expect(screen.getByText('$145.00')).toBeInTheDocument();
    expect(screen.getByText('$114.76')).toBeInTheDocument();
    expect(screen.getByText('Amount Billed')).toBeInTheDocument();
    expect(screen.getByText('Plan Discount')).toBeInTheDocument();
    expect(screen.getByText('Plan Paid')).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
