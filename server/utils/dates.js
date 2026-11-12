// Date helpers. Hotel "today" is evaluated in the hotel's timezone (default India),
// so check-in/out rules don't flip at the wrong hour on a UTC server.
const TZ = process.env.HOTEL_TIMEZONE || 'Asia/Kolkata';

export function todayString() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date()); // YYYY-MM-DD
}

// Accepts "YYYY-MM-DD" (or ISO) and returns a Date at UTC midnight for that day.
export function parseDay(value) {
  if (!value) return null;
  const str = String(value).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const d = new Date(`${str}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dayString(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export function nightsBetween(start, end) {
  return Math.round((end - start) / 86400000);
}
