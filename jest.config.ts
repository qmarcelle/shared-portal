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
    '^msw/node$': '<rootDir>/node_modules/msw/lib/node/index.js',
    '^msw$': '<rootDir>/node_modules/msw/lib/core/index.js',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testEnvironment: '<rootDir>/jest.environment.js',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['./src/**'],
  coveragePathIgnorePatterns: ['/tests/'],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './coverage',
        filename: 'report.html',
        openReport: true,
      },
    ],
  ],
  resetMocks: true,
};

export default createJestConfig(customJestConfig);
