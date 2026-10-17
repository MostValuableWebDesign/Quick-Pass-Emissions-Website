import { formatWeeklyHours, type HoursSchedule } from './hours';

const addressFields = {
  street: '1185 Old Salem Rd. SE',
  city: 'Conyers',
  region: 'GA',
  postalCode: '30094',
};
const addressDisplay = `${addressFields.street}, ${addressFields.city}, ${addressFields.region} ${addressFields.postalCode}`;
const directionsUrl = `https://www.google.com/maps/dir/?${new URLSearchParams({ api: '1', destination: addressDisplay })}`;
const businessTimeZone = 'America/New_York';
const emissionsPolicy = {
  priceCents: 2000,
  priceUnit: 'per test',
  walkInsWelcome: true as boolean | null,
};
const emissionsPayment = 'Cash, credit, and debit cards';
const kioskPayment = 'Credit and debit cards';
const retestFaqAnswer =
  'You may receive one free retest at the original inspection station within 30 calendar days of your initial test; the 30-day period includes the date and time of that test. After completing the required repairs, return with the Emissions Repair Form completed by your repair technician.';

export function formatEmissionsPrice(cents: number): string {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new Error('Emissions price must be a non-negative number of cents.');
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: cents % 100 === 0 ? 0 : 2, maximumFractionDigits: 2,
  }).format(cents / 100);
}
const sharedServiceHours: HoursSchedule = {
  weekly: {
    mon: { open: '08:00', close: '18:00' },
    tue: { open: '08:00', close: '18:00' },
    wed: { open: '08:00', close: '18:00' },
    thu: { open: '08:00', close: '18:00' },
    fri: { open: '08:00', close: '18:00' },
    sat: { open: '08:00', close: '17:00' },
    sun: null,
  },
  special: {},
  specialHoursConfirmed: false,
};
const sharedHoursHeading = 'Emissions testing & tag-renewal kiosk hours';
const sharedHoursSummary = formatWeeklyHours(sharedServiceHours);
const emissionsPriceAnswer =
  `Emissions testing costs ${formatEmissionsPrice(emissionsPolicy.priceCents)} ${emissionsPolicy.priceUnit}.`;
const sharedHoursAnswer =
  `${sharedHoursHeading}: ${sharedHoursSummary.join('; ')}.`;
const googleRatingListingUrl = `https://www.google.com/maps/search/?${new URLSearchParams({
  api: '1',
  query: 'Quick Pass Emissions & Tag Renewal, 1185 Old Salem Rd SE, Conyers, GA 30094',
})}`;

