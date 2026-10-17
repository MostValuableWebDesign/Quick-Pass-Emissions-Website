import { business, formatEmissionsPrice } from '@/content/business';
import { WeeklyHours } from '@/components/WeeklyHours';
import './EmissionsTesting.css';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export function EmissionsTesting() {
  return (
    <section className="qp-emissions qp-emissions-service" id="emissions-testing" aria-labelledby="qp-emissions-heading">
      <header className="qp-emissions-header">
        <p className="qp-section-label">Emissions testing</p>
        <h2 id="qp-emissions-heading" tabIndex={-1}>{business.copy.emissionsHeading}</h2>
      </header>
      <div className="qp-emissions-inner">
        <div className="qp-emissions-offer">
          <div className="qp-emissions-price">
            <span className="qp-emissions-price-amount">{formatEmissionsPrice(business.emissions.priceCents)}</span>
            <span className="qp-emissions-price-unit" aria-hidden="true">/ {business.emissions.priceUnit.replace(/^per\s+/i, '').toUpperCase()}</span>
            <span className="qp-sr-only">{business.emissions.priceUnit}</span>
          </div>
          {business.emissions.walkInsWelcome && (
            <span className="qp-emissions-walkin">Walk-ins welcome</span>
          )}
        </div>
        <div className="qp-emissions-facts">
          <section className="qp-emissions-card qp-emissions-hours" aria-labelledby="qp-emissions-hours-heading">
            <div className="qp-emissions-card-heading">
              <h3 id="qp-emissions-hours-heading">Hours</h3>
            </div>
            <p className="qp-emissions-card-context">Emissions testing &amp; tag-renewal kiosk</p>
            <WeeklyHours />
          </section>
          <section className="qp-emissions-card qp-emissions-payment" aria-labelledby="qp-emissions-payment-heading">
            <div className="qp-emissions-card-heading">
              <h3 id="qp-emissions-payment-heading">Payment methods</h3>
            </div>
            <p>{business.emissions.payment}</p>
            <p className="qp-emissions-payment-note">For emissions testing; kiosk payments are separate.</p>
          </section>
          <section className="qp-emissions-card qp-emissions-preparation" aria-labelledby="qp-emissions-preparation-heading">
            <div className="qp-emissions-card-heading">
              <h3 id="qp-emissions-preparation-heading">Before you visit</h3>
            </div>
            <ol className="qp-emissions-checklist" role="list">
              {business.emissions.preparation.map((step, i) => (
                <li key={step}><strong>{prepLabels[i] ?? `Step ${i + 1}`}</strong><span>{step}</span></li>
              ))}
            </ol>
            {business.emissions.initialTestDocuments === null
              ? <p className="qp-emissions-callout">Call us if you have questions about what to bring.</p>
              : business.emissions.initialTestDocuments.length > 0 && <p className="qp-emissions-callout">Bring: {business.emissions.initialTestDocuments.join(', ')}.</p>}
            <a className="qp-emissions-official" href={business.urls.emissionsPreparation} target="_blank" rel="noreferrer">Georgia’s official preparation tips ↗</a>
          </section>
        </div>
        <div className="qp-emissions-visual">
          <figure className="qp-inspection-photo">
            <img
              src={asset(business.photos.inspection480)}
              srcSet={`${asset(business.photos.inspection480)} 480w, ${asset(business.photos.inspection960)} 960w`}
              sizes="(max-width: 650px) calc(100vw - 36px), (max-width: 900px) 44vw, 480px"
              alt={business.photos.inspectionAlt}
              width="480"
              height="381"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
const prepLabels = ['Warm up', 'Fuel cap & Check Engine light', 'Plan ahead', 'Retest visit'];
