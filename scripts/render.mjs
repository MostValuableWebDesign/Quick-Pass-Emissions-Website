import { addressLine, directionsUrl, phoneUrl, publicationIssues, sources, structuredData } from './content.mjs';
export const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const svg = path => `<svg viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
const arrow = svg('<path d="M5 12h14m-6-6 6 6-6 6"/>');
const pin = svg('<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/>');
const phoneIcon = svg('<path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3-1 4C10 23 1 14 3 4Z"/>');
const mark = svg('<path d="M4 4h10l6 8-6 8H4l6-8Z"/>');
const pending = value => `<p class="pending">${escapeHtml(value)}</p>`;
const hours = rows => rows.map(([day, time]) => `<div class="hours-row"><span>${escapeHtml(day)}</span><span>${escapeHtml(time)}</span></div>`).join('');

export function render(template, b, publish = false) {
  if (publish && publicationIssues(b).length) throw new Error(`Publication blocked: ${publicationIssues(b).join('; ')}`);
  const tel = phoneUrl(b.phone);
  const call = tel
    ? `<a class="button secondary" href="${escapeHtml(tel)}">${phoneIcon} Call Us</a>`
    : `<a class="button pending-call" href="#contact">${phoneIcon} Call Us · pending</a>`;
  const headline = b.kioskAvailable && b.emissionsAvailable ? 'Your emissions test.<br>Your tag renewal.<br><span>One convenient stop.</span>' : 'Plan your visit to<br><span>Quick Pass Emissions.</span>';
  const tokens = {
    SEO: publish ? `<link rel="canonical" href="${escapeHtml(b.siteUrl)}"><meta property="og:url" content="${escapeHtml(b.siteUrl)}"><meta property="og:image" content="${escapeHtml(new URL('assets/property-1600.webp', b.siteUrl).href)}">` : '<meta name="robots" content="noindex, nofollow">',
    SCHEMA: JSON.stringify(structuredData(b, publish)).replaceAll('<', '\\u003c'),
    PREVIEW: publish ? '' : '<div class="preview-note"><strong>Website preview</strong> · Phone, emissions hours, pricing &amp; appointment details await confirmation. <a href="#location">Review visit details</a></div>',
    MARK: mark, ARROW: arrow, PIN: pin, CALL_BUTTON: call,
    DIRECTIONS: escapeHtml(directionsUrl(b)), ADDRESS: escapeHtml(addressLine(b)),
    MAP_URL: escapeHtml(`https://www.google.com/maps?q=${encodeURIComponent(addressLine(b))}&output=embed`),
    HERO: headline,
    OG_DESCRIPTION: escapeHtml(b.kioskAvailable && b.emissionsAvailable ? 'Your emissions test. Your tag renewal. One convenient stop.' : 'Plan your visit to Quick Pass Emissions in Conyers.'),
    PHONE_DETAIL: tel ? `<a href="${escapeHtml(tel)}">${escapeHtml(b.phone.display)}</a>` : pending('Customer phone number: owner confirmation needed.'),
    MOBILE_CALL: tel ? `<a href="${escapeHtml(tel)}">${phoneIcon} Call</a>` : `<a class="pending-call" href="#contact">${phoneIcon} Call · number pending</a>`,
    PRICE: b.emissionsPrice ? `<p>${escapeHtml(b.emissionsPrice)}</p>` : pending('Price confirmation needed.'),
    PAYMENTS: b.emissionsPayments ? `<p>${escapeHtml(b.emissionsPayments)}</p>` : pending('Emissions payment methods: confirmation needed.'),
    EMISSIONS_HOURS: b.emissionsHours ? hours(b.emissionsHours) : pending('Testing hours: owner confirmation needed. Kiosk hours do not establish testing hours.'),
    KIOSK_HOURS: hours(b.kioskHours),
    APPOINTMENTS: escapeHtml(b.appointments || 'Emissions appointment policy: confirmation needed. Please confirm before visiting.'),
    KIOSK_CASH: escapeHtml(b.kioskCashAccepted === true ? 'Cash is also accepted at this kiosk.' : b.kioskCashAccepted === false ? 'This kiosk does not accept cash.' : 'Cash availability at this location has not been confirmed; bring a card.'),
    YEAR: new Date().getUTCFullYear(), VERIFIED_DATE: escapeHtml(b.verifiedOn),
    ...Object.fromEntries(Object.entries(sources).map(([key, value]) => [`SOURCE_${key.replace(/[A-Z]/g, c => `_${c}`).toUpperCase()}`, escapeHtml(value)])),
  };
  const result = template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
    if (!(key in tokens)) throw new Error(`Unknown template token ${key}`);
    return tokens[key];
  });
  if (/\{\{[A-Z_]+\}\}/.test(result)) throw new Error('Unresolved template content');
  return result;
}
