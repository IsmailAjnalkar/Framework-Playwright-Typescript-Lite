// Browser-specific utilities for Playwright automation.
export class BrowserHelpers {
  // Wait for page to be fully loaded
  static async waitForPageLoad(page: any): Promise<void> {
    await page.waitForLoadState('networkidle');
  }

  // Wait for element to be visible and stable
  static async waitForElementStable(page: any, selector: string, timeout: number = 10000): Promise<void> {
    await page.waitForSelector(selector, { state: 'visible', timeout });
    await page.waitForFunction(
      (sel: string) => {
        const element = document.querySelector(sel);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      selector,
      { timeout: 5000 }
    );
  }

  // Scroll element into view smoothly
  static async scrollIntoView(page: any, selector: string): Promise<void> {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  // Get element bounding box
  static async getBoundingBox(page: any, selector: string): Promise<any> {
    return await page.locator(selector).boundingBox();
  }

  // Check if element is in viewport
  static async isInViewport(page: any, selector: string): Promise<boolean> {
    return await page.locator(selector).isVisible();
  }

  // Get page title
  static async getPageTitle(page: any): Promise<string> {
    return await page.title();
  }

  // Get current URL
  static async getCurrentUrl(page: any): Promise<string> {
    return page.url();
  }

  // Navigate back
  static async goBack(page: any): Promise<void> {
    await page.goBack();
  }

  // Navigate forward
  static async goForward(page: any): Promise<void> {
    await page.goForward();
  }

  // Refresh page
  static async refreshPage(page: any): Promise<void> {
    await page.reload();
  }

  // Clear browser storage
  static async clearStorage(page: any): Promise<void> {
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  // Set viewport size
  static async setViewportSize(page: any, width: number, height: number): Promise<void> {
    await page.setViewportSize({ width, height });
  }

  // Get viewport size
  static async getViewportSize(page: any): Promise<any> {
    return page.viewportSize();
  }

  // Take full page screenshot
  static async takeFullPageScreenshot(page: any, fileName: string): Promise<void> {
    await page.screenshot({ path: fileName, fullPage: true });
  }

  // Take element screenshot
  static async takeElementScreenshot(page: any, selector: string, fileName: string): Promise<void> {
    const element = page.locator(selector);
    await element.screenshot({ path: fileName });
  }

  // Get page source
  static async getPageSource(page: any): Promise<string> {
    return await page.content();
  }

  // Execute JavaScript in page context
  static async executeScript(page: any, script: string, ...args: any[]): Promise<any> {
    return await page.evaluate(script, ...args);
  }

  // Wait for network requests to complete
  static async waitForNetworkIdle(page: any, timeout: number = 10000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  // Mock network response
  static async mockResponse(page: any, url: string, responseData: any): Promise<void> {
    await page.route(url, (route: any) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      });
    });
  }

  // Block network requests
  static async blockRequests(page: any, patterns: string[]): Promise<void> {
    await page.route(patterns, (route: any) => route.abort());
  }

  // Set user agent
  static async setUserAgent(page: any, userAgent: string): Promise<void> {
    await page.setExtraHTTPHeaders({ 'User-Agent': userAgent });
  }

  // Get browser console logs
  static async getConsoleLogs(page: any): Promise<string[]> {
    const logs: string[] = [];
    page.on('console', (msg: any) => {
      logs.push(msg.text());
    });
    return logs;
  }

  // Handle dialog (alert, confirm, prompt)
  static async handleDialog(page: any, accept: boolean = true, promptText?: string): Promise<void> {
    page.on('dialog', async (dialog: any) => {
      if (promptText && dialog.type() === 'prompt') {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  // Wait for file download
  static async waitForDownload(page: any, timeout: number = 30000): Promise<any> {
    return await page.waitForEvent('download', { timeout });
  }

  // Upload file
  static async uploadFile(page: any, selector: string, filePath: string): Promise<void> {
    const fileInput = page.locator(selector);
    await fileInput.setInputFiles(filePath);
  }

  // Get element attribute
  static async getElementAttribute(page: any, selector: string, attribute: string): Promise<string | null> {
    return await page.locator(selector).getAttribute(attribute);
  }

  // Set element attribute
  static async setElementAttribute(
    page: any,
    selector: string,
    attribute: string,
    value: string
  ): Promise<void> {
    await page.locator(selector).setAttribute(attribute, value);
  }

  // Get element text content
  static async getElementText(page: any, selector: string): Promise<string> {
    return await page.locator(selector).textContent();
  }

  // Get element inner HTML
  static async getElementHTML(page: any, selector: string): Promise<string> {
    return await page.locator(selector).innerHTML();
  }

  // Get element outer HTML
  static async getElementOuterHTML(page: any, selector: string): Promise<string> {
    return await page.locator(selector).evaluate((el: Element) => el.outerHTML);
  }

  // Check if element exists
  static async elementExists(page: any, selector: string): Promise<boolean> {
    return (await page.locator(selector).count()) > 0;
  }

  // Get elements count
  static async getElementsCount(page: any, selector: string): Promise<number> {
    return await page.locator(selector).count();
  }

  // Get all elements text
  static async getAllElementsText(page: any, selector: string): Promise<string[]> {
    return await page.locator(selector).allTextContents();
  }

  // Click element with retry
  static async clickWithRetry(page: any, selector: string, maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await page.locator(selector).click();
        return;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }

  // Type text with clear first
  static async typeWithClear(page: any, selector: string, text: string): Promise<void> {
    const element = page.locator(selector);
    await element.clear();
    await element.type(text);
  }

  // Select dropdown option by value
  static async selectByValue(page: any, selector: string, value: string): Promise<void> {
    await page.locator(selector).selectOption({ value });
  }

  // Select dropdown option by label
  static async selectByLabel(page: any, selector: string, label: string): Promise<void> {
    await page.locator(selector).selectOption({ label });
  }

  // Get selected option value
  static async getSelectedValue(page: any, selector: string): Promise<string | null> {
    return await page.locator(selector).inputValue();
  }

  // Check checkbox/radio
  static async checkElement(page: any, selector: string): Promise<void> {
    await page.locator(selector).check();
  }

  // Uncheck checkbox
  static async uncheckElement(page: any, selector: string): Promise<void> {
    await page.locator(selector).uncheck();
  }

  // Check if element is checked
  static async isElementChecked(page: any, selector: string): Promise<boolean> {
    return await page.locator(selector).isChecked();
  }

  // Focus element
  static async focusElement(page: any, selector: string): Promise<void> {
    await page.locator(selector).focus();
  }

  // Hover element
  static async hoverElement(page: any, selector: string): Promise<void> {
    await page.locator(selector).hover();
  }

  // Double click element
  static async doubleClickElement(page: any, selector: string): Promise<void> {
    await page.locator(selector).dblclick();
  }

  // Right click element
  static async rightClickElement(page: any, selector: string): Promise<void> {
    await page.locator(selector).click({ button: 'right' });
  }

  // Drag and drop
  static async dragAndDrop(page: any, fromSelector: string, toSelector: string): Promise<void> {
    await page.locator(fromSelector).dragTo(page.locator(toSelector));
  }

  // Press key
  static async pressKey(page: any, key: string): Promise<void> {
    await page.keyboard.press(key);
  }

  // Type text
  static async typeText(page: any, text: string): Promise<void> {
    await page.keyboard.type(text);
  }

  // Get page cookies
  static async getCookies(page: any): Promise<any[]> {
    return await page.context().cookies();
  }

  // Set cookie
  static async setCookie(page: any, name: string, value: string, domain: string): Promise<void> {
    await page.context().addCookies([{ name, value, domain, path: '/' }]);
  }

  // Delete cookie
  static async deleteCookie(page: any, name: string, domain: string): Promise<void> {
    await page.context().addCookies([{ name, value: '', domain, path: '/', expires: 0 }]);
  }

  // Get local storage item
  static async getLocalStorageItem(page: any, key: string): Promise<string | null> {
    return await page.evaluate((k: string) => localStorage.getItem(k), key);
  }

  // Set local storage item
  static async setLocalStorageItem(page: any, key: string, value: string): Promise<void> {
    await page.evaluate(([k, v]: [string, string]) => localStorage.setItem(k, v), [key, value]);
  }

  // Get session storage item
  static async getSessionStorageItem(page: any, key: string): Promise<string | null> {
    return await page.evaluate((k: string) => sessionStorage.getItem(k), key);
  }

  // Set session storage item
  static async setSessionStorageItem(page: any, key: string, value: string): Promise<void> {
    await page.evaluate(([k, v]: [string, string]) => sessionStorage.setItem(k, v), [key, value]);
  }

  // Get geolocation
  static async setGeolocation(page: any, latitude: number, longitude: number): Promise<void> {
    await page.context().setGeolocation({ latitude, longitude });
  }

  // Grant permissions
  static async grantPermissions(page: any, permissions: string[]): Promise<void> {
    await page.context().grantPermissions(permissions);
  }

  // Clear permissions
  static async clearPermissions(page: any): Promise<void> {
    await page.context().clearPermissions();
  }

  // Emulate device
  static async emulateDevice(page: any, deviceName: string): Promise<void> {
    const { devices } = require('playwright');
    const device = devices[deviceName];
    if (device) {
      await page.setViewportSize(device.viewport);
      await page.setExtraHTTPHeaders(device.extraHTTPHeaders || {});
    }
  }

  // Set network conditions
  static async setNetworkConditions(
    page: any,
    download: number,
    upload: number,
    latency: number
  ): Promise<void> {
    await page.context().setOffline(false);
    // Note: This requires Playwright's network emulation features
    // Implementation may vary based on Playwright version
  }

  // Get performance metrics
  static async getPerformanceMetrics(page: any): Promise<any> {
    return await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as any;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        totalTime: perfData.loadEventEnd - perfData.fetchStart
      };
    });
  }

  // Get page load time
  static async getPageLoadTime(page: any): Promise<number> {
    return await page.evaluate(() => {
      const [navigation] = performance.getEntriesByType('navigation') as any[];
      return navigation.loadEventEnd - navigation.fetchStart;
    });
  }
}
