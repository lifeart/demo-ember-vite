import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';

captureCoverage(test);

test('qUnit tests', async ({ page }) => {
  const maxQunitTestTime = 1000 * 60 * 5;
  test.setTimeout(maxQunitTestTime);

  await page.goto('http://localhost:4200/tests/');
  await page.evaluate(() => {
    window['QUnit'].done(function () {
      window['onQunitDone']();
    });
  });
  await page.exposeBinding(
    'onQunitDone',
    async () => {
      await expect(page).toHaveTitle(/✔/);
    },
    { handle: true }
  );

  const testResults = await page.locator('#qunit-testresult-display');

  const [total, passed, failed] = await Promise.all([
    testResults.locator('.total').textContent(),
    testResults.locator('.passed').textContent(),
    testResults.locator('.failed').textContent(),
  ]);

  await expect(failed, 'No failed tests').toBe('0');
  await expect(passed, 'All tests passed').toBe(total);
});
