import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { render } from '../scripts/render.mjs';
const require = createRequire(import.meta.url);
const business = JSON.parse(await readFile(new URL('../content/business.json', import.meta.url)));
const template = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');

for (const width of [320, 390, 768, 1440]) test(`layout and accessible content at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Your emissions test.Your tag renewal.One convenient stop.');
  await expect(page.locator('.property-photo img')).toBeVisible();
  expect(await page.locator('.property-photo img').evaluate(img => img.complete && img.naturalWidth > 0)).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })));
  expect(violations).toEqual([]);
  expect(errors).toEqual([]);
  await page.locator('.arrival-photo img').scrollIntoViewIfNeeded();
  await page.locator('.arrival-photo img').evaluate(img => img.decode());
  expect(await page.locator('.arrival-photo img').evaluate(img => img.naturalWidth > 0)).toBeTruthy();
  if (width < 761) {
    await expect(page.locator('.mobile-actions')).toBeVisible();
    const rect = await page.locator('.mobile-actions').boundingBox();
    expect(rect.y + rect.height).toBe(900);
    await page.getByRole('button', { name: 'Menu' }).click();
  }
  for (const [name, hash] of [['Tag Renewal', '#tag-renewal'], ['Emissions Testing', '#emissions-testing'], ['Location & Hours', '#location'], ['Home', '#home']]) {
    if (width < 761 && await page.locator('#navigation').isHidden()) await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('navigation').getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
  }
});

test('mobile menu supports keyboard and escape; renewal details expand', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(page.getByRole('navigation')).toBeHidden();
  await page.getByRole('link', { name: 'View Tag Renewal Details' }).click();
  await expect(page.locator('#tag-details')).toHaveAttribute('open', '');
});

test('directions work and missing phone cannot place a call', async ({ page }) => {
  await page.goto('/');
  const directions = await page.locator('a[href*="maps/dir/"]').evaluateAll(links => links.map(link => link.href));
  expect(directions.length).toBeGreaterThanOrEqual(6);
  for (const href of directions) expect(new URL(href).searchParams.get('destination')).toBe('1185 Old Salem Rd SE, Conyers, GA 30094');
  if (!business.phone) {
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    await page.locator('.hero .pending-call').click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator('#contact')).toContainText('confirmation needed');
  }
});

test('confirmed phone uses real tel links on desktop and mobile', async ({ page }) => {
  const fixture = { ...business, phone: { e164: '+17705550123', display: '(770) 555-0123' } };
  await page.route('**/phone-fixture', route => route.fulfill({ contentType: 'text/html', body: render(template, fixture) }));
  await page.goto('/phone-fixture');
  await expect(page.locator('a[href="tel:+17705550123"]')).toHaveCount(4);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.mobile-actions a[href^="tel:"]')).toBeVisible();
  await expect(page.locator('#contact')).toHaveText('(770) 555-0123');
});

test('map requests are deferred until selected; FAQs and content work without JavaScript', async ({ page, browser }) => {
  await page.route('https://www.google.com/maps**', route => route.fulfill({ contentType: 'text/html', body: '<p>Map provider test response</p>' }));
  await page.goto('/');
  await expect(page.locator('iframe')).toHaveCount(0);
  await page.getByRole('button', { name: 'Show interactive map' }).click();
  await expect(page.getByTitle('Quick Pass Emissions location in Conyers, Georgia')).toHaveAttribute('src', /1185%20Old%20Salem/);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await context.newPage();
  await noJsPage.goto('http://127.0.0.1:4173/');
  await noJsPage.locator('.faq-list summary').filter({ hasText: 'What happens if my vehicle fails?' }).click();
  await expect(noJsPage.locator('.faq-list details[open]')).toContainText('30-calendar-day');
  await expect(noJsPage.locator('a[href*="maps/dir/"]').first()).toBeVisible();
  await noJsPage.setViewportSize({ width: 390, height: 844 });
  await expect(noJsPage.getByRole('navigation')).toBeVisible();
  await context.close();
});
