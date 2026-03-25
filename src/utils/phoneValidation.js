/**
 * Congo phone validation by operator
 * Airtel: 04, 05
 * MTN: 06
 * Kolo: any (internal wallet)
 */
export function getPhonePlaceholder(method) {
  if (method === "airtel") return "05X XXX XXX";
  if (method === "mtn") return "06X XXX XXX";
  return "06X XXX XXX";
}

export function validatePayPhone(phone, method) {
  const digits = phone.replace(/\s/g, "");
  if (digits.length !== 9) return "Le numéro doit contenir 9 chiffres";
  if (method === "airtel" && !digits.startsWith("04") && !digits.startsWith("05")) {
    return "Les numéros Airtel commencent par 04 ou 05";
  }
  if (method === "mtn" && !digits.startsWith("06")) {
    return "Les numéros MTN commencent par 06";
  }
  return null;
}

export function isPayPhoneValid(phone, method) {
  return validatePayPhone(phone, method) === null;
}
