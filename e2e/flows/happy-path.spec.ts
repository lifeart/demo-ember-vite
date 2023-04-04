import { test, expect } from '@playwright/test';

import { captureCoverage } from './../utils/index.ts';

captureCoverage(test);

test.describe('Happy path', () => {
  test('i11n is working just fine', async ({ page }) => {
    await page.goto('http://localhost:4200');

    const msgNode = page.locator('[data-test-welcome-msg]');

    await expect(
      page.locator('button[data-test-lang]'),
      '3 languages is available'
    ).toHaveCount(3);

    await expect(msgNode, 'Default language is english').toContainText(
      'Hello World!'
    );

    // now, let's change the language
    await page.click('[data-test-lang="fr-fr"]');
    await expect(msgNode, 'French language is working').toContainText(
      'Bonjour tout le monde!'
    );

    // now, let's change the language
    await page.click('[data-test-lang="ru-ru"]');
    await expect(msgNode, 'Russian language is working').toContainText(
      'Привет мир!'
    );
    // Expect a title "to contain" a substring.
  });

  test('dialog click is working fine', async ({ page }) => {
    await page.goto('http://localhost:4200');

    page.on('dialog', (dialog) => {
      expect(dialog.message()).toBe('Fine');
      dialog.accept();
    });
    await page.click('[data-test-click-me]');
  });

  test('power select is working fine', async ({ page }) => {
    await page.goto('http://localhost:4200');

    await expect(
      page.locator('.ember-power-select-trigger'),
      'we have some value, selected by default'
    ).toContainText('1');

    await page.click('.ember-power-select-trigger');

    await expect(
      page.locator('.ember-power-select-option'),
      'we have 3 options'
    ).toHaveCount(3);

    await expect(
      page.locator('.ember-power-select-option[data-option-index="2"]')
    ).toContainText('3');
    await page.click('.ember-power-select-option[data-option-index="2"]');

    await expect(
      page.locator('.ember-power-select-trigger'),
      'selected value updated'
    ).toContainText('3');
  });

  test('timer is working fine', async ({ page }) => {
    await page.goto('http://localhost:4200');

    const t1 = await page.locator('pre.font-mono').textContent();
    await page.waitForTimeout(1000);
    const t2 = await page.locator('pre.font-mono').textContent();

    await expect(t1, 'time is going').not.toEqual(t2);
  });
});
