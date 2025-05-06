import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import fs from 'fs';
import path from 'path';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      replace: () => null,
    };
  },
}));

describe('ID Card Migration', () => {
  const basePath = path.join(process.cwd(), 'src/(common)/myplan/idcard');

  it('should have all required files in the new location', () => {
    const requiredFiles = [
      'page.tsx',
      'loading.tsx',
      'error.tsx',
      'not-found.tsx'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(basePath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should have the page component in the correct location', () => {
    const pagePath = path.join(basePath, 'page.tsx');
    expect(fs.existsSync(pagePath)).toBe(true);
  });
});