
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('SauceDemo Login Tests', () => {

  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('TC_LOGIN_001 - Successful login with valid credentials', async ({ page }) => {

    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory/);

    await expect(page.locator('.title')).toHaveText('Products');

  });

  test('TC_LOGIN_002 - Login with invalid credentials', async () => {

    await loginPage.login('wrong_user', 'wrong_password');

    await expect(loginPage.errorMessage).toBeVisible();

  });

  test('TC_LOGIN_003 - Login with empty credentials', async () => {

    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toContainText('Username is required');

  });

});
