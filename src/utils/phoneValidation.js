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

/** Affichage d'un numéro congolais : +242069839701 ou 069839701 → 06 983 97 01 (autres formats inchangés) */
export function fmtPhone(p) {
  if (!p) return "";
  const d = String(p).replace(/\s/g, "").replace(/^\+?242/, "");
  return /^0\d{8}$/.test(d) ? d.replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4") : String(p);
}
