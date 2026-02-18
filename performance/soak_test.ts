/**
 * SOAK TEST
 *
 * Objective: Run the system under sustained load for an extended period
 * (typically 1+ hours) to detect:
 * - Memory leaks that occur over time
 * - Database connection pool exhaustion
 * - Resource degradation (memory, CPU) over time
 * - Log file growth or disk space issues
 * - Database query performance degradation
 *
 * This test helps ensure the system can run reliably for long periods
 * without degradation or crashes.
 */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '60m',
};

export default function () {
  http.get('http://test.k6.io');
  sleep(1);
}
