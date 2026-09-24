export const VALID_PHONE = /^(?:\+218|00218|0)?9[0-9]{8}$/;

export function normalizeLibyanPhone(input: string) {
  let digits = input.replace(/[^\d+]/g, "");
  if (/^\+2189/.test(digits)) return digits;
  if (/^2189/.test(digits)) return "+" + digits;
  if (/^00218/.test(digits)) return "+218" + digits.slice(5);
  if (/^09/.test(digits)) return "+218" + digits.slice(1);
  if (/^0/.test(digits)) return digits;
  if (/^9/.test(digits)) return "+218" + digits;
  return digits;
}

// يلوّف ما يكتبه المستخدم (09XXXXXXXX أو 9XXXXXXXX أو +218912345678)
// إلى صيغة العرض المحلية 09… دون رمز الدولة، لأن +218 يُضاف تلقائياً.
export function toLocalPhoneDigits(input: string) {
  let d = input.replace(/[^\d]/g, "");
  if (d.startsWith("00218")) d = d.slice(5);
  else if (d.startsWith("218")) d = d.slice(3);
  if (/^9\d{8}$/.test(d) && d.length === 9) d = "0" + d;
  return d.slice(0, 10);
}

export function maskPhone(phone: string) {
  if (phone.length < 8) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-2)}`;
}