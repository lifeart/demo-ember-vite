import type { test } from '@playwright/test';

export function withCoverage(testConstructor: typeof test) {
  // fine
  testConstructor.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage();
  });
}
