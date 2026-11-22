
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');

test.describe('SauceDemo Product Module Tests', () => {

  let loginPage;
  let productsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('TC_PROD_001 - Verify products page is displayed', async ({ page }) => {

    await expect(productsPage.productsTitle).toHaveText('Products');
    await expect(page).toHaveURL(/inventory/);

  });

  test('TC_PROD_002 - Verify total product count', async () => {

    const count = await productsPage.getProductCount();

    expect(count).toBe(6);

  });

  test('TC_PROD_003 - Verify product names', async () => {

    const expectedProducts = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];

    const actualProducts = await productsPage.getProductNames();

    expect(actualProducts).toEqual(expectedProducts);

  });

  test('TC_PROD_004 - Verify product prices are displayed', async () => {

    const prices = await productsPage.getProductPrices();

    expect(prices).toHaveLength(6);

    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
    }

  });

  test('TC_PROD_005 - Sort products by price low to high', async () => {

    await productsPage.sortProducts('lohi');

    const actualPrices = await productsPage.getProductPrices();

    const expectedPrices = [...actualPrices].sort((a, b) => a - b);

    expect(actualPrices).toEqual(expectedPrices);

  });

  test('TC_PROD_006 - Sort products by price high to low', async () => {

    await productsPage.sortProducts('hilo');

    const actualPrices = await productsPage.getProductPrices();

    const expectedPrices = [...actualPrices].sort((a, b) => b - a);

    expect(actualPrices).toEqual(expectedPrices);

  });

  test('TC_PROD_007 - Sort products by name A to Z', async () => {

    await productsPage.sortProducts('az');

    const actualNames = await productsPage.getProductNames();

    const expectedNames = [...actualNames].sort((a, b) => a.localeCompare(b));

    expect(actualNames).toEqual(expectedNames);

  });

  test('TC_PROD_008 - Sort products by name Z to A', async () => {

    await productsPage.sortProducts('za');

    const actualNames = await productsPage.getProductNames();

    const expectedNames = [...actualNames].sort((a, b) => b.localeCompare(a));

    expect(actualNames).toEqual(expectedNames);

  });

  test('TC_PROD_009 - Open product details', async ({ page }) => {

    const productName = 'Sauce Labs Backpack';

    await productsPage.openProduct(productName);

    await expect(page.locator('.inventory_details_name'))
      .toHaveText(productName);

    await expect(page.locator('.inventory_details_price'))
      .toBeVisible();

    await expect(page.locator('.inventory_details_desc'))
      .toBeVisible();

  });

  test('TC_PROD_010 - Verify specific product price', async () => {

  const productName = 'Sauce Labs Backpack';

  const price = await productsPage.getProductPriceByName(productName);

  expect(price).toBe(29.99);

});

});
