const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Exclude React Native Firebase packages from web builds
  config.externals = {
    ...config.externals,
    '@react-native-firebase/app': 'commonjs @react-native-firebase/app',
    '@react-native-firebase/auth': 'commonjs @react-native-firebase/auth',
    '@react-native-firebase/firestore': 'commonjs @react-native-firebase/firestore',
  };

  // Add resolve fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/vendor/emitter/EventEmitter': false,
  };

  return config;
};
