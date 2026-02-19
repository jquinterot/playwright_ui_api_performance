# API Test Automation Architecture

## Overview

This API testing framework follows enterprise-grade patterns for maintainability, scalability, and reliability. It demonstrates separation of concerns, dynamic test data generation, and business workflow encapsulation.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Test Layer                             │
│  ┌─────────────────┐  ┌─────────────────────────────────┐  │
│  │  Acceptance     │  │  Integration                    │  │
│  │  - Basic CRUD   │  │  - Business Workflows           │  │
│  │  - Error cases  │  │  - Multi-step operations        │  │
│  └────────┬────────┘  └──────────────┬──────────────────┘  │
└───────────┼──────────────────────────┼───────────────────────┘
            │                          │
            ▼                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Service Layer                             │
│         (Business Logic, Workflows, Setup)                  │
│                                                             │
│  • PostService.createPostWithComments()                    │
│  • PostService.createUpdateAndVerifyPost()                 │
│  • PostService.cleanupPost()                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Controllers │  │    Data      │  │  Validators  │
│  (HTTP)      │  │   Factory    │  │ (Assertions) │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Layer Responsibilities

### 1. Controllers Layer (`controllers/`)

**Purpose:** Handle low-level HTTP operations

**Files:**

- `JsonPlaceholderController.ts` - JSONPlaceholder API methods
- `CatFactController.ts` - Cat Facts API methods

**Pattern:** Single Responsibility - One controller per API

```typescript
// Example: Controller handles one API call
async createPost(post: Post): Promise<APIResponse> {
  return await this.request.post(`${this.baseUrl}/posts`, {
    data: post,
    headers: apiConfig.headers
  });
}
```

### 2. Service Layer (`helpers/services/`)

**Purpose:** Encapsulate business workflows that span multiple API calls

**File:** `PostService.ts`

**Pattern:** Facade Pattern - High-level operations hide complexity

**Why This Matters:**

- Controllers handle single calls, but real tests need workflows
- Creates reusable business operations
- Single place to update when logic changes

```typescript
// Example: Service orchestrates multiple calls
async createPostWithComments(commentCount: number) {
  // 1. Create post
  // 2. Add comments
  // 3. Validate
  // Returns complete result
}
```

### 3. Data Factory (`helpers/factories/`)

**Purpose:** Generate dynamic test data

**File:** `DataFactory.ts`

**Pattern:** Factory Pattern - Dynamic object creation

**Why This Matters:**

- No hardcoded data conflicts in parallel runs
- Unique data for each test (timestamp + counter)
- Easy to create variations

```typescript
// Example: Dynamic data generation
const post = DataFactory.createPost({
  userId: 42,
  title: 'Custom Title', // Override defaults
});
// Result: { userId: 42, title: 'Custom Title', body: 'Test Post... 12345' }
```

### 4. Validators Layer (`helpers/validators/`)

**Purpose:** Reusable response validation

**File:** `ResponseValidator.ts`

**Pattern:** Helper Pattern - Common assertions

```typescript
// Example: Reusable validation
await ResponseValidator.validateStatus(response, 201);
await ResponseValidator.validateBodyContainsKey(response, 'id');
```

### 5. Configuration (`helpers/config/`)

**Purpose:** Centralized settings

**File:** `ApiConfig.ts`

**Pattern:** Singleton Pattern - Single source of truth

```typescript
// Usage anywhere in codebase
import { apiConfig } from '../config/ApiConfig';
const baseUrl = apiConfig.baseUrl;
```

## Design Patterns Implemented

| Pattern               | Location               | Value                            |
| --------------------- | ---------------------- | -------------------------------- |
| **Singleton**         | `ApiConfig.ts`         | One config instance across tests |
| **Factory**           | `DataFactory.ts`       | Dynamic test data generation     |
| **Service Layer**     | `PostService.ts`       | Business workflow encapsulation  |
| **Controller**        | `*Controller.ts`       | HTTP operation abstraction       |
| **Validation Helper** | `ResponseValidator.ts` | Reusable assertions              |

## Folder Structure

