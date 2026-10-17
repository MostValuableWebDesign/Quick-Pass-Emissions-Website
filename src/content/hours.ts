export type Weekday = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export type DayHours = { open: string; close: string } | null;
export type HoursSchedule = {
  weekly: Record<Weekday, DayHours>;
  // Local calendar dates (YYYY-MM-DD). null explicitly means closed.
  special: Record<string, DayHours>;
  specialHoursConfirmed: boolean;
};

const orderedDays: { key: Weekday; label: string; schemaUrl: string }[] = [
  { key: 'mon', label: 'Monday', schemaUrl: 'https://schema.org/Monday' },
  { key: 'tue', label: 'Tuesday', schemaUrl: 'https://schema.org/Tuesday' },
  { key: 'wed', label: 'Wednesday', schemaUrl: 'https://schema.org/Wednesday' },
  { key: 'thu', label: 'Thursday', schemaUrl: 'https://schema.org/Thursday' },
  { key: 'fri', label: 'Friday', schemaUrl: 'https://schema.org/Friday' },
  { key: 'sat', label: 'Saturday', schemaUrl: 'https://schema.org/Saturday' },
  { key: 'sun', label: 'Sunday', schemaUrl: 'https://schema.org/Sunday' },
];

type WeeklySegment = { days: typeof orderedDays; hours: DayHours };

function sameHours(a: DayHours, b: DayHours): boolean {
  if (a === null || b === null) return a === b;
  return a.open === b.open && a.close === b.close;
}

function groupWeeklyHours(schedule: HoursSchedule): WeeklySegment[] {
  const segments: WeeklySegment[] = [];
  for (const day of orderedDays) {
    const hours = schedule.weekly[day.key];
    const previous = segments.at(-1);
    if (previous && sameHours(previous.hours, hours)) previous.days.push(day);
    else segments.push({ days: [day], hours });
  }
  return segments;
}

export function formatTime(value: string): string {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    throw new Error(`Invalid opening-hours time: ${value}`);
  }
  const [hour, minute] = value.split(':').map(Number);
  return `${hour % 12 || 12}${minute ? `:${String(minute).padStart(2, '0')}` : ''} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function formatDayHours(hours: DayHours): string {
  return hours === null ? 'Closed today' : `${formatTime(hours.open)}–${formatTime(hours.close)}`;
}

export function formatWeeklyHours(schedule: HoursSchedule): string[] {
  const regular = groupWeeklyHours(schedule).map(({ days, hours }) => {
    const first = days[0]!.label;
    const last = days[days.length - 1]!.label;
    const dayLabel = first === last ? first : `${first}–${last}`;
    const hoursLabel = hours === null ? 'Closed' : `${formatTime(hours.open)}–${formatTime(hours.close)}`;
    return `${dayLabel}: ${hoursLabel}`;
  });
  const special = Object.entries(schedule.special)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, hours]) => {
      const dateLabel = new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric',
      }).format(new Date(`${date}T12:00:00Z`));
      const hoursLabel = hours === null ? 'Closed' : `${formatTime(hours.open)}–${formatTime(hours.close)}`;
      return `Special hours (${dateLabel}): ${hoursLabel}`;
    });
  return [...regular, ...special];
}

export function getOpeningHoursStructuredData(schedule: HoursSchedule) {
  const weekly = groupWeeklyHours(schedule)
    .filter(({ hours }) => hours !== null)
    .map(({ days, hours }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days.map((day) => day.schemaUrl),
      opens: hours!.open,
      closes: hours!.close,
    }));
  const special = Object.entries(schedule.special)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      validFrom: date,
      validThrough: date,
      // Google interprets 00:00–00:00 as closed for that date.
      opens: hours?.open ?? '00:00',
      closes: hours?.close ?? '00:00',
    }));
  return { weekly, special };
}

export function getTodayHours(schedule: HoursSchedule, now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',
  }).formatToParts(now);
  const part = (name: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === name)!.value;
  const dateKey = `${part('year')}-${part('month')}-${part('day')}`;
  const weekday = part('weekday').toLowerCase() as Weekday;
  const isSpecial = Object.prototype.hasOwnProperty.call(schedule.special, dateKey);
  const hours = isSpecial ? schedule.special[dateKey] : schedule.weekly[weekday];
  if (hours === undefined) throw new Error(`Missing hours for ${dateKey}`);
  return { dateKey, weekday, isSpecial, hours, label: formatDayHours(hours) };
}

const weekdayKeys: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const weekdayNames: Record<Weekday, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

function minutesSinceMidnight(value: string): number {
  formatTime(value);
  const [hour, minute] = value.split(':').map(Number);
  return hour! * 60 + minute!;
}

function dateKeyAfter(dateKey: string, offset: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day! + offset));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function getBusinessHoursStatus(schedule: HoursSchedule, now: Date, timeZone: string) {
  const today = getTodayHours(schedule, now, timeZone);
  const timeParts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const timePart = (name: Intl.DateTimeFormatPartTypes) => timeParts.find((part) => part.type === name)!.value;
  const currentMinutes = Number(timePart('hour')) * 60 + Number(timePart('minute'));

  if (today.hours !== null) {
    const opensAt = minutesSinceMidnight(today.hours.open);
    const closesAt = minutesSinceMidnight(today.hours.close);
    if (currentMinutes >= opensAt && currentMinutes < closesAt) {
      return {
        ...today,
        isOpen: true,
        message: `Open now · Closes at ${formatTime(today.hours.close)}`,
      };
    }
  }

  const todayUtc = Date.parse(`${today.dateKey}T00:00:00Z`);
  const futureSpecialDates = Object.keys(schedule.special)
    .filter((date) => date >= today.dateKey)
    .sort();
  const lastSpecialDate = futureSpecialDates.at(-1);
  const specialRange = lastSpecialDate
    ? Math.ceil((Date.parse(`${lastSpecialDate}T00:00:00Z`) - todayUtc) / 86_400_000) + 7
    : 0;
  const searchDays = Math.max(8, specialRange);

  for (let offset = 0; offset <= searchDays; offset += 1) {
    const dateKey = dateKeyAfter(today.dateKey, offset);
    const weekdayIndex = new Date(Date.parse(`${dateKey}T00:00:00Z`)).getUTCDay();
    const weekday = weekdayKeys[weekdayIndex]!;
    const isSpecial = Object.prototype.hasOwnProperty.call(schedule.special, dateKey);
    const hours = isSpecial ? schedule.special[dateKey] : schedule.weekly[weekday];
    if (hours === undefined) throw new Error(`Missing hours for ${dateKey}`);
    if (hours === null) continue;
    if (offset === 0 && currentMinutes >= minutesSinceMidnight(hours.open)) continue;

    const dayPhrase = offset === 0
      ? 'today'
      : weekday === 'mon'
        ? 'Monday'
        : offset === 1
          ? 'tomorrow'
          : weekdayNames[weekday];
    return {
      ...today,
      isOpen: false,
      message: `Closed · Opens ${dayPhrase} at ${formatTime(hours.open)}`,
    };
  }

  return { ...today, isOpen: false, message: 'Closed · No upcoming opening scheduled' };
}
