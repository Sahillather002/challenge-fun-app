module.exports = {
  preset: 'jest-expo',
  // setupFilesAfterEnv: ['<rootDir>/jest-setup.js'], // Temporarily disabled
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-native-js-polyfills|@react-native/js-polyfills|react-native|@react-native|react-native-vector-icons|react-native-animatable|react-native-chart-kit|react-native-dotenv|react-native-gesture-handler|react-native-haptic-feedback|react-native-linear-gradient|react-native-paper|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-vector-icons|react-native-web|react-native-uuid|react-native-keychain)'
  ],
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['react-native'],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}'
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native',
    '^react-native-vector-icons/MaterialCommunityIcons$': '<rootDir>/__mocks__/react-native-vector-icons.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
