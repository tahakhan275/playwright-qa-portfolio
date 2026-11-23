import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.error = page.locator('[data-test="error"]');
    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  async fillDetails(first: string, last: string, postal: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(postal);
    await this.continueButton.click();
  }

  /** Reads "Item total: $39.98" style labels and returns the number. */
  static money(text: string): number {
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  async expectTotalsAddUp() {
    const subtotal = CheckoutPage.money(await this.itemTotal.innerText());
    const tax = CheckoutPage.money(await this.tax.innerText());
    const total = CheckoutPage.money(await this.total.innerText());
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }

  async finish() {
    await this.finishButton.click();
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
