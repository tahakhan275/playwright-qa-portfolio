# Playwright QA Automation Portfolio

![Playwright tests](../../actions/workflows/playwright.yml/badge.svg)

A test automation framework built with **Playwright + TypeScript**, covering three layers of testing:

| Layer | Target | What it shows |
|---|---|---|
| **UI (end-to-end)** | [Sauce Demo](https://www.saucedemo.com) shop | Page Object Model, custom fixtures, data-driven negative tests, full checkout flow with price-total validation, desktop + mobile (Pixel 7) runs |
| **API** | [Restful Booker](https://restful-booker.herokuapp.com) | Token auth, full CRUD (POST/GET/PUT/PATCH/DELETE), negative and security checks (403 without token), search, response header checks |
| **Accessibility** | Sauce Demo | Automated WCAG 2.1 A/AA scan with axe-core; critical issues fail the build, all findings attached to the report |

Tests run automatically on every push through **GitHub Actions**, and the HTML report is saved as a build artifact.

## Project structure

```
pages/            Page objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
fixtures/         Test data and custom Playwright fixtures
tests/ui/         End-to-end UI tests
tests/api/        REST API tests
tests/a11y/       Accessibility tests
.github/workflows CI pipeline
```

## Run locally

```bash
npm install
npx playwright install chromium
npm test              # everything
npm run test:ui       # UI only
npm run test:api      # API only
npm run test:a11y     # accessibility only
npm run report        # open the HTML report
```

## Design choices

- **Page Object Model + fixtures:** tests read like user journeys; locators live in one place, so a UI change means one fix.
- **Stable locators:** `data-test` attributes and accessible roles instead of brittle CSS paths.
- **Tagged smoke suite:** `@smoke` tests also run on a mobile viewport.
- **Failure evidence:** screenshots, videos and traces are kept only for failed tests to keep CI fast.
- **Retries only in CI:** flaky behaviour stays visible locally instead of being hidden.

## About me

Muhammad Taha Khan, ISTQB CTFL certified Senior SQA Engineer, 5+ years in QA (web, mobile, API, accessibility).
[LinkedIn](https://www.linkedin.com/in/tahakhan270595)
