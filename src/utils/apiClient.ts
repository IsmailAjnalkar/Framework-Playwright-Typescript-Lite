// Simple reusable API client that wraps Playwright's request context.
import { APIRequestContext } from '@playwright/test';

export class APIClient {
  // Playwright request context for API calls.
  private requestContext: APIRequestContext;
  // Base URL for all API endpoints.
  private baseURL: string;

  constructor(requestContext: APIRequestContext, baseURL: string) {
    this.requestContext = requestContext;
    this.baseURL = baseURL;
  }

  // Normalize URL paths to avoid duplicate slashes.
  private url(path: string) {
    return `${this.baseURL.replace(/\/+$/, '')}/${path.replace(/^\//, '')}`;
  }

  // Send a GET request to the normalized API path.
  async get(path: string) {
    return this.requestContext.get(this.url(path));
  }

  // Send a POST request with JSON body and default headers.
  async post(path: string, body: any) {
    return this.requestContext.post(this.url(path), {
      data: body,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
