module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/services/**/*.ts'],
  coverageThreshold: { global: { lines: 40, statements: 40, functions: 40, branches: 30 } },
};
