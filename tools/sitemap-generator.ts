import { chromium, Page } from '@playwright/test';

interface SitemapOptions {
  baseUrl: string;
  maxPages?: number;
  excludePatterns?: string[];
  outputPath?: string;
}

interface DiscoveredPage {
  url: string;
  title?: string;
  status?: number;
}

export class SitemapGenerator {
  private visited = new Set<string>();
  private queue: string[] = [];
  private discovered: DiscoveredPage[] = [];
  private options: Required<SitemapOptions>;

  constructor(options: SitemapOptions) {
    this.options = {
      maxPages: options.maxPages ?? 100,
      excludePatterns: options.excludePatterns ?? [],
      outputPath: options.outputPath ?? './sitemap.xml',
      baseUrl: options.baseUrl,
    };
  }

  async generate(): Promise<string> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    this.queue.push(this.options.baseUrl);

    while (
      this.queue.length > 0 &&
      this.discovered.length < this.options.maxPages
    ) {
      const url = this.queue.shift()!;

      if (this.isVisited(url)) continue;

      const pageInfo = await this.crawlPage(page, url);
      if (pageInfo) {
        this.discovered.push(pageInfo);
        console.log(`✓ Discovered: ${url}`);
      }
    }

    await browser.close();

    return this.generateSitemapXml();
  }

  private async crawlPage(
    page: Page,
    url: string,
  ): Promise<DiscoveredPage | null> {
    try {
      this.visited.add(url);

      const response = await page.goto(url, { timeout: 10000 });
      const status = response?.status() ?? 0;

      if (status >= 400) {
        console.log(`✗ Skipping ${url} (status: ${status})`);
        return null;
      }

      const title = await page.title();
      const links = await this.extractLinks(page);

      for (const link of links) {
        if (this.shouldInclude(link)) {
          this.queue.push(link);
        }
      }

      return { url, title, status };
    } catch (error) {
      console.log(`✗ Error crawling ${url}: ${error}`);
      return null;
    }
  }

  private async extractLinks(page: Page): Promise<string[]> {
    return await page.evaluate(() => {
      const links: string[] = [];
      const elements = document.querySelectorAll('a[href]');
      elements.forEach((el) => {
        const href = el.getAttribute('href');
        if (href) links.push(href);
      });
      return links;
    });
  }

  private shouldInclude(url: string): boolean {
    if (this.isVisited(url)) return false;
    if (!url.startsWith(this.options.baseUrl)) return false;

    for (const pattern of this.options.excludePatterns) {
      if (url.includes(pattern)) return false;
    }

    return true;
  }

  private isVisited(url: string): boolean {
    const normalized = this.normalizeUrl(url);
    return this.visited.has(normalized);
  }

  private normalizeUrl(url: string): string {
    return url.split('#')[0];
  }

  private generateSitemapXml(): string {
    const urls = this.discovered
      .map(
        (p) => `
  <url>
    <loc>${this.escapeXml(p.url)}</loc>
    ${p.title ? `<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  getDiscoveredPages(): DiscoveredPage[] {
    return this.discovered;
  }
}

async function main() {
  const baseUrl = process.env.SITEMAP_URL || 'https://www.demoblaze.com';

  console.log(`🔍 Generating sitemap for: ${baseUrl}`);

  const generator = new SitemapGenerator({
    baseUrl,
    maxPages: 50,
    excludePatterns: ['#', 'logout', 'cart'],
  });

  const xml = await generator.generate();

  console.log(
    `\n📄 Generated sitemap with ${generator.getDiscoveredPages().length} pages`,
  );
  console.log(xml);

  const fs = await import('fs');
  fs.writeFileSync('./sitemap.xml', xml);
  console.log('\n✅ Sitemap saved to ./sitemap.xml');
}

main();
