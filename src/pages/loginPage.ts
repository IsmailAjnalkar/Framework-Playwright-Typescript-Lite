// Page object model for the login page.
// Contains all page-specific actions and locators for login flows.
import { Locator, Page, TestInfo } from '@playwright/test';
import { BasePage } from './basePage';
import { locators } from './locators';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly flashMessage: Locator;

  constructor(page: Page, testInfo?: TestInfo) {
    super(page, testInfo);
    this.usernameInput = page.locator(locators.loginPage.usernameInput);
    this.passwordInput = page.locator(locators.loginPage.passwordInput);
    this.loginButton = page.locator(locators.loginPage.loginButton);
    this.flashMessage = page.locator(locators.loginPage.flashMessage);
  }

  // Navigate to the login page and wait until the page is ready.
  async goto() {
    await super.goto('/login');
    await this.waitForLoad();
    await this.takeStepScreenshot('login-page');
  }

  // Fill login fields and submit the form, capturing screenshots at each step.
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.takeStepScreenshot('login-enter-username');
    await this.passwordInput.fill(password);
    await this.takeStepScreenshot('login-enter-password');
    await this.loginButton.click();
    await this.takeStepScreenshot('login-submit');
  }

  async getFlashMessage() {
    return this.flashMessage.textContent();
  }
}
