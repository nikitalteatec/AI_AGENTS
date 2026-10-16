import { test, expect } from '@playwright/test';

test.describe('Five core customer operations', () => {
  test('Sign in with valid credentials and handle rejected/missing credentials', async ({ page }) => {
    // 1. Start from the logged-out login page in a fresh session. Submit the form with both username and password blank.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('alert')).toContainText('Username is required');

    // 2. Enter an unrecognized username and incorrect password, then select Login.
    await page.locator('[data-test="username"]').fill('unknown_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('alert')).toContainText('Username and password do not match');

    // 3. Enter the documented standard_user username and secret_sauce password, then select Login.
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
});
