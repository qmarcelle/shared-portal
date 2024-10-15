import SupportPage from '@/app/support/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

global.open = jest.fn();

describe('Support Page', () => {
  let renderContainer: HTMLElement;
  beforeEach(() => {
    const { container } = render(<SupportPage />);
    renderContainer = container;
  });
  it('should render the page correctly', () => {
    // Contact Us Section should be present
    expect(screen.getByText('Contact Us')).toBeVisible();
    expect(screen.getAllByText('Call')[0]).toBeVisible();
    expect(screen.getByText('Chat')).toBeVisible();
    expect(screen.getByText('Email')).toBeVisible();

    // Resources Section should be present
    expect(screen.getByText('Resources')).toBeVisible();
    expect(screen.getByText('Frequently Asked Questions')).toBeVisible();
    expect(screen.getByText('Health Insurance Glossary')).toBeVisible();
    expect(screen.getByText('Find a Form')).toBeVisible();

    expect(renderContainer).toMatchSnapshot();
  });

  it('should open the Qualtrics survey link on feedback button click', () => {
    fireEvent.click(screen.getByLabelText('Share Your Feedback'));
    expect(global.open).toHaveBeenCalledWith(
      'https://bcbst.qualtrics.com/jfe/form/SV_6rHlwsGRs79CO33?Q_CHL=si',
      '_blank',
      'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=500,width=400,height=400',
    );
  });
});
