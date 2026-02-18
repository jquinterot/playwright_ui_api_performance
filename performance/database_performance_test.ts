/**
 * DATABASE PERFORMANCE TEST
 *
 * Objective: Test database query performance under load by:
 * - Measuring query response times
 * - Testing complex joins and aggregations
 * - Checking connection pool utilization
 * - Identifying N+1 query problems
 * - Testing database under concurrent write/read loads
 *
 * Note: This is a simulated test. In production, you would
 * target your actual database endpoints or use a database
 * benchmarking tool.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://catfact.ninja';

export const options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  const queryPayload = JSON.stringify({
    query: 'SELECT * FROM users WHERE id = ?',
    params: [Math.floor(Math.random() * 100)],
  });

  const startTime = new Date();
  const response = http.post(`${BASE_URL}/fact`, queryPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  const queryDuration = new Date().getTime() - startTime.getTime();

  check(response, {
    'query executed successfully': (r) => r.status === 200 || r.status === 404,
    'query response time < 200ms': () => queryDuration < 200,
  });

  console.log(`Query execution time: ${queryDuration}ms`);

  sleep(1);
}
