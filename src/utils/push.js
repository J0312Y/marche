/**
 * Notifications Firebase (téléphone) : autorisation, enregistrement de l'appareil auprès de l'API,
 * réception (app ouverte) et ouverture d'une notification touchée.
 * Inactif hors application native ou si FEATURES.push est faux (Firebase non configuré :
 * l'appel à register() ferait planter l'application).
 */
import { Capacitor } from "@capacitor/core";
import FEATURES from "../config/features";
import api from "../api/client";

let started = false;
let handlers = { onForeground: null, onTap: null };

export const pushAvailable = () => FEATURES.push && Capacitor.isNativePlatform();

export async function initPush({ onForeground, onTap } = {}) {
  handlers = { onForeground, onTap };
  if (!pushAvailable() || started) return;
  started = true;
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    await PushNotifications.createChannel({ id: "lamuka", name: "Commandes et messages", description: "Suivi des commandes, courses et messages", importance: 5, visibility: 1, sound: "default", vibration: true }).catch(() => {});
    let st = (await PushNotifications.checkPermissions()).receive;
    if (st === "prompt" || st === "prompt-with-rationale") st = (await PushNotifications.requestPermissions()).receive;
    if (st !== "granted") { started = false; return; }
    await PushNotifications.addListener("registration", (t) => { api.post("/users/push-token", { token: t.value }).catch(() => {}); });
    await PushNotifications.addListener("registrationError", (e) => console.warn("push: enregistrement impossible", e?.error));
    await PushNotifications.addListener("pushNotificationReceived", (n) => handlers.onForeground?.(n));
    await PushNotifications.addListener("pushNotificationActionPerformed", (a) => handlers.onTap?.(a.notification?.data || {}));
    await PushNotifications.register();
  } catch (e) { started = false; console.warn("push:", e?.message); }
}

/** À la déconnexion : cet appareil ne reçoit plus les notifications du compte */
export async function forgetPush() {
  if (!pushAvailable()) return;
  try { await api.delete("/users/push-token"); } catch {}
}