```
api/
├── controllers/              # HTTP Controllers
│   ├── CatFactController.ts
│   └── JsonPlaceholderController.ts
├── helpers/
│   ├── config/
│   │   └── ApiConfig.ts      # Singleton configuration
│   ├── factories/
│   │   └── DataFactory.ts    # Dynamic test data
│   ├── services/
│   │   └── PostService.ts    # Business workflows
│   ├── types/                # TypeScript interfaces
│   ├── validators/
│   │   └── ResponseValidator.ts
│   └── objects/              # Static test data
├── tests/
│   ├── acceptance/           # Basic API tests
│   │   ├── acceptance_test.spec.ts
│   │   ├── posts_api.spec.ts
│   │   └── error_handling.spec.ts
│   └── integration/          # Business workflows
│       └── posts_integration.spec.ts
└── playwright.config.ts
```

## Test Categories

### Acceptance Tests (`tests/acceptance/`)

- **Purpose:** Verify individual API endpoints work
- **Scope:** Single HTTP operations
- **Examples:** GET /posts, POST /posts, error cases

### Integration Tests (`tests/integration/`)

- **Purpose:** Verify business workflows
- **Scope:** Multiple coordinated API calls
- **Examples:** Create post with comments, bulk operations

## Running Tests

```bash
# Run all API tests
npm run api:acceptance

# Run with 4 parallel workers
cd api && npx playwright test --workers=4

# Run only acceptance tests
cd api && npx playwright test --grep @acceptance

# Run only integration tests
cd api && npx playwright test tests/integration

# Run with tags
cd api && npx playwright test --grep @negative
```

## Parallel Execution

All tests are parallel-safe because:

1. **Dynamic Data:** `DataFactory` generates unique data per test
2. **No Shared State:** Each test is independent
3. **Isolated Resources:** Tests don't interfere with each other

**Test Results:**

```
Running 16 tests using 4 workers
✅ 16 passed (4.1s)
```

## Best Practices Demonstrated

### 1. No Hardcoded Data

```typescript
// ❌ Bad
const post = { title: 'Test', body: 'Body' };

// ✅ Good
const post = DataFactory.createPost();
```

### 2. Business Logic in Services

```typescript
// ❌ Bad - Logic in test
const response1 = await api.createPost(data);
const response2 = await api.updatePost(id, data);
const response3 = await api.getPost(id);

// ✅ Good - Logic in service
const result = await postService.createUpdateAndVerifyPost();
```

### 3. Step-by-Step Test Structure

```typescript
// ✅ Good - Given/When/Then in steps
await test.step('When user creates post', async () => {
  result = await postService.createPostWithComments(5);
});

await test.step('Then post should be created', async () => {
  expect(result.post.id).toBeDefined();
});
```

### 4. Reusable Validations

```typescript
// ❌ Bad - Inline validation
expect(response.status()).toBe(201);

// ✅ Good - Centralized validation
await ResponseValidator.validateStatus(response, 201);
```

## API Coverage

| Endpoint             | Method | Test File                 | Status |
| -------------------- | ------ | ------------------------- | ------ |
| `/posts`             | GET    | posts_api.spec.ts         | ✅     |
| `/posts/{id}`        | GET    | posts_api.spec.ts         | ✅     |
| `/posts`             | POST   | posts_api.spec.ts         | ✅     |
| `/posts/{id}`        | PUT    | posts_api.spec.ts         | ✅     |
| `/posts/{id}`        | DELETE | posts_api.spec.ts         | ✅     |
| `/posts?userId={id}` | GET    | posts_api.spec.ts         | ✅     |
| Error Handling       | -      | error_handling.spec.ts    | ✅     |
| Workflows            | -      | posts_integration.spec.ts | ✅     |

## Future Enhancements

1. **Request Interceptor** - Logging and authentication
2. **Contract Testing** - Validate API schema compliance
3. **Performance Tests** - Response time benchmarks
4. **Mock Server** - Isolate tests from external APIs

## Summary

This architecture provides:

- ✅ **Maintainability** - Clear separation of concerns
- ✅ **Scalability** - Parallel execution with dynamic data
- ✅ **Reusability** - Service layer and factories
- ✅ **Readability** - Given/When/Then test structure
- ✅ **Reliability** - No hardcoded data conflicts
