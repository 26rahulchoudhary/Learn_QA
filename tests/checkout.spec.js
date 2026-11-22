const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

test.describe('SauceDemo Checkout Module Tests', () => {
  let loginPage;
  let productsPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.openCart();
    await checkoutPage.openCheckout();
  });

  test('TC_CHECKOUT_001 - Navigate to checkout', async ({ page }) => {
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('TC_CHECKOUT_002 - Verify checkout information page', async () => {
    await expect(checkoutPage.firstNameInput).toBeVisible();
    await expect(checkoutPage.lastNameInput).toBeVisible();
    await expect(checkoutPage.postalCodeInput).toBeVisible();
  });

  test('TC_CHECKOUT_003 - Continue with empty information', async () => {
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage)
      .toContainText('First Name is required');
  });

  test('TC_CHECKOUT_004 - Submit without first name', async () => {
    await checkoutPage.enterCustomerInformation('', 'Choudhary', '400067');
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage)
      .toContainText('First Name is required');
  });

  test('TC_CHECKOUT_005 - Submit without last name', async () => {
    await checkoutPage.enterCustomerInformation('Rahul', '', '400067');
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage)
      .toContainText('Last Name is required');
  });

  test('TC_CHECKOUT_006 - Submit without postal code', async () => {
    await checkoutPage.enterCustomerInformation('Rahul', 'Choudhary', '');
    await checkoutPage.continueCheckout();

    await expect(checkoutPage.errorMessage)
      .toContainText('Postal Code is required');
  });

  test('TC_CHECKOUT_007 - Complete checkout with valid information', async ({ page }) => {
    await checkoutPage.enterCustomerInformation(
      'Rahul',
      'Choudhary',
      '400067'
    );

    await checkoutPage.continueCheckout();

    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('TC_CHECKOUT_008 - Verify checkout', async ({ page }) => {
  await checkoutPage.enterCustomerInformation(
    'Rahul',
    'Choudhary',
    '400067'
  );

  await checkoutPage.continueCheckout();

  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('.title')).toHaveText('Checkout: Overview');

  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.locator('.inventory_item_name'))
    .toHaveText('Sauce Labs Backpack');

  await expect(page.locator('.inventory_item_price'))
    .toHaveText('$29.99');

  const itemTotal = await checkoutPage.getItemTotal();
  const tax = await checkoutPage.getTax();
  const total = await checkoutPage.getTotal();

  expect(tax).toBe(2.40);
  expect(total).toBe(32.39);

  expect(total).toBeCloseTo(itemTotal + tax, 2);
});


test('TC_CHECKOUT_009 - Complete the order successfully', async ({ page }) => {
  await checkoutPage.enterCustomerInformation(
    'Rahul',
    'Choudhary',
    '400067'
  );

  await checkoutPage.continueCheckout();
  await checkoutPage.finishOrder();

  await expect(page).toHaveURL(/checkout-complete/);

  await expect(checkoutPage.confirmationMessage)
    .toHaveText('Thank you for your order!');

  await expect(checkoutPage.confirmationDescription)
    .toContainText('Your order has been dispatched');
});

});