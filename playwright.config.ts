// Playwright configuration — environment-driven browser selection, headed/headless
// execution, HTML report, retries, parallel execution, and cross-browser projects.
import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test';
import './src/utils/env';

const browser = process.env.PW_BROWSER && process.env.PW_BROWSER.toLowerCase();
const isHeadless = process.env.PW_HEADLESS !== 'false';

const availableProjects: NonNullable<PlaywrightTestConfig['projects']> = [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'chrome', use: { channel: 'chrome', ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } }
];

const projects = browser ? availableProjects.filter((p) => p.name === browser) : availableProjects;
if (browser && projects.length === 0) {
  throw new Error(`Unknown PW_BROWSER value: "${process.env.PW_BROWSER}". Use chromium, chrome, firefox, or webkit.`);
}

export default defineConfig({
  testDir: './src/tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: process.env.PLAYWRIGHT_REPORT_DIR ?? 'playwright-report', open: 'never' }]
  ],
  use: {
    actionTimeout: 0,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL ?? 'https://the-internet.herokuapp.com',
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    headless: isHeadless,
    launchOptions: { slowMo: 0 }
  },
  projects
});
