// Custom assertion utilities for enhanced test validation.
import { expect, Locator, Page } from '@playwright/test';

export class AssertionHelpers {
  // Assert that an element contains specific text
  static async assertElementContainsText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }

  // Assert that an element has exact text
  static async assertElementHasText(locator: Locator, expectedText: string): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }

  // Assert that an element is visible
  static async assertElementVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  // Assert that an element is hidden
  static async assertElementHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  // Assert that an element has a specific attribute value
  static async assertElementHasAttribute(locator: Locator, attribute: string, value: string): Promise<void> {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  // Assert that a page has a specific title
  static async assertPageTitle(page: Page, expectedTitle: string): Promise<void> {
    await expect(page).toHaveTitle(expectedTitle);
  }

  // Assert that a page URL contains specific text
  static async assertPageURLContains(page: Page, expectedURLPart: string): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedURLPart));
  }

  // Assert that an element count matches expected number
  static async assertElementCount(locator: Locator, expectedCount: number): Promise<void> {
    await expect(locator).toHaveCount(expectedCount);
  }

  // Assert that a checkbox is checked
  static async assertCheckboxChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  // Assert that a checkbox is unchecked
  static async assertCheckboxUnchecked(locator: Locator): Promise<void> {
    await expect(locator).not.toBeChecked();
  }

  // Assert that an element has a specific CSS class
  static async assertElementHasClass(locator: Locator, className: string): Promise<void> {
    await expect(locator).toHaveClass(new RegExp(className));
  }

  // Assert that an element's value matches expected value
  static async assertElementValue(locator: Locator, expectedValue: string): Promise<void> {
    await expect(locator).toHaveValue(expectedValue);
  }

  // Assert that an element is enabled
  static async assertElementEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  // Assert that an element is disabled
  static async assertElementDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  // Custom assertion for API response status
  static assertResponseStatus(response: any, expectedStatus: number): void {
    expect(response.status()).toBe(expectedStatus);
  }

  // Custom assertion for API response JSON structure
  static assertResponseJsonStructure(response: any, expectedKeys: string[]): void {
    const jsonData = response.json();
    expectedKeys.forEach((key) => {
      expect(jsonData).toHaveProperty(key);
    });
  }

  // Assert that a number is within a range
  static assertNumberInRange(actual: number, min: number, max: number): void {
    expect(actual).toBeGreaterThanOrEqual(min);
    expect(actual).toBeLessThanOrEqual(max);
  }

  // Assert that an array contains specific items
  static assertArrayContains<T>(array: T[], expectedItems: T[]): void {
    expectedItems.forEach((item) => {
      expect(array).toContain(item);
    });
  }

  // Assert that a string matches a regex pattern
  static assertStringMatchesPattern(text: string, pattern: RegExp): void {
    expect(text).toMatch(pattern);
  }
}
