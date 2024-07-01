import nextJest from 'next/jest';
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  moduleNameMapper: {
    '^@/components/(.*)$': '/src/components/$1',
    '^@/pages/(.*)$': '/src/pages/$1',
    '^@/utils/(.*)$': '/src/utils/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/tests/**/*spec.{ts,tsx}'],
  //coverageProvider: 'v8',
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: ['/tests/'],
  collectCoverage: true,
  reporters: [['default', { summaryThreshold: 1 }]],
  // coverageDirectory: './reports/coverage',
  setupFiles: ['./src/tests/setup.ts'],
};
export default createJestConfig(customJestConfig);
