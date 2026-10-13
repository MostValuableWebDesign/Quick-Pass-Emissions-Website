import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('docs/preview', { recursive: true });
const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_CHROMIUM_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } : {}) });
try {
  for (const [name, width, height] of [['desktop', 1440, 1050], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4174');
    await page.locator('.property-photo img').evaluate(img => img.decode());
    await page.locator('.arrival-photo img').scrollIntoViewIfNeeded();
    await page.locator('.arrival-photo img').evaluate(img => img.decode());
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `docs/preview/${name}.png` });
    await page.screenshot({ path: `docs/preview/${name}-full.png`, fullPage: true });
    await page.close();
  }
} finally { await browser.close(); }
