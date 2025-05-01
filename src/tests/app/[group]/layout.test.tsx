import { render, screen } from '@testing-library/react';
import GroupLayout from '@/app/[group]/layout';

jest.mock('@/components/composite/Header', () => ({
  Header: () => <div data-testid="mock-header">Header</div>,
}));

jest.mock('@/components/composite/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>,
}));

describe('GroupLayout', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
    params: { group: 'test-group' },
  };

  it('renders header and footer by default', () => {
    render(<GroupLayout {...defaultProps} />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('uses "member" as default group when not provided', () => {
    render(<GroupLayout {...defaultProps} params={{ group: '' }} />);

    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });
});