// BasePage provides shared page-level helpers used across all page objects.
import fs from 'fs';
import path from 'path';
import { Page, TestInfo } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;
  private readonly testInfo?: TestInfo;
  private readonly screenshotDir: string;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    const reportDir = process.env.PLAYWRIGHT_REPORT_DIR ?? 'playwright-report';
    this.screenshotDir = path.resolve(process.cwd(), reportDir, 'screenshots');
  }

  // Navigate to a relative or absolute URL path.
  async goto(path: string) {
    await this.page.goto(path);
  }

  // Wait until the page's DOM content has finished loading.
  async waitForLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Capture a screenshot for a specific logical step and attach it to the Playwright report.
  async takeStepScreenshot(stepName: string) {
    const safeName = stepName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${safeName}-${timestamp}.png`;
    const screenshotPath = path.join(this.screenshotDir, filename);

    await fs.promises.mkdir(this.screenshotDir, { recursive: true });
    const screenshotBuffer = await this.page.screenshot({ path: screenshotPath, fullPage: true });

    if (this.testInfo) {
      await this.testInfo.attach(stepName, {
        body: screenshotBuffer,
        contentType: 'image/png'
      });
    }
  }
}
