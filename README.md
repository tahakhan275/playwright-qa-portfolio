# Playwright QA Automation Portfolio

![Playwright tests](../../actions/workflows/playwright.yml/badge.svg) ![Postman API tests](../../actions/workflows/postman.yml/badge.svg)

A test automation portfolio built with **Playwright + TypeScript** and **Postman + Newman**, covering four layers of testing:

| Layer | Target | What it shows |
|---|---|---|
| **UI (end-to-end)** | [Sauce Demo](https://www.saucedemo.com) shop | Page Object Model, custom fixtures, data-driven negative tests, full checkout flow with price-total validation, desktop + mobile (Pixel 7) runs |
| **API** | [Restful Booker](https://restful-booker.herokuapp.com) | Token auth, full CRUD (POST/GET/PUT/PATCH/DELETE), negative and security checks (403 without token), search, response header checks |
| **API (Postman)** | [Restful Booker](https://restful-booker.herokuapp.com) | Postman collection run by Newman in CI: token auth, chained CRUD with dynamic test data, JSON schema validation, search, negative and security checks (403/404/invalid body), response-time checks, clean-up; HTML + JUnit reports |
| **Accessibility** | Sauce Demo | Automated WCAG 2.1 A/AA scan with axe-core; critical issues fail the build, all findings attached to the report |

Tests run automatically on every push through **GitHub Actions**, and the HTML report is saved as a build artifact.

## Project structure

```
pages/            Page objects (LoginPage, InventoryPage, CartPage, CheckoutPage)
fixtures/         Test data and custom Playwright fixtures
tests/ui/         End-to-end UI tests
tests/api/        REST API tests
tests/a11y/       Accessibility tests
postman/          Postman collection + environment (run with Newman)
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

### Postman collection

Import `postman/restful-booker.postman_collection.json` and `postman/restful-booker.postman_environment.json` into Postman and press **Run**, or from the command line:

```bash
npm install -g newman newman-reporter-htmlextra
newman run postman/restful-booker.postman_collection.json \
  -e postman/restful-booker.postman_environment.json -r cli,htmlextra
```

## Design choices

- **Page Object Model + fixtures:** tests read like user journeys; locators live in one place, so a UI change means one fix.
- **Stable locators:** `data-test` attributes and accessible roles instead of brittle CSS paths.
- **Tagged smoke suite:** `@smoke` tests also run on a mobile viewport.
- **Failure evidence:** screenshots, videos and traces are kept only for failed tests to keep CI fast.
- **Two API approaches:** the same API is tested in code (Playwright) and in Postman, the tool many QA teams use day to day.
- **Retries only in CI:** flaky behaviour stays visible locally instead of being hidden.

## About me

Muhammad Taha Khan, ISTQB CTFL certified Senior SQA Engineer, 5+ years in QA (web, mobile, API, accessibility).
[LinkedIn](https://www.linkedin.com/in/tahakhan270595)
