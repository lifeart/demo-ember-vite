import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';

captureCoverage(test);

test.describe('login flow', () => {
  test('by default user is logged out', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await expect(page.locator('[data-login-status]')).toContainText(
      'You are not authenticated'
    );
  });
  test('user could not visit profile page if logged out', async ({ page }) => {
    await page.goto('http://localhost:4200/profile');
    await page.click('a[href="/profile"]');
    await expect(page.url()).toBe('http://localhost:4200/login');
  });
  test('user could use login form', async ({ page }) => {
    await page.goto('http://localhost:4200/login');
    const navigationPromise = page.waitForNavigation();
    await page.click('[data-test-login-button]');
    await navigationPromise;
    await expect(page.url()).toBe('http://localhost:4200/profile');

    await expect(page.locator('[data-test-name]')).toContainText('Santa Claus');

    await expect(page.locator('[data-login-status]')).toContainText(
      'You are authenticated as Santa Claus'
    );
  });
  test('user could logout', async ({ page }) => {
    await page.goto('http://localhost:4200/profile');
    const navigationPromise = page.waitForNavigation();
    await page.click('[data-test-login-button]');
    await navigationPromise;
    await expect(page.url()).toBe('http://localhost:4200/profile');

    await page.click('[data-test-logout]');
    await expect(page.url()).toBe('http://localhost:4200/');
  });
});
