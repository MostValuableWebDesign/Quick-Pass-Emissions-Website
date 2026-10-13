export const sources = {
  kiosk: 'https://gamvexpress.com/locations/',
  kioskRules: 'https://dor.georgia.gov/mvd-self-service-tag-kiosk-faq',
  renewal: 'https://georgia.gov/renew-vehicle-registration',
  payments: 'https://gamvexpress.com/faqnew/',
  emissions: 'https://cleanairforce.com/motorists/before-you-test',
  retest: 'https://cleanairforce.com/common/faqs',
};

export function addressLine(b) {
  return `${b.address.streetAddress}, ${b.address.addressLocality}, ${b.address.addressRegion} ${b.address.postalCode}`;
}

export function directionsUrl(b) {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', addressLine(b));
  return url.href;
}

export function phoneUrl(phone) {
  if (!/^\+1\d{10}$/.test(phone?.e164 ?? '')) return null;
  return `tel:${phone.e164}`;
}

export function publicationIssues(b) {
  const missing = [];
  if (!phoneUrl(b.phone) || !b.phone?.display) missing.push('confirmed customer phone');
  if (!Array.isArray(b.emissionsHours) || !b.emissionsHours.length || b.emissionsHours.some(row => !Array.isArray(row) || row.length !== 2 || row.some(v => typeof v !== 'string' || !v.trim()))) missing.push('emissions hours');
  if (!b.emissionsPrice?.trim()) missing.push('emissions price');
  if (!b.emissionsPayments?.trim()) missing.push('emissions payment methods');
  if (!b.appointments?.trim()) missing.push('appointment policy');
  if (!b.ownerConfirmed) missing.push('owner confirmation of business details');
  try {
    const u = new URL(b.siteUrl);
    if (u.protocol !== 'https:' || /localhost|example\.|\.test$/.test(u.hostname) || u.pathname !== '/' || u.search || u.hash) throw new Error();
  } catch { missing.push('final HTTPS site URL'); }
  if (!b.publicationApproved) missing.push('owner approval after preview');
  return missing;
}

export function structuredData(b, publish = false) {
  const data = {
    '@context': 'https://schema.org', '@type': 'AutomotiveBusiness',
    name: b.name,
    address: { '@type': 'PostalAddress', ...Object.fromEntries(Object.entries(b.address).filter(([k]) => k !== 'source')) },
    geo: { '@type': 'GeoCoordinates', ...b.coordinates },
    hasMap: directionsUrl(b),
  };
  if (phoneUrl(b.phone)) data.telephone = b.phone.e164;
  // Kiosk access is not represented as the hours of the emissions business.
  if (publish) { data.url = b.siteUrl; data.image = new URL('assets/property-1600.webp', b.siteUrl).href; }
  return data;
}
