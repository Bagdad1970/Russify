import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
import { generateUser } from '../fixtures/test-data';
import { saveUser } from '../fixtures/user-storage';

test('Успешная регистрация через Профиль', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const user = generateUser();

  await registerPage.goto();
  await registerPage.registerViaProfile(user);

  
  await expect(registerPage.modal).not.toBeVisible();

  
  await expect(page).toHaveURL('http://russify.k-lab.su');

  saveUser(user);
});
