import { test, expect } from '@playwright/test';

test('Проверка что открывается сайт', async ({ page }) => {
  await page.goto('http://russify.k-lab.su');
  await page.waitForTimeout(5000);
  await expect(page).toHaveTitle(/frontend/);
});