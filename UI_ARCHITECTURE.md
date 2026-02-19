# UI Test Automation Architecture

## Overview

This UI testing framework implements enterprise-grade patterns for end-to-end web testing using Playwright. It features a layered architecture with clear separation between page objects, business actions, test flows, and actual test specifications.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Test Layer                             │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │  Acceptance      │  │  Regression                    │  │
│  │  - Page title    │  │  - E2E workflows               │  │
│  │  - Basic checks  │  │  - Data-driven tests           │  │
│  └────────┬─────────┘  └──────────────┬─────────────────┘  │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │  Accessibility   │  │  Visual                        │  │
│  │  - Axe-core      │  │  - Screenshot comparison       │  │
│  └────────┬─────────┘  └──────────────┬─────────────────┘  │
└───────────┼──────────────────────────┼───────────────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Flow Layer                                │
│              (Reusable Test Workflows)                      │
│                                                             │
│  • CartFlows.addProductToCart()                            │
│  • CartFlows.addProductAndVerifyInCart()                   │
│  • CartFlows.completePurchase()                            │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Actions    │  │    Pages     │  │   Fixtures   │
│  (Business   │  │  (Locators)  │  │  (Setup)     │
│   Logic)     │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Configuration Layer                          │
│  • TestConfig (Singleton)                                   │
│  • playwright.config.ts                                     │
│  • Environment variables (.env)                             │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Page Layer (`pages/`)

**Purpose:** Define element locators for each page

**Pattern:** Page Object Model (POM) with BasePage inheritance

**Files:**

- `BasePage.ts` - Common locators (navbar, modals, alerts)
- `HomePage.ts` - Home page specific elements
- `ProductPage.ts` - Product detail page
- `CartPage.ts` - Shopping cart page
- `LoginPage.ts` - Login modal
- etc.

**Why This Matters:**

- Locators in one place - easy to update when UI changes
- Reusable across tests
- Type-safe element access

```typescript
// Example: Page defines WHAT elements exist
export class HomePage extends BasePage {
  getProduct(product: string): Locator {
    return this.page.getByRole('link', { name: product });
  }
}
```

### 2. Actions Layer (`actions/`)

**Purpose:** Business logic and user interactions

**Pattern:** Action classes with Page injection

**Files:**

- `HomeActions.ts` - Home page interactions
- `ProductActions.ts` - Product page operations
- `CartActions.ts` - Cart operations
- `LoginActions.ts` - Login operations
- etc.

**Why This Matters:**

- Encapsulates HOW to perform actions
- Reusable across tests
- Can add logging, waits, validations

```typescript
// Example: Actions define HOW to interact
export class HomeActions {
  async selectProduct(product: string) {
    await this.homePage.getProduct(product).click();
  }
}
```

### 3. Factory Layer (`actions/ActionsFactory.ts`)

**Purpose:** Create and manage action instances

**Pattern:** Factory Pattern

**Why This Matters:**

- Centralizes object creation
- Ensures consistent initialization
- Easy to inject dependencies

```typescript
// Usage in tests
const actionFactory = new ActionFactory(page);
const homeActions = actionFactory.createHomeActions();
```

### 4. Flow Layer (`helpers/flows/`)

**Purpose:** Multi-step business workflows

**Pattern:** Static helper methods

**File:** `CartFlows.ts`

**Why This Matters:**

- Common workflows in one place
- Reduces duplication in tests
- Readable high-level operations

```typescript
// Example: Complete workflow in one call
await CartFlows.addProductAndVerifyInCart(actionFactory, 'iPhone 6', 'Phones');
```

### 5. Fixture Layer (`helpers/fixtures/`)

**Purpose:** Test setup and teardown

**Pattern:** Playwright Test Fixtures

**File:** `ActionFactoryFixture.ts`

**Why This Matters:**

- Automatic setup before each test
- Consistent test environment
- Reduces boilerplate

```typescript
// Tests get actionFactory automatically
test('Check login', async ({ actionFactory }) => {
  // actionFactory is ready to use
});
```

### 6. Data Layer (`helpers/test-data/`)

**Purpose:** Test data management

**Pattern:** JSON files + Loader class

**Files:**

- `products.json` - Product data
- `TestDataLoader.ts` - Data access

**Why This Matters:**

- Data separate from tests
- Easy to add new test cases
- Supports data-driven testing

### 7. Configuration Layer (`helpers/config/`)

**Purpose:** Centralized settings

**Pattern:** Singleton Pattern

**File:** `TestConfig.ts`

**Why This Matters:**

- Environment-specific settings
- Single source of truth
- Easy to switch environments

## Design Patterns Implemented

| Pattern               | Location                  | Value                         |
| --------------------- | ------------------------- | ----------------------------- |
| **Page Object Model** | `pages/`                  | Separates locators from tests |
| **Factory**           | `ActionsFactory.ts`       | Consistent object creation    |
| **Singleton**         | `TestConfig.ts`           | Single config instance        |
| **Strategy**          | `RetryStrategy.ts`        | Different retry behaviors     |
| **Data-Driven**       | `test-data/`              | Parameterized tests           |
| **Fixture**           | `ActionFactoryFixture.ts` | Automatic test setup          |

## Folder Structure

