const INDIA_COUNTRY_CODE = '91';
const INDIA_LOCAL_DIGITS = 10;

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, '');
}

function extractLocalDigits(digits: string): string {
  let local = digits;
  if (local.startsWith(INDIA_COUNTRY_CODE)) {
    local = local.slice(INDIA_COUNTRY_CODE.length);
  }
  return local.slice(0, INDIA_LOCAL_DIGITS);
}

export function formatIndianPhoneInput(value: string): string {
  const local = extractLocalDigits(sanitizePhoneInput(value));
  if (!local) return '';
  if (local.length <= 5) return `+91 ${local}`;
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}

export function formatPhoneForDisplay(value: string): string {
  return formatIndianPhoneInput(value);
}

export function validatePhone(value: string): string | null {
  const digits = sanitizePhoneInput(value);
  if (!digits) return null;
  const local = extractLocalDigits(digits);
  if (local.length !== INDIA_LOCAL_DIGITS) {
    return 'Enter a valid 10-digit Indian mobile number.';
  }
  return null;
}

export function normalizePhone(value: string): string | null {
  const digits = sanitizePhoneInput(value);
  if (!digits) return null;
  const local = extractLocalDigits(digits);
  return local || null;
}

export default {
  sanitizePhoneInput,
  formatIndianPhoneInput,
  formatPhoneForDisplay,
  validatePhone,
  normalizePhone,
};
