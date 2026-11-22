
class CartPage {
  constructor(page) {
    this.page = page;
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.removeButton = page.locator('[data-test^="remove-"]');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  async openCart() {
    await this.cartIcon.click();
  }

  async getCartCount() {
    return await this.cartBadge.textContent();
  }

  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemNames() {
    return await this.cartItemNames.allTextContents();
  }

  async getCartItemPrices() {
    const prices = await this.cartItemPrices.allTextContents();
    return prices.map(price => parseFloat(price.replace('$', '')));
  }

  async removeProduct(productName) {
    const product = this.page.locator('.cart_item').filter({
      hasText: productName
    });

    await product.locator('[data-test^="remove-"]').click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CartPage };
