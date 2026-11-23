import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;

  constructor(private readonly page: Page) {
    this.items = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
  }

  async itemNames(): Promise<string[]> {
    return this.items.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