export const business = {
  name: 'Quick Pass Emissions',
  shortLocation: 'Conyers, Georgia',
  timeZone: businessTimeZone,
  hoursHeading: sharedHoursHeading,
  hoursStatusHeading: 'Emissions & tag-renewal kiosk',
  address: {
    ...addressFields,
    display: addressDisplay,
    mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(addressDisplay)}&output=embed`,
  },
  contact: {
    phone: '(770) 761-8812',
    phoneDisplay: '(770) 761-8812',
    dialogTitle: 'Call details',
    dialogDescription:
      'A phone number is not listed here. Use the directions link to find the location.',
    dialogHint: 'Use Get Directions to open a map to the location.',
  },
  googleRating: {
    rating: 4.7,
    reviewCount: 278,
    verifiedOn: '2026-10-15',
    source: 'Google Maps business listing',
    listingUrl: googleRatingListingUrl,
  },
  kiosk: {
    hours: sharedServiceHours,
    name: 'Georgia MV Express self-service tag-renewal kiosk',
    payment: kioskPayment,
    identificationOptions: [
      'Renewal notice barcode',
      'Plate number + last four VIN digits',
    ],
    requirements: [
      { label: 'License', detail: 'A valid Georgia driver’s license' },
      { label: 'Registration address', detail: 'A correct registration address' },
      { label: 'Insurance', detail: 'Insurance on file' },
      { label: 'Emissions record', detail: 'A passing emissions result on file, where applicable' },
    ],
  },
  emissions: {
    ...emissionsPolicy,
    hours: sharedServiceHours,
    payment: emissionsPayment,
    preparation: [
      'Warm up your engine before the inspection.',
      'Secure the fuel cap. Have a persistent Check Engine light checked by a qualified repair technician.',
      'GCAF recommends testing four to six weeks before your registration renewal.',
      'Returning after a failed test? Complete the repairs and bring your completed Emissions Repair Form.',
    ],
    initialTestDocuments: null as readonly string[] | null,
  },
  copy: {
    heroEyebrow: 'YOUR FRIENDLY NEIGHBORHOOD EMISSIONS',
    heroHeadlineStart: 'Your emissions test.',
    heroHeadlineTagRenewal: 'Your tag renewal.',
    heroHeadlineEmphasis: 'Your One Stop Shop.',
    heroDescription:
      'Visit Quick Pass Emissions for vehicle emissions testing and convenient Georgia tag renewal.',
    photoCaption: 'Our location on Old Salem Road',
    renewalHeading: 'Need to renew your Georgia tag?',
    kioskIntroduction: {
      beforeLink: 'Renew your Georgia vehicle registration at our on-site Georgia MV Express self-service kiosk. Eligibility depends on your county and registration status. Check the ',
      linkText: 'official kiosk requirements',
      afterLink: ' before visiting.',
    },
    emissionsHeading: 'Emissions testing made straightforward.',
    locationHeading: 'Easy to find on Old Salem Road.',
    faqHeading: 'A few quick answers.',
  },
  urls: {
    directions: directionsUrl,
    dorKioskFaq: 'https://dor.georgia.gov/mvd-self-service-tag-kiosk-faq',
    emissionsFaq: 'https://cleanairforce.com/motorists/before-you-test',
    emissionsPreparation: 'https://cleanairforce.com/motorists/before-you-test/testing-tips',
    emissionsRetest: 'https://cleanairforce.com/motorists/after-you-test',
    kioskListing: 'https://gamvexpress.com/locations1/quick-pass-emissions-conyers',
    county: 'https://rockdaletaxoffice.org/',
  },
    photos: {
    heroDesktop640: 'images/station-hero-desktop-640.webp',
    heroDesktop1280: 'images/station-hero-desktop-1280.webp',
    heroMobile384: 'images/station-hero-mobile-384.webp',
    heroMobile512: 'images/station-hero-mobile-512.webp',
    property640: 'images/property-640.webp',
    property1024: 'images/property-1024.webp',
    original: 'images/quick-pass-property.png',
    inspection480: 'images/emissions-bay-edited-480.webp',
    inspection960: 'images/emissions-bay-edited-960.webp',
    heroAlt: 'Actual Quick Pass Emissions storefront, photographed on site, with its original tag-renewal and emissions signs above the service bays.',
    propertyAlt: 'Actual wide exterior photo of Quick Pass Emissions on Old Salem Road, showing the original storefront and its emissions and tag-renewal signs.',
    inspectionAlt: 'Digitally edited photo of Quick Pass Emissions’ inspection bay, with the blue-and-white EMISSIONS sign overhead and both cars retained.',
    kiosk: 'images/mv-express-kiosk.webp',
    kioskReferenceAlt: 'Standalone Georgia MV Express self-service tag-renewal kiosk reference image; this is not a photograph of the installed kiosk.',
    tagRenewalPlate: 'images/georgia-tag-renewal-plate.png',
    tagRenewalPlateAlt: 'Illustrative Georgia license plate with a peach graphic, example number ABC1234, and Chattahoochee County; not an actual vehicle plate.',
  },
  faq: [
    {
      question: 'Can I test my vehicle and renew my tag at this location?',
      answer:
        'This location offers emissions testing and an on-site Georgia MV Express self-service kiosk. Kiosk eligibility depends on your registration and county.',
      linkLabel: 'Check the official kiosk eligibility FAQ',
      link: 'dorKioskFaq',
    },
    {
      question: 'What do I need for tag renewal?',
      answer:
        'Have your renewal notice barcode, or your plate and last four VIN digits, plus a valid Georgia license. Your registration address, insurance, and emissions record must be current where applicable. Not every renewal qualifies.',
      linkLabel: 'See kiosk renewal details',
      link: 'kioskListing',
    },
    {
      question: 'Does my vehicle need an emissions test?',
      answer:
        'Emissions testing requirements depend on your vehicle’s model year, fuel type, weight, and county of registration. Check',
      answerLinkSuffix: ' to see whether your vehicle needs testing.',
      linkLabel: 'Georgia Clean Air Force’s current requirements',
      link: 'emissionsFaq',
    },
    {
      question: 'What does emissions testing cost?',
      answer: emissionsPriceAnswer,
      linkLabel: '',
      link: '',
    },
    {
      question: 'What are the emissions testing & tag-renewal kiosk hours?',
      answer: sharedHoursAnswer,
      linkLabel: '',
      link: '',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        `The renewal kiosk accepts ${kioskPayment.toLowerCase()}. Emissions testing accepts ${emissionsPayment.toLowerCase()}.`,
      linkLabel: '',
      link: '',
    },
    {
      question: 'What happens if my vehicle fails?',
      answer: retestFaqAnswer,
      linkLabel: 'Read the official emissions FAQ',
      link: 'emissionsRetest',
    },
    {
      question: 'Are appointments required?',
      answer:
        `${emissionsPolicy.walkInsWelcome === true
          ? 'No appointment is needed for emissions testing; walk-ins are welcome.'
          : emissionsPolicy.walkInsWelcome === false
            ? 'Walk-ins are not offered. Contact the station about visit arrangements.'
            : 'Call us to confirm whether walk-ins are available.'} The tag-renewal kiosk is self-service.`,
      linkLabel: '',
      link: '',
    },
  ],
} as const;

export type BusinessUrlKey = keyof typeof business.urls;
