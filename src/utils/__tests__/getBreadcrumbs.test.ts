import { getBreadcrumbs } from '../getBreadcrumbs';

describe('getBreadcrumbs', () => {
  it('should return empty array for root path', () => {
    const result = getBreadcrumbs('/');
    expect(result).toEqual([]);
  });

  it('should return breadcrumbs for simple path', () => {
    const result = getBreadcrumbs('/benefits');
    expect(result).toEqual([{ label: 'Benefits', path: '/benefits' }]);
  });

  it('should return breadcrumbs for nested path', () => {
    const result = getBreadcrumbs('/benefits/planDocuments');
    expect(result).toEqual([
      { label: 'Benefits', path: '/benefits' },
      { label: 'Plan Documents', path: '/benefits/planDocuments' },
    ]);
  });

  it('should handle dynamic segments with metadata', () => {
    const result = getBreadcrumbs('/claims/123456', {
      '/claims/[id]': 'Claim Details',
    });
    expect(result).toEqual([
      { label: 'Claims', path: '/claims' },
      { label: 'Claim Details', path: '/claims/123456' },
    ]);
  });

  it('should use fallback labels when metadata not provided', () => {
    const result = getBreadcrumbs('/support/faq/general');
    expect(result).toEqual([
      { label: 'Support', path: '/support' },
      { label: 'FAQ', path: '/support/faq' },
      { label: 'General', path: '/support/faq/general' },
    ]);
  });

  it('should handle paths with query parameters', () => {
    const result = getBreadcrumbs('/benefits?type=medical');
    expect(result).toEqual([{ label: 'Benefits', path: '/benefits' }]);
  });

  // Additional test cases based on actual routes
  it('should handle spending account paths', () => {
    const result = getBreadcrumbs('/spendingAccounts/HSA');
    expect(result).toEqual([
      { label: 'Spending Accounts', path: '/spendingAccounts' },
      { label: 'HSA', path: '/spendingAccounts/HSA' },
    ]);
  });

  it('should handle health program paths', () => {
    const result = getBreadcrumbs('/myHealth/healthProgramsResources');
    expect(result).toEqual([
      { label: 'My Health', path: '/myHealth' },
      {
        label: 'Health Programs Resources',
        path: '/myHealth/healthProgramsResources',
      },
    ]);
  });

  it('should handle ID card paths', () => {
    const result = getBreadcrumbs('/myplan/idcard');
    expect(result).toEqual([
      { label: 'My Plan', path: '/myplan' },
      { label: 'ID Card', path: '/myplan/idcard' },
    ]);
  });

  it('should handle primary care provider paths', () => {
    const result = getBreadcrumbs('/myPrimaryCareProvider');
    expect(result).toEqual([
      { label: 'My Primary Care Provider', path: '/myPrimaryCareProvider' },
    ]);
  });

  it('should handle complex metadata overrides', () => {
    const metadata = {
      '/benefits/[type]/details': 'Benefit Details',
      '/claims/[id]/documents': 'Claim Documents',
      '/spendingSummary/[type]': 'Spending Details',
    };

    const paths = [
      {
        path: '/benefits/medical/details',
        expected: [
          { label: 'Benefits', path: '/benefits' },
          { label: 'Medical', path: '/benefits/medical' },
          { label: 'Benefit Details', path: '/benefits/medical/details' },
        ],
      },
      {
        path: '/claims/12345/documents',
        expected: [
          { label: 'Claims', path: '/claims' },
          { label: '12345', path: '/claims/12345' },
          { label: 'Claim Documents', path: '/claims/12345/documents' },
        ],
      },
      {
        path: '/spendingSummary/FSA',
        expected: [
          { label: 'Spending Summary', path: '/spendingSummary' },
          { label: 'Spending Details', path: '/spendingSummary/FSA' },
        ],
      },
    ];

    paths.forEach(({ path, expected }) => {
      const result = getBreadcrumbs(path, metadata);
      expect(result).toEqual(expected);
    });
  });
});
