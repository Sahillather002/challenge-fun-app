const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Completely ignore React Native Firebase packages on web
  config.resolve.alias = {
    ...config.resolve.alias,
    '@react-native-firebase/app': false,
    '@react-native-firebase/auth': false,
    '@react-native-firebase/firestore': false,
  };

  // Add resolve fallbacks for Node.js modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native/Libraries/vendor/emitter/EventEmitter': false,
  };

  // Ignore these modules during bundling
  config.plugins.push(
    new (require('webpack')).IgnorePlugin({
      resourceRegExp: /@react-native-firebase/,
    })
  );

  return config;
};
