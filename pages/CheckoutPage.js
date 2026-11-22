class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');

    this.continueButton = page.getByRole('button', { name: 'Continue' });

    this.errorMessage = page.locator('[data-test="error"]');

    this.overviewTitle = page.locator('.title');
    this.finishButton = page.getByRole('button', { name: 'Finish' });

    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');

    this.confirmationMessage = page.locator('.complete-header');
    this.confirmationDescription = page.locator('.complete-text');
  }

  async openCheckout() {
    await this.checkoutButton.click();
  }

  async enterCustomerInformation(firstName, lastName, postalCode) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async getConfirmationMessage() {
  return await this.confirmationMessage.textContent();
}

  async getItemTotal() {
    const text = await this.itemTotal.textContent();
    return parseFloat(text.replace('Item total: $', ''));
  }

  async getTax() {
    const text = await this.tax.textContent();
    return parseFloat(text.replace('Tax: $', ''));
  }

  async getTotal() {
    const text = await this.total.textContent();
    return parseFloat(text.replace('Total: $', ''));
  }
}

module.exports = { CheckoutPage };