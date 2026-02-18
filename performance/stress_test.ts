/**
 * STRESS TEST
 *
 * Objective: Gradually increase the number of virtual users (VUs) over time
 * to find the breaking point of the system. This helps identify:
 * - Maximum load the system can handle
 * - Performance degradation under high load
 * - Resource limits (CPU, memory, network)
 *
 * The test ramps up from 100 to 500 users in stages, holding each level
 * for several minutes to observe sustained performance.
 */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 400 },
    { duration: '2m', target: 500 },
    { duration: '5m', target: 0 },
  ],
};

export default function () {
  http.get('http://test.k6.io');
  sleep(1);
}
