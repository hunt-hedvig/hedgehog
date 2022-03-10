module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testRegex: '\\.test\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['/node_modules/', '/build/', '/types/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['node_modules', 'src', 'shared'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  testEnvironment: 'jsdom',
}
