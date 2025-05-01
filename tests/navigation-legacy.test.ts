import fs from 'fs';
import path from 'path';

describe('Navigation API Migration', () => {
  const srcDir = path.join(process.cwd(), 'src');
  let allFiles: string[] = [];

  // Helper function to recursively get all .ts and .tsx files
  const getAllFiles = (dir: string): string[] => {
    const files = fs.readdirSync(dir);
    const fileList: string[] = [];

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        fileList.push(...getAllFiles(filePath));
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    });

    return fileList;
  };

  beforeAll(() => {
    allFiles = getAllFiles(srcDir);
  });

  test('no imports from next/router remain', () => {
    const routerImports = allFiles.filter((file) => {
      const content = fs.readFileSync(file, 'utf8');
      return (
        content.includes("from 'next/router'") ||
        content.includes('from "next/router"')
      );
    });

    if (routerImports.length > 0) {
      console.log('Files still using next/router:', routerImports);
    }
    expect(routerImports).toHaveLength(0);
  });

  test('no direct window.location usage remains', () => {
    const windowLocation = allFiles.filter((file) => {
      const content = fs.readFileSync(file, 'utf8');
      // Exclude test files as they may need window.location for testing
      if (file.includes('/tests/')) return false;
      return content.includes('window.location');
    });

    if (windowLocation.length > 0) {
      console.log('Files still using window.location:', windowLocation);
    }
    expect(windowLocation).toHaveLength(0);
  });

  test('no raw anchor tags with internal links remain in app directory', () => {
    const appDir = path.join(srcDir, 'app');
    const appFiles = getAllFiles(appDir);

    const rawAnchors = appFiles.filter((file) => {
      const content = fs.readFileSync(file, 'utf8');
      // Look for <a href="/..."> but exclude external links
      return /\<a\s+href=["']\//i.test(content);
    });

    if (rawAnchors.length > 0) {
      console.log('Files still using raw anchor tags:', rawAnchors);
    }
    expect(rawAnchors).toHaveLength(0);
  });
});
