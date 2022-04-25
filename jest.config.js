module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testRegex: '\\.test\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['/build/', '/types/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['src', 'shared'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  testEnvironment: 'jsdom',
}
