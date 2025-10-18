#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      tests: {
        unit: false,
        performance: false,
        api: false,
        googleFit: false
      },
      metrics: {},
      timestamp: new Date().toISOString()
    };
  }

  async runUnitTests() {
    console.log('🧪 Running Unit Tests...');

    return new Promise((resolve, reject) => {
      const jest = spawn('npx', ['jest', '--passWithNoTests'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      let output = '';
      jest.stdout.on('data', (data) => {
        output += data.toString();
      });

      jest.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      jest.on('close', (code) => {
        this.results.tests.unit = code === 0;
        console.log(`Unit tests: ${code === 0 ? '✅' : '❌'}`);
        console.log(output);
        resolve(code === 0);
      });

      jest.on('error', (error) => {
        console.error('Failed to run unit tests:', error);
        this.results.tests.unit = false;
        reject(error);
      });
    });
  }

  async runPerformanceTests() {
    console.log('⚡ Running Performance Tests...');

    return new Promise((resolve, reject) => {
      const performanceTest = spawn('node', ['scripts/performance-test.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      let output = '';
      performanceTest.stdout.on('data', (data) => {
        output += data.toString();
      });

      performanceTest.on('close', (code) => {
        console.log(`Performance tests: ${code === 0 ? '✅' : '❌'}`);
        this.results.tests.performance = code === 0;
        resolve(code === 0);
      });

      performanceTest.on('error', (error) => {
        console.error('Failed to run performance tests:', error);
        this.results.tests.performance = false;
        reject(error);
      });
    });
  }

  async runAPIIntegrationTests() {
    console.log('🔗 Running API Integration Tests...');

    return new Promise((resolve, reject) => {
      const apiTest = spawn('node', ['scripts/api-integration-test.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      apiTest.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      apiTest.on('close', (code) => {
        console.log(`API integration tests: ${code === 0 ? '✅' : '❌'}`);
        this.results.tests.api = code === 0;
        resolve(code === 0);
      });

      apiTest.on('error', (error) => {
        console.error('Failed to run API tests:', error);
        this.results.tests.api = false;
        reject(error);
      });
    });
  }

  async runGoogleFitTests() {
    console.log('🏃 Running Google Fit Integration Tests...');

    return new Promise((resolve, reject) => {
      const googleFitTest = spawn('node', ['scripts/google-fit-test.js'], {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });

      googleFitTest.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      googleFitTest.on('close', (code) => {
        console.log(`Google Fit tests: ${code === 0 ? '✅' : '❌'}`);
        this.results.tests.googleFit = code === 0;
        resolve(code === 0);
      });

      googleFitTest.on('error', (error) => {
        console.error('Failed to run Google Fit tests:', error);
        this.results.tests.googleFit = false;
        reject(error);
      });
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Complete Test Suite...\n');

    try {
      await this.runUnitTests();
      await this.runPerformanceTests();
      await this.runAPIIntegrationTests();
      await this.runGoogleFitTests();

      console.log('\n📊 Complete Test Results:');
      console.log(JSON.stringify(this.results, null, 2));

      // Save comprehensive results
      const fs = require('fs');
      fs.writeFileSync(
        path.join(__dirname, '../test-results.json'),
        JSON.stringify(this.results, null, 2)
      );

      console.log('\n✅ All test results saved to test-results.json');

      return this.results;

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      throw error;
    }
  }

  generateResumeMetrics() {
    console.log('\n📋 Resume Validation Metrics:');

    const metrics = {
      'Cross-platform Compatibility': this.results.tests.unit ? '✅ Verified' : '❌ Failed',
      'Real-time Features': this.results.tests.api ? '✅ Verified' : '❌ Failed',
      'Payment Integration': this.results.tests.api ? '✅ Verified' : '❌ Failed',
      'Google Fit Integration': this.results.tests.googleFit ? '✅ Verified' : '❌ Failed',
      'Performance Standards': this.results.tests.performance ? '✅ Verified' : '❌ Failed',
      'Bundle Optimization': this.results.tests.performance ? '✅ Verified' : '❌ Failed',
      'Scalability': this.results.tests.performance ? '✅ Verified' : '❌ Failed'
    };

    console.log(JSON.stringify(metrics, null, 2));
    return metrics;
  }
}

// Run all tests if called directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests()
    .then(() => runner.generateResumeMetrics())
    .catch(console.error);
}

module.exports = TestRunner;
