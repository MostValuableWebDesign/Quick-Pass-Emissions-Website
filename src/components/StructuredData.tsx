import { business } from '@/content/business';
import { getOpeningHoursStructuredData } from '@/content/hours';

const hours = getOpeningHoursStructuredData(business.emissions.hours);
const price = business.emissions.priceCents / 100;
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: business.name,
  ...(business.contact.phone ? { telephone: business.contact.phone } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    postalCode: business.address.postalCode,
    addressCountry: 'US',
  },
  openingHoursSpecification: hours.weekly,
  ...(hours.special.length ? { specialOpeningHoursSpecification: hours.special } : {}),
  makesOffer: [{
    '@type': 'Offer',
    price,
    priceCurrency: 'USD',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency: 'USD',
      unitText: business.emissions.priceUnit,
    },
    itemOffered: { '@type': 'Service', name: 'Vehicle emissions testing' },
  }],
  additionalProperty: [{
    '@type': 'PropertyValue',
    name: 'Business time zone',
    value: business.timeZone,
  }],
};

export function StructuredData() {
  const json = JSON.stringify(schema).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
