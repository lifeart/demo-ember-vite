import type { Page } from '@playwright/test';

export async function skipModalDialog(page: Page) {
  await page.click('[data-test-id="close-modal-dialog"]');
  await new Promise((resolve) => setTimeout(resolve, 500));
}
