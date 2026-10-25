import { useEffect, useState } from "react";
import { App as CapApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import Sheet from "./Sheet";
import toast from "../../utils/toast";

// Mise à jour de l'application : au lancement et au retour dans l'app, on compare le numéro de version installé
// avec la dernière version publiée (GET /app-version, écrit par scripts/publier-apk.ps1).
// Plus récente → feuille « Nouvelle version » ; sous min_code → obligatoire (pas de « Plus tard »).
// Le bouton ouvre Google Play si l'app y est publiée (app_store_url dans le panneau), sinon télécharge l'APK.
const API = import.meta.env.VITE_API_URL || "http://localhost/lamuka-api/api/v1";
const ORIGIN = new URL(API, window.location.href).origin;
const LATER = "lk-update-later"; // { code, until } : « Plus tard » repousse la même version de 24 h

async function installedBuild() {
  if (Capacitor.isNativePlatform()) return Number((await CapApp.getInfo()).build) || 0;
  try { return Number(localStorage.getItem("lk-dev-build")) || 0; } catch { return 0; } // essais dans le navigateur
}

/** Version installée lisible (« 1.0.3 ») ; null dans le navigateur */
export async function installedVersion() {
  if (!Capacitor.isNativePlatform()) return null;
  try { return (await CapApp.getInfo()).version || null; } catch { return null; }
}

/** « Rechercher une mise à jour » (Compte) : vérifie tout de suite, même après « Plus tard » */
export const checkForUpdate = () => window.dispatchEvent(new CustomEvent("lk-check-update"));

export default function UpdatePrompt() {
  const [up, setUp] = useState(null);
  useEffect(() => {
    let last = 0;
    const check = async (manual = false) => {
      if (!manual && Date.now() - last < 10 * 60 * 1000) return; // au plus une vérification toutes les 10 min
      last = Date.now();
      try {
        const build = await installedBuild();
        if (!build) { if (manual) toast.info("Vérification disponible dans l'application installée"); return; }
        const r = await fetch(`${API}/app-version`, { cache: "no-store" });
        const v = (await r.json())?.data;
        if (!v?.code || v.code <= build) { setUp(null); if (manual) toast.success("Vous avez la dernière version"); return; }
        const forced = build < (v.min_code || 0);
        let later = null; try { later = JSON.parse(localStorage.getItem(LATER) || "null"); } catch { /* rien */ }
        if (!manual && !forced && later?.code === v.code && later.until > Date.now()) return;
        setUp({ ...v, forced });
      } catch { if (manual) toast.error("Vérification impossible : vérifiez votre connexion"); }
    };
    check();
    // Aussi pendant l'utilisation (l'app peut rester ouverte longtemps) et au retour sur l'écran
    const timer = setInterval(() => check(), 30 * 60 * 1000);
    const onVis = () => { if (document.visibilityState === "visible") check(); };
    const onManual = () => check(true);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("lk-check-update", onManual);
    const sub = Capacitor.isNativePlatform() ? CapApp.addListener("resume", () => check()) : null;
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("lk-check-update", onManual); sub?.then((s) => s.remove()); };
  }, []);
  if (!up) return null;
  const later = () => { try { localStorage.setItem(LATER, JSON.stringify({ code: up.code, until: Date.now() + 24 * 3600 * 1000 })); } catch { /* rien */ } setUp(null); };
  // Sur le téléphone, naviguer vers une adresse externe la fait ouvrir par Android (Chrome télécharge l'APK, ou Google Play)
  const update = () => { const u = up.store_url || ORIGIN + up.url; if (Capacitor.isNativePlatform()) window.location.href = u; else window.open(u, "_blank", "noopener"); };
  return (
    <Sheet onClose={up.forced ? () => {} : later}>
      <div style={{ padding: "6px 20px 18px" }} className="tu-update">
        <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>{up.forced ? "Mise à jour nécessaire" : "Nouvelle version disponible"}</div>
        <p style={{ fontSize: 16, lineHeight: 1.45, marginTop: 8, color: "var(--t-text)" }}>
          {up.forced ? "Cette version de Lamuka n'est plus prise en charge. Installez la nouvelle version pour continuer." : "Une nouvelle version de Lamuka est prête à être installée."}
        </p>
        <p style={{ fontSize: 14, marginTop: 6, color: "var(--t-sub)" }}>Version {up.version}{up.size_mb && !up.store_url ? ` · ${String(up.size_mb).replace(".", ",")} Mo` : ""}</p>
        {up.notes && <p style={{ fontSize: 15, lineHeight: 1.45, marginTop: 12, whiteSpace: "pre-line" }}>{up.notes}</p>}
        {!up.store_url && <p style={{ fontSize: 13, lineHeight: 1.45, marginTop: 12, color: "var(--t-sub)" }}>Le fichier se télécharge : ouvrez-le puis appuyez sur « Installer ». Votre compte est conservé.</p>}
        <button className="t-cta center" style={{ width: "100%", height: 52, justifyContent: "center", fontSize: 17, marginTop: 20 }} onClick={update}>Mettre à jour</button>
        {!up.forced && <button className="t-cta ghost center" style={{ width: "100%", height: 52, justifyContent: "center", fontSize: 17, marginTop: 12 }} onClick={later}>Plus tard</button>}
      </div>
    </Sheet>
  );
}
