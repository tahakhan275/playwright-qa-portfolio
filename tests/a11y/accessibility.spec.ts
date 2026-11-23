import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated WCAG 2.1 A/AA scan with axe-core.
 * Critical issues fail the test; all findings are attached to the HTML report
 * so they can be triaged like any other defect.
 */
const pages = [
  { name: 'login page', path: '/' },
];

for (const p of pages) {
  test(`${p.name} has no critical accessibility violations`, async ({ page }, testInfo) => {
    await page.goto(p.path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical, critical.map((v) => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
}