```
ui/
├── actions/                    # Business logic
│   ├── ActionsFactory.ts       # Factory for actions
│   ├── HomeActions.ts
│   ├── ProductActions.ts
│   ├── CartActions.ts
│   ├── LoginActions.ts
│   ├── SignUpActions.ts
│   ├── ContactActions.ts
│   ├── AboutUsActions.ts
│   ├── PlaceOrderActions.ts
│   └── CommonActions.ts
├── pages/                      # Page Objects
│   ├── BasePage.ts            # Common elements
│   ├── HomePage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── LoginPage.ts
│   ├── SignUpPage.ts
│   ├── ContactPage.ts
│   ├── AboutUsPage.ts
│   ├── PlaceOrderPage.ts
│   └── CommonPage.ts
├── helpers/
│   ├── config/
│   │   └── TestConfig.ts      # Singleton config
│   ├── fixtures/
│   │   └── ActionFactoryFixture.ts
│   ├── flows/
│   │   └── CartFlows.ts       # Business workflows
│   ├── test-data/
│   │   ├── products.json      # Test data
│   │   └── TestDataLoader.ts
│   ├── enums/                 # Constants
│   │   ├── MenuOptions.ts
│   │   ├── Categories.ts
│   │   ├── Phones/
│   │   └── Monitors/
│   ├── types/                 # TypeScript types
│   └── strategies/
│       └── RetryStrategy.ts
├── tests/
│   ├── acceptance/            # Smoke tests
│   ├── regression/            # Full test suite
│   │   ├── order_management/
│   │   ├── login_management/
│   │   ├── home_management/
│   │   └── ...
│   ├── accessibility/
│   └── visual/
└── playwright.config.ts
```

## Test Organization

### By Feature

```
tests/
├── order_management/          # Cart, checkout flows
├── login_management/          # Login, signup, logout
├── home_management/           # Category browsing
├── contact_management/        # Contact form
└── about_us_management/       # About us modal
```

### By Type

- **Acceptance** (`@acceptance`) - Critical path tests
- **Regression** (`@regression`) - Full test suite
- **Accessibility** (`@accessibility`) - Axe-core scans
- **Visual** (`@visual`) - Screenshot comparison

## CI/CD Integration (Docker)

### GitHub Actions Workflow

```yaml
jobs:
  ui-acceptance-tests:
    runs-on: ubuntu-latest
    container: mcr.microsoft.com/playwright:v1.58.2
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run Playwright tests
        run: npm run ui:acceptance
```

### Why Docker?

- **Consistency** - Same environment locally and in CI
- **Pre-installed browsers** - No download time
- **Dependencies included** - No system setup needed
- **Version pinning** - Specific Playwright version

### Running Tests

```bash
# Local development
npm run ui:acceptance
npm run ui:regression

# With UI mode
npm run ui:mode

# Debug mode
npm run ui:debug

# Update snapshots
npm run ui:update-snapshots
```

## Best Practices Demonstrated

### 1. No Raw Playwright in Tests

```typescript
// ❌ Bad - Raw Playwright in test
await page.getByRole('link', { name: 'iPhone' }).click();

// ✅ Good - Use Actions
await homeActions.selectProduct('iPhone 6');
```

### 2. Given/When/Then Structure

```typescript
await test.step('When user adds product to cart', async () => {
  await CartFlows.addProductToCart(actionFactory, product, price);
});

await test.step('Then product should be in cart', async () => {
  await cartActions.checkProductIsDisplayed(product);
});
```

### 3. Path Aliases for Clean Imports

```typescript
// Using @ aliases instead of relative paths
import { ActionFactory } from '@actions/ActionsFactory';
import { TestDataLoader } from '@helpers/test-data/TestDataLoader';
```

### 4. Data-Driven Tests

```typescript
const phones = TestDataLoader.getPhones();
for (const phone of phones) {
  test(`Add ${phone.name} to cart`, async () => {
    // Test each phone
  });
}
```

### 5. Tags for Test Selection

```typescript
test.describe('@regression @Order @Phones Check Phones category', () => {
  // Runs with: npx playwright test --grep @regression
});
```

## Test Results Example

```
Running 15 tests using 4 workers
✅ 15 passed (12.6s)

Test Categories:
├── Acceptance: 2 tests
├── Regression: 13 tests
│   ├── Order Management: 8 tests
│   ├── Login Management: 3 tests
│   └── Home Management: 2 tests
```

## Key Features

| Feature                   | Implementation                   |
| ------------------------- | -------------------------------- |
| **Parallel Execution**    | 4 workers by default             |
| **Screenshot on Failure** | `screenshot: 'only-on-failure'`  |
| **Video Recording**       | `video: 'retain-on-failure'`     |
| **Trace Viewer**          | `trace: 'on-first-retry'`        |
| **Retry Logic**           | 2 retries in CI                  |
| **Path Aliases**          | `@actions`, `@helpers`, `@pages` |

## Future Enhancements

1. **Visual Regression** - Expand screenshot testing
2. **Cross-browser** - Firefox, WebKit support
3. **Mobile Emulation** - Responsive testing
4. **API Integration** - Combined UI + API tests
5. **Performance Metrics** - Core Web Vitals

## Summary

This architecture provides:

- ✅ **Maintainability** - Clear separation, single responsibility
- ✅ **Scalability** - Easy to add new pages and tests
- ✅ **Reusability** - Actions and flows shared across tests
- ✅ **Reliability** - Fixtures, retries, stable selectors
- ✅ **Readability** - Given/When/Then structure
- ✅ **CI/CD Ready** - Docker, parallel execution, artifacts
