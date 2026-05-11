// Custom wait utilities for handling timing and synchronization in tests.
import { Page, Locator } from '@playwright/test';

export class WaitHelpers {
  // Wait for a specific amount of time
  static async waitForTimeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Wait for an element to be visible with custom timeout
  static async waitForElementVisible(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  }

  // Wait for an element to be hidden
  static async waitForElementHidden(page: Page, selector: string, timeout: number = 5000): Promise<void> {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  // Wait for text content to appear in an element
  static async waitForTextContent(locator: Locator, text: string, timeout: number = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    await locator.waitFor({ timeout });
    const content = await locator.textContent();
    if (!content?.includes(text)) {
      throw new Error(`Text "${text}" not found in element within ${timeout}ms`);
    }
  }

  // Wait for a function to return true
  static async waitForCondition(
    condition: () => Promise<boolean> | boolean,
    timeout: number = 5000,
    interval: number = 100
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await this.waitForTimeout(interval);
    }
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  // Wait for page to be fully loaded
  static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page.waitForLoadState('networkidle', { timeout });
  }

  // Wait for network requests to complete
  static async waitForNetworkIdle(page: Page, timeout: number = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  // Retry a function until it succeeds or max attempts reached
  static async retry<T>(fn: () => Promise<T>, maxAttempts: number = 3, delay: number = 1000): Promise<T> {
    let lastError: Error;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxAttempts) {
          await this.waitForTimeout(delay);
        }
      }
    }
    throw lastError!;
  }
}
