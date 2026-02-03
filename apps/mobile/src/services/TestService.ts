export class TestService {
    private testResults: any[] = [];

    constructor() {
        console.log('TestService initialized');
    }

    async runTest(testName: string): Promise<boolean> {
        try {
            console.log(`Running test: ${testName}`);
            await new Promise(resolve => setTimeout(resolve, 100));
            this.testResults.push({ name: testName, status: 'passed', timestamp: Date.now() });
            return true;
        } catch (error) {
            console.error(`Test failed: ${testName}`, error);
            this.testResults.push({ name: testName, status: 'failed', timestamp: Date.now() });
            return false;
        }
    }

    getTestResults(): any[] {
        return this.testResults;
    }

    clearResults(): void {
        this.testResults = [];
    }

    async measureExecutionTime(fn: () => Promise<void>): Promise<number> {
        const start = Date.now();
        await fn();
        return Date.now() - start;
    }
}