module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testRegex: '\\.test\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/types/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['node_modules', 'src', 'shared'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  setupFiles: ['<rootDir>/test-setup-enzyme.js'],
  testEnvironment: 'jsdom',
}
