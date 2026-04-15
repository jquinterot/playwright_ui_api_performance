# Playwright Tools

This directory contains utility tools built with Playwright for site exploration and auditing.

## Are These Related to Our Test Automation?

**Partially.** These tools use the same Playwright framework but serve different purposes:

| Our Test Automation                | These Tools                |
| ---------------------------------- | -------------------------- |
| Runs existing tests                | Explore/crawl sites        |
| Validates functionality            | Audits quality (a11y, SEO) |
| Uses fixtures, flows, page objects | Standalone scripts         |
| Regression suite                   | Discovery/Audit suite      |

## Tools

### 1. Sitemap Generator (`sitemap-generator.ts`)

Crawls a website and generates an XML sitemap.

**Use case:** SEO testing, site structure validation

```bash
SITEMAP_URL=https://example.com npm run tool:sitemap
```

### 2. Accessibility Auditor (`accessibility-auditor.ts`)

Runs axe-core accessibility audits on URLs.

**Use case:** Accessibility compliance checking

```bash
AUDIT_URLS=https://example.com,https://example.com/about npm run tool:audit
```

### 3. Screenshot Tool (`screenshot-tool.ts`)

Captures screenshots of URLs for visual testing.

**Use case:** Visual regression baseline, documentation

```bash
SCREENSHOT_URLS=https://example.com npm run tool:screenshot
```

## Integration Ideas

These tools could be integrated into the project by:

1. **CI/CD Pipeline** - Run accessibility audits on deployment
2. **Visual Testing** - Generate baseline screenshots
3. **Site Monitoring** - Check for broken pages
4. **Documentation** - Auto-generate site maps for docs

## Running Tools

```bash
# Install dependencies
npm install

# Run individual tools
npm run tool:sitemap
npm run tool:audit
npm run tool:screenshot

# Or run with npx
npx ts-node tools/sitemap-generator.ts
```
