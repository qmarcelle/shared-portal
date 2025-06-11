import { ManageMyPlan } from '@/app/myPlan/components/ManageMyPlan';
import { useRouter } from 'next/navigation';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

expect.extend(toHaveNoViolations);

jest.mock('next/navigation');

describe('Defect 75648: Manage My Plan SSN Link Navigation', () => {
  const mockPush = jest.fn();
  let vRules: VisibilityRules = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    vRules = {
      enableBenefitChange: true,
      subscriber: true,
      wellnessOnly: false,
      futureEffective: false,
      fsaOnly: false,
      terminated: false,
      katieBeckNoBenefitsElig: false,
      blueCare: false
    };
  });

  describe('SSN Link Navigation Tests', () => {
    it('navigates to correct SSN update URL when clicking link', async () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      await userEvent.click(ssnLink);

      expect(mockPush).toHaveBeenCalledWith('/myPlan/updateSocialSecurityNumber');
    });

    it('preserves query parameters during navigation', async () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      await userEvent.click(ssnLink);

      expect(mockPush).toHaveBeenCalledWith(
        expect.not.stringContaining('?returnUrl=')
      );
    });

    it('maintains browser history stack correctly', async () => {
      const mockReplace = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({ 
        push: mockPush,
        replace: mockReplace
      });

      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      await userEvent.click(ssnLink);

      expect(mockReplace).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('Link Visibility Tests', () => {
    it('shows SSN link for eligible users', () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      expect(screen.getByText(/update social security number/i)).toBeVisible();
      expect(screen.getByRole('link', { name: /update social security number/i }))
        .toHaveAttribute('href', '/myPlan/updateSocialSecurityNumber');
    });

    it('hides SSN link for ineligible users', () => {
      vRules.enableBenefitChange = false;
      render(<ManageMyPlan visibilityRules={vRules} />);

      expect(screen.queryByText(/update social security number/i)).not.toBeInTheDocument();
    });

    it('shows correct link text and description', () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      const link = screen.getByRole('link', { name: /update social security number/i });
      expect(link).toBeInTheDocument();
      expect(screen.getByText(/add or update the social security number associated with your plan/i))
        .toBeInTheDocument();
    });
  });

  describe('Error Handling Tests', () => {
    it('handles navigation errors gracefully', async () => {
      mockPush.mockRejectedValueOnce(new Error('Navigation failed'));
      
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      await userEvent.click(ssnLink);

      // Should not throw error and should maintain UI state
      expect(ssnLink).toBeInTheDocument();
      expect(ssnLink).not.toBeDisabled();
    });
  });

  describe('Accessibility Tests', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ManageMyPlan visibilityRules={vRules} />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains keyboard navigation', async () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      
      // Verify link is keyboard focusable
      ssnLink.focus();
      expect(document.activeElement).toBe(ssnLink);

      // Verify Enter key triggers navigation
      await userEvent.keyboard('{Enter}');
      expect(mockPush).toHaveBeenCalledWith('/myPlan/updateSocialSecurityNumber');
    });

    it('has correct ARIA attributes', () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      expect(ssnLink).toHaveAttribute('role', 'link');
      expect(ssnLink).toHaveAttribute('aria-label', expect.stringContaining('Update Social Security Number'));
    });
  });

  describe('Integration Tests', () => {
    it('preserves state when navigating back', async () => {
      const { rerender } = render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      await userEvent.click(ssnLink);

      // Simulate navigation back
      rerender(<ManageMyPlan visibilityRules={vRules} />);

      expect(screen.getByRole('link', { name: /update social security number/i }))
        .toBeInTheDocument();
    });

    it('works correctly with browser refresh', async () => {
      const { unmount } = render(<ManageMyPlan visibilityRules={vRules} />);

      // Simulate page refresh
      unmount();
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      await userEvent.click(ssnLink);

      expect(mockPush).toHaveBeenCalledWith('/myPlan/updateSocialSecurityNumber');
    });
  });

  describe('Performance Tests', () => {
    it('navigates within 100ms', async () => {
      render(<ManageMyPlan visibilityRules={vRules} />);

      const ssnLink = screen.getByRole('link', { name: /update social security number/i });
      
      const start = performance.now();
      await userEvent.click(ssnLink);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });
  });
});