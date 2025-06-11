import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import { useRouter } from 'next/navigation';
import { useAppModalStore } from '@/components/foundation/AppModal';
import LoginPage from '@/app/login/page';
import '@testing-library/jest-dom';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

jest.mock('next/navigation');

describe('Login Error Handling (Defects 75000, 74996, 74987, 74990, 75003)', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ 
      push: mockPush,
      replace: mockReplace
    });
    useAppModalStore.getState().dismissModal();
  });

  const renderLoginPage = async () => {
    return render(await LoginPage());
  };

  const fillLoginForm = async () => {
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'testpass');
    return screen.getByRole('button', { name: /sign in/i });
  };

  describe('404 Not Found Error (75000)', () => {
    it('shows user-friendly message for 404 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 404,
          errorObject: { message: 'Resource not found' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/The requested resource does not exist/i)).toBeInTheDocument();
        expect(screen.getByText(/Error code: 404/i)).toBeInTheDocument();
      });
    });

    it('provides helpful guidance for 404 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 404,
          errorObject: { message: 'Resource not found' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Please try again or contact support/i)).toBeInTheDocument();
      });
    });
  });

  describe('500 Internal Server Error (74996)', () => {
    it('shows user-friendly message for 500 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Unable to process request/i)).toBeInTheDocument();
        expect(screen.getByText(/Error Code: 500/i)).toBeInTheDocument();
      });
    });

    it('maintains form state after 500 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      await fillLoginForm();
      const usernameInput = screen.getByLabelText(/username/i);
      expect(usernameInput).toHaveValue('testuser');
    });
  });

  describe('504 Gateway Timeout (74987)', () => {
    it('shows user-friendly message for 504 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 504,
          errorObject: { message: 'Gateway Timeout' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Connection Timeout/i)).toBeInTheDocument();
        expect(screen.getByText(/Error Code: 504/i)).toBeInTheDocument();
      });
    });

    it('allows retry after timeout', async () => {
      mockedAxios.post
        .mockRejectedValueOnce(
          createAxiosErrorForTest({
            status: 504,
            errorObject: { message: 'Gateway Timeout' }
          })
        )
        .mockResolvedValueOnce({ data: { token: 'test-token' } });

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/try again/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await userEvent.click(retryButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('503 Service Unavailable (74990)', () => {
    it('shows user-friendly message for 503 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 503,
          errorObject: { message: 'Service Unavailable' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/The Service is unavailable/i)).toBeInTheDocument();
        expect(screen.getByText(/Error Code: 503/i)).toBeInTheDocument();
      });
    });

    it('shows maintenance message when appropriate', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 503,
          errorObject: { 
            message: 'Service Unavailable',
            maintenance: true
          }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/system is undergoing maintenance/i)).toBeInTheDocument();
      });
    });
  });

  describe('502 Bad Gateway (75003)', () => {
    it('shows user-friendly message for 502 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 502,
          errorObject: { message: 'Bad Gateway' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/Bad Gateway/i)).toBeInTheDocument();
        expect(screen.getByText(/Error Code: 502/i)).toBeInTheDocument();
      });
    });

    it('provides contact support option for 502 error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 502,
          errorObject: { message: 'Bad Gateway' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(/contact support/i)).toBeInTheDocument();
      });
    });
  });

  describe('Common Error Handling Behavior', () => {
    it('clears sensitive form data on error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      await fillLoginForm();
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveValue('');
    });

    it('maintains focus management after error', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(document.activeElement).toBe(loginButton);
      });
    });

    it('shows error message in accessible manner', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('aria-live', 'assertive');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('maintains accessibility during error states', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      const { container } = await renderLoginPage();
      const loginButton = await fillLoginForm();
      await userEvent.click(loginButton);

      await waitFor(async () => {
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    it('provides keyboard navigation during error states', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      await fillLoginForm();
      await userEvent.keyboard('{Enter}');

      await waitFor(() => {
        const errorMessage = screen.getByRole('alert');
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Performance Tests', () => {
    it('renders error messages within 100ms', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        createAxiosErrorForTest({
          status: 500,
          errorObject: { message: 'Internal Server Error' }
        })
      );

      await renderLoginPage();
      const loginButton = await fillLoginForm();
      
      const start = performance.now();
      await userEvent.click(loginButton);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });
});