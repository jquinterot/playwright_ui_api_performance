/**
 * USER JOURNEY TEST (Concurrent User Scenarios)
 *
 * Objective: Simulate realistic user flows through the application
 * to test:
 * - End-to-end user experience under load
 * - Performance of multi-step processes
 * - Session handling and state management
 * - Database queries triggered by user actions
 *
 * This test simulates a user visiting multiple pages in sequence,
 * mimicking real-world usage patterns.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://test.k6.io';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const sessionId = `session_${__VU}_${__ITER}`;

  const homeResponse = http.get(`${BASE_URL}/`);
  check(homeResponse, {
    'home page loaded': (r) => r.status === 200,
  });
  sleep(1);

  const aboutResponse = http.get(`${BASE_URL}/about.php`);
  check(aboutResponse, {
    'about page loaded': (r) => r.status === 200,
  });
  sleep(1);

  const contactResponse = http.get(`${BASE_URL}/contact.php`);
  check(contactResponse, {
    'contact page loaded': (r) => r.status === 200,
  });
  sleep(1);

  console.log(`User journey completed for ${sessionId}`);
}
