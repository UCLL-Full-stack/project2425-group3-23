/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Map @
    '^@components/(.*)$': '<rootDir>/components/$1', // Map @components to components
    '^@services/(.*)$': '<rootDir>/services/$1', // Map @services to services
  }
};