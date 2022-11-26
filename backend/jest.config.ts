/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@App': '<rootDir>/src/app.ts',
    '^@Authentication': '<rootDir>/src/auth',
    '^@Controllers': '<rootDir>/src/controllers',
    '^@Database': '<rootDir>/src/database',
    '^@Errors': '<rootDir>/src/errors',
    '^@Routes': '<rootDir>/src/routes',
    '^@Utils': '<rootDir>/src/utils',
    '^@Validations': '<rootDir>/src/validations',
  },
}
