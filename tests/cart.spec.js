
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');
const { CartPage } = require('../pages/CartPage');

test.describe('SauceDemo Cart Module Tests', () => {
  let loginPage;
  let productsPage;
  let cartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);
    cartPage = new CartPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('TC_CART_001 - Add a product to the cart', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC_CART_002 - Verify cart badge count', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('TC_CART_003 - Open cart and verify product details', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.openCart();

    await expect(cartPage.cartItemNames).toContainText('Sauce Labs Backpack');
    await expect(cartPage.cartItems).toHaveCount(1);
  });

  test('TC_CART_004 - Verify product price in cart', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.openCart();

    await expect(cartPage.cartItemPrices).toHaveText('$29.99');
  });

  test('TC_CART_005 - Remove a product from cart', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.openCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('TC_CART_006 - Verify cart is empty after removal', async ({ page }) => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await cartPage.openCart();

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('TC_CART_007 - Add multiple products and verify cart count', async () => {
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.addProductToCart('Sauce Labs Bike Light');
    await productsPage.addProductToCart('Sauce Labs Bolt T-Shirt');

    await cartPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(3);
    await expect(cartPage.cartItemNames).toHaveCount(3);
  });
});
