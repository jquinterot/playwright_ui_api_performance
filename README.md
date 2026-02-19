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
│   ├── pages/            # Page Object Model
│   ├── tests/            # Test specs
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

- ✅ **Parallel Execution** - Fast test runs with 4+ workers
- ✅ **Path Aliases** - Clean imports (`@actions`, `@helpers`)
- ✅ **Dynamic Test Data** - Factory pattern for unique data
- ✅ **Docker Ready** - Consistent CI/CD environments
- ✅ **Comprehensive Reporting** - HTML, JUnit, artifacts

---

Built with ❤️ using Playwright, TypeScript, and K6.
