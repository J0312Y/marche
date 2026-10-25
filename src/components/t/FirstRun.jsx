import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import Icon from "../Icon";
import LocationPicker from "./LocationPicker";
import useBackClose from "../../hooks/useBackClose";
import { setDeliverTo, currentPosition, quarterList, loadZones } from "../../utils/zone";
import api from "../../api/client";
import { art3d } from "../../config/art3d";
import { INTRO_ART as ART } from "../../config/introArt";

const DURATION = 4000;
const toSlide = (b) => ({ t: b.title || "", d: b.subtitle || "", img: b.image || "" });
const CACHE = "lk-intro";
const SlideArt = ({ img }) => img.startsWith("intro:") ? (ART[img.slice(6)] || null)
  : <img src={img.startsWith("art:") ? art3d(img.slice(4)) : img} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />;

/** Introduction qui défile seule (Toters : barres de progression, langue, « Get Started ») */
function Intro({ onDone }) {
  // Écrans gérés dans le panneau (« Contenu de l'app › Introduction ») ; sans aucun écran, on passe directement à la suite
  const [slides, setSlides] = useState(() => { try { return JSON.parse(localStorage.getItem(CACHE) || "[]"); } catch { return []; } });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    api.get("/banners").then((r) => { const s = Array.isArray(r) ? r.filter((b) => b.placement === "intro").map(toSlide) : []; setSlides(s); try { localStorage.setItem(CACHE, JSON.stringify(s)); } catch {} })
      .catch(() => {}).finally(() => setLoaded(true));
  }, []);
  useEffect(() => { if (loaded && !slides.length) onDone(); }, [loaded, slides.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const SLIDES = slides;
  const [i, setI] = useState(0);
  const [p, setP] = useState(0);
  const start = useRef(Date.now());
  useEffect(() => {
    start.current = Date.now(); setP(0);
    const t = setInterval(() => {
      const k = (Date.now() - start.current) / DURATION;
      if (!SLIDES.length) return;
      if (k >= 1) setI((n) => (n + 1) % SLIDES.length); else setP(k);
    }, 50);
    return () => clearInterval(t);
  }, [i, SLIDES.length]);
  useEffect(() => { if (i >= SLIDES.length) setI(0); }, [i, SLIDES.length]);
  const s = SLIDES[i] || SLIDES[0];
  if (!s) return <div className="fr-intro" />;
  return (
    <div className="fr-intro" onClick={(e) => { if (e.target.closest("button")) return; setI((n) => (e.clientX > window.innerWidth / 2 ? (n + 1) % SLIDES.length : (n + SLIDES.length - 1) % SLIDES.length)); }}>
      <div className="bars">{SLIDES.map((_, k) => <span key={k}><i style={{ width: k < i ? "100%" : k === i ? p * 100 + "%" : 0 }} /></span>)}</div>
      <div className="lang"><button><Icon name="globe" size={18} color="var(--acc)" />Fr</button></div>
      <h1>{s.t}</h1>
      <p>{s.d}</p>
      <div className="art">{s.img && <SlideArt img={s.img} />}</div>
      <button className="t-cta center fr-cta" onClick={onDone}>Commencer</button>
    </div>
  );
}

/** « Activez les notifications pour : » + fenêtre Android */
function Notif({ onDone, onBack }) {
  const ask = async () => {
    try {
      if (Capacitor.isNativePlatform()) { const { LocalNotifications } = await import("@capacitor/local-notifications"); await LocalNotifications.requestPermissions(); }
      else if (window.Notification?.requestPermission) await window.Notification.requestPermission();
    } catch {}
    onDone();
  };
  const ROWS = [["Suivez votre commande en direct", "#00B492", "bike"], ["Soyez les premiers informés des promos", "#E5484D", "percent"], ["Découvrez les nouveautés de Lamuka", "#5B3FD6", "gift"]];
  return (
    <div className="fr-page">
      <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
      <h2>Activez les notifications pour :</h2>
      {ROWS.map(([t, c, ic]) => <div key={t} className="fr-row"><span className="ic" style={{ background: c + "1F" }}><Icon name={ic} size={26} color={c} /></span><b>{t}</b></div>)}
      <button className="t-cta center fr-cta" style={{ position: "static", marginTop: 26 }} onClick={ask}>Continuer</button>
      <p className="fr-note">Vous pourrez changer cela plus tard dans les réglages du téléphone.</p>
    </div>
  );
}

/** « Autorisez l'accès à la localisation » + fenêtre Android */
function Loc({ onDone, onBack }) {
  const [busy, setBusy] = useState(false);
  const ask = async () => {
    setBusy(true);
    try { const p = await currentPosition(); try { localStorage.setItem("lk-geo", "on"); } catch {} onDone(p); }
    catch (e) { try { localStorage.setItem("lk-geo", e?.code === 1 ? "denied" : "off"); } catch {} onDone(null); }
  };
  return (
    <div className="fr-page center">
      <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
      <div className="fr-locart">
        <svg width="110" height="110" viewBox="0 0 110 110" fill="none"><path d="M22 40l22-8 22 8 22-8v52l-22 8-22-8-22 8z" fill="#fff" stroke="#D5D7DD" strokeWidth="3" /><path d="M55 14c-11 0-20 9-20 20 0 15 20 34 20 34s20-19 20-34c0-11-9-20-20-20z" fill="#00B492" /><circle cx="55" cy="34" r="7" fill="#fff" /><path d="M78 16l6-6M82 26l8-2" stroke="#00B492" strokeWidth="4" strokeLinecap="round" /></svg>
      </div>
      <h2 style={{ textAlign: "center", fontSize: 30 }}>Autorisez l'accès à la localisation</h2>
      <p className="fr-sub">Votre position nous aide à trouver les restaurants et boutiques près de chez vous, pour commander plus facilement.</p>
      <button className="t-cta center fr-cta" disabled={busy} onClick={ask}>{busy ? "Un instant…" : "Autoriser l'accès à la localisation"}</button>
    </div>
  );
}

/** « Choisir un lieu » : recherche + Utiliser ma position (Toters « Select a location ») */
export function SelectLocation({ gps, onPicked, onBack }) {
  const [q, setQ] = useState("");
  const [map, setMap] = useState(null); // { start, useGps }
  useEffect(() => { loadZones(); }, []);
  useBackClose(!!map, () => setMap(null));
  const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const res = q.trim() ? quarterList().filter((x) => norm(x.name).includes(norm(q.trim()))) : [];
  const useMine = async () => {
    try { const p = gps || (await currentPosition()); try { localStorage.setItem("lk-geo", "on"); } catch {} setMap({ start: p }); }
    catch { setMap({ start: null }); }
  };
  return (
    <div className="fr-page" style={{ background: "var(--t-page)", padding: 0 }}>
      <div className="tl-head" style={{ background: "var(--t-page)" }}>{onBack && <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}<b>Choisir un lieu</b></div>
      <div style={{ padding: "6px 16px" }}>
        <div className="fr-search"><Icon name="search" size={22} color="var(--t-sub)" /><input placeholder="Rechercher un quartier, une rue…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {!q.trim() && <button className="fr-mine" onClick={useMine}>
          <Icon name="navigation" size={22} color="var(--t-text)" />
          <span><b>Utiliser ma position</b><small>Livrer à ma position actuelle</small></span>
          <Icon name="chevron_right" size={22} color="var(--t-sub)" />
        </button>}
        {res.map((r) => (
          <button key={r.name} className="tl-res" style={{ background: "var(--card)" }} onClick={() => setMap({ start: { lat: r.lat, lng: r.lng } })}>
            <Icon name="map_pin" size={20} color="var(--t-sub)" /><span><b>{r.name}</b><small>{r.zone ? r.zone + ", Congo" : "Congo"}</small></span>
          </button>
        ))}
        {q.trim() && res.length === 0 && <div className="t-empty"><p>Aucun lieu trouvé.</p></div>}
      </div>
      {map && <LocationPicker initial={map.start} onClose={() => setMap(null)}
        onConfirm={(p) => { setDeliverTo({ lat: p.lat, lng: p.lng, quarter: p.quarter, label: p.quarter }); onPicked?.(p); }} />}
    </div>
  );
}

/**
 * Premier lancement, dans l'ordre de Toters : introduction → notifications → localisation → choisir un lieu → carte.
 * skipIntro : l'introduction a déjà été vue (il ne manque que le lieu).
 */
export default function FirstRun({ skipIntro = false, onDone }) {
  const [step, setStep] = useState(skipIntro ? "select" : "intro");
  const [gps, setGps] = useState(null);
  const markSeen = () => { try { localStorage.setItem("lk-onb-done", "1"); } catch {} };
  if (step === "intro") return <Intro onDone={() => { markSeen(); setStep("notif"); }} />;
  if (step === "notif") return <Notif onBack={() => setStep("intro")} onDone={() => setStep("loc")} />;
  if (step === "loc") return <Loc onBack={() => setStep("notif")} onDone={(p) => { setGps(p); setStep("select"); }} />;
  return <SelectLocation gps={gps} onBack={skipIntro ? null : () => setStep("loc")} onPicked={() => onDone?.()} />;
}
