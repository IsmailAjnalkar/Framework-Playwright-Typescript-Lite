// Test-specific utilities for Playwright test automation.
export class TestHelpers {
  // Generate unique test ID
  static generateTestId(prefix: string = 'test'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }

  // Create test data object with timestamps
  static createTestData(baseData: any = {}): any {
    return {
      ...baseData,
      testId: this.generateTestId(),
      createdAt: new Date().toISOString(),
      testRunId: process.env.TEST_RUN_ID || 'unknown'
    };
  }

  // Retry test function with exponential backoff
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Measure execution time of a function
  static async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return { result, duration };
  }

  // Create test timeout wrapper
  static withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage?: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(errorMessage || `Operation timed out after ${timeoutMs}ms`)),
          timeoutMs
        )
      )
    ]);
  }

  // Generate test data variations
  static generateDataVariations(baseData: any, variations: any[]): any[] {
    return variations.map((variation) => ({ ...baseData, ...variation }));
  }

  // Validate test environment
  static validateTestEnvironment(requiredVars: string[]): { valid: boolean; missing: string[] } {
    const missing = requiredVars.filter((varName) => !process.env[varName]);
    return {
      valid: missing.length === 0,
      missing
    };
  }

  // Create test scenario matrix
  static createTestMatrix<T extends Record<string, any[]>>(
    dimensions: T
  ): Array<{ [K in keyof T]: T[K][number] }> {
    const keys = Object.keys(dimensions) as Array<keyof T>;
    const values = keys.map((key) => dimensions[key]);

    const cartesian = (...arrays: any[][]): any[][] => {
      return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])), [[]]);
    };

    const combinations = cartesian(...values);
    return combinations.map((combination) =>
      keys.reduce((obj, key, index) => {
        obj[key] = combination[index];
        return obj;
      }, {} as any)
    );
  }

  // Compare objects deeply
  static deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (obj1 == null || obj2 == null) return obj1 === obj2;

    if (typeof obj1 !== typeof obj2) return false;

    if (typeof obj1 !== 'object') return obj1 === obj2;

    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    if (Array.isArray(obj1)) {
      if (obj1.length !== obj2.length) return false;
      for (let i = 0; i < obj1.length; i++) {
        if (!this.deepEqual(obj1[i], obj2[i])) return false;
      }
      return true;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      if (!this.deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  // Generate random test data based on schema
  static generateRandomData(schema: any): any {
    const result: any = {};

    for (const [key, type] of Object.entries(schema)) {
      switch (type) {
        case 'string':
          result[key] = Math.random().toString(36).substring(2, 15);
          break;
        case 'number':
          result[key] = Math.floor(Math.random() * 1000);
          break;
        case 'boolean':
          result[key] = Math.random() > 0.5;
          break;
        case 'email':
          result[key] = `${Math.random().toString(36).substring(2, 10)}@test.com`;
          break;
        case 'date':
          result[key] = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0];
          break;
        case 'array':
          result[key] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () =>
            Math.random().toString(36).substring(2, 8)
          );
          break;
        default:
          result[key] = type;
      }
    }

    return result;
  }

  // Create test data factory
  static createDataFactory<T>(template: T, generators: Partial<Record<keyof T, () => any>> = {}): () => T {
    return () => {
      const result = { ...template };

      for (const [key, generator] of Object.entries(generators)) {
        if (generator && typeof generator === 'function') {
          (result as any)[key] = generator();
        }
      }

      return result;
    };
  }

  // Mock API responses for testing
  static createMockResponse(status: number = 200, data: any = {}, headers: Record<string, string> = {}): any {
    return {
      status,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
  }

  // Generate test report data
  static generateTestReport(testResults: any[]): any {
    const total = testResults.length;
    const passed = testResults.filter((t) => t.status === 'passed').length;
    const failed = testResults.filter((t) => t.status === 'failed').length;
    const skipped = testResults.filter((t) => t.status === 'skipped').length;

    return {
      summary: {
        total,
        passed,
        failed,
        skipped,
        passRate: total > 0 ? (passed / total) * 100 : 0
      },
      tests: testResults,
      generatedAt: new Date().toISOString(),
      duration: testResults.reduce((sum, test) => sum + (test.duration || 0), 0)
    };
  }

  // Clean up test artifacts
  static async cleanupTestArtifacts(patterns: string[]): Promise<void> {
    const fs = require('fs').promises;
    const path = require('path');
    const glob = require('glob');

    for (const pattern of patterns) {
      const files = glob.sync(pattern);
      for (const file of files) {
        try {
          await fs.unlink(file);
        } catch (error) {
          console.warn(`Failed to delete ${file}:`, error);
        }
      }
    }
  }

  // Setup test database state
  static async setupTestDatabase(setupQueries: string[]): Promise<void> {
    // This would integrate with your database client
    // Implementation depends on your database setup
    for (const query of setupQueries) {
      // Execute query
      console.log(`Executing setup query: ${query}`);
    }
  }

  // Teardown test database state
  static async teardownTestDatabase(teardownQueries: string[]): Promise<void> {
    // This would integrate with your database client
    // Implementation depends on your database setup
    for (const query of teardownQueries) {
      // Execute query
      console.log(`Executing teardown query: ${query}`);
    }
  }

  // Generate test user credentials
  static generateTestUser(overrides: any = {}): any {
    const baseUser = {
      username: `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      email: `user_${Date.now()}@test.com`,
      password: 'TestPass123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      isActive: true
    };

    return { ...baseUser, ...overrides };
  }

  // Validate test configuration
  static validateTestConfig(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.baseURL) errors.push('baseURL is required');
    if (!config.browser) errors.push('browser is required');
    if (config.timeout && config.timeout < 0) errors.push('timeout must be positive');
    if (config.retries && config.retries < 0) errors.push('retries must be non-negative');

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Create test step logger
  static createStepLogger(testInfo: any) {
    return {
      step: async (name: string, fn: () => Promise<void>) => {
        console.log(`Starting step: ${name}`);
        const start = Date.now();
        try {
          await fn();
          const duration = Date.now() - start;
          console.log(`Completed step: ${name} (${duration}ms)`);
          await testInfo.attach(`Step: ${name}`, {
            body: `Duration: ${duration}ms`,
            contentType: 'text/plain'
          });
        } catch (error) {
          const duration = Date.now() - start;
          console.error(`Failed step: ${name} (${duration}ms)`, error);
          throw error;
        }
      }
    };
  }

  // Compare screenshots with threshold
  static async compareScreenshots(
    actualPath: string,
    expectedPath: string,
    threshold: number = 0.1
  ): Promise<boolean> {
    const fs = require('fs').promises;
    const pixelmatch = require('pixelmatch');
    const { PNG } = require('pngjs');

    const actualImg = PNG.sync.read(await fs.readFile(actualPath));
    const expectedImg = PNG.sync.read(await fs.readFile(expectedPath));

    const { width, height } = actualImg;
    const diff = new PNG({ width, height });

    const mismatchedPixels = pixelmatch(actualImg.data, expectedImg.data, diff.data, width, height, {
      threshold
    });

    const totalPixels = width * height;
    const matchPercentage = ((totalPixels - mismatchedPixels) / totalPixels) * 100;

    return matchPercentage >= (1 - threshold) * 100;
  }

  // Generate performance benchmark data
  static generatePerformanceReport(metrics: any[]): any {
    const responseTimes = metrics.map((m) => m.responseTime).filter((t) => t != null);
    const memoryUsage = metrics.map((m) => m.memoryUsage).filter((m) => m != null);

    return {
      summary: {
        totalRequests: metrics.length,
        averageResponseTime:
          responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0,
        maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
        minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
        averageMemoryUsage:
          memoryUsage.length > 0 ? memoryUsage.reduce((a, b) => a + b, 0) / memoryUsage.length : 0,
        p95ResponseTime: this.calculatePercentile(responseTimes, 95),
        p99ResponseTime: this.calculatePercentile(responseTimes, 99)
      },
      metrics,
      generatedAt: new Date().toISOString()
    };
  }

  // Calculate percentile from array
  private static calculatePercentile(arr: number[], percentile: number): number {
    if (arr.length === 0) return 0;
    const sorted = arr.sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }

  // Create test data seeder
  static createDataSeeder(entityType: string, count: number, factory: () => any): any[] {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        ...factory(),
        entityType,
        seedIndex: i,
        seededAt: new Date().toISOString()
      });
    }
    return data;
  }

  // Validate test data integrity
  static validateDataIntegrity(
    data: any[],
    schema: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      for (const [field, rules] of Object.entries(schema)) {
        const value = item[field];

        if (rules.required && (value === null || value === undefined || value === '')) {
          errors.push(`Item ${i}: ${field} is required`);
        }

        if (value !== null && value !== undefined) {
          if (rules.type && typeof value !== rules.type) {
            errors.push(`Item ${i}: ${field} must be of type ${rules.type}`);
          }

          if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
            errors.push(`Item ${i}: ${field} must be at least ${rules.minLength} characters`);
          }

          if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
            errors.push(`Item ${i}: ${field} must be at most ${rules.maxLength} characters`);
          }

          if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
            errors.push(`Item ${i}: ${field} does not match required pattern`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
