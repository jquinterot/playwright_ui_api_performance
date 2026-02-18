/**
 * THRESHOLD-BASED TEST
 *
 * Objective: Define performance thresholds that, if exceeded,
 * will cause the test to fail. This ensures:
 * - Response times meet SLA requirements
 * - Error rates stay within acceptable limits
 * - Minimum throughput is maintained
 * - Automated quality gates in CI/CD pipelines
 *
 * Thresholds defined:
 * - http_req_duration: p(95) < 500ms
 * - http_req_failed: error rate < 1%
 * - http_reqs: at least 50 requests throughout test
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://catfact.ninja';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['count>50'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/fact`);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'response has fact': (r) => r.json('fact') !== undefined,
  });

  sleep(1);
}
