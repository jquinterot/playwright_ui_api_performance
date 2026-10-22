# Automation Testing Framework

A comprehensive testing framework covering UI, API, and Performance testing using modern tools and best practices.

## 🛠️ Tech Stack

| Category        | Tool                    | Purpose                        |
| --------------- | ----------------------- | ------------------------------ |
| **UI Testing**  | Playwright              | E2E browser automation         |
| **API Testing** | Playwright + TypeScript | REST API validation            |
| **Performance** | K6                      | Load, stress, and soak testing |
| **Language**    | TypeScript              | Type-safe test development     |
| **CI/CD**       | GitHub Actions          | Automated test execution       |

## 📁 Project Structure

```
├── ui/                    # UI Tests (Playwright)
│   ├── actions/          # Business logic layer
│   ├── flows/            # Orchestration layer (journeys composed of actions)
│   ├── pages/            # Page Object Model
│   ├── tests/            # Test specs
│   │   ├── auth/         # Login-once setup project (storageState)
│   │   ├── features_examples/  # Sample rules for new Playwright APIs
│   │   └── performance/  # Browser performance (Playwright)
│   └── helpers/          # Utilities, fixtures, config
├── api/                   # API Tests (Playwright)
│   ├── controllers/      # API controllers
│   ├── tests/            # Test specs
│   └── helpers/          # Data factories, validators
├── performance/           # Performance Tests (K6)
│   ├── load_test.ts
│   ├── stress_test.ts
│   └── ...
├── .github/workflows/     # CI/CD pipelines
└── docs/                  # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
npm install
npx playwright install
```

> Playwright version is pinned to **1.64** (see `package.json`). The CI runner
> image must match: `mcr.microsoft.com/playwright:v1.64.0`.

### Run Tests

```bash
# UI Tests
npm run ui:acceptance
npm run ui:regression

# API Tests
npm run api:acceptance

# Performance Tests
npm run performance:test
npm run performance:stress
```

### Learning specs — new Playwright APIs (1.61 → 1.64)

```bash
npm run ui:learning    # anonymous examples in ui/tests/features_examples/
# authenticated examples (storageState setup project runs first):
cd ui && npx @playwright/test test tests/features_examples/authenticated --project=chromium-authenticated
```

See [ui/tests/features_examples/README.md](ui/tests/features_examples/README.md)
for the topic-to-file index (locks, `within()`, `visible()`, WebStorage,
step metadata, AbortSignal, WebP, data-driven rows).

## 📊 Test Coverage

| Type        | Count  | Tools      |
| ----------- | ------ | ---------- |
| UI Tests    | 15     | Playwright |
| API Tests   | 16     | Playwright |
| Performance | 10     | K6         |
| **Total**   | **41** | -          |

## 🏗️ Architecture Patterns

- **Page Object Model (POM)** - UI layer separation
- **Factory Pattern** - Test data and object creation
- **Service Layer** - Business workflow encapsulation
- **Singleton** - Configuration management
- **Data-Driven** - Parameterized tests
- **Fixture Chain** - `SafeTestFixture` (network guard rails) → `ActionFactoryFixture` (actions + flows)
- **Instance Flows** - Orchestration classes wired as fixtures (`ShoppingFlow`)
- **storageState setup project** - login once in `auth.setup.ts`, reuse the session everywhere

## 🔄 CI/CD

All tests run automatically on:

- Every push/PR to `main`
- Scheduled daily runs (performance)
- Path-specific triggers (only affected tests)

**Docker Support**: Uses official Playwright and K6 Docker images for consistent environments.

## 📖 Documentation

Detailed architecture and implementation guides:

- [UI Architecture](docs/UI_ARCHITECTURE.md)
- [API Architecture](docs/API_ARCHITECTURE.md)
- [Performance Architecture](docs/PERFORMANCE_ARCHITECTURE.md)

## 🎯 Key Features

- ✅ **Parallel Execution** - Fast test runs with 4+ workers (+ isolated retries)
- ✅ **Path Aliases** - Clean imports (`@actions`, `@helpers`)
- ✅ **Dynamic Test Data** - Factory pattern for unique data
- ✅ **Docker Ready** - Consistent CI/CD environments
- ✅ **Comprehensive Reporting** - HTML (merged files), JUnit, artifacts
- ✅ **Test Locks** - shared-resource safety for parallel runs (Playwright 1.63+)

---

Built with ❤️ using Playwright, TypeScript, and K6.
