import nextJest from 'next/jest';
const createJestConfig = nextJest({
  dir: './',
});
const customJestConfig = {
  moduleNameMapper: {
    '^@/components/(.*)$': '/src/components/$1',
    '^@/pages/(.*)$': '/src/pages/$1',
    '^@/utils/(.*)$': '/src/utils/$1',
    'next-auth/providers/credentials':
      '<rootDir>/src/tests/__mocks__/next-auth-providers-credentials.ts',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: [
    '<rootDir>/src/tests/__mocks__/ping-jest-mock-data-setup.ts',
  ],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['**/tests/**/*spec.{ts,tsx}'],
  //coverageProvider: 'v8',
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: ['/tests/'],
  collectCoverage: true,
  reporters: [['default', { summaryThreshold: 1 }], 'jest-html-reporters'],
  // coverageDirectory: './reports/coverage',
  setupFiles: ['./src/tests/setup.ts'],
};
export default createJestConfig(customJestConfig);
