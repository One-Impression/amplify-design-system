/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['module:@react-native/babel-preset'] }],
  },
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterSetup: [],
  moduleNameMapper: {
    '^@one-impression/tokens-creator/react-native$': '<rootDir>/__mocks__/tokens-creator.ts',
  },
};
