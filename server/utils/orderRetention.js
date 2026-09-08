const normalizeDate = (value = new Date()) => {
  const candidate = value instanceof Date ? value : new Date(value);
  return Number.isNaN(candidate.getTime()) ? new Date() : candidate;
};

const getTimeZoneParts = (date) => {
  const safeDate = normalizeDate(date);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.ORDER_TIMEZONE || "Asia/Kolkata",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  return formatter.formatToParts(safeDate).reduce((parts, part) => {
    if (part.type !== "literal") parts[part.type] = Number(part.value);
    return parts;
  }, {});
};

const getTimeZoneOffsetMinutes = (date) => {
  const safeDate = normalizeDate(date);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.ORDER_TIMEZONE || "Asia/Kolkata",
    timeZoneName: "shortOffset",
    hour: "2-digit",
    minute: "2-digit",
  });
  const timeZoneName = formatter.formatToParts(safeDate).find((part) => part.type === "timeZoneName")?.value || "GMT";
  const match = timeZoneName.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
  if (!match) return 0;

  const minutes = Number(match[2]) * 60 + Number(match[3] || 0);
  return match[1] === "+" ? minutes : -minutes;
};

export const getMidnightForDate = (date = new Date(), dayOffset = 0) => {
  const safeDate = normalizeDate(date);
  const { year, month, day } = getTimeZoneParts(safeDate);
  const midnightUtc = Date.UTC(year, month - 1, day + dayOffset);
  const offsetMinutes = getTimeZoneOffsetMinutes(new Date(midnightUtc));
  return new Date(midnightUtc - offsetMinutes * 60 * 1000);
};

export const getStartOfCurrentDay = (date = new Date()) => getMidnightForDate(date);

export const getNextMidnight = (date = new Date()) => getMidnightForDate(date, 1);
