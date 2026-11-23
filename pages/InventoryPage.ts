import { Page, Locator, expect } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly prices: Locator;
  readonly names: Locator;
  readonly sortSelect: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.prices = page.locator('[data-test="inventory-item-price"]');
    this.names = page.locator('[data-test="inventory-item-name"]');
    this.sortSelect = page.locator('[data-test="product-sort-container"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.title).toHaveText('Products');
  }

  async addToCart(productName: string) {
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string) {
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption) {
    await this.sortSelect.selectOption(option);
  }

  async getPrices(): Promise<number[]> {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async getNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async openCart() {
    await this.cartLink.click();
  }
}
