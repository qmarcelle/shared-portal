import { describe, expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('File Existence', () => {
  const requiredFiles = [
    'app/planselect/active/page.tsx',
    'app/planselect/termed/page.tsx',
    'app/error/page.tsx',
    'app/maintenance/page.tsx',
  ];

  it.each(requiredFiles)('should have file: %s', (filePath) => {
    const fullPath = path.join(process.cwd(), 'src', filePath);
    expect(fs.existsSync(fullPath)).toBe(true);
  });

  it.each(requiredFiles)(
    'should export required components and metadata',
    async (filePath) => {
      const fullPath = path.join(process.cwd(), 'src', filePath);
      const fileContent = fs.readFileSync(fullPath, 'utf8');

      expect(fileContent).toMatch(/export const metadata/);
      expect(fileContent).toMatch(/export default function \w+Page/);
    },
  );
});
