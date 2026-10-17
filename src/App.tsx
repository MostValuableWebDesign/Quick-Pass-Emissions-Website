import { useEffect, useRef, useState, type ReactNode } from 'react';
import { business, formatEmissionsPrice, type BusinessUrlKey } from '@/content/business';
import { PlanYourVisit } from '@/components/PlanYourVisit';
import { EmissionsTesting } from '@/components/EmissionsTesting';
import { WeeklyHours } from '@/components/WeeklyHours';
import { StructuredData } from '@/components/StructuredData';
import { trackEvent } from '@/lib/analytics';
import './EditorialWelcome.css';
import './ServicePanels.css';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const phoneHref = (phone: string) => {
  const digits = phone.replace(/\D/g, '');
  const internationalDigits = digits.length === 10 ? `1${digits}` : digits;
  if (!/^1\d{10}$/.test(internationalDigits)) {
    throw new Error('Business phone must be configured as a valid US phone number.');
  }
  return `tel:+${internationalDigits}`;
};

function CallControl({
  className,
  children,
  onUnverified,
  placement,
}: {
  className: string;
  children: ReactNode;
  onUnverified: () => void;
  placement: string;
}) {
  if (business.contact.phone) {
    return (
      <a
        className={className}
        href={phoneHref(business.contact.phone)}
        data-testid="link-call-business"
        onClick={() => trackEvent('call_clicked', { placement })}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      className={className}
      type="button"
      onClick={() => {
        trackEvent('call_prompt_opened', { placement });
        onUnverified();
      }}
      data-testid="button-call-business"
    >
      {children}
    </button>
  );
}

function DirectionsIcon() {
  return (
    <svg className="qp-directions-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        className="qp-directions-icon-backplate"
        d="M12 1.75 22.25 12 12 22.25 1.75 12 12 1.75Z"
      />
      <path
        className="qp-directions-icon-arrow"
        d="M7 17.5v-7.25C7 9.56 7.56 9 8.25 9H14V6l5.5 5.5L14 17v-3.5h-4.25v4Z"
        transform="translate(0.075 0.975) scale(0.9)"
      />
    </svg>
  );
}

const ratingStarPath =
  'M12 2.5l2.9 5.86 6.47.94-4.68 4.56 1.1 6.44L12 17.26l-5.79 3.04 1.1-6.44-4.68-4.56 6.47-.94L12 2.5z';

function GoogleRatingBadge() {
  const { rating } = business.googleRating;
  const wholeStars = Math.floor(rating);
  const partialFill = Math.round((rating - wholeStars) * 100);
  const partialStarFill = 'url(#qp-google-rating-partial-fill)';

  return (
    <a
      href={business.googleRating.listingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="qp-rating-badge"
      aria-label={`Read Google reviews for Quick Pass Emissions: rated ${rating.toFixed(1)} out of 5 stars on Google`}
      data-testid="google-rating-badge"
      onClick={() => trackEvent('google_reviews_clicked', { placement: 'hero' })}
    >
      <svg className="qp-rating-google-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M43.61 20.08H42V20H24v8h11.3c-1.65 4.66-6.07 8-11.3 8v8c11.05 0 20-8.95 20-20 0-1.34-.14-2.65-.39-3.92z"
        />
        <path
          fill="#34A853"
          d="M24 44c5.27 0 10.04-2.02 13.66-5.3l-6.3-5.34C29.27 35.76 26.73 36 24 36c-5.2 0-9.62-3.34-11.28-8l-6.57 5.07C9.66 39.66 16.32 44 24 44z"
        />
        <path
          fill="#FBBC05"
          d="M12.72 28c-.47-1.2-.72-2.49-.72-4s.25-2.8.72-4l-6.57-5.07C4.77 18.37 4 21.08 4 24s.77 5.63 2.15 8.07L12.72 28z"
        />
        <path
          fill="#EA4335"
          d="M24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.15 15.93l6.57 5.07C14.38 15.34 18.8 12 24 12z"
        />
      </svg>
      <svg
        className="qp-rating-stars"
        viewBox="0 0 116 24"
        aria-hidden="true"
        data-partial-fill={partialFill}
      >
        <defs>
          <linearGradient id="qp-google-rating-partial-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset={`${partialFill}%`} stopColor="#C7942E" />
            <stop offset={`${partialFill}%`} stopColor="#D7DED2" />
          </linearGradient>
        </defs>
        {Array.from({ length: 5 }, (_, index) => {
          const isPartial = index === wholeStars && partialFill > 0;
          const fill = index < wholeStars
            ? '#C7942E'
            : isPartial
              ? partialStarFill
              : '#D7DED2';
          return (
            <path
              key={index}
              d={ratingStarPath}
              transform={`translate(${index * 23} 0)`}
              fill={fill}
              stroke={isPartial ? '#B5C2B0' : fill === '#C7942E' ? '#A97D25' : '#A6B5A2'}
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
      <span>{rating.toFixed(1)}/5 on Google</span>
    </a>
  );
}

function ExternalLink({
  urlKey,
  children,
  className,
  onClick,
}: {
  urlKey: BusinessUrlKey;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a className={className} href={business.urls[urlKey]} target="_blank" rel="noreferrer" onClick={onClick}>
      {children}
    </a>
  );
}

type KioskIconName = 'barcode' | 'plate' | 'license' | 'address' | 'insurance' | 'emissions' | 'payment' | 'printer';

function KioskIcon({ name }: { name: KioskIconName }) {
  let paths: ReactNode;

  switch (name) {
    case 'barcode':
      paths = <><path d="M4 5v14M7 5v14M10 5v14M14 5v14M17 5v14M20 5v14" /></>;
      break;
    case 'plate':
      paths = <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h10M7 14h1M11 14h1M15 14h1M19 14h1" /></>;
      break;
    case 'license':
      paths = <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8" cy="11" r="2" /><path d="M5.5 16c.6-1.3 1.4-2 2.5-2s1.9.7 2.5 2M13 10h5M13 14h5" /></>;
      break;
    case 'address':
      paths = <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>;
      break;
    case 'insurance':
      paths = <><path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>;
      break;
    case 'emissions':
      paths = <><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6M9 16h3" /><path d="m14 18 1.5 1.5L19 16" /></>;
      break;
    case 'payment':
      paths = <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>;
      break;
    case 'printer':
      paths = <><path d="M7 8V3h10v5M6 17H4a2 2 0 0 1-2-2v-4a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v4a2 2 0 0 1-2 2h-2M6 14h12v7H6z" /></>;
      break;
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths}
    </svg>
  );
}

function App() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    document.title = 'Quick Pass Emissions | Conyers, Georgia';
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!callOpen) return;
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, [callOpen]);

  useEffect(() => {
    const sections = ['home', 'tag-renewal', 'emissions-testing', 'location-hours']
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const unlinkedSections = ['.qp-faq', '.qp-footer']
      .map((selector) => document.querySelector<HTMLElement>(selector))
      .filter((section): section is HTMLElement => section !== null);
    let animationFrame = 0;

    const updateActiveSection = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        const headerHeight = document.querySelector('.qp-header')?.getBoundingClientRect().height ?? 0;
        const activationLine = headerHeight + 16;

        const currentUnlinkedSection = unlinkedSections.some((section) => {
          const bounds = section.getBoundingClientRect();
          return bounds.top <= activationLine && bounds.bottom > activationLine;
        });
        if (currentUnlinkedSection) {
          setActiveSection('');
          return;
        }

        let currentSection = '';
        for (const section of sections) {
          if (section.getBoundingClientRect().top > activationLine) break;
          currentSection = section.id;
        }
        setActiveSection(currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    window.addEventListener('hashchange', updateActiveSection);
    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
      window.removeEventListener('hashchange', updateActiveSection);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const openCallNotice = () => {
    setMenuOpen(false);
    setCallOpen(true);
  };
  const closeMenu = () => setMenuOpen(false);
  const focusNavigationTarget = (sectionId: string) => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      const heading = sectionId === 'home'
        ? document.getElementById('qp-title')
        : document.getElementById(sectionId)?.querySelector<HTMLElement>('h1, h2');
      heading?.focus({ preventScroll: true });
    });
  };
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'tag-renewal', label: 'Tag Renewal' },
    { id: 'emissions-testing', label: 'Emissions Testing' },
    { id: 'location-hours', label: 'Location & Hours' },
  ];

  return (
    <div className="qp-editorial">
      <StructuredData />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="qp-header">
        <div className="qp-header-inner">
          <a className="qp-brand" href="#home" aria-label={`${business.name} home`} onClick={() => focusNavigationTarget('home')}>
            <span className="qp-brand-logo-shell">
              <img className="qp-brand-logo" src={asset('images/quick-pass-logo-660.webp')} alt="" width="660" height="220" decoding="async" />
            </span>
            <span className="qp-brand-sub">{business.shortLocation}</span>
          </a>
          <nav
            id="qp-mobile-navigation"
            className={`qp-nav${menuOpen ? ' is-open' : ''}`}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => focusNavigationTarget(link.id)}
                aria-current={activeSection === link.id ? 'location' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <CallControl className="qp-head-cta" placement="header" onUnverified={openCallNotice}>Call Us</CallControl>
          <button
            ref={menuButtonRef}
            className="qp-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="qp-mobile-navigation"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="button-toggle-navigation"
          >
            <span className="qp-menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <main id="main-content">
        <section className="qp-hero" id="home" aria-labelledby="qp-title">
          <picture className="qp-hero-backdrop">
            <source
              media="(max-width: 650px)"
              type="image/webp"
              srcSet={`${asset(business.photos.heroMobile384)} 384w, ${asset(business.photos.heroMobile512)} 512w`}
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet={`${asset(business.photos.heroDesktop640)} 640w, ${asset(business.photos.heroDesktop1280)} 1280w`}
              sizes="100vw"
            />
            <img
              src={asset(business.photos.heroDesktop1280)}
              alt={business.photos.heroAlt}
              width="1280"
              height="561"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
          <div className="qp-hero-inner">
          <div className="qp-hero-top">
            <div className="qp-hero-copy">
              <p className="qp-eyebrow">{business.copy.heroEyebrow}</p>
              <h1
                id="qp-title"
                tabIndex={-1}
                aria-label={`${business.copy.heroHeadlineStart} ${business.copy.heroHeadlineTagRenewal} ${business.copy.heroHeadlineEmphasis}`}
              >
                <span>{business.copy.heroHeadlineStart}</span>
                <span>{business.copy.heroHeadlineTagRenewal}</span>
                <em>{business.copy.heroHeadlineEmphasis}</em>
              </h1>
              <p className="qp-hero-lede">{business.copy.heroDescription}</p>
              <div className="qp-actions">
                <a
                  className="qp-button qp-button-primary"
                  href={business.urls.directions}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-hero-directions"
                  onClick={() => trackEvent('directions_clicked', { placement: 'hero' })}
                >
                  Get directions <DirectionsIcon />
                </a>
                <CallControl className="qp-button qp-button-secondary" placement="hero" onUnverified={openCallNotice}>Call Us</CallControl>
              </div>
              <GoogleRatingBadge />
            </div>
          </div>
          </div>
        </section>

        <PlanYourVisit />

        <section className="qp-content qp-renewal" id="tag-renewal" aria-labelledby="qp-renew-heading">
          <div className="qp-renew-intro">
            <p className="qp-section-label">On-site, self-service kiosk</p>
            <h2 id="qp-renew-heading" tabIndex={-1}>{business.copy.renewalHeading}</h2>
            <p>
              {business.copy.kioskIntroduction.beforeLink}
              <ExternalLink
                urlKey="dorKioskFaq"
                onClick={() => trackEvent('kiosk_requirements_clicked', { placement: 'tag_renewal_intro' })}
              >
                {business.copy.kioskIntroduction.linkText}
              </ExternalLink>
              {business.copy.kioskIntroduction.afterLink}
            </p>
            <figure className="qp-kiosk-site-photo">
              <img
                src={asset(business.photos.kiosk)}
                alt={business.photos.kioskReferenceAlt}
                loading="lazy"
                decoding="async"
                width="360"
                height="757"
              />
              <figcaption className="qp-kiosk-site-caption">Georgia MV Express kiosk — reference image.</figcaption>
            </figure>
          </div>
          <div className="qp-renew-info">
            <div className="qp-renew-info-header">
              <h3>Ready to renew?</h3>
              <p>Have these details handy before using the kiosk.</p>
            </div>
            <div className="qp-kiosk-primary">
              <p className="qp-kiosk-primary-label">Bring one of these</p>
              <div className="qp-kiosk-option-list">
                <div className="qp-kiosk-option">
                  <KioskIcon name="barcode" />
                  <strong>{business.kiosk.identificationOptions[0]}</strong>
                </div>
                <span className="qp-kiosk-option-or">or</span>
                <div className="qp-kiosk-option">
                  <KioskIcon name="plate" />
                  <strong>{business.kiosk.identificationOptions[1]}</strong>
                </div>
              </div>
            </div>
            <div className="qp-kiosk-requirements">
              <h4>Also needed</h4>
              <ul className="qp-checklist">
                {business.kiosk.requirements.map((requirement) => (
                  <li key={requirement.label}>
                    <span className="qp-kiosk-requirement-copy">
                      <strong>{requirement.label}</strong>
                      <span>{requirement.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="qp-kiosk-policy">
              <p>Not every renewal qualifies.</p>
              <ExternalLink
                urlKey="dorKioskFaq"
                className="qp-kiosk-official-link"
                onClick={() => trackEvent('kiosk_requirements_clicked', { placement: 'tag_renewal_panel' })}
              >
                Check official kiosk requirements <span aria-hidden="true">↗</span>
              </ExternalLink>
            </div>
            <div className="qp-renew-payment-strip">
              <div className="qp-renew-payment-item">
                <span><strong>Payment methods</strong><span>{business.kiosk.payment}</span></span>
              </div>
              <div className="qp-renew-payment-item">
                <span><strong>Printing</strong><span>If the renewal completes successfully, it prints your registration and decal.</span></span>
              </div>
            </div>
          </div>
        </section>

        <EmissionsTesting />

        <section className="qp-content qp-visit" id="location-hours" aria-labelledby="qp-visit-heading">
          <div className="qp-visit-copy">
            <p className="qp-section-label">Location &amp; hours</p>
            <h2 id="qp-visit-heading" tabIndex={-1}>{business.copy.locationHeading}</h2>
            <address>{business.name}<br />{business.address.street}<br />{business.address.city}, {business.address.region} {business.address.postalCode}</address>
            <div className="qp-visit-details">
              {business.contact.phone && (
                <p className="qp-visit-phone">
                  <strong>Phone</strong><br />
                  <a
                    data-testid="link-location-phone"
                    href={phoneHref(business.contact.phone)}
                    onClick={() => trackEvent('call_clicked', { placement: 'location_phone' })}
                  >
                    {business.contact.phoneDisplay ?? business.contact.phone}
                  </a>
                </p>
              )}
              <p><strong>Emissions test price</strong><br />{formatEmissionsPrice(business.emissions.priceCents)} {business.emissions.priceUnit}</p>
              <div className="qp-visit-hours">
                <p><strong>{business.hoursHeading}</strong></p>
                <WeeklyHours />
              </div>
              <div className="qp-visit-actions">
                <ExternalLink
                  urlKey="directions"
                  className="qp-button qp-button-primary"
                  onClick={() => trackEvent('directions_clicked', { placement: 'location_section' })}
                >
                  Get Directions <DirectionsIcon />
                </ExternalLink>
                <CallControl className="qp-button qp-button-secondary" placement="location_section" onUnverified={openCallNotice}>Call Us</CallControl>
              </div>
            </div>
          </div>
          <div className="qp-map-wrap">
            <iframe
              className="qp-map"
              src={business.address.mapEmbed}
              title={`Map showing ${business.name} at ${business.address.display}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="qp-map-caption">
              <p><strong>{business.address.display}</strong></p>
              <a
                href={business.urls.directions}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('directions_clicked', { placement: 'map_caption' })}
              >
                Open directions <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <figure className="qp-property qp-location-property">
            <picture>
              <source
                type="image/webp"
                srcSet={`${asset(business.photos.property640)} 640w, ${asset(business.photos.property1024)} 1024w`}
                sizes="(max-width: 650px) calc(100vw - 36px), (max-width: 900px) 55vw, 620px"
              />
              <img
                src={asset(business.photos.original)}
                alt={business.photos.propertyAlt}
                width="1024"
                height="449"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <figcaption className="qp-photo-caption">{business.copy.photoCaption}</figcaption>
          </figure>
        </section>

        <section className="qp-faq" aria-labelledby="qp-faq-heading">
          <div className="qp-faq-layout">
            <div className="qp-faq-intro">
              <p className="qp-section-label">Good to know</p>
              <h2 id="qp-faq-heading">{business.copy.faqHeading}</h2>
            </div>
            <div className="qp-faq-list">
              {business.faq.map((item) => {
                const answerLinkSuffix = 'answerLinkSuffix' in item ? item.answerLinkSuffix : undefined;
                return (
                  <details
                    key={item.question}
                    onToggle={(event) => {
                      if (event.currentTarget.open) {
                        trackEvent('faq_answer_opened', { question: item.question });
                      }
                    }}
                  >
                    <summary>{item.question}</summary>
                    <p>
                      {item.answer}
                      {item.link && item.linkLabel && (
                        answerLinkSuffix
                          ? <> <ExternalLink urlKey={item.link as BusinessUrlKey}>{item.linkLabel}</ExternalLink>{answerLinkSuffix}</>
                          : <> <ExternalLink urlKey={item.link as BusinessUrlKey}>{item.linkLabel} <span aria-hidden="true">↗</span></ExternalLink>.</>
                      )}
                    </p>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="qp-footer">
        <div className="qp-footer-main">
          <div>
            <a className="qp-brand" href="#home" aria-label={`${business.name} home`} onClick={() => focusNavigationTarget('home')}>
              <span className="qp-brand-logo-shell">
                <img className="qp-brand-logo" src={asset('images/quick-pass-logo-660.webp')} alt="" width="660" height="220" decoding="async" />
              </span>
              <span className="qp-brand-sub">{business.shortLocation}</span>
            </a>
            <address>
              {business.address.display}<br />
              {business.contact.phone && business.contact.phoneDisplay && (
                <>
                  <a
                    className="qp-footer-phone"
                    href={phoneHref(business.contact.phone)}
                    onClick={() => trackEvent('call_clicked', { placement: 'footer' })}
                  >
                    {business.contact.phoneDisplay}
                  </a>
                </>
              )}
            </address>
          </div>
          <nav className="qp-footer-links" aria-label="Footer navigation">
            <a href="#tag-renewal">Tag Renewal</a>
            <a href="#emissions-testing">Emissions Testing</a>
            <a href="#location-hours">Location &amp; Hours</a>
            <ExternalLink urlKey="dorKioskFaq">Georgia DOR kiosk FAQ <span aria-hidden="true">↗</span></ExternalLink>
            <ExternalLink urlKey="emissionsFaq">Clean Air Force FAQ <span aria-hidden="true">↗</span></ExternalLink>
            <ExternalLink urlKey="county">Rockdale County Tax Office <span aria-hidden="true">↗</span></ExternalLink>
          </nav>
        </div>
        <p className="qp-copyright">© {currentYear} {business.name}</p>
      </footer>

      <div className="qp-mobile-bar" aria-label="Quick actions">
          <CallControl className="qp-button qp-button-secondary" placement="mobile_sticky" onUnverified={openCallNotice}>Call</CallControl>
          <a
            className="qp-button qp-button-primary"
            href={business.urls.directions}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('directions_clicked', { placement: 'mobile_sticky' })}
          >
          Directions <DirectionsIcon />
        </a>
      </div>

      {!business.contact.phone && (
        <dialog
          className="qp-dialog"
          ref={dialogRef}
          aria-labelledby="qp-call-title"
          aria-describedby="qp-call-description"
          onClose={() => setCallOpen(false)}
          onClick={(event) => {
            if (event.target === dialogRef.current) dialogRef.current?.close();
          }}
        >
          <button className="qp-dialog-close" type="button" aria-label="Close phone information" onClick={() => dialogRef.current?.close()}>
            <span aria-hidden="true">×</span>
          </button>
          <p className="qp-section-label">{business.name}</p>
          <h2 id="qp-call-title">{business.contact.dialogTitle}</h2>
          <p id="qp-call-description">{business.contact.dialogDescription}</p>
          <p className="qp-dialog-hint">{business.contact.dialogHint}</p>
          <a
            className="qp-button qp-button-primary"
            href={business.urls.directions}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              trackEvent('directions_clicked', { placement: 'call_notice' });
              dialogRef.current?.close();
            }}
          >
            Get directions <DirectionsIcon />
          </a>
        </dialog>
      )}
    </div>
  );
}

export default App;
