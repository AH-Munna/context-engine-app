/** Calendar dates without time or timezone (local calendar day). */

/** Inclusive bounds for trip date-range pickers (±20 years from today). */
export function getTripDatePickerBounds(): {minimumDate: Date; maximumDate: Date} {
  const year = new Date().getFullYear();
  return {
    minimumDate: new Date(year - 20, 0, 1),
    maximumDate: new Date(year + 20, 11, 31),
  };
}

export function toDateOnlyString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDateOnly(value: string): Date {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateOnlyDisplay(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMonthYearDisplay(d: Date): string {
  return d.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function toMonthYearString(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${m}/${d.getFullYear()}`;
}

export function parseMonthYear(value: string): Date | null {
  const match = value.trim().match(/^(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return null;
  }
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  if (month < 1 || month > 12 || year < 1900) {
    return null;
  }
  return new Date(year, month - 1, 1);
}

export function monthYearFromInput(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  return parseMonthYear(value);
}

export function formatStoredMonthYear(value: string): string {
  const parsed = monthYearFromInput(value);
  return parsed ? formatMonthYearDisplay(parsed) : value;
}

export function toMonthStartString(d: Date): string {
  return toDateOnlyString(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function parseMonthStart(value: string): Date {
  return parseDateOnly(value.slice(0, 10));
}

export function dateOnlyFromInput(value: string | Date | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string' && value.length >= 10) {
    return parseDateOnly(value);
  }
  return null;
}
