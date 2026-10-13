# Quick Pass Emissions website

Independent, lightweight public website for emissions testing and Georgia tag renewal in Conyers. This repository has no dependency on the internal Business OS, authentication, payments, bookings, customer database, or secrets.

## Preview locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:4174**. The default build is a preview with explicit missing-detail labels, `noindex, nofollow`, and a robots exclusion. Nothing in this repository automatically deploys the website.

The design uses the owner's actual property photograph, retaining all original signage. Responsive WebP variants are generated from the original without cropping or compositing. Native HTML handles navigation and FAQs; the small progressive JavaScript enhances the mobile menu, renewal-details shortcut, and optional Google map. Fonts are system fonts; there are no third-party scripts, analytics, or remote fonts. Google Maps loads only when selected; ordinary directions links always work.

## Business details and publication

Edit `content/business.json` to supply confirmed facts. See [the verification record](docs/CONTENT_VERIFICATION.md) for source links and outstanding items. Telephone format:

```json
"phone": { "e164": "+1 followed by the 10 digit customer number", "display": "Owner-confirmed customer number" }
```

Set `emissionsHours` to an array of `[day label, hours label]` pairs. `emissionsPrice`, `emissionsPayments`, and `appointments` are plain text. Do not copy kiosk hours into emissions hours without owner confirmation. `kioskCashAccepted` remains `null` unless confirmed; the preview recommends bringing a card.

After reviewing the preview, confirming details, and selecting the final domain, set `ownerConfirmed`, `publicationApproved`, and the final HTTPS `siteUrl`, then run:

```sh
npm run build:publish
```

This build fails if required facts or approval are missing. A successful publication build creates a static `dist/` directory, canonical/social metadata, a sitemap, and indexable robots instructions. Uploading that directory to a chosen host is a separate, explicitly approved step. **No deployment has been performed.**

## Verify

```sh
npm test
npx playwright install chromium
npm run test:browser
```

The browser tests run their own preview server on port 4173 and cover 320, 390, 768, and 1440px layouts, accessibility scans, keyboard/mobile navigation, missing and confirmed phone links, exact directions, expandable details, deferred map loading, and no-JavaScript content/navigation. The fixture phone number is reserved test data and never appears in the site build. To use an existing test browser, set `PLAYWRIGHT_CHROMIUM_PATH` to its executable, or `PLAYWRIGHT_CHANNEL` to an installed browser channel.

For fresh preview screenshots with the preview server running:

```sh
node scripts/capture-preview.mjs
```

See [desktop](docs/preview/desktop.png), [mobile](docs/preview/mobile.png), and [verification results](docs/VERIFICATION.md).
