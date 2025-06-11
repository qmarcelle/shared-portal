import { ViewPayPremium } from '@/app/dashboard/components/viewPayPremium';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}));

// Mock environment variables
process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA = 'ElectronicPaymentBOA';

describe('Defect 75829: Pay Premium SSO Timeout', () => {
  const mockProps = {
    label: 'Open External Website',
    subLabelOne: 'Use this service as an easy and secure way to pay your premium with a debit card or electronic check. Setup recurring bank drafts, manage future payments, and view payment history.',
    subLabelTwo: 'By continuing, you agree to leave the BlueCross website and view the content of an external website. If you choose not to leave the BlueCross website, simply cancel.',
    primaryButtonLabel: 'Cancel',
    secondaryButtonLabel: 'Continue',
    primaryButtonCallback: jest.fn(),
    secondaryButtonCallback: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAppModalStore.getState().dismissModal();
  });

  describe('SSO Connection Tests', () => {
    it('shows loading state during SSO connection', async () => {
      mockedAxios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ 
          data: { REF: 'abcdef_l12345' }
        }), 100))
      );

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByLabelText(/connecting to payment system/i)).toBeInTheDocument();
    });

    it('handles SSO timeout with user-friendly message', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 504,
          errorObject: { message: 'Gateway Timeout' }
        })
      );

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to connect to payment system. Please try again later./i))
          .toBeInTheDocument();
      });
    });

    it('prevents multiple SSO connection attempts', async () => {
      const slowResponse = new Promise(resolve => 
        setTimeout(() => resolve({ data: { REF: 'abcdef_l12345' } }), 1000)
      );
      mockedAxios.post.mockImplementationOnce(() => slowResponse);

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);
      await userEvent.click(continueButton); // Second click should be ignored

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(continueButton).toBeDisabled();
    });
  });

  describe('Error Handling Tests', () => {
    it('shows error message on network failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 0,
          errorObject: { message: 'Network Error' }
        })
      );

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to connect. Please check your network connection./i))
          .toBeInTheDocument();
      });
    });

    it('shows error message on BOA service unavailable', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 503,
          errorObject: { message: 'Service Unavailable' }
        })
      );

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText(/Payment service is temporarily unavailable. Please try again later./i))
          .toBeInTheDocument();
      });
    });
  });

  describe('Recovery Tests', () => {
    it('allows retry after timeout error', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(createAxiosErrorForTest({
          status: 504,
          errorObject: { message: 'Gateway Timeout' }
        }))
        .mockResolvedValueOnce({ data: { REF: 'abcdef_l12345' } });

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to connect to payment system. Please try again later./i))
          .toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /Try Again/i });
      await userEvent.click(retryButton);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/sso/launch?PartnerSpId=ElectronicPaymentBOA')
      );
    });
  });

  describe('Accessibility Tests', () => {
    it('maintains accessibility during loading state', async () => {
      mockedAxios.post.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ 
          data: { REF: 'abcdef_l12345' }
        }), 100))
      );

      const { container } = render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains focus management during error state', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 504,
          errorObject: { message: 'Gateway Timeout' }
        })
      );

      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      await waitFor(() => {
        const errorMessage = screen.getByText(/Unable to connect to payment system. Please try again later./i);
        expect(document.activeElement).toBe(errorMessage);
      });
    });
  });

  describe('Performance Tests', () => {
    it('initiates SSO request within 150ms', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { REF: 'abcdef_l12345' }
      });

      const start = performance.now();
      render(<ViewPayPremium {...mockProps} />);

      const continueButton = screen.getByRole('button', { name: /Continue/i });
      await userEvent.click(continueButton);

      const duration = performance.now() - start;
      expect(duration).toBeLessThan(150);
    });
  });
});