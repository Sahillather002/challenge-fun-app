import '@testing-library/jest-native/extend-expect';

// Setup file for Jest tests

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
  },
  Animated: {
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      interpolate: jest.fn(() => ({
        __getValue: jest.fn(() => 0),
      })),
    })),
    View: 'Animated.View',
    Text: 'Animated.Text',
  },
}));

// Mock Expo modules
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'mock-redirect-uri'),
  startAsync: jest.fn(() => Promise.resolve({ type: 'success', params: {} })),
  TokenResponse: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-constants', () => ({
  manifest: {
    extra: {
      googleFitClientId: 'mock-client-id',
    },
  },
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  presentNotificationAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({ data: [], error: null })),
      insert: jest.fn(() => ({ data: [], error: null })),
      update: jest.fn(() => ({ data: [], error: null })),
      delete: jest.fn(() => ({ data: [], error: null })),
    })),
    channel: jest.fn(() => ({
      on: jest.fn(() => ({ subscribe: jest.fn() })),
    })),
    auth: {
      signInWithPassword: jest.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
      signUp: jest.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      getUser: jest.fn(() => Promise.resolve({ data: { user: {} }, error: null })),
    },
  })),
}));

// Mock Firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: {} })),
  signOut: jest.fn(() => Promise.resolve()),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => true, data: () => ({}) })),
  setDoc: jest.fn(() => Promise.resolve()),
  updateDoc: jest.fn(() => Promise.resolve()),
}));

// Mock React Native Paper
jest.mock('react-native-paper', () => ({
  Card: 'Card',
  Title: 'Title',
  Paragraph: 'Paragraph',
  Button: 'Button',
  TextInput: 'TextInput',
  FAB: 'FAB',
  Chip: 'Chip',
  List: {
    Item: 'List.Item',
    Icon: 'List.Icon',
  },
  Switch: 'Switch',
  RadioButton: 'RadioButton',
  Divider: 'Divider',
  ProgressBar: 'ProgressBar',
  Snackbar: 'Snackbar',
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: 'Navigator',
    Screen: 'Screen',
  }),
}));

// Mock Razorpay (if using)
jest.mock('react-native-razorpay', () => ({
  checkout: jest.fn(() => Promise.resolve({})),
}));

// Mock Google Fit Service
jest.mock('../src/services/GoogleFitService', () => ({
  GoogleFitService: {
    getInstance: () => ({
      getStepCount: jest.fn(() => Promise.resolve(8500)),
      syncSteps: jest.fn(() => Promise.resolve(true)),
      isAuthorized: jest.fn(() => true),
      authorize: jest.fn(() => Promise.resolve(true)),
    }),
  },
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Global test utilities
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
