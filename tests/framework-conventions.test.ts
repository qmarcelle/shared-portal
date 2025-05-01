import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'src/app');

describe('Framework Conventions', () => {
  const getAllFiles = (dir: string): string[] => {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath));
      } else if (stat.isFile() && item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }

    return files;
  };

  const readFileContent = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf-8');
  };

  const isDynamicSegment = (dir: string): boolean => {
    const basename = path.basename(dir);
    return basename.startsWith('[') && basename.endsWith(']');
  };

  describe('Loading and Error Components', () => {
    const allFiles = getAllFiles(APP_DIR);

    test('no custom Loading components in page/layout files', () => {
      const pageFiles = allFiles.filter(
        (file) => file.endsWith('page.tsx') || file.endsWith('layout.tsx'),
      );

      for (const file of pageFiles) {
        const content = readFileContent(file);
        expect(content).not.toMatch(
          /export\s+(?:default\s+)?function\s+Loading/,
        );
      }
    });

    test('no custom ErrorBoundary components in page/layout files', () => {
      const pageFiles = allFiles.filter(
        (file) => file.endsWith('page.tsx') || file.endsWith('layout.tsx'),
      );

      for (const file of pageFiles) {
        const content = readFileContent(file);
        expect(content).not.toMatch(
          /export\s+(?:default\s+)?function\s+Error(?:Boundary)?/,
        );
      }
    });

    test('every route segment has loading.tsx and error.tsx', () => {
      const routeDirs = allFiles
        .filter(
          (file) => file.endsWith('page.tsx') || file.endsWith('layout.tsx'),
        )
        .map((file) => path.dirname(file));

      const uniqueRouteDirs = [...new Set(routeDirs)];

      for (const dir of uniqueRouteDirs) {
        const hasLoading = fs.existsSync(path.join(dir, 'loading.tsx'));
        const hasError = fs.existsSync(path.join(dir, 'error.tsx'));

        expect(hasLoading).toBe(true);
        expect(hasError).toBe(true);
      }
    });

    test('every dynamic segment has not-found.tsx', () => {
      const routeDirs = allFiles
        .filter(
          (file) => file.endsWith('page.tsx') || file.endsWith('layout.tsx'),
        )
        .map((file) => path.dirname(file));

      const uniqueRouteDirs = [...new Set(routeDirs)];
      const dynamicSegments = uniqueRouteDirs.filter(isDynamicSegment);

      for (const dir of dynamicSegments) {
        const hasNotFound = fs.existsSync(path.join(dir, 'not-found.tsx'));
        expect(hasNotFound).toBe(true);
      }
    });

    test('dynamic segments have proper metadata', () => {
      const routeDirs = allFiles
        .filter(
          (file) => file.endsWith('page.tsx') || file.endsWith('layout.tsx'),
        )
        .map((file) => path.dirname(file));

      const uniqueRouteDirs = [...new Set(routeDirs)];
      const dynamicSegments = uniqueRouteDirs.filter(isDynamicSegment);

      for (const dir of dynamicSegments) {
        const pageFile = path.join(dir, 'page.tsx');
        if (fs.existsSync(pageFile)) {
          const content = readFileContent(pageFile);
          expect(content).toMatch(/export\s+const\s+metadata/);
        }
      }
    });

    test('dynamic segments have proper fallback handling', () => {
      const routeDirs = allFiles
        .filter(
          (file) => file.endsWith('page.tsx') || file.endsWith('layout.tsx'),
        )
        .map((file) => path.dirname(file));

      const uniqueRouteDirs = [...new Set(routeDirs)];
      const dynamicSegments = uniqueRouteDirs.filter(isDynamicSegment);

      for (const dir of dynamicSegments) {
        const notFoundFile = path.join(dir, 'not-found.tsx');
        if (fs.existsSync(notFoundFile)) {
          const content = readFileContent(notFoundFile);
          expect(content).toMatch(/export\s+const\s+metadata/);
          expect(content).toMatch(/export\s+default\s+function\s+NotFound/);
        }
      }
    });
  });

  describe('Dynamic Segments', () => {
    const dynamicSegments = [
      'src/app/claims/[type]',
      'src/app/support/faqTopics/[type]',
      'src/app/spendingSummary/[type]',
    ];

    test.each(dynamicSegments)(
      'Dynamic segment %s has required files',
      (segment) => {
        expect(
          fs.existsSync(path.join(process.cwd(), segment, 'page.tsx')),
        ).toBe(true);
        expect(
          fs.existsSync(path.join(process.cwd(), segment, 'loading.tsx')),
        ).toBe(true);
        expect(
          fs.existsSync(path.join(process.cwd(), segment, 'error.tsx')),
        ).toBe(true);
        expect(
          fs.existsSync(path.join(process.cwd(), segment, 'not-found.tsx')),
        ).toBe(true);
      },
    );

    test.each(dynamicSegments)(
      'Dynamic segment %s exports metadata',
      async (segment) => {
        const pageContent = fs.readFileSync(
          path.join(process.cwd(), segment, 'page.tsx'),
          'utf8',
        );
        expect(pageContent).toMatch(/export const metadata/);
      },
    );

    test.each(dynamicSegments)(
      'Dynamic segment %s validates type parameter',
      async (segment) => {
        const pageContent = fs.readFileSync(
          path.join(process.cwd(), segment, 'page.tsx'),
          'utf8',
        );
        expect(pageContent).toMatch(/notFound\(\)/);
        expect(pageContent).toMatch(/Object\.values/);
      },
    );
  });
});
