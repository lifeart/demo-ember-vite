import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';
import { skipModalDialog } from './../utils/modal-dialog.ts';

captureCoverage(test);

test.describe('login flow', () => {
  test('by default user is logged out', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await skipModalDialog(page);
    await expect(page.locator('[data-login-status]')).toContainText(
      'You are not authenticated'
    );
  });
  test('user could not visit profile page if logged out', async ({ page }) => {
    await page.goto('http://localhost:4200/profile');
    await skipModalDialog(page);
    await page.click('a[href="/profile"]');
    await expect(page.url()).toBe('http://localhost:4200/login');
  });
  test('user could use login form', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    await skipModalDialog(page);
    await page.click('[data-test-login-button]');
    await page.waitForURL('http://localhost:4200/profile');

    await expect(page.url()).toBe('http://localhost:4200/profile');

    await expect(page.locator('[data-test-name]')).toContainText('Santa Claus');

    await expect(page.locator('[data-login-status]')).toContainText(
      'You are authenticated as Santa Claus'
    );
  });
  test('user could logout', async ({ page }) => {
    await page.goto('http://localhost:4200/profile');
    await skipModalDialog(page);
    await page.click('[data-test-login-button]');
    await page.waitForURL('http://localhost:4200/profile');
    await expect(page.url()).toBe('http://localhost:4200/profile');

    await page.click('[data-test-logout]');
    await expect(page.url()).toBe('http://localhost:4200/');
  });
});
