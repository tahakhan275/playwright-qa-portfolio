import { test, expect } from '../../fixtures/pages';
import { USERS } from '../../fixtures/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees a clear error', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.username, USERS.locked.password);
    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  test('wrong credentials are rejected', async ({ loginPage, page }) => {
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);
    await loginPage.expectError('Username and password do not match');
    await expect(page).not.toHaveURL(/inventory/);
  });

  // Data-driven negative tests: one test per missing field
  const missing = [
    { case: 'empty username', user: '', pass: 'secret_sauce', msg: 'Username is required' },
    { case: 'empty password', user: 'standard_user', pass: '', msg: 'Password is required' },
  ];
  for (const m of missing) {
    test(`validation: ${m.case}`, async ({ loginPage }) => {
      await loginPage.login(m.user, m.pass);
      await loginPage.expectError(m.msg);
    });
  }

  test('protected page redirects to login when not signed in', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
