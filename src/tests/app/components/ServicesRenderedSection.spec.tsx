import { ServicesRenderedSection } from '@/app/(main)/claimServiceRendered/components/ServicesRenderedSection';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <ServicesRenderedSection
      serviceTitle="Immunization"
      className="large-section"
      service={[
        {
          serviceLabel: 'Office Visit',
          serviceSubLabel: 'Your share',
          serviceSubLabelValue: 30.24,
          serviceCode: '345678',
          labelText1: 'Amount Billed',
          labelValue1: 145.0,
          labelText2: 'Plan Discount',
          labelValue2: 114.76,
          labelText3: 'Plan Paid',
          labelValue3: 0.0,
        },
      ]}
    />,
  );
};

describe('ServicesRenderedSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Immunization')).toBeInTheDocument();
    expect(screen.getByText('Office Visit')).toBeInTheDocument();
    expect(screen.getByText('Your share')).toBeInTheDocument();
    expect(screen.getByText('$30.24')).toBeInTheDocument();

    screen.getByText('Office Visit');
    let serviceRenderedSectionContent = screen.queryByText(
      'Service Code: 345678',
    );
    expect(serviceRenderedSectionContent).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Office Visit')); //check that body text is visible after clicking
    serviceRenderedSectionContent = screen.getByText('Service Code: 345678');
    expect(serviceRenderedSectionContent).toBeInTheDocument();

    fireEvent.click(screen.getByText('Office Visit')); //check that it is not visible after clicking again
    serviceRenderedSectionContent = screen.queryByText('Service Code: 345678');
    expect(serviceRenderedSectionContent).not.toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
