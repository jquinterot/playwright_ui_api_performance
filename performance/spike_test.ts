/**
 * SPIKE TEST
 *
 * Objective: Test the system's response to sudden, dramatic increases
 * in traffic (spikes). This helps identify:
 * - How quickly the system can scale
 * - Performance under sudden load spikes
 * - Recovery time after spike subsides
 * - Any cascading failures or timeouts
 *
 * Unlike stress test, spike testing focuses on rapid changes rather
 * than gradual increases.
 */

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '10s', target: 500 },
    { duration: '3m', target: 500 },
    { duration: '10s', target: 100 },
    { duration: '3m', target: 100 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  http.get('http://test.k6.io');
  sleep(1);
}
