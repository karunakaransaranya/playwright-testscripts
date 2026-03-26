# Playwright Automation Framework

End-to-end test automation framework built with [Playwright](https://playwright.dev/) using the **Page Object Model (POM)** design pattern. Tests are written against the [Sauce Demo](https://www.saucedemo.com/) web application.

## Prerequisites

| Tool         | Version          |
| ------------ | ---------------- |
| **Node.js**  | v18 or higher    |
| **npm**      | v9 or higher     |
| **Playwright** | ^1.58.0        |

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

### Environment Setup

Create a `.env.dev` file in the project root (not committed to Git):

```dotenv
LOGIN_URL=https://www.saucedemo.com/
USERNAME=standard_user
PASSWORD=secret_sauce

---

## Project Structure

```
PlaywrightAutomation/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI/CD pipeline
├── pageobject/                     # Page Object Model classes
│   ├── LoginPage.js                # Login page actions & validations
│   ├── AddToCart.js                # Inventory & add-to-cart actions
│   ├── CartItem.js                 # Cart page validations
│   └── Checkout.js                 # Checkout flow & order validation
├── tests/                          # Test spec files
│   ├── auth.setup.js               # Authentication setup (saves session)
│   ├── login.spec.js               # Login test scenarios
│   ├── checkout.spec.js            # Checkout flow test scenarios
│   ├── calendly-wed-booking.spec.js # Calendly booking tests (skipped)
│   └── testdata/
│       └── login.testdata.js       # Test data constants & error messages
├── playwright/
│   └── .auth/
│       └── user.json               # Saved auth state (auto-generated)
├── playwright-report/              # HTML test reports (auto-generated)
├── test-results/                   # Test artifacts (auto-generated)
├── .env.dev                        # Dev environment variables (not in Git)
├── .env.test                       # Test environment variables (not in Git)
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies & npm scripts
├── playwright.config.js            # Playwright configuration
└── results.xml                     # JUnit XML report (auto-generated)
```

---

## Page Object Model (POM)

The framework follows the **Page Object Model** design pattern, where each page of the application is represented by a class that encapsulates:

- **Locators** — defined in the constructor
- **Actions** — methods that interact with the page (click, fill, navigate)
- **Validations** — methods that assert expected behavior

### Page Object Classes

| Class | File | Responsibility |
| ----- | ---- | -------------- |
| `LoginPage` | `pageobject/LoginPage.js` | Login/logout, credential validation, error handling, look & feel checks |
| `AddToCart` | `pageobject/AddToCart.js` | Add single/multiple items to cart, side menu validation, cart count |
| `CartItem` | `pageobject/CartItem.js` | Cart item validation (name, description, price, quantity) |
| `Checkout` | `pageobject/Checkout.js` | Checkout form, order summary validation, order completion |

### POM Flow

```
LoginPage          →  AddToCart         →  CartItem          →  Checkout
├── geturl()           ├── addSingle()      ├── cartItemVal()    ├── checkoutDetails()
├── login()            ├── addMultiple()     └── getCartItems()   ├── validatedetail()
├── loginWithCreds()   └── cartItem()                             └── validateAllDetails()
├── logout()
└── validateLookAndFeel()
```

---

## Scenarios Tested

### Login Tests (`login.spec.js`)

| # | Scenario | Description |
| - | -------- | ----------- |
| 1 | Valid login | Login with valid credentials and verify inventory page |
| 2 | Invalid password | Verify error message for wrong password |
| 3 | Invalid username | Verify error message for wrong username |
| 4 | Both fields blank | Verify "Username is required" error |
| 5 | Blank username | Verify "Username is required" error |
| 6 | Blank password | Verify "Password is required" error |
| 7 | Look and Feel | Validate logo, placeholders, login form, credential info section |
| 8 | All valid users login & logout | Data-driven test for all 5 valid users (standard, problem, performance_glitch, error, visual) |
| 9 | Locked out user | Verify locked_out_user gets error and stays on login page |
| 10 | All users wrong password | Data-driven test: all users with wrong password show error |
| 11 | Cart empty after fresh login | Data-driven test: verify cart badge not visible after fresh login |

### Checkout Tests (`checkout.spec.js`)

| # | Scenario | Description |
| - | -------- | ----------- |
| 1 | Single product checkout | Add one item → cart validation → checkout → order confirmation |
| 2 | Multiple product checkout | Add 3 items → cart validation → checkout → validate all products → order confirmation |

### Authentication Setup (`auth.setup.js`)

| # | Scenario | Description |
| - | -------- | ----------- |
| 1 | Authenticate | Logs in and saves browser session state to `playwright/.auth/user.json` for reuse |

---

## How to Run Tests

### Run all tests (default: dev environment)

```bash
npm run dev
```

### Run by environment

```bash
npm run dev       # Uses .env.dev
npm run test      # Uses .env.test
npm run stage     # Uses .env.stage
npm run prod      # Uses .env.prod
```

### Run specific test file

```bash
npx playwright test tests/login.spec.js
npx playwright test tests/checkout.spec.js
```

### Run tests with specific grep pattern

```bash
npx playwright test --grep "valid credentials"
npx playwright test --grep "Login"
```

### Run in headed mode (see browser)

```bash
npx playwright test --headed
```

### Run with Playwright UI Mode

```bash
npx playwright test --ui
```

### View HTML report

```bash
npx playwright show-report
```

---

## Configuration

### `playwright.config.js`

| Setting | Value | Description |
| ------- | ----- | ----------- |
| `testDir` | `./tests` | Test files directory |
| `fullyParallel` | `false` | Tests run sequentially |
| `workers` | `1` | Single worker |
| `retries` | `0` | No retries on failure |
| `timeout` | `60000` (1 min) | Max time per test |
| `headless` | `!!process.env.CI` | Headed locally, headless in CI |
| `forbidOnly` | `!!process.env.CI` | Blocks `.only()` in CI pipeline |
| `screenshot` | `only-on-failure` | Captures screenshot on failure |
| `trace` | `on-first-retry` | Captures trace on first retry |

### Reporters

| Reporter | Output | Purpose |
| -------- | ------ | ------- |
| `html` | `playwright-report/` | Visual HTML report |
| `list` | Console | Terminal output |
| `junit` | `results.xml` | CI/Jenkins/GitLab integration |

### Browser Projects

| Project | Browser | Description |
| ------- | ------- | ----------- |
| `setup` | Chrome | Runs `*.setup.js` files first (authentication) |
| `chromium` | Chrome | Runs all tests with saved auth state |

### Environment Configuration

The framework uses `dotenv` and `cross-env` for multi-environment support:

1. `.env.dev` is loaded as the **base** configuration
2. Environment-specific `.env.{env}` file overrides base values
3. `cross-env` ensures compatibility across Windows, Mac, and Linux

---

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that:

1. Installs Node.js and dependencies
2. Installs Playwright browsers
3. Runs tests in headless mode
4. Uploads test reports as artifacts

### Environment Variables in CI

Sensitive credentials should be stored as **GitHub Secrets** (Settings → Secrets → Actions):

| Secret | Description |
| ------ | ----------- |
| `LOGIN_URL` | Application URL |
| `USERNAME` | Login username |
| `PASSWORD` | Login password |

---

## Notes

- **Authentication state** is saved after the `setup` project runs and reused by all subsequent tests, avoiding repeated login.
- **`.env` files are not committed to Git** — credentials are stored locally and as GitHub Secrets in CI.
- **Data-driven tests** use `for...of` loops inside `test.describe` blocks to test all valid users automatically.
- **Test data** is centralized in `tests/testdata/login.testdata.js` for easy maintenance.
- The framework supports running against multiple environments (`dev`, `test`, `stage`, `prod`) via npm scripts.
- Screenshots are captured **only on failure** to save storage.
- JUnit XML reports (`results.xml`) are generated for CI/CD integration with Jenkins, GitLab, etc.
