import { expect, test } from '@jest/globals';

// The list of dynamic folders that should have not-found.tsx
const dynamicFolders = [
  'src/a../((common)/claims/[id]',
  'src/app/error',
  'src/app/maintenance',
  // These are from the future implementation mentioned in the spec
  // 'src/app/(common)',
  // 'src/app/[group]',
];

describe('Not Found Pages', () => {
  test.each(dynamicFolders)(
    '%s should have a not-found.tsx file',
    async (folder) => {
      try {
        // Dynamic import to check if the file exists
        const notFoundModule = await import(`../../${folder}/not-found`);
        expect(notFoundModule).toBeDefined();
      } catch (error) {
        // If import fails, test should fail
        // eslint-disable-next-line no-console
        console.error(`Failed to import not-found.tsx from ${folder}:`, error);
        throw new Error(
          `${folder}/not-found.tsx does not exist or cannot be imported`,
        );
      }
    },
  );
});
