const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add dotenv support for .env files in development
  if (env.mode === 'development') {
    config.plugins.push(
      new Dotenv({
        path: './.env',
        systemvars: true,
      })
    );
  }

  // Add path alias for @/ to src/
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': require('path').resolve(__dirname, 'src'),
  };

  // Expo Router specific configuration
  if (config.experiments) {
    config.experiments.topLevelAwait = true;
  }

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
