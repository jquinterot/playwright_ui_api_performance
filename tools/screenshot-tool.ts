import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

interface ScreenshotOptions {
  url: string;
  outputDir?: string;
  fullPage?: boolean;
  selectors?: string[];
}

interface ScreenshotResult {
  url: string;
  filename: string;
  success: boolean;
  error?: string;
}

export class ScreenshotTool {
  private outputDir: string;

  constructor(outputDir: string = './screenshots') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async capture(options: ScreenshotOptions): Promise<ScreenshotResult> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    const page = await context.newPage();

    try {
      await page.goto(options.url, { timeout: 30000 });
      await page.waitForLoadState('networkidle');

      const timestamp = Date.now();
      const urlObj = new URL(options.url);
      const filename = `${urlObj.hostname}_${timestamp}.png`;
      const filepath = path.join(this.outputDir, filename);

      if (options.selectors && options.selectors.length > 0) {
        for (const selector of options.selectors) {
          const element = page.locator(selector).first();
          if (await element.isVisible()) {
            await element.screenshot({ path: filepath });
            console.log(`📸 Captured element: ${selector} → ${filename}`);
          }
        }
      } else {
        await page.screenshot({
          path: filepath,
          fullPage: options.fullPage ?? false,
        });
        console.log(`📸 Captured: ${options.url} → ${filename}`);
      }

      await browser.close();

      return {
        url: options.url,
        filename,
        success: true,
      };
    } catch (error) {
      await browser.close();
      return {
        url: options.url,
        filename: '',
        success: false,
        error: String(error),
      };
    }
  }

  async captureMultiple(urls: string[]): Promise<ScreenshotResult[]> {
    const results: ScreenshotResult[] = [];

    for (const url of urls) {
      const result = await this.capture({ url });
      results.push(result);
    }

    return results;
  }
}

async function main() {
  const urls = process.env.SCREENSHOT_URLS?.split(',') || [
    'https://www.demoblaze.com',
    'https://www.demoblaze.com/index.html',
  ];

  const outputDir = process.env.SCREENSHOT_OUTPUT || './screenshots';

  console.log(`📸 Taking screenshots of ${urls.length} pages`);

  const tool = new ScreenshotTool(outputDir);
  const results = await tool.captureMultiple(urls);

  console.log('\n--- Results ---');
  results.forEach((r) => {
    if (r.success) {
      console.log(`✅ ${r.url} → ${r.filename}`);
    } else {
      console.log(`❌ ${r.url}: ${r.error}`);
    }
  });
}

main();
