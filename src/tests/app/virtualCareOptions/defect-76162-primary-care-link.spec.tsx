import VirtualCareOptions from '@/app/virtualCareOptions';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        currUsr: {
          plan: { memCk: '123456789', grpId: '87898' }
        }
      }
    },
    status: 'authenticated'
  }))
}));

describe('Defect 76162: Virtual Primary Care Link Clickability', () => {
  let vRules: VisibilityRules;

  beforeEach(() => {
    jest.clearAllMocks();
    vRules = {
      teladocEligible: true,
      primary360Eligible: true,
      blueCare: false,
      fsaOnly: false,
      terminated: false,
      wellnessOnly: false,
      groupRenewalDateBeforeTodaysDate: true
    };
  });

  describe('Link Functionality Tests', () => {
    it('renders Virtual Primary Care link as clickable', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      expect(link).toBeEnabled();
      expect(link).not.toHaveAttribute('aria-disabled');
      expect(link).toHaveStyle({ cursor: 'pointer' });
    });

    it('navigates to correct URL when clicking link', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      await userEvent.click(link);

      expect(window.location.href).toContain(`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_TELADOC}`);
    });

    it('handles keyboard navigation correctly', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      link.focus();
      await userEvent.keyboard('{Enter}');

      expect(window.location.href).toContain(`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_TELADOC}`);
    });
  });

  describe('Visual Feedback Tests', () => {
    it('shows hover state on link', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      await userEvent.hover(link);

      expect(link).toHaveClass('hover:text-primary-600');
    });

    it('shows focus state on link', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      link.focus();

      expect(link).toHaveClass('focus:ring-2');
    });

    it('shows active state when clicking', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      await userEvent.click(link);

      expect(link).toHaveClass('active:text-primary-800');
    });
  });

  describe('Content Tests', () => {
    it('displays correct link text and description', () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.getByText('Teladoc Health Primary Care Provider')).toBeVisible();
      expect(screen.getByText(/With Primary 360, you can talk to a board-certified primary care doctor/i)).toBeVisible();
    });

    it('includes correct benefits list', () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const benefitsList = screen.getByRole('list');
      expect(benefitsList).toBeVisible();
      expect(screen.getByText('Annual checkups and preventive care')).toBeVisible();
      expect(screen.getByText('Prescriptions')).toBeVisible();
      expect(screen.getByText(/Lab orders and recommended screenings/i)).toBeVisible();
      expect(screen.getByText(/Referrals to in-network specialists/i)).toBeVisible();
    });
  });

  describe('Accessibility Tests', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct ARIA attributes', () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      expect(link).toHaveAttribute('role', 'link');
      expect(link).toHaveAttribute('aria-label', expect.stringContaining('Learn More About Teladoc Health Primary Care'));
    });

    it('maintains focus order', async () => {
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      const focusableElements = document.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
      const focusOrder = Array.from(focusableElements);
      
      expect(focusOrder).toContain(link);
      expect(focusOrder.indexOf(link)).toBeGreaterThan(0);
    });
  });

  describe('Error Handling Tests', () => {
    it('handles navigation errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      window.location.href = '#error';

      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i });
      await userEvent.click(link);

      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('Performance Tests', () => {
    it('renders link within 100ms', async () => {
      const start = performance.now();
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
      expect(screen.getByRole('link', { name: /Learn More About Teladoc Health Primary Care/i })).toBeVisible();
    });
  });
});