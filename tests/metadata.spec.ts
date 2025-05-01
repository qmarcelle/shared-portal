import fs from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'src/app');

describe('Metadata Conventions', () => {
  const getAllFiles = (dir: string): string[] => {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath));
      } else if (
        stat.isFile() &&
        (item.endsWith('page.tsx') || item.endsWith('layout.tsx'))
      ) {
        files.push(fullPath);
      }
    }

    return files;
  };

  const readFileContent = (filePath: string): string => {
    return fs.readFileSync(filePath, 'utf-8');
  };

  describe('Route Metadata', () => {
    const routeFiles = getAllFiles(APP_DIR);
    let totalFiles = 0;
    let filesWithMetadata = 0;

    beforeAll(() => {
      totalFiles = routeFiles.length;
      filesWithMetadata = routeFiles.filter((file) => {
        const content = readFileContent(file);
        return content.includes('export const metadata');
      }).length;
    });

    test('every route file exports metadata', () => {
      for (const file of routeFiles) {
        const content = readFileContent(file);
        const relativePath = path.relative(APP_DIR, file);

        expect(content).toMatch(
          /export\s+const\s+metadata/,
          `${relativePath} should export metadata`,
        );
      }
    });

    test('metadata coverage matches total route files', () => {
      expect(filesWithMetadata).toBe(totalFiles);

      // Log coverage stats
      console.log(
        `Metadata Coverage: ${filesWithMetadata}/${totalFiles} files (${Math.round((filesWithMetadata / totalFiles) * 100)}%)`,
      );
    });

    test('metadata exports have JSDoc comments', () => {
      for (const file of routeFiles) {
        const content = readFileContent(file);
        const relativePath = path.relative(APP_DIR, file);

        // Check for JSDoc comment before metadata export
        expect(content).toMatch(
          /\/\*\*[\s\S]*?\*\/\s*export\s+const\s+metadata/,
          `${relativePath} should have JSDoc comment for metadata`,
        );
      }
    });
  });
});
