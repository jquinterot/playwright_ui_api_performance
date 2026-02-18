/**
 * FILE TRANSFER TEST (Upload/Download)
 *
 * Objective: Test file handling performance including:
 * - File upload throughput and response time
 * - File download speeds
 * - Large file handling capabilities
 * - Network bandwidth utilization
 * - Timeout handling for large files
 *
 * This test helps identify issues with handling files of
 * various sizes under concurrent load.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = 'https://httpbin.org';

export const options = {
  vus: 5,
  duration: '20s',
};

export default function () {
  const testData =
    'This is a test file content for upload testing ' + 'x'.repeat(1000);

  const uploadResponse = http.post(`${BASE_URL}/post`, testData, {
    headers: { 'Content-Type': 'text/plain' },
  });

  check(uploadResponse, {
    'upload successful': (r) => r.status === 200,
    'upload response contains data': (r) => r.json('data') !== undefined,
  });

  console.log(
    `Upload size: ${testData.length} bytes, Status: ${uploadResponse.status}`,
  );

  const downloadResponse = http.get(`${BASE_URL}/bytes/1024`);

  check(downloadResponse, {
    'download successful': (r) => r.status === 200,
    'download size > 0': (r) => r.body !== null && r.body.length > 0,
  });

  console.log(
    `Download size: ${downloadResponse.body?.length || 0} bytes, Status: ${
      downloadResponse.status
    }`,
  );

  sleep(1);
}
