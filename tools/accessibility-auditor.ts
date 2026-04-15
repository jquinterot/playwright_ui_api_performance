import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface AuditOptions {
  urls: string[];
  outputPath?: string;
}

interface AuditResult {
  url: string;
  violations: AxeBuilder['analysis'];
  timestamp: string;
}

export class AccessibilityAuditor {
  private results: AuditResult[] = [];

  async audit(options: AuditOptions): Promise<AuditResult[]> {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const url of options.urls) {
      console.log(`🔍 Auditing: ${url}`);
      try {
        await page.goto(url, { timeout: 30000 });

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();

        const result: AuditResult = {
          url,
          violations: accessibilityScanResults,
          timestamp: new Date().toISOString(),
        };

        this.results.push(result);

        if (accessibilityScanResults.violations.length > 0) {
          console.log(
            `  ⚠️  Found ${accessibilityScanResults.violations.length} violations`,
          );
        } else {
          console.log(`  ✅ No violations`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error}`);
      }
    }

    await browser.close();
    return this.results;
  }

  generateReport(): string {
    const summary = this.results.map((r) => {
      const violations = r.violations.violations || [];
      const violationList = violations
        .map(
          (v: any) => `
    - ${v.id}: ${v.description}
      Impact: ${v.impact || 'none'}
      Help: ${v.helpUrl}`,
        )
        .join('\n');

      return `
## ${r.url}
- Violations: ${violations.length}
- Timestamp: ${r.timestamp}
${violations.length > 0 ? violationList : '  ✅ All clear'}`;
    });

    return `# Accessibility Audit Report
Generated: ${new Date().toISOString()}

## Summary
- Total URLs: ${this.results.length}
- Total Violations: ${this.results.reduce((sum, r) => sum + (r.violations.violations?.length || 0), 0)}

${summary.join('\n')}
`;
  }

  getResults(): AuditResult[] {
    return this.results;
  }

  hasViolations(): boolean {
    return this.results.some((r) => (r.violations.violations?.length || 0) > 0);
  }
}

async function main() {
  const urls = process.env.AUDIT_URLS?.split(',') || [
    'https://www.demoblaze.com',
    'https://www.demoblaze.com/index.html',
  ];

  console.log(`🔍 Running accessibility audit on ${urls.length} URLs`);

  const auditor = new AccessibilityAuditor();
  await auditor.audit({ urls });

  const report = auditor.generateReport();
  console.log(report);

  const fs = await import('fs');
  fs.writeFileSync('./accessibility-report.md', report);
  console.log('✅ Report saved to ./accessibility-report.md');

  if (auditor.hasViolations()) {
    process.exit(1);
  }
}

main();
