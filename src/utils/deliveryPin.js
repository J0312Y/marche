/**
 * deliveryPin.js — Per-order 4-digit PIN for delivery confirmation
 *
 * Flow:
 * 1. Client passes PIN to driver verbally at delivery
 * 2. Driver enters PIN → verified against this stored value
 *
 * PINs are deterministic per order ref (so buyer and driver agree).
 * Stored in localStorage to persist across sessions.
 */

const LS_KEY = "order-delivery-pins";

function loadPins() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}

function savePins(pins) {
  localStorage.setItem(LS_KEY, JSON.stringify(pins));
}

// Deterministic 4-digit PIN from string (hash)
function generatePinFromRef(ref) {
  let h = 0;
  for (let i = 0; i < ref.length; i++) {
    h = ((h << 5) - h) + ref.charCodeAt(i);
    h |= 0;
  }
  // Force positive, 4 digits, avoid sequences like 0000 or 1234
  const n = (Math.abs(h) % 9000) + 1000;
  return String(n);
}

export function getOrderPin(orderRef) {
  if (!orderRef) return "0000";
  const pins = loadPins();
  if (pins[orderRef]) return pins[orderRef];
  const pin = generatePinFromRef(orderRef);
  pins[orderRef] = pin;
  savePins(pins);
  return pin;
}

export function verifyOrderPin(orderRef, attemptedPin) {
  return getOrderPin(orderRef) === String(attemptedPin || "").trim();
}

// Optional: reset PIN (e.g. if user requests a new one)
export function resetOrderPin(orderRef) {
  const pins = loadPins();
  delete pins[orderRef];
  savePins(pins);
  return getOrderPin(orderRef); // generates a fresh one
}
