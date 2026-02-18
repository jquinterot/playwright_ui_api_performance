/**
 * ENDPOINT RESPONSE TIME TEST
 *
 * Objective: Measure latency across different API endpoints to:
 * - Identify slow endpoints that need optimization
 * - Compare performance across different endpoints
 * - Track response time distribution (p50, p95, p99)
 * - Set performance baselines for each endpoint
 *
 * This test randomly selects different endpoints to get a
 * representative sample of API performance.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://catfact.ninja';

export const options = {
  vus: 5,
  duration: '20s',
};

export default function () {
  const endpoints = ['/fact', '/facts', '/facts?max_length=100'];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

  const startTime = new Date();
  const response = http.get(`${BASE_URL}${endpoint}`);
  const duration = new Date().getTime() - startTime.getTime();

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': () => duration < 500,
    'response has data': (r) =>
      r.json('fact') !== undefined || r.json('data') !== undefined,
  });

  console.log(`Endpoint: ${endpoint}, Duration: ${duration}ms`);

  sleep(1);
}
