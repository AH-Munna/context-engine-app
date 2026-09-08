import {COUNTRIES, CountryEntry} from '../constants/countries';

const UNKNOWN_COUNTRY: CountryEntry = {
  code: 'XX',
  dial: '',
  name: 'Other',
  flag: '🌍',
};

const SORTED_BY_DIAL = [...COUNTRIES].sort(
  (a, b) =>
    b.dial.replace(/\D/g, '').length - a.dial.replace(/\D/g, '').length,
);

export function defaultCountryFromUser(userCountryCode?: string): CountryEntry {
  if (!userCountryCode) {
    return COUNTRIES.find(c => c.code === 'US') || UNKNOWN_COUNTRY;
  }
  const byDial = COUNTRIES.find(c => c.dial === userCountryCode);
  if (byDial) {
    return byDial;
  }
  const byCode = COUNTRIES.find(
    c => c.code.toUpperCase() === userCountryCode.toUpperCase(),
  );
  if (byCode) {
    return byCode;
  }
  return COUNTRIES.find(c => c.code === 'US') || UNKNOWN_COUNTRY;
}

export function resolvePhoneCountry(
  phone: string,
  userCountryCode?: string,
): CountryEntry {
  const trimmed = String(phone || '').trim();
  const defaultCountry = defaultCountryFromUser(userCountryCode);

  if (!trimmed) {
    return UNKNOWN_COUNTRY;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) {
    return UNKNOWN_COUNTRY;
  }

  const hasExplicitCountryCode =
    trimmed.startsWith('+') ||
    trimmed.startsWith('00') ||
    (digits.length > 10 && digits.startsWith('1'));

  if (hasExplicitCountryCode) {
    const normalizedDigits =
      trimmed.startsWith('00') && !trimmed.startsWith('+')
        ? digits.replace(/^00/, '')
        : digits;

    for (const country of SORTED_BY_DIAL) {
      const dialDigits = country.dial.replace(/\D/g, '');
      if (!dialDigits || !normalizedDigits.startsWith(dialDigits)) {
        continue;
      }
      if (dialDigits === '1' && defaultCountry.dial === '+1') {
        return defaultCountry;
      }
      return country;
    }
    return UNKNOWN_COUNTRY;
  }

  return defaultCountry;
}

export interface CountryContactGroup<T> {
  key: string;
  countryName: string;
  countryFlag: string;
  contacts: T[];
}

export function groupContactsByCountry<T extends {countryCode?: string; countryName?: string; countryFlag?: string; name?: string}>(
  contacts: T[],
): CountryContactGroup<T>[] {
  const sorted = [...contacts].sort((a, b) => {
    const countryCompare = (a.countryName || '').localeCompare(b.countryName || '');
    if (countryCompare !== 0) {
      return countryCompare;
    }
    return (a.name || '').localeCompare(b.name || '', undefined, {
      sensitivity: 'base',
    });
  });

  const groups: CountryContactGroup<T>[] = [];
  let current: CountryContactGroup<T> | null = null;

  for (const contact of sorted) {
    const key = contact.countryCode || 'XX';
    if (!current || current.key !== key) {
      current = {
        key,
        countryName: contact.countryName || UNKNOWN_COUNTRY.name,
        countryFlag: contact.countryFlag || UNKNOWN_COUNTRY.flag,
        contacts: [],
      };
      groups.push(current);
    }
    current.contacts.push(contact);
  }

  return groups;
}

export function attachPhoneCountry<T extends {phone: string}>(
  contact: T,
  userCountryCode?: string,
): T & {
  countryCode: string;
  countryName: string;
  countryFlag: string;
} {
  const country = resolvePhoneCountry(contact.phone, userCountryCode);
  return {
    ...contact,
    countryCode: country.code,
    countryName: country.name,
    countryFlag: country.flag,
  };
}
