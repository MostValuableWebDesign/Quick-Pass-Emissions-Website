# Quick Pass Emissions — Content Verification

Internal only. Checked 2026-10-14. Editorial Welcome selected and implemented as a private preview; not publication approval.

| Claim | Status | Source / notes |
|---|---|---|
| Quick Pass Emissions location: 1185 Old Salem Rd. SE, Conyers, GA 30094 | Verified | https://dor.georgia.gov/locations/quick-pass-emissions-conyers and https://gamvexpress.com/locations1/quick-pass-emissions-conyers |
| On-site Georgia MV Express self-service renewal kiosk | Verified | Same two official location sources |
| Kiosk accepts credit and debit cards | Verified | Same two official location sources; not evidence for emissions payment methods |
| Kiosk access hours | Owner confirmed | Use the same shared weekly schedule as emissions testing. Any confirmed date-specific overrides apply to both services; none have been supplied yet. |
| Emissions testing at this location | Verified listing and owner-supplied photo | https://www.google.com/search?q=quickpass+emisssions ; original property photo shows emissions bay |
| Phone (770) 761-8812 | Owner confirmed | Owner supplied the number in chat; the visible location link and all Call Us actions use this shared value. |
| Shared emissions and kiosk hours: Mon–Fri 8 AM–6 PM; Sat 8 AM–5 PM; Sun closed | Owner confirmed | One schedule in America/New_York applies to both services. Holiday/special exceptions remain unconfirmed. |
| Emissions test price: $20 per test | Owner confirmed 2026-10-14 | Use the shared emissions configuration across the site and structured data. |
| Emissions payment methods: cash, credit, and debit | Owner confirmed 2026-10-14 | Owner supplied |
| No appointment required; walk-ins welcome | Owner confirmed 2026-10-14 | Owner supplied |
| One free retest within 30 calendar days at original inspection station | Owner confirmed 2026-10-14 | Owner supplied |
| Kiosk users need eligible registration in participating county, valid GA license, correct address, insurance and emissions on file where applicable | Verified | https://dor.georgia.gov/mvd-self-service-tag-kiosk-faq |
| Scan renewal barcode or enter plate and last four VIN digits; registration and decal print after successful renewal | Verified | https://gamvexpress.com/locations1/quick-pass-emissions-conyers |
| Kiosk eligibility varies; not every renewal qualifies | Verified | https://dor.georgia.gov/mvd-self-service-tag-kiosk-faq |
| Emissions results transmitted electronically | Verified | https://cleanairforce.com/frequently-asked-questions |
| Current vehicle emissions eligibility | Verified on official GCAF eligibility page | https://cleanairforce.com/motorists/before-you-test; includes current registration-year eligibility by model year, fuel type, weight, and county. Link to the live page instead of hardcoding year-specific model ranges. |
| Staff-assisted renewal and kiosk fees | Not confirmed | Do not claim staff assistance or add unconfirmed kiosk fees. |
| County renewal guidance | Official resource located | https://rockdaletaxoffice.org/ ; detailed county claims deferred to full build |

## Repository inspection
Public repository https://github.com/MostValuableWebDesign/Quick-Pass-Emissions-Website.git cloned read-only into /tmp/quick-pass-source. HEAD 749bcf7c4df0a6a03cfe498f4eecd1a1b5d4bf58. No tracked source, instructions, or photos. No remote edits, commits, or pushes at design-selection stage.

The Replit workspace and website repository have unrelated histories. Export only the standalone website into a fresh clone of the website repository's main branch, preserve its history, and verify the remote commit after a normal push. Never force-push the workspace's history into that repository. A successful public clone or fetch does not verify GitHub write authentication. A GitHub push is not publication approval.

## Owner confirmation / publication blockers
- Confirm station-specific initial emissions-test documents, if any. The site directs customers to call with questions and links to official Georgia preparation tips; do not substitute kiosk paperwork requirements.
- No emissions holiday/special-date exceptions have been supplied. Add only owner-confirmed date overrides; do not infer closures or claim holiday hours are confirmed.
- Kiosk access uses the same shared weekly schedule as emissions testing. No holiday or special-date overrides have been supplied; any later confirmed override applies to both.
- Do not claim unconfirmed kiosk fees or staff-assisted renewal.
- The owner supplied original station photographs for the hero, emissions entrance, and location section. An actual installed-kiosk photo can replace the supplied standalone reference later.
- Confirm final domain and approve content and preview before publication.

