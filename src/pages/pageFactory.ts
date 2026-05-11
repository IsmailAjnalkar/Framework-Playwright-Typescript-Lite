// PageFactory centralizes page object construction to keep tests clean.
import { Page, TestInfo } from '@playwright/test';
import { LoginPage } from './loginPage';
import { SecureAreaPage } from './secureAreaPage';

export class PageFactory {
  static login(page: Page, testInfo?: TestInfo) {
    return new LoginPage(page, testInfo);
  }

  static secureArea(page: Page, testInfo?: TestInfo) {
    return new SecureAreaPage(page, testInfo);
  }
}
