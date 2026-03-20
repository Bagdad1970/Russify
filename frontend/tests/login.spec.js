import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { loadUser } from '../fixtures/user-storage';

let user;

test.beforeAll(() => {
  user = loadUser();
});

test('Логин через Настройки', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginViaSettings(user.email, user.password);
  await loginPage.settings.click();  
  await expect(page.locator('.settings-logout-btn')).toBeVisible();
});

test('Логин через Избранное', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginViaFavorites(user.email, user.password);
  await loginPage.settings.click();  
  await expect(page.locator('.settings-logout-btn')).toBeVisible();
});

test('Логин через Профиль', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginViaProfile(user.email, user.password);
  await loginPage.settings.click();  
  await expect(page.locator('.settings-logout-btn')).toBeVisible();
});