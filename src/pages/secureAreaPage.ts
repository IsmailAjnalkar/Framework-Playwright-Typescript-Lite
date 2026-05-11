// Page object model for the secure area / logged-in landing page.
// Contains actions and element accessors for the secure area screen.
import { Locator, Page, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';
import { locators } from './locators';

export class SecureAreaPage extends BasePage {
  readonly header: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
    this.header = page.locator(locators.secureAreaPage.header);
    this.logoutButton = page.locator(locators.secureAreaPage.logoutButton);
  }

  async isVisible() {
    return this.header.isVisible();
  }

  async getHeaderText() {
    return this.header.textContent();
  }

  // Click the logout button and capture a final screenshot of the action.
  async logout() {
    await this.logoutButton.click();
    await this.takeStepScreenshot('secure-area-logout');
  }
}
