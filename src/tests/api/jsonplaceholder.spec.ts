// API test examples using a custom Playwright fixture and reusable API client.
import { test, expect } from '../../utils/fixtures';

test.describe('API validation tests', () => {
  test('should validate a sample todo resource', async ({ apiClient }) => {
    const response = await apiClient.get('/todos/1');
    expect(response.ok()).toBeTruthy();

    const todo = await response.json();
    expect(todo).toMatchObject({
      id: 1,
      userId: 1,
      title: expect.any(String),
      completed: expect.any(Boolean)
    });
  });

  test('should create a new post with a JSON payload', async ({ apiClient }) => {
    const response = await apiClient.post('/posts', {
      title: 'Playwright API Example',
      body: 'A beginner-friendly API validation sample',
      userId: 42
    });

    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created).toMatchObject({
      title: 'Playwright API Example',
      body: 'A beginner-friendly API validation sample',
      userId: 42
    });
  });
});
