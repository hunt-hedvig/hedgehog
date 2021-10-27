module.exports = {
  transform: {
    '\\.tsx?$': 'babel-jest',
  },
  testRegex: '\\.test\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['node_modules', 'src', 'shared'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/__mocks__/styleMock.ts',
  },
  setupFiles: ['<rootDir>/test-setup-enzyme.js'],
  testEnvironment: 'jsdom',
}
