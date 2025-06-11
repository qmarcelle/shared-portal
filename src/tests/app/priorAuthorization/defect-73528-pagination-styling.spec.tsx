import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PriorAuthorizationsPage from '@/app/priorAuthorization/page';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { format } from 'date-fns';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

expect.extend(toHaveNoViolations);

jest.mock('next-auth/react');
jest.mock('next/navigation');

const mockSession = {
  data: {
    user: {
      currUsr: {
        plan: { memCk: '123456789', grpId: '87898' }
      }
    }
  },
  status: 'authenticated'
};

describe('PriorAuthorizationsPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSession as jest.Mock).mockReturnValue(mockSession);
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  const makeMockEntries = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      referenceId: `PA-${i + 1}`,
      serviceDate: new Date(2025, 0, i + 1).toISOString(),
      issuer: `Auth item ${i + 1}`,
      priorAuthStatus: 'Pending',
      memberName: 'Test Member',
      columns: [
        { label: 'Referred by', value: 'Dr. Smith', defaultValue: 'N/A' },
        { label: 'Referred to', value: 'Dr. Jones', defaultValue: 'N/A' }
      ]
    }));

  describe('Happy path tests', () => {
    it('does not show pagination when one result returns', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(1) } }
      });

      render(await PriorAuthorizationsPage());

      expect(screen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
      expect(screen.getByText('Auth item 1')).toBeInTheDocument();
    });

    it('does not show pagination when five results return', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(5) } }
      });

      render(await PriorAuthorizationsPage());

      expect(screen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
      expect(screen.getAllByRole('listitem')).toHaveLength(5);
    });

    it('shows pagination when more than five results return', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(6) } }
      });

      render(await PriorAuthorizationsPage());

      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeVisible();
    });

    it('renders "Sort by date" label in bold', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(2) } }
      });

      render(await PriorAuthorizationsPage());

      const sortLabel = screen.getByText(/sort by date/i);
      expect(sortLabel).toHaveClass('font-bold');
    });

    it('navigates to detail page when clicking an entry', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(3) } }
      });

      render(await PriorAuthorizationsPage());

      await userEvent.click(screen.getByText('Auth item 2'));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/priorAuthorization/authDetails'));
    });
  });

  describe('Edge case tests', () => {
    it('handles zero results gracefully', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: [] } }
      });

      render(await PriorAuthorizationsPage());

      expect(screen.getByText(/no prior authorizations found/i)).toBeVisible();
      expect(screen.queryByRole('navigation', { name: /pagination/i })).toBeNull();
    });
  });

  describe('Error state tests', () => {
    it('displays user-friendly error when API fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network Error'));

      render(await PriorAuthorizationsPage());

      await waitFor(() => {
        expect(screen.getByText(/There was a problem loading prior auth details/i)).toBeVisible();
      });
    });
  });

  describe('Accessibility tests', () => {
    it('has no accessibility violations', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(2) } }
      });

      const { container } = render(await PriorAuthorizationsPage());
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('User interaction tests', () => {
    it('sort button toggles descending/ascending order', async () => {
      const unsorted = makeMockEntries(3).reverse();
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: unsorted } }
      });

      render(await PriorAuthorizationsPage());

      const button = screen.getByRole('button', { name: /sort by date/i });
      await userEvent.click(button);
      
      const items = screen.getAllByRole('listitem');
      const dates = items.map(item => item.textContent);
      
      expect(dates[0]).toContain(format(new Date(2025, 0, 1), 'MM/dd/yyyy'));
      expect(dates[2]).toContain(format(new Date(2025, 0, 3), 'MM/dd/yyyy'));
    });
  });

  describe('Responsive tests', () => {
    it('renders mobile layout at small viewport', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(2) } }
      });

      global.innerWidth = 320;
      global.dispatchEvent(new Event('resize'));

      render(await PriorAuthorizationsPage());

      expect(screen.getByTestId('mobile-prior-auth-list')).toBeInTheDocument();
    });
  });

  describe('Authentication tests', () => {
    it('redirects to login when unauthenticated', async () => {
      (useSession as jest.Mock).mockReturnValue({ data: null, status: 'unauthenticated' });

      render(await PriorAuthorizationsPage());
      
      expect(mockPush).toHaveBeenCalledWith('/login?callbackUrl=/member/myplan/priorauthorizations');
    });
  });

  describe('Performance tests', () => {
    it('renders under 200ms on average', async () => {
      mockedAxios.get.mockResolvedValue({ 
        data: { memberPriorAuthDetails: { memberPriorAuthDetail: makeMockEntries(5) } }
      });

      const start = performance.now();
      render(await PriorAuthorizationsPage());
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(200);
    });
  });
});