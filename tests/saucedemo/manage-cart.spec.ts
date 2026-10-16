import { test, expect } from '@playwright/test';

test.describe('@regression Five core customer operations', () => {
  test('Add, review, remove, and continue shopping from the cart', async ({ page }) => {
    // 1. In a fresh session sign in as standard_user, add Sauce Labs Backpack.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 2. Add a different product, open cart, and review its contents.
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
    await expect(cartItems.nth(0)).toContainText('Sauce Labs Backpack');
    await expect(cartItems.nth(0)).toContainText('carry.allTheThings()');
    await expect(cartItems.nth(0)).toContainText('$29.99');
    await expect(cartItems.nth(0).getByText('1', { exact: true })).toBeVisible();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    await expect(cartItems.nth(1)).toContainText('Sauce Labs Bike Light');
    await expect(cartItems.nth(1)).toContainText('$9.99');
    await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

    // 3. Remove one product.
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems.first()).toContainText('Sauce Labs Bike Light');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // 4. Select Continue Shopping and return to the cart without adding anything else.
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/inventory.html/);
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(cartItems).toHaveCount(1);
    await expect(cartItems.first()).toContainText('Sauce Labs Bike Light');

    // 5. Remove the remaining product.
    await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
    await expect(cartItems).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
