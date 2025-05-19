import { Breadcrumb } from '@/models/app/breadcrumb';
import { getBreadcrumbs } from '@/utils/routing';

describe('Breadcrumb Data', () => {
  it('Should retrieve appropriate breadcrumb info for a path with breadcrumbParent specified', () => {
    const testBreadcrumbs = getBreadcrumbs('/balances');
    const expected: Breadcrumb[] = [
      {
        title: 'My Plan',
        path: '/myPlan',
        current: false,
      },
      {
        title: 'Benefits & Coverage',
        path: '/benefits',
        current: false,
      },
      {
        title: 'Balances',
        path: '/balances',
        current: true,
      },
    ];
    expect(testBreadcrumbs).toBe(expected);
  });
});
