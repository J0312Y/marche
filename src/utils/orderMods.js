/**
 * orderMods.js — Order modifications coordination
 *
 * When a client modifies an order in transit/preparation, this stores
 * the modification details so vendor and driver screens can react to it.
 *
 * Storage:
 *   localStorage["pending-order-mods"] = {
 *     "#LMK-2026-0214": {
 *       ref, modifiedAt, oldItems, newItems, modifyFee,
 *       oldTotal, newTotal, paymentMethod, status (pending/vendor_ack/driver_ack/complete)
 *     }
 *   }
 */

const LS_KEY = "pending-order-mods";

export function loadAllMods() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); }
  catch { return {}; }
}

export function getMod(orderRef) {
  return loadAllMods()[orderRef] || null;
}

export function saveMod(orderRef, modData) {
  const all = loadAllMods();
  all[orderRef] = { ...modData, ref: orderRef };
  localStorage.setItem(LS_KEY, JSON.stringify(all));
  // Notify listeners
  window.dispatchEvent(new CustomEvent("order-mod-updated", { detail: { ref: orderRef } }));
  return all[orderRef];
}

export function updateModStatus(orderRef, status) {
  const all = loadAllMods();
  if (!all[orderRef]) return null;
  all[orderRef].status = status;
  all[orderRef].statusUpdatedAt = new Date().toISOString();
  localStorage.setItem(LS_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("order-mod-updated", { detail: { ref: orderRef } }));
  return all[orderRef];
}

export function deleteMod(orderRef) {
  const all = loadAllMods();
  delete all[orderRef];
  localStorage.setItem(LS_KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("order-mod-updated", { detail: { ref: orderRef } }));
}

export function hasPendingMods() {
  const all = loadAllMods();
  return Object.values(all).filter(m => m.status === "pending" || m.status === "vendor_ack").length;
}

// Compute the human-readable diff between two item lists
export function computeDiff(oldItems, newItems) {
  const oldMap = {};
  oldItems.forEach(it => { oldMap[it.name] = it.qty || it.origQty || 0; });

  const added = [];
  const removed = [];
  const updated = [];

  newItems.forEach(it => {
    const oldQty = oldMap[it.name] || 0;
    const newQty = it.qty;
    if (newQty === 0 && oldQty > 0) {
      removed.push({ name: it.name, qty: oldQty });
    } else if (newQty > oldQty) {
      updated.push({ name: it.name, oldQty, newQty, change: `+${newQty - oldQty}` });
    } else if (newQty < oldQty && newQty > 0) {
      updated.push({ name: it.name, oldQty, newQty, change: `-${oldQty - newQty}` });
    }
    delete oldMap[it.name];
  });

  // Items in old but not in new = also removed (sanity check)
  Object.entries(oldMap).forEach(([name, qty]) => {
    if (qty > 0) removed.push({ name, qty });
  });

  return { added, removed, updated };
}

// Time ago helper for "Modifiée il y a 2 min"
export function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
}
