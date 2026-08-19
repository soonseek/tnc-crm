const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

type KstParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function toKstParts(date: Date): KstParts {
  const shifted = new Date(date.getTime() + KST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    second: shifted.getUTCSeconds(),
  };
}

function fromKstParts(parts: KstParts): Date {
  return new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
    ) - KST_OFFSET_MS,
  );
}

function dateKey(parts: Pick<KstParts, "year" | "month" | "day">) {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function addCalendarDays(parts: KstParts, days: number): KstParts {
  return toKstParts(new Date(fromKstParts(parts).getTime() + days * 24 * 60 * 60 * 1000));
}

function isBusinessDay(parts: KstParts, holidays: ReadonlySet<string>) {
  const dayOfWeek = fromKstParts({ ...parts, hour: 12 }).getUTCDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.has(dateKey(parts));
}

function nextBusinessDay(parts: KstParts, holidays: ReadonlySet<string>) {
  let candidate = addCalendarDays(parts, 1);
  while (!isBusinessDay(candidate, holidays)) {
    candidate = addCalendarDays(candidate, 1);
  }
  return candidate;
}

export function calculateFirstContactDeadline(
  receivedAt: Date,
  holidays: ReadonlySet<string> = new Set(),
) {
  const received = toKstParts(receivedAt);
  const withinBusinessHours =
    isBusinessDay(received, holidays) && received.hour >= 9 && received.hour < 18;
  const deadlineDay = nextBusinessDay(received, holidays);

  return fromKstParts({
    ...deadlineDay,
    hour: withinBusinessHours ? received.hour : 18,
    minute: withinBusinessHours ? received.minute : 0,
    second: withinBusinessHours ? received.second : 0,
  });
}
