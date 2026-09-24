export const VALID_PHONE = /^(\+218|00218|0)?9[0-9]{8}$/;

export function normalizeLibyanPhone(input: string) {
  const digits = input.replace(/[^\d+]/g, "");
  if (/^\+2189/.test(digits)) return digits;
  if (/^2189/.test(digits)) return "+" + digits;
  if (/^002189/.test(digits)) return "+" + digits.slice(3);
  if (/^9/.test(digits)) return "+218" + digits;
  return digits;
}

export function maskPhone(phone: string) {
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-2)}`;
}