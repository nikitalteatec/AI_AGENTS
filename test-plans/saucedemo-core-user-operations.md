# Sauce Demo Core User Operations Test Plan

## Application Overview

Functional test plan based on exploration of https://www.saucedemo.com. Covers the five common customer operations: sign in, browse/select products, manage the cart, complete checkout, and sign out. The UI provides the standard_user credentials (password: secret_sauce), six products with four sorting options, cart add/remove controls, required checkout fields (first name, last name, ZIP/postal code), order totals, and a completion confirmation. Run each scenario independently from a logged-out, fresh/reset application state using the standard_user account unless stated otherwise. Use an isolated browser session or Reset App State between scenarios so prior cart or checkout state cannot affect results.

## Test Scenarios

### 1. Five core customer operations

**Seed:** `tests\seed.spec.ts`

#### 1.1. Sign in with valid credentials and handle rejected/missing credentials

**File:** `tests\saucedemo\sign-in.spec.ts`

**Steps:**
  1. Start from the logged-out login page in a fresh session. Submit the form with both username and password blank.
    - expect: The user remains on the login page and sees a required-username validation error.
  2. Enter an unrecognized username and an incorrect password, then select Login.
    - expect: Authentication is rejected and an error is displayed; the user is not taken to the catalog.
  3. Enter the documented standard_user username and secret_sauce password, then select Login.
    - expect: The login succeeds and the Products catalog is displayed.
    - expect: No login error remains visible.

#### 1.2. Browse, sort, and inspect the product catalog

**File:** `tests\saucedemo\browse-products.spec.ts`

**Steps:**
  1. From a newly authenticated standard_user session, inspect the Products page.
    - expect: The catalog displays six products with a name, description, price, and Add to cart action.
    - expect: The default sort is Name (A to Z), and product names appear alphabetically.
  2. Change Sort products to Price (low to high), then Price (high to low).
    - expect: Low-to-high sorting orders product prices ascending; high-to-low orders them descending.
    - expect: All six products remain present after each sort.
  3. Change sorting to Name (Z to A), then open a product detail page by selecting its name or image.
    - expect: The product order is descending alphabetically.
    - expect: The detail page shows the selected product's matching name, description, price, and Add to cart action, plus Back to products.
  4. Select Back to products.
    - expect: The catalog is displayed again and is usable for continued shopping.

#### 1.3. Add, review, remove, and continue shopping from the cart

**File:** `tests\saucedemo\manage-cart.spec.ts`

**Steps:**
  1. From a fresh standard_user session, add Sauce Labs Backpack from the catalog.
    - expect: The product's action changes to Remove and the cart badge displays 1.
  2. Add a different product, open the cart, and review its contents.
    - expect: The cart badge reflects two items.
    - expect: The cart lists both selected products with quantity, description, price, and Remove controls.
  3. Remove one product from the cart.
    - expect: Only the other product remains and the cart badge updates to 1.
  4. Select Continue Shopping and return to the cart without adding anything else.
    - expect: The catalog is reachable and the retained cart item remains present when the cart is reopened.
  5. Remove the remaining product.
    - expect: The cart is empty and the cart badge no longer indicates any items.

#### 1.4. Validate checkout information and complete an order

**File:** `tests\saucedemo\checkout.spec.ts`

**Steps:**
  1. From a fresh standard_user session, add one known product (for example, Sauce Labs Onesie) and proceed through the cart to Checkout.
    - expect: The cart contains the selected product and checkout opens the Your Information form with First Name, Last Name, and Zip/Postal Code fields.
  2. Submit the checkout form with all fields blank.
    - expect: Checkout does not advance and displays a required First Name validation error.
  3. Enter a first name only and select Continue.
    - expect: Checkout remains on Your Information and indicates that Last Name is required.
  4. Enter a last name as well but leave Zip/Postal Code blank, then select Continue.
    - expect: Checkout remains on Your Information and indicates that Zip/Postal Code is required.
  5. Complete all three fields with valid non-empty values and select Continue.
    - expect: The Checkout: Overview page lists the selected item and shows payment, shipping, item subtotal, tax, and total.
    - expect: The displayed total equals item subtotal plus tax.
  6. Select Finish.
    - expect: The Checkout: Complete page displays a thank-you/order-dispatched confirmation.
    - expect: The cart is empty after successful order completion.

#### 1.5. Sign out and verify the authenticated session ends

**File:** `tests\saucedemo\sign-out.spec.ts`

**Steps:**
  1. From a fresh authenticated standard_user session, open the navigation menu and select Logout.
    - expect: The login page is displayed and authenticated catalog/cart pages are no longer shown.
  2. Attempt to open the inventory page directly in the same browser session.
    - expect: The user is redirected to the login page or otherwise prevented from viewing authenticated inventory content.
  3. Sign in again with standard_user and secret_sauce, then sign out once more using the menu.
    - expect: A subsequent login succeeds and Logout consistently returns the user to the login page.
