import { defineConfig, devices } from '@playwright/test';

/**
 * Three projects so each layer can run on its own:
 *   ui   - end-to-end tests against the Sauce Demo shop (page object model)
 *   api  - REST API tests against Restful Booker (CRUD + auth)
 *   a11y - automated WCAG checks with axe-core
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'ui-mobile',
      testDir: './tests/ui',
      grep: /@smoke/,
      use: { ...devices['Pixel 7'], baseURL: 'https://www.saucedemo.com' },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: 'https://restful-booker.herokuapp.com' },
    },
    {
      name: 'a11y',
      testDir: './tests/a11y',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://www.saucedemo.com' },
    },
  ],
});
