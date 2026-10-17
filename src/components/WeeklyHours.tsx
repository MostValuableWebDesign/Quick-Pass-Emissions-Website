import { business } from '@/content/business';
import { formatWeeklyHours } from '@/content/hours';

export function WeeklyHours() {
  return (
    <ul className="qp-weekly-hours" aria-label={business.hoursHeading}>
      {formatWeeklyHours(business.emissions.hours).map((line) => <li key={line}>{line}</li>)}
    </ul>
  );
}
