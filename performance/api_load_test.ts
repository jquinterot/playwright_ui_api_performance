/**
 * API LOAD TEST
 *
 * Objective: Test API endpoints under load to measure:
 * - Response time under concurrent requests
 * - Throughput (requests per second)
 * - Error rates under load
 * - API resource consumption
 *
 * This test targets specific API endpoints to ensure they can handle
 * expected production traffic levels.
 */

import http from 'k6/http';
import { sleep } from 'k6';

const BASE_URL = 'https://catfact.ninja';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  http.get(`${BASE_URL}/fact`);
  sleep(1);
}
