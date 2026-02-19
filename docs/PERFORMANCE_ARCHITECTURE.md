# Performance Test Architecture

## Overview

This performance testing framework uses K6 (Grafana k6) for load, stress, spike, and soak testing. It implements multiple performance test types to validate system behavior under various load conditions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Performance Test Types                     │
│                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  Load Test   │ │  Stress Test │ │  Spike Test  │       │
│  │  (Baseline)  │ │  (Breaking   │ │  (Sudden     │       │
│  │              │ │   Point)     │ │   Traffic)   │       │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  Soak Test   │ │  Endpoint    │ │  File        │       │
│  │  (Endurance) │ │  Response    │ │  Transfer    │       │
│  │              │ │  Time        │ │              │       │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘       │
│         └────────────────┼────────────────┘                │
│                          │                                 │
│  ┌───────────────────────┴───────────────────────┐        │
│  │           Threshold Test                      │        │
│  │   (SLA validation with automatic failure)    │        │
│  └───────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Test Execution Layer                        │
│                                                             │
│  • Virtual Users (VUs) simulation                          │
│  • Ramp-up / Steady-state / Ramp-down phases               │
│  • Request metrics collection                              │
│  • Threshold validation                                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Metrics & Reporting                         │
│                                                             │
│  • Response Time (p50, p95, p99)                           │
│  • Request Rate (RPS)                                      │
│  • Error Rate                                              │
│  • Data Transfer                                           │
└─────────────────────────────────────────────────────────────┘
```

## Performance Test Types

### 1. Load Test (`load_test.ts`)

**Purpose:** Establish baseline performance under expected load

**Scenario:**

- 10 virtual users
- 30 seconds duration
- Steady traffic pattern

**Use Case:**

- Verify system handles normal traffic
- Baseline for comparison

```typescript
export const options = {
  vus: 10,
  duration: '30s',
};
```

### 2. Stress Test (`stress_test.ts`)

**Purpose:** Find system breaking point

**Scenario:**

- Gradual ramp-up from 100 to 500 users
- Multiple stages with hold periods
- Total duration: ~21 minutes

**Use Case:**

- Find maximum capacity
- Identify degradation patterns
- Determine scaling needs

```typescript
stages: [
  { duration: '2m', target: 100 }, // Ramp up
  { duration: '5m', target: 100 }, // Hold
  { duration: '2m', target: 200 }, // Ramp up
  { duration: '5m', target: 200 }, // Hold
  { duration: '2m', target: 300 }, // Continue...
  { duration: '5m', target: 400 },
  { duration: '2m', target: 500 },
  { duration: '5m', target: 0 }, // Ramp down
];
```

### 3. Spike Test (`spike_test.ts`)

**Purpose:** Test response to sudden traffic spikes

**Scenario:**

- Sudden jump from 100 to 500 users
- Quick return to baseline
- Tests auto-scaling and recovery

**Use Case:**

- Viral traffic events
- Marketing campaigns
- Flash sales

```typescript
stages: [
  { duration: '10s', target: 100 }, // Normal
  { duration: '1m', target: 100 }, // Hold
  { duration: '10s', target: 500 }, // SPIKE!
  { duration: '3m', target: 500 }, // Hold spike
  { duration: '10s', target: 100 }, // Back to normal
  { duration: '3m', target: 100 }, // Recovery
];
```

### 4. Soak Test (`soak_test.ts`)

**Purpose:** Detect memory leaks and degradation over time

**Scenario:**

- 50 users sustained for 60 minutes
- Constant moderate load

**Use Case:**

- Memory leak detection
- Resource exhaustion
- Database connection pool issues

```typescript
export const options = {
  vus: 50,
  duration: '60m', // 1 hour
};
```

### 5. API Load Test (`api_load_test.ts`)

**Purpose:** Test specific API endpoints

**Scenario:**

- 10 VUs hitting Cat Facts API
- Simple GET requests

**Use Case:**

- API performance baseline
- Third-party API validation

### 6. Endpoint Response Time Test (`endpoint_response_time_test.ts`)

**Purpose:** Compare latency across different endpoints

**Features:**

- Random endpoint selection
- Response time validation
- Error rate tracking

```typescript
const endpoints = ['/fact', '/facts', '/facts?max_length=100'];
const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
```

### 7. User Journey Test (`user_journey_test.ts`)

**Purpose:** Simulate realistic user flows

**Scenario:**

- Multi-step session
- Home → About → Contact
- Tests session handling

### 8. Database Performance Test (`database_performance_test.ts`)

**Purpose:** Test query performance under load

**Note:** Simulated for demo - would test actual DB queries

### 9. File Transfer Test (`file_transfer_test.ts`)

**Purpose:** Test upload/download performance

**Features:**

- File upload simulation
- File download validation
- Transfer speed measurement

### 10. Threshold Test (`threshold_test.ts`)

**Purpose:** Enforce SLA requirements

**Features:**

- Automatic test failure on threshold breach
- p95 response time validation
- Error rate limits

```typescript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // Fail if p95 > 500ms
    http_req_failed: ['rate<0.01'], // Fail if errors > 1%
    http_reqs: ['count>50'], // Fail if < 50 requests
  },
};
```

## CI/CD Integration (Docker)

### GitHub Actions Workflow

```yaml
jobs:
  k6_quick_tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        test:
          - performance/api_load_test.ts
          - performance/endpoint_response_time_test.ts
          - performance/threshold_test.ts
          - performance/user_journey_test.ts
          - performance/database_performance_test.ts
          - performance/file_transfer_test.ts
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run k6 test
        uses: k6io/action@v0.1
        with:
          filename: ${{ matrix.test }}
