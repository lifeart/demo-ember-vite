import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';
import { skipModalDialog } from './../utils/modal-dialog.ts';


captureCoverage(test);

test.describe('Ember-Bootstrap route', () => {
  test('it loadable', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await skipModalDialog(page);
    await expect(page).not.toHaveTitle(/Bootstrap/);
    await page.click('a[href="/bootstrap"]');
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Bootstrap/);
  });
});