## Preview verification
- The owner clarified that the former polished frontage panorama was an AI-generated renovation concept. It is not displayed. The hero and location now use separate original station photographs supplied by the owner, and emissions uses the original side-entrance photograph. Only resizing, format conversion, and cropping are applied. Source paths and crop bounds are in `scripts/src/optimize-property.ts` and `scripts/src/optimize-inspection.ts`; filenames and old captions are not evidence of photographic provenance.
- The owner clarified that the green-sided bay scene containing a technician, car, and kiosk is an AI-generated renovation concept, not property documentation. It is no longer displayed, and its derived images are removed from public assets.
- No actual installed-kiosk close-up is available. The standalone supplied kiosk reference is captioned “Georgia MV Express kiosk — reference image.” and identified as a reference in alt text.
- The photographic update passed production build and TypeScript checks. Browser checks at 320, 390, 768 and 1280px verified one responsive station-photo request per load, a 160KB image transfer budget, and sampled foreground/background contrast of at least 5.44:1 across tested hero text and buttons. Desktop and mobile screenshots were inspected. Existing hero buttons, navigation, phone dialog, FAQ toggles, image loading and no-overflow checks passed.
- “Plan your visit,” emissions, location, FAQs, and LocalBusiness structured data use the shared service schedule: Monday–Friday 8 AM–6 PM, Saturday 8 AM–5 PM, Sunday closed, and `America/New_York`. It applies to emissions testing and the self-service tag-renewal kiosk.
- Date-specific overrides use America/New_York calendar dates (`YYYY-MM-DD`); `null` means closed and overrides the weekly schedule for both services. The configured override map is empty because no exceptions have been supplied. Do not present holiday closures/hours as confirmed.
- Visit-hours tests cover Eastern midnight boundaries, both daylight-saving transitions, weekday/Saturday/Sunday values, shared special-hour closures and modified schedules, and structured-data output. Run the website/browser suite at 320, 390, 768, and 1280px after future schedule changes.
- Emissions preparation and retest content was verified against Georgia Clean Air Force on 2026-10-14: https://cleanairforce.com/motorists/before-you-test (warm engine), https://cleanairforce.com/motorists/before-you-test/testing-tips (secure fuel cap, persistent Check Engine light, testing four to six weeks before renewal), and https://cleanairforce.com/motorists/after-you-test (one free retest at the original station within 30 calendar days, including the initial date/time, after repairs and with a completed Emissions Repair Form).
- Initial-test paperwork requirements are not established by the reviewed sources. Confirm any station-specific document requirements before publication; do not substitute the kiosk’s license/barcode/VIN requirements. The site uses the fallback: “Call us if you have questions about what to bring.”
- The emissions-section image is an unretouched crop of the original station panorama, showing its actual emissions bay and vehicle. It is not labeled as a documented inspection in progress, and no generated scene is used.
- Website and export TypeScript checks passed. The standalone website production build passed.
- Desktop, tablet, and mobile screenshots were inspected; desktop and mobile full-page captures are saved in ignored generated-artifacts/screenshots/.
- Original property photograph is preserved; responsive WebP variants are provided.
- No runtime errors appeared in the captured browser logs. The managed website workflow starts cleanly.
- Automated Chromium interaction checks previously passed at 320, 390, 768 and 1280 pixels: mobile menu and Escape/focus restoration, anchor navigation, missing-phone dialog and close controls, FAQ toggles, image/asset loading, overflow, external-link safety, directions URL/address, map fallback, and no page errors. Re-run with `pnpm --filter @workspace/scripts run test-website`.
- The map is lazy-loaded and was not rendered in full-page captures; its address and directions fallback are visible. Map rendering remains unverified.
- The owner-confirmed public domain is `https://quickpassemissions.com/`. Production allows crawling, uses that homepage canonical URL, and provides a sitemap. The 404 page and design canvas remain non-indexable.
