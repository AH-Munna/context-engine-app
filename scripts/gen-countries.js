/**
 * Regenerate app/constants/countries.ts and app/constants/isoCountries.ts
 * from ISO 3166-1 data (world-countries) + dial codes (country-telephone-data).
 *
 * Usage: node scripts/gen-countries.js
 */

const fs = require('fs');
const path = require('path');
const countries = require('world-countries');
const {allCountries: dialCountries} = require('country-telephone-data');

const root = path.join(__dirname, '..');
const countriesOut = path.join(root, 'app/constants/countries.ts');
const isoOut = path.join(root, 'app/constants/isoCountries.ts');

const DIAL_BY_ISO2 = Object.fromEntries(
  dialCountries.map(c => [c.iso2.toUpperCase(), `+${c.dialCode}`]),
);

/** User-friendly display names (ISO official names can be awkward). */
const DISPLAY_NAMES = {
  CD: 'DR Congo',
  CG: 'Congo',
  CI: "Côte d'Ivoire",
  CZ: 'Czechia',
  FK: 'Falkland Islands',
  GB: 'United Kingdom',
  KP: 'North Korea',
  KR: 'South Korea',
  LA: 'Laos',
  MK: 'North Macedonia',
  PS: 'Palestine',
  SZ: 'Eswatini',
  ST: 'Sao Tome and Principe',
  TL: 'Timor-Leste',
  TW: 'Taiwan',
  US: 'United States',
  VA: 'Vatican City',
  VN: 'Vietnam',
};

/** Extra search terms (lowercase) mapped to alpha-2 codes. */
const SEARCH_ALIASES = {
  GB: ['england', 'scotland', 'wales', 'northern ireland', 'britain', 'great britain', 'uk'],
  KP: ['dprk', 'north korea', 'democratic peoples republic of korea'],
  KR: ['rok', 'south korea', 'republic of korea'],
  PS: ['palestine', 'palestinian territories', 'west bank', 'gaza'],
  US: ['usa', 'america', 'united states of america'],
  AE: ['uae', 'emirates'],
  CD: ['drc', 'democratic republic of the congo', 'dr congo'],
  CG: ['republic of the congo'],
  CZ: ['czech republic', 'czechia'],
  MK: ['macedonia'],
  SZ: ['swaziland'],
  ST: ['sao tome', 'sao tome and principe', 'stp', 'são tomé', 'são tomé and príncipe'],
  LA: ['laos'],
  TL: ['east timor', 'timor leste'],
};

function escapeName(name) {
  return name.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function displayName(alpha2, fallback) {
  return DISPLAY_NAMES[alpha2] || fallback;
}

const entries = countries
  .filter(c => c.cca2 && c.cca3 && c.name?.common)
  .map(c => {
    const alpha2 = c.cca2.toUpperCase();
    const alpha3 = c.cca3.toUpperCase();
    const name = displayName(alpha2, c.name.common);
    const dial = DIAL_BY_ISO2[alpha2] || '';
    const aliases = SEARCH_ALIASES[alpha2] || [];
    return {alpha2, alpha3, name, dial, aliases};
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const sharedHeader = `function flag(cca2: string): string {
  return cca2
    .toUpperCase()
    .split('')
    .map(c => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}`;

const countriesLines = entries
  .filter(e => e.dial)
  .map(
    e =>
      `  {code:'${e.alpha2}',dial:'${e.dial}',name:'${escapeName(e.name)}',flag:flag('${e.alpha2}')},`,
  );

const countriesTs = `// Auto-generated ISO 3166-1 country list with dial codes — run: node scripts/gen-countries.js
export interface CountryEntry {
  code: string;   // ISO 3166-1 alpha-2
  dial: string;   // e.g. "+1"
  name: string;
  flag: string;   // emoji flag
}

${sharedHeader}

export const COUNTRIES: CountryEntry[] = [
${countriesLines.join('\n')}
];
`;

const isoLines = entries.map(e => {
  const aliasPart =
    e.aliases.length > 0
      ? `,searchAliases:[${e.aliases.map(a => `'${escapeName(a)}'`).join(',')}]`
      : '';
  return `  {alpha2:'${e.alpha2}',alpha3:'${e.alpha3}',name:'${escapeName(e.name)}',flag:flag('${e.alpha2}')${aliasPart}},`;
});

const isoTs = `// Auto-generated ISO 3166-1 country list for passport entries — run: node scripts/gen-countries.js
export interface IsoCountry {
  alpha2: string;
  alpha3: string;
  name: string;
  flag: string;
  searchAliases?: string[];
}

${sharedHeader}

export const ISO_COUNTRIES: IsoCountry[] = [
${isoLines.join('\n')}
];

export function findIsoCountryByAlpha3(alpha3: string): IsoCountry | undefined {
  return ISO_COUNTRIES.find(c => c.alpha3 === alpha3.toUpperCase());
}

export function findIsoCountryByAlpha2(alpha2: string): IsoCountry | undefined {
  return ISO_COUNTRIES.find(c => c.alpha2 === alpha2.toUpperCase());
}

export function searchIsoCountries(query: string, limit = 30): IsoCountry[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return ISO_COUNTRIES.slice(0, limit);
  }
  return ISO_COUNTRIES.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      c.alpha3.toLowerCase().includes(q) ||
      c.alpha2.toLowerCase().includes(q) ||
      (c.searchAliases?.some(alias => alias.includes(q)) ?? false),
  ).slice(0, limit);
}
`;

fs.writeFileSync(countriesOut, countriesTs);
fs.writeFileSync(isoOut, isoTs);

console.log(`Generated ${entries.length} ISO countries → ${isoOut}`);
console.log(`Generated ${countriesLines.length} dial-code countries → ${countriesOut}`);

const checks = ['KR', 'KP', 'PS', 'GB'];
for (const code of checks) {
  const found = entries.find(e => e.alpha2 === code);
  console.log(found ? `✓ ${code}: ${found.name}` : `✗ missing ${code}`);
}
