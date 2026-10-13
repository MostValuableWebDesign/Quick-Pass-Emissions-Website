# Verification

October 13, 2026. Source pushed separately from deployment.

- Preview build: passed. Original 2.4 MB property photo is served as responsive WebP: approximately 68 KB at 800px, 220 KB at 1600px, 288 KB at original resolution. No image crop or signage changes.
- Content/build contracts: 7 tests passed. Checks cover unresolved facts, phone validation, exact-address directions, release prerequisites, metadata exclusions, safe text escaping, and conditional one-stop headline.
- Browser checks: 8 tests passed using Chromium for Testing. Four viewports (320, 390, 768, 1440px), no horizontal overflow, loaded property image, navigation anchors, mobile sticky actions, keyboard menu and Escape, renewal details, phone/directions hrefs, deferred map iframe, and JavaScript-disabled FAQs/mobile navigation.
- Accessibility: axe-core WCAG 2 A/AA and 2.1 AA scans passed at all four viewports. Manual visual review of desktop and mobile screenshots completed. Automated scans are not a comprehensive accessibility certification.
- Dependency audit: no known vulnerabilities reported by npm at installation.
- Publication build: intentionally blocked against the current incomplete business configuration; verified that it rejects missing business details and approval. Ready-to-publish fixture is tested without using fixture facts in the website.

The default Playwright browser was not installed in the user's standard cache. Tests were run successfully against the existing Chromium for Testing executable using `PLAYWRIGHT_CHROMIUM_PATH`; no new browser installation was needed. One initial contrast issue was corrected before the passing run.

Live calls were not placed. Directions were checked for their exact destination, not driven in person. Map insertion uses a stubbed provider response in the automated test; live Google map rendering and availability remain subject to Google/network access. No live website was deployed; no domain/DNS setup or production indexing was tested. Owner-only missing details are listed in [CONTENT_VERIFICATION.md](CONTENT_VERIFICATION.md).
