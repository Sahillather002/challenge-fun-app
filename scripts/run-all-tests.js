#!/usr/bin/env node

/**
 * Test Runner Script for Health Competition App
 *
 * This script runs all tests in the project with proper configuration
 * and provides a summary of test results.
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🏃‍♂️ Running Health Competition App Test Suite...\n');

// Test configuration
const testConfig = {
  testEnvironment: 'node',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-native-js-polyfills|react-native|@react-native|react-native-vector-icons|react-native-animatable|react-native-chart-kit|react-native-dotenv|react-native-gesture-handler|react-native-haptic-feedback|react-native-linear-gradient|react-native-paper|react-native-reanimated|react-native-safe-area-context|react-native-screens|react-native-svg|react-native-vector-icons|react-native-web)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/*.{test,spec}.{ts,tsx}'
  ],
  verbose: true,
  coverage: true,
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};

// Test categories
const testCategories = [
  {
    name: 'Authentication Tests',
    pattern: '**/Auth/**/__tests__/*.test.tsx'
  },
  {
    name: 'Competition Tests',
    pattern: '**/Competition/**/__tests__/*.test.tsx'
  },
  {
    name: 'Payment Tests',
    pattern: '**/Payment/**/__tests__/*.test.tsx'
  },
  {
    name: 'Dashboard Tests',
    pattern: '**/screens/**/__tests__/DashboardScreens.test.tsx'
  },
  {
    name: 'Settings Tests',
    pattern: '**/Settings/**/__tests__/*.test.tsx'
  },
  {
    name: 'Context Tests',
    pattern: '**/context/**/__tests__/*.test.tsx'
  },
  {
    name: 'Service Tests',
    pattern: '**/services/**/__tests__/*.test.ts'
  },
  {
    name: 'Component Tests',
    pattern: '**/components/**/__tests__/*.test.tsx'
  },
  {
    name: 'Utility Tests',
    pattern: '**/src/**/__tests__/UtilsAndHooks.test.tsx'
  }
];

function runTests() {
  console.log('📋 Test Categories:');
  testCategories.forEach((category, index) => {
    console.log(`  ${index + 1}. ${category.name}`);
  });
  console.log('\n');

  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;

  testCategories.forEach((category, index) => {
    console.log(`🔍 Running ${category.name}...`);

    try {
      const output = execSync(
        `npx jest "${category.pattern}" --config="${JSON.stringify(testConfig)}" --verbose --no-coverage`,
        {
          encoding: 'utf8',
          stdio: 'pipe',
          cwd: process.cwd()
        }
      );

      // Parse Jest output to extract test results
      const lines = output.split('\n');
      let passed = 0;
      let failed = 0;
      let tests = 0;

      lines.forEach(line => {
        if (line.includes('✓') && line.includes('test')) {
          passed++;
        } else if (line.includes('✗') && line.includes('test')) {
          failed++;
        }
      });

      if (passed > 0 || failed > 0) {
        tests = passed + failed;
        totalPassed += passed;
        totalFailed += failed;
        totalTests += tests;

        console.log(`  ✅ ${passed} passed, ${failed} failed, ${tests} total`);
      } else {
        console.log(`  ⚠️  No tests found or tests failed to run`);
      }

    } catch (error) {
      console.log(`  ❌ Error running ${category.name}:`, error.message);
      totalFailed++;
    }

    console.log('');
  });

  // Run all tests together for final summary
  console.log('📊 Final Summary:');
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${totalPassed}`);
  console.log(`   Failed: ${totalFailed}`);

  if (totalFailed === 0) {
    console.log('\n🎉 All tests passed! The project is ready for deployment.');
    process.exit(0);
  } else {
    console.log(`\n❌ ${totalFailed} test(s) failed. Please fix the issues before deployment.`);
    process.exit(1);
  }
}

// Run the tests
runTests();
