import { Temporal } from '@js-temporal/polyfill';

export function formatRelativeTime(date: Date, locale: string = 'es'): string {
  const instant = Temporal.Instant.fromEpochMilliseconds(date?.getTime?.() ?? 0);
  const now = Temporal.Now.instant();
  
  const duration = now.since(instant);
  
  const seconds = duration.total('seconds');
  const minutes = duration.total('minutes');
  const hours = duration.total('hours');
  const days = duration.total('days');
  const weeks = days / 7;
  const months = days / 30;
  const years = days / 365;

  if (seconds < 60) {
    return locale === 'es' ? 'hace unos segundos' : 'a few seconds ago';
  } else if (minutes < 60) {
    const mins = Math.floor(minutes);
    return locale === 'es' 
      ? `hace ${mins} minuto${mins !== 1 ? 's' : ''}`
      : `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    const hrs = Math.floor(hours);
    return locale === 'es' 
      ? `hace ${hrs} hora${hrs !== 1 ? 's' : ''}`
      : `${hrs} hour${hrs !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    const d = Math.floor(days);
    return locale === 'es' 
      ? `hace ${d} día${d !== 1 ? 's' : ''}`
      : `${d} day${d !== 1 ? 's' : ''} ago`;
  } else if (weeks < 4) {
    const w = Math.floor(weeks);
    return locale === 'es' 
      ? `hace ${w} semana${w !== 1 ? 's' : ''}`
      : `${w} week${w !== 1 ? 's' : ''} ago`;
  } else if (months < 12) {
    const m = Math.floor(months);
    return locale === 'es' 
      ? `hace ${m} mes${m !== 1 ? 'es' : ''}`
      : `${m} month${m !== 1 ? 's' : ''} ago`;
  } else {
    const y = Math.floor(years);
    return locale === 'es' 
      ? `hace ${y} año${y !== 1 ? 's' : ''}`
      : `${y} year${y !== 1 ? 's' : ''} ago`;
  }
} 