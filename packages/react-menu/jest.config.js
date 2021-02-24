/**
 * @type {jest.InitialOptions}
 */
module.exports = {
  displayName: 'react-menu',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json',
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  coverageDirectory: '../../coverage/packages/react-button',
  setupFilesAfterEnv: ['./config/tests.js'],
};
