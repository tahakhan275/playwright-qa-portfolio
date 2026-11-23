import { test, expect } from '../../fixtures/pages';
import { USERS, CUSTOMER } from '../../fixtures/users';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Cart and checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('cart badge updates when adding and removing items', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.removeFromCart(BACKPACK);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('complete purchase end to end @smoke', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.addToCart(BIKE_LIGHT);
    await inventoryPage.openCart();
    expect(await cartPage.itemNames()).toEqual([BACKPACK, BIKE_LIGHT]);

    await cartPage.checkout();
    await checkoutPage.fillDetails(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await checkoutPage.expectTotalsAddUp();
    await checkoutPage.finish();
  });

  test('checkout requires customer details', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart(BACKPACK);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillDetails('', CUSTOMER.lastName, CUSTOMER.postalCode);
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('cart contents persist after page reload', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(BACKPACK);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});

test.describe('Sorting', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
  });

  test('price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });
});
