# Quick Pass Emissions

Public informational website for emissions testing and Georgia tag renewal in Conyers.
The owner selected the Editorial Welcome design. This is a **preview, not publication-ready**.

## Run locally

Requires Node.js 22 or newer and pnpm 10.

```sh
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```

Static output is in dist/public/. The build prerenders the homepage from the same React components
and business configuration used by the browser; JavaScript hydrates navigation and live hours.
There is no backend, account system, booking, checkout, or database.
PORT and BASE_PATH are optional for local development; they can be supplied by a hosting environment.

## Static hosting

Publish only dist/public/ when the owner approves publication. Serve existing files at their exact paths.
Do not configure a catch-all SPA rewrite to index.html: the only public page is the root homepage,
with fragment navigation. Configure your host to use 404.html for missing paths with HTTP status 404
(not a 200 rewrite). Replit static hosting recognizes this file automatically.
Verify the root, assets, and a random unknown URL on the chosen host before launch.
The published production homepage is crawlable after owner approval. Keep the production robots.txt, canonical URL, and sitemap aligned with the confirmed domain; the 404 page remains noindex.

## Update content and photos

Edit src/content/business.ts for address, contact details, service-specific hours, policies, links, and FAQ answers.
The phone is deliberately null while unverified; set contact.phone to an international-format number
and phoneDisplay to the readable version only after owner confirmation. Update the confirmation labels too.
Call controls then use tel links automatically.

The original property image is in public/images/quick-pass-property.png. Two optimized WebP variants are included.
The supplied kiosk photo is preserved in public/images/mv-express-kiosk.png, with an optimized mv-express-kiosk.webp display version.
This standalone kiosk image is a reference, not a photo of the installed kiosk. Keep its reference caption and alt text.
The green-sided technician/car/kiosk scene is an AI-generated renovation concept and is not included in public assets.
Replace image variants together, preserving signage and building appearance. Additional entrance and bay images
have not been provided; do not invent them. Never use kiosk hours as emissions-testing hours.

## Approval and missing details

See internal CONTENT_VERIFICATION.md for sources, claim status, and owner-confirmation checklist.
It is not part of the public website output.

Confirm the phone number, emissions holiday/special-date exceptions, station-specific initial-test document requirements,
and kiosk access hours before publication. Do not infer kiosk access from emissions hours or invent date overrides.
LocalBusiness JSON-LD is generated from the shared business configuration; it includes emissions price and hours only.
Production homepage indexing is enabled for the owner-confirmed domain. Keep the canonical URL and
sitemap consistent with https://quickpassemissions.com/; the design canvas remains noindex.
Google controls crawl timing and indexing decisions.
A GitHub push does not authorize public deployment.
