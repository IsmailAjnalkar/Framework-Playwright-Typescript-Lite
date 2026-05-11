// Custom Playwright fixtures extend the built-in test object with API support.
import { APIClient } from './apiClient';
import base, { APIRequestContext } from '@playwright/test';

export type TestFixtures = {
  apiBaseUrl: string;
  apiClient: APIClient;
};

const test = base.extend<TestFixtures>({
  // apiBaseUrl is a shared fixture that provides the base URL for API tests.
  apiBaseUrl: [
    process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
    { scope: 'test' as const }
  ],

  // apiClient is a reusable fixture built from the Playwright request context.
  apiClient: async ({ apiBaseUrl, request }: { apiBaseUrl: string; request: APIRequestContext }, use) => {
    const client = new APIClient(request, apiBaseUrl);
    await use(client);
  }
});

export { test };
export const expect = base.expect;
