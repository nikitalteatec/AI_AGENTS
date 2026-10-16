import { test, expect } from '@playwright/test';

test.describe('Five core customer operations', () => {
  test('Validate checkout information and complete an order', async ({ page }) => {
    // 1. In a fresh session sign in as standard_user, add Sauce Labs Onesie, open cart and Checkout.
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Zip/Postal Code' })).toBeVisible();

    // 2. Submit all fields blank.
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(/checkout-step-one.html/);
    await expect(page.getByRole('alert')).toContainText('First Name is required');

    // 3. Enter first name only and continue.
    await page.locator('[data-test="firstName"]').fill('Taylor');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toContainText('Last Name is required');

    // 4. Enter last name also, leave postal code blank, continue.
    await page.locator('[data-test="lastName"]').fill('Tester');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByRole('alert')).toContainText('Postal Code is required');

    // 5. Fill all fields with Taylor, Tester, 90210 and Continue.
    await page.locator('[data-test="postalCode"]').fill('90210');
    await page.locator('[data-test="continue"]').click();
    await expect(page.getByText('Checkout: Overview')).toBeVisible();
    await expect(page.getByText('Sauce Labs Onesie', { exact: true })).toBeVisible();
    await expect(page.getByText('Payment Information:')).toBeVisible();
    await expect(page.getByText('Shipping Information:')).toBeVisible();
    await expect(page.getByText('Item total: $7.99')).toBeVisible();
    await expect(page.getByText('Tax: $0.64')).toBeVisible();
    await expect(page.getByText('Total: $8.63')).toBeVisible();
    const itemTotal = Number((await page.locator('.summary_subtotal_label').innerText()).replace('Item total: $', ''));
    const tax = Number((await page.locator('.summary_tax_label').innerText()).replace('Tax: $', ''));
    const total = Number((await page.locator('.summary_total_label').innerText()).replace('Total: $', ''));
    expect(total).toBeCloseTo(itemTotal + tax, 2);

    // 6. Finish.
    await page.locator('[data-test="finish"]').click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
    await expect(page.getByText('Your order has been dispatched')).toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
