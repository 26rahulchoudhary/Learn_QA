
class ProductsPage {
  constructor(page) {
    this.page = page;

    this.productsTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async getProductNames() {
    return await this.productNames.allTextContents();
  }

  async getProductPrices() {
    const prices = await this.productPrices.allTextContents();

    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  async sortProducts(option) {
    await this.sortDropdown.selectOption(option);
  }

  async openProduct(productName) {
    await this.page.getByText(productName, { exact: true }).click();
  }

  async getSelectedSortOption() {
    return await this.sortDropdown.inputValue();
  }

  async getProductPriceByName(productName) {
  const product = this.page.locator('.inventory_item').filter({
    hasText: productName
  });

  const priceText = await product.locator('.inventory_item_price').textContent();

  return parseFloat(priceText.replace('$', ''));
}

async addProductToCart(productName) {
  const product = this.page.locator('.inventory_item').filter({
    hasText: productName
  });

  await product.locator('button').click();
}

}


module.exports = { ProductsPage };
