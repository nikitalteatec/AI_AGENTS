import { test, expect } from '@playwright/test';

test.describe('Five core customer operations', () => {
  test('Browse, sort, and inspect the product catalog', async ({ page }) => {
    // 1. Start in a fresh session; sign in as standard_user / secret_sauce and inspect Products.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    const productCards = page.locator('.inventory_item');
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
    await expect(productCards).toHaveCount(6);
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('az');
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.getByText('$29.99', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toHaveCount(6);

    // 2. Select Price (low to high), then Price (high to low).
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');
    await expect(productCards).toHaveCount(6);
    await expect(productCards.first()).toContainText('Sauce Labs Onesie');
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('hilo');
    await expect(productCards).toHaveCount(6);
    await expect(productCards.first()).toContainText('Sauce Labs Fleece Jacket');

    // 3. Select Name (Z to A), then open a product detail page.
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    await expect(productCards.first()).toContainText('Test.allTheThings() T-Shirt (Red)');
    await page.locator('[data-test="item-3-title-link"]').click();
    await expect(page.getByText('Test.allTheThings() T-Shirt (Red)', { exact: true })).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toHaveText('$15.99');
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add to cart' })).toBeVisible();

    // 4. Select Back to products.
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/inventory.html/);
    await expect(productCards).toHaveCount(6);
  });
});
