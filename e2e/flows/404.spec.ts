import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';
import { skipModalDialog } from './../utils/modal-dialog.ts';

captureCoverage(test);

test.describe('NotFound route', () => {
  test('it loadable', async ({ page }) => {
    await page.goto('http://localhost:4200/foo-bar-baz');
    await skipModalDialog(page);
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Not found/);
    // Expect an element "to contain" text.
    await expect(page.locator('[data-not-found-text]')).toContainText(
      'Sorry, we couldn’t find the page /foo-bar-baz'
    );
  });
});
