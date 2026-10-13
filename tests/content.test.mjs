import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { directionsUrl, phoneUrl, publicationIssues, structuredData } from '../scripts/content.mjs';
import { render } from '../scripts/render.mjs';
const business = JSON.parse(await readFile(new URL('../content/business.json', import.meta.url)));
const template = await readFile(new URL('../src/index.html', import.meta.url), 'utf8');
const ready = { ...business, phone: { e164: '+17705550123', display: '(770) 555-0123' }, emissionsHours: [['Monday–Friday', 'Owner-confirmed hours']], emissionsPrice: '$20 — test fixture only', emissionsPayments: 'Card — test fixture only', appointments: 'Owner-confirmed policy', ownerConfirmed: true, siteUrl: 'https://quickpass-fixture.org/', publicationApproved: true };

test('preview preserves unresolved facts and does not invent phone links', () => {
  const html = render(template, { ...business, phone: null });
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /number pending/);
  assert.doesNotMatch(html, /href="tel:/);
  assert.doesNotMatch(html, /\{\{[A-Z_]+\}\}/);
  assert.match(html, /Testing hours: owner confirmation needed/);
  assert.match(html, /2026 registration/);
});
test('directions identify the exact business address, not a generic search', () => {
  const url = new URL(directionsUrl(business));
  assert.equal(url.hostname, 'www.google.com');
  assert.equal(url.searchParams.get('api'), '1');
  assert.equal(url.searchParams.get('destination'), '1185 Old Salem Rd SE, Conyers, GA 30094');
});
test('confirmed phone appears in all primary and mobile call actions', () => {
  assert.equal(phoneUrl(ready.phone), 'tel:+17705550123');
  assert.equal(phoneUrl({ e164: 'javascript:alert(1)' }), null);
  const html = render(template, ready);
  assert.equal([...html.matchAll(/href="tel:\+17705550123"/g)].length, 4);
  assert.doesNotMatch(html, /number pending/);
});
test('publication fails closed until business details, final URL, and preview approval are supplied', () => {
  assert.ok(publicationIssues(business).length >= 7);
  assert.throws(() => render(template, business, true), /Publication blocked/);
  assert.equal(publicationIssues(ready).length, 0);
  for (const url of ['http://quickpass.org/', 'https://example.com/', 'https://localhost/', 'https://quickpass.test/', 'https://quickpass.org/?a=1']) assert.ok(publicationIssues({ ...ready, siteUrl: url }).includes('final HTTPS site URL'));
  assert.match(render(template, ready, true), /rel="canonical"/);
  assert.doesNotMatch(render(template, ready, true), /noindex|Website preview/);
});
test('local search metadata omits unknown phone, price, reviews and ambiguous hours', () => {
  const data = structuredData(business);
  assert.equal(data.address.streetAddress, '1185 Old Salem Rd SE');
  for (const key of ['telephone', 'priceRange', 'aggregateRating', 'openingHours', 'url']) assert.equal(data[key], undefined);
  assert.equal(structuredData(ready, true).telephone, ready.phone.e164);
});
test('special characters in owner-provided content cannot become markup', () => {
  const html = render(template, { ...business, emissionsPrice: '<script>alert("price")</script>' });
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>alert/);
});
test('one-stop headline requires both services to be confirmed', () => {
  assert.match(render(template, business), /One convenient stop/);
  assert.doesNotMatch(render(template, { ...business, kioskAvailable: false }), /One convenient stop/);
});