```

### Test Organization in CI

| Job                | Tests        | Trigger       | Duration |
| ------------------ | ------------ | ------------- | -------- |
| **k6_quick_tests** | 6 fast tests | Every PR/push | ~3 min   |
| **k6_spike_test**  | Spike test   | Every PR/push | ~8 min   |
| **k6_stress_test** | Stress test  | Schedule only | ~20 min  |
| **k6_soak_test**   | Soak test    | Schedule only | ~60 min  |

### Scheduled Runs

```yaml
schedule:
  - cron: '0 2 * * *' # Daily at 2 AM UTC
```

Long-running tests (stress, soak) only run on schedule, not on every PR.

## Running Tests

### Local Development

```bash
# Quick tests
npm run performance:test       # Load test
npm run performance:api        # API load test
npm run performance:endpoint   # Endpoint timing
npm run performance:threshold  # SLA validation

# Moderate tests
npm run performance:spike      # Spike test (~8 min)

# Long tests (schedule only)
npm run performance:stress     # Stress test (~20 min)
npm run performance:soak       # Soak test (~60 min)

# Specialized tests
npm run performance:journey    # User flows
npm run performance:database   # DB performance
npm run performance:file       # File transfers
```

### With Docker

```bash
# Run with official k6 Docker image
docker run -i grafana/k6 run - <performance/load_test.ts
```

## Key Metrics

### Response Time Percentiles

- **p(50)** - Median response time
- **p(95)** - 95th percentile (most users experience)
- **p(99)** - 99th percentile (worst case)

### Request Metrics

- **http_reqs** - Total requests
- **http_req_failed** - Failed requests
- **http_req_duration** - Response time
- **http_req_blocked** - Time blocked
- **http_req_connecting** - Connection time
- **http_req_tls_handshaking** - TLS handshake time

### Custom Metrics

- **iteration_duration** - Full scenario duration
- **data_received** - Bytes received
- **data_sent** - Bytes sent

## Best Practices

### 1. Gradual Ramp-Up

```typescript
// ❌ Bad - Sudden 1000 users
export const options = { vus: 1000 };

// ✅ Good - Gradual ramp
stages: [
  { duration: '1m', target: 100 },
  { duration: '2m', target: 500 },
  { duration: '1m', target: 1000 },
];
```

### 2. Threshold Validation

```typescript
// Always define success criteria
thresholds: {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.01'],
}
```

### 3. Realistic Scenarios

```typescript
// Add think time between requests
sleep(1); // 1 second pause (realistic user behavior)
```

### 4. Randomization

```typescript
// Random endpoints to avoid cache bias
const endpoints = ['/api/a', '/api/b', '/api/c'];
const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
```

## Test Results Example

```bash
$ k6 run performance/threshold_test.ts

     █ THRESHOLD TEST

   ✓ http_req_duration..............: p(95)<500  ✓ [PASS]
   ✓ http_req_failed................: rate<0.01 ✓ [PASS]
   ✓ http_reqs......................: count>50  ✓ [PASS]

     data_received..................: 45 kB  1.5 kB/s
     data_sent......................: 12 kB  0.4 kB/s
     http_req_blocked...............: avg=2.3ms  min=1µs    med=2µs    max=50ms
     http_req_connecting............: avg=1.8ms  min=0s     med=0s     max=40ms
     http_req_duration..............: avg=150ms  min=80ms   med=145ms  max=320ms
       { expected_response:true }...: avg=150ms  min=80ms   med=145ms  max=320ms
     http_req_failed................: 0.00%  ✓ 0 / 120
     http_req_receiving.............: avg=0.5ms  min=20µs   med=0.4ms  max=5ms
     http_req_sending...............: avg=0.1ms  min=30µs   med=0.1ms  max=2ms
     http_req_tls_handshaking.......: avg=0s     min=0s     med=0s     max=0s
     http_req_waiting...............: avg=149ms  min=80ms   med=144ms  max=318ms
     http_reqs......................: 120    4.0/s
     iteration_duration.............: avg=1.15s  min=1.08s  med=1.14s  max=1.32s
     iterations.....................: 120    4.0/s
     vus............................: 10     min=10     max=10
     vus_max........................: 10     min=10     max=10
```

## Folder Structure

```
performance/
├── load_test.ts                 # Baseline load test
├── stress_test.ts               # Find breaking point
├── spike_test.ts                # Sudden traffic spikes
├── soak_test.ts                 # Long-running endurance
├── api_load_test.ts             # API endpoint testing
├── endpoint_response_time_test.ts  # Latency comparison
├── user_journey_test.ts         # Multi-step flows
├── database_performance_test.ts  # Query performance
├── file_transfer_test.ts        # Upload/download
├── threshold_test.ts            # SLA validation
└── browser_performance_test.ts  # Playwright browser metrics
```

## Future Enhancements

1. **Distributed Load** - Multiple load generators
2. **Chaos Testing** - Random failures and latency
3. **Custom Metrics** - Business-specific KPIs
4. **Grafana Dashboard** - Real-time visualization
5. **Trend Analysis** - Historical performance tracking

## Summary

This architecture provides:

- ✅ **10 Test Types** - Covering all performance scenarios
- ✅ **Automated SLAs** - Threshold-based pass/fail
- ✅ **CI/CD Integration** - Docker-based, parallel execution
- ✅ **Smart Scheduling** - Quick tests on PR, long tests scheduled
- ✅ **Clear Metrics** - Response times, error rates, throughput
- ✅ **Best Practices** - Gradual ramp-up, realistic scenarios
