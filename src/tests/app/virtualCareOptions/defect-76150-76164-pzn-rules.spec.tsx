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

describe('Virtual Care Options PZN Rules (Defects 76150, 76164)', () => {
  let vRules: VisibilityRules;

  beforeEach(() => {
    jest.clearAllMocks();
    vRules = {
      teladocEligible: true,
      diabetesPreventionEligible: false,
      diabetesManagementEligible: false,
      blueCare: false,
      fsaOnly: false,
      terminated: false,
      wellnessOnly: false,
      groupRenewalDateBeforeTodaysDate: true,
      pznVirtualCareEnabled: true
    };
  });

  describe('DPP Card Visibility Tests', () => {
    it('hides Virtual DPP card for non-eligible members', async () => {
      vRules.diabetesPreventionEligible = false;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
      expect(screen.queryByText('Get a personal action plan, health coaching and a smart scale at no extra cost.')).not.toBeInTheDocument();
    });

    it('shows Virtual DPP card for eligible members', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.getByText('Virtual Diabetes Prevention Program (DPP)')).toBeVisible();
      expect(screen.getByText('Get a personal action plan, health coaching and a smart scale at no extra cost.')).toBeVisible();
    });

    it('requires both teladocEligible and diabetesPreventionEligible flags', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = false;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
    });
  });

  describe('PZN Rule Combinations', () => {
    it('respects fsaOnly rule', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      vRules.fsaOnly = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
    });

    it('respects terminated rule', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      vRules.terminated = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
    });

    it('respects wellnessOnly rule', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      vRules.wellnessOnly = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
    });

    it('respects groupRenewalDateBeforeTodaysDate rule', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      vRules.groupRenewalDateBeforeTodaysDate = false;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
    });
  });

  describe('Card Content Tests', () => {
    it('displays correct DPP card content when visible', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const card = screen.getByText('Virtual Diabetes Prevention Program (DPP)').closest('div');
      expect(card).toHaveTextContent('Get a personal action plan');
      expect(card).toHaveTextContent('health coaching');
      expect(card).toHaveTextContent('smart scale at no extra cost');
    });

    it('includes correct link in DPP card', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const link = screen.getByRole('link', { name: /Learn More About Diabetes Prevention/i });
      expect(link).toHaveAttribute('href', expect.stringContaining('/myhealth/healthprograms/teladocHealthDiabetesPrevention'));
    });
  });

  describe('Error State Tests', () => {
    it('handles API errors gracefully', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      expect(screen.queryByText('Virtual Diabetes Prevention Program (DPP)')).not.toBeInTheDocument();
      expect(screen.getByText(/problem loading/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('maintains accessibility with DPP card visible', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      const { container } = render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('maintains accessibility with DPP card hidden', async () => {
      vRules.diabetesPreventionEligible = false;
      
      const { container } = render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('User Interaction Tests', () => {
    it('allows navigation to DPP details when clicking card', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const card = screen.getByText('Virtual Diabetes Prevention Program (DPP)').closest('a');
      await userEvent.click(card);

      // Verify navigation or modal opening depending on your implementation
      expect(window.location.pathname).toContain('/myhealth/healthprograms/teladocHealthDiabetesPrevention');
    });

    it('maintains keyboard navigation when DPP card is visible', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);

      const card = screen.getByText('Virtual Diabetes Prevention Program (DPP)').closest('a');
      card.focus();
      
      expect(document.activeElement).toBe(card);
      await userEvent.keyboard('{Enter}');
      
      expect(window.location.pathname).toContain('/myhealth/healthprograms/teladocHealthDiabetesPrevention');
    });
  });

  describe('Performance Tests', () => {
    it('renders DPP card within 100ms when eligible', async () => {
      vRules.diabetesPreventionEligible = true;
      vRules.teladocEligible = true;
      
      const start = performance.now();
      render(<VirtualCareOptions sessionData={{ visibilityRules: vRules }} />);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
      expect(screen.getByText('Virtual Diabetes Prevention Program (DPP)')).toBeVisible();
    });
  });
});