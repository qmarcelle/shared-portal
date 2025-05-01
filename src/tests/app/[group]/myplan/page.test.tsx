import { render } from '@testing-library/react';
import GroupMyPlanPage from '@/app/[group]/myplan/page';

jest.mock('../../(common)/myplan/page', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-shared-myplan">Shared MyPlan Page</div>,
}));

jest.mock('@/app/providers/GroupProvider', () => ({
  useGroup: () => ({ group: 'test-group' }),
}));

describe('GroupMyPlanPage', () => {
  it('renders the shared MyPlan page', () => {
    const { getByTestId } = render(<GroupMyPlanPage />);
    expect(getByTestId('mock-shared-myplan')).toBeInTheDocument();
  });
});