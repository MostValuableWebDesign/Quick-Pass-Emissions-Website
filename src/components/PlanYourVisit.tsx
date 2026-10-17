import { useEffect, useState } from 'react';
import { business, formatEmissionsPrice } from '@/content/business';
import { getBusinessHoursStatus, getTodayHours } from '@/content/hours';
import { trackEvent } from '@/lib/analytics';
import './PlanYourVisit.css';

export function PlanYourVisit() {
  // Keep build HTML and the first hydration render identical, even much later.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const refresh = () => {
      if (!document.hidden) setNow(new Date());
    };
    const interval = window.setInterval(refresh, 60_000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);
  const emissionsToday = now ? getTodayHours(business.emissions.hours, now, business.timeZone) : null;
  const hoursStatus = now ? getBusinessHoursStatus(business.kiosk.hours, now, business.timeZone) : null;
  const statusMessage = hoursStatus
    ? hoursStatus.message.replace(/^Open now · Closes at /, 'Open now until ')
    : 'See our weekly hours below.';
  const todayLabel = emissionsToday === null
    ? null
    : emissionsToday.hours === null
    ? 'Closed'
    : `${emissionsToday.label}${emissionsToday.isSpecial ? ' · Special hours' : ''}`;

  return (
    <section className="qp-plan-visit" aria-labelledby="qp-plan-visit-heading" data-timezone={business.timeZone}>
      <div className="qp-plan-inner">
        <div className="qp-plan-heading">
          <h2 id="qp-plan-visit-heading">Plan your visit</h2>
          {now && emissionsToday && <time dateTime={emissionsToday.dateKey}>
            {new Intl.DateTimeFormat('en-US', { timeZone: business.timeZone, weekday: 'long', month: 'short', day: 'numeric' }).format(now)}
          </time>}
        </div>
        <div className="qp-plan-status" data-open={hoursStatus?.isOpen} data-special={hoursStatus?.isSpecial}>
          <span className="qp-plan-status-dot" aria-hidden="true" />
          <strong>{business.hoursStatusHeading}</strong>
          <span className="qp-plan-status-separator" aria-hidden="true">·</span>
          <span className="qp-plan-status-message" role="status" aria-live="polite" aria-atomic="true" data-testid="business-hours-status">
            {statusMessage}
          </span>
        </div>
        <p className="qp-plan-facts">
          <span>{formatEmissionsPrice(business.emissions.priceCents)} emissions test</span>
          <span data-testid="today-emissions-hours">{todayLabel ? `Today: ${todayLabel}` : 'Weekly hours listed below.'}</span>
          <span>{business.emissions.walkInsWelcome === true ? 'No appointment needed.' : 'Call to confirm walk-ins.'}</span>
        </p>
        <address className="qp-plan-address">
          <a
            href={business.urls.directions}
            target="_blank"
            rel="noreferrer"
            data-testid="link-plan-address"
            onClick={() => trackEvent('directions_clicked', { placement: 'plan_visit_address' })}
          >
            {business.address.display}
          </a>
        </address>
      </div>
    </section>
  );
}
