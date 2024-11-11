import { AboutPrimaryCareProvider } from '@/app/findcare/primaryCareOptions/components/AboutPrimaryCareProvider';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
const renderUI = () => {
  return render(<AboutPrimaryCareProvider className="large-section" />);
};

describe('AboutPrimaryCareProvider', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', { name: 'About Primary Care Providers' });
    screen.getByText(
      'A primary care provider (PCP), a doctor or nurse practitioner that offers routine checkups, vaccines and non-emergency medical care.',
    );

    screen.getByText('Why See a PCP');
    let Psychiatrists = screen.queryByText(
      // eslint-disable-next-line quotes
      "PCP's are typically the first person you talk to if you have a health concern. They know your health history and act as a hub for all your medical care. You might turn to them for:",
    );
    expect(Psychiatrists).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Why See a PCP')); //check that body text is visible after clicking
    Psychiatrists = screen.queryByText(
      // eslint-disable-next-line quotes
      "PCP's are typically the first person you talk to if you have a health concern. They know your health history and act as a hub for all your medical care. You might turn to them for:",
    );
    expect(Psychiatrists).toBeInTheDocument();

    fireEvent.click(screen.getByText('Why See a PCP')); //check that it is not visible after clicking again
    Psychiatrists = screen.queryByText(
      'PCP&apos;s are typically the first person you talk to if you have a health concern. They know your health history and act as a hub for all your medical care. You might turn to them for:',
    );
    expect(Psychiatrists).not.toBeInTheDocument();

    screen.getByText('Types of PCPs');
    Psychiatrists = screen.queryByText(
      'The term primary care provider (PCP) refers to any of the following types of medical professionals',
    );
    expect(Psychiatrists).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Types of PCPs')); //check that body text is visible after clicking
    Psychiatrists = screen.queryByText(
      'The term primary care provider (PCP) refers to any of the following types of medical professionals:',
    );
    expect(Psychiatrists).toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
