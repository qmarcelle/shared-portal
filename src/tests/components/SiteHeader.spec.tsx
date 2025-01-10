process.env.NEXT_PUBLIC_ALERTS =
  'There is a planned system outage on July 23-25;Another type of message that effects';

import { SiteHeaderServerWrapper } from '@/components/serverComponents/StiteHeaderServerWrapper';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// Mock useRouter:
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: mockReplace,
    };
  },
}));

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: { memCk: '123456789', grpId: '87898', sbsbCk: '654567656' },
        },
        vRules: {
          dental: true,
          dentalCostsEligible: true,
          enableCostTools: true,
        },
      },
    }),
  ),
}));

describe('SiteHeader', () => {
  it('should render the UI correctly with AlertBar', async () => {
    const SiteHeader = await SiteHeaderServerWrapper();
    const { container } = render(SiteHeader);

    expect(
      screen.getByText('There is a planned system outage on July 23-25'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Another type of message that effects'),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });
});
