import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { FormLayout } from '../layout';
// Import react-hook-form to use with jest.spyOn
import * as reactHookForm from 'react-hook-form';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock form-tabs component
jest.mock('../components/form-tabs', () => ({
  FormTabs: ({ activeTabIndex, setActiveTabIndex }) => (
    <div>
      <button onClick={() => setActiveTabIndex(activeTabIndex + 1)}>
        Next Tab
      </button>
      <div data-testid="active-tab">{activeTabIndex}</div>
    </div>
  ),
  Tab: () => <div>Tab</div>,
}));

describe('FormLayout', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
    };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the form layout with children', () => {
    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('navigates to next step on continue', async () => {
    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled();
    });
  });

  it('shows validation error when form is invalid', async () => {
    const mockTrigger = jest.fn().mockResolvedValue(false);
    const useFormSpy = jest.spyOn(reactHookForm, 'useForm');
    useFormSpy.mockImplementation(() => ({
      ...jest.requireActual('react-hook-form').useForm(),
      trigger: mockTrigger,
    }));

    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    fireEvent.click(screen.getByText('Continue'));

    await waitFor(() => {
      expect(
        screen.getByText('Please fix the errors before proceeding'),
      ).toBeInTheDocument();
    });
  });

  it('renders progress bar with correct percentage', () => {
    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    const progressBar = screen.getByRole('img', { name: /bar chart/i });
    expect(progressBar).toHaveStyle({ width: '20%' }); // First step of 5
  });

  it('shows correct button labels based on step', () => {
    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    // First step should show Cancel and Continue
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('navigates back to dashboard on cancel from first step', () => {
    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('disables navigation during form submission', async () => {
    render(
      <FormLayout>
        <div>Test Content</div>
      </FormLayout>,
    );

    // Simulate form submission
    const continueButton = screen.getByText('Continue');
    fireEvent.click(continueButton);

    // Buttons should be disabled during submission
    await waitFor(() => {
      expect(continueButton).toBeDisabled();
      expect(screen.getByText('Cancel')).toBeDisabled();
    });
  });

  it('maintains form state between steps', async () => {
    const { rerender } = render(
      <FormLayout>
        <div>Step 1</div>
      </FormLayout>,
    );

    // Navigate to next step
    fireEvent.click(screen.getByText('Continue'));

    // Rerender with new step content
    rerender(
      <FormLayout>
        <div>Step 2</div>
      </FormLayout>,
    );

    // Progress should update
    const progressBar = screen.getByRole('img', { name: /bar chart/i });
    expect(progressBar).toHaveStyle({ width: '40%' }); // Second step of 5
  });
});
