const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Mock Supabase for web to avoid module resolution issues
config.resolver.alias = {
  '@supabase/postgrest-js': 'react-native',
  '@supabase/supabase-js': 'react-native',
  '@': './src',
};

module.exports = config;
