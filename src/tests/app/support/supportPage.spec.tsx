import SupportPage from '@/app/support/page';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

describe('Support Page', () => {
  it('should render the page correctly', () => {
    const { container } = render(<SupportPage />);

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

    expect(container).toMatchSnapshot();
  });
});
