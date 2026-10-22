/**
 * BROWSER PERFORMANCE TEST (Playwright)
 *
 * Objective: Measure real browser performance metrics including:
 * - Page load time (onload, DOMContentLoaded)
 * - First Paint & First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP) - Core Web Vital
 * - First Input Delay (FID) - Core Web Vital
 * - Cumulative Layout Shift (CLS) - Core Web Vital
 * - Network request timing
 *
 * These tests run in a real browser to capture actual user-perceived
 * performance rather than just server-side metrics.
 */

import { test, expect } from '@playwright/test';

test.describe('Browser Performance Tests', () => {
  test('should measure page load performance metrics', async ({ page }) => {
    const metrics: { name: string; value: number }[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        console.log(`Console: ${msg.text()}`);
      }
    });

    await page.goto('http://test.k6.io', { waitUntil: 'networkidle' });

    const performanceTiming = await page.evaluate(() => {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;
      return {
        loadEventEnd: timing.loadEventEnd - navigationStart,
        domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
        firstPaint:
          (performance as any).getEntriesByType('paint')[0]?.startTime || 0,
      };
    });

    console.log('Page Load Time:', performanceTiming.loadEventEnd, 'ms');
    console.log(
      'DOM Content Loaded:',
      performanceTiming.domContentLoaded,
      'ms',
    );
    console.log('First Paint:', performanceTiming.firstPaint, 'ms');

    expect(performanceTiming.loadEventEnd).toBeLessThan(5000);
  });

  test('should measure Core Web Vitals', async ({ page }) => {
    await page.goto('http://test.k6.io', { waitUntil: 'networkidle' });

    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: Record<string, number> = {};

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              vitals.fid = (entry as any).processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift') {
              vitals.cls = (vitals.cls || 0) + (entry as any).value;
            }
          }
        });

        observer.observe({
          entryTypes: [
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
          ],
        });

        setTimeout(() => observer.disconnect(), 3000);
        setTimeout(() => resolve(vitals), 3500);
      });
    });

    console.log('Core Web Vitals:', webVitals);
  });

  test('should measure network request timing', async ({ page }) => {
    const requestTimings: { url: string; duration: number }[] = [];

    await page.route('**/*', async (route) => {
      const start = Date.now();
      await route.continue();
      const duration = Date.now() - start;
      requestTimings.push({ url: route.request().url(), duration });
    });

    await page.goto('http://test.k6.io', { waitUntil: 'networkidle' });

    console.log('Network Requests:', requestTimings);
  });
});
