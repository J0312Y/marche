import { useCallback, useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { RouteMap } from "../../components/t/Route";
import MapScreen from "../../components/t/MapScreen";
import Sheet from "../../components/t/Sheet";
import { StoreLogo } from "../../components/t/StoreCard";
import { useApp } from "../../context/AppContext";
import { order as orderSvc } from "../../services";
import { fmt } from "../../utils/helpers";
import { optionsLabel } from "../../utils/cartMath";
import CONTACT, { whatsappLink } from "../../config/contact";
import { openDocument } from "../../utils/documents";

// Étapes visibles par le client (comme Toters : reçue → préparation → en route → livrée)
const STAGES = [
  { k: "received", t: "Commande reçue", s: "En attente de confirmation par la boutique", icon: "receipt" },
  { k: "preparing", t: "En préparation", s: "La boutique prépare votre commande", icon: "utensils" },
  { k: "onway", t: "En route", s: "Votre livreur arrive", icon: "bike" },
  { k: "delivered", t: "Livrée", s: "Bon appétit !", icon: "check_circle" },
];
const stageOf = (st) => ({ pending: 0, confirmed: 1, preparing: 1, ready: 1, assigned: 1, picked_up: 2, delivering: 2, delivered: 3 })[st] ?? 0;
const parseOpts = (o) => { try { return typeof o === "string" ? JSON.parse(o) : o || []; } catch { return []; } };
const hm = (d) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const km = (p, q) => { const R = 6371, a = (q.lat - p.lat) * Math.PI / 180, b = (q.lng - p.lng) * Math.PI / 180; const x = Math.sin(a / 2) ** 2 + Math.cos(p.lat * Math.PI / 180) * Math.cos(q.lat * Math.PI / 180) * Math.sin(b / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };

/**
 * Suivi de commande « Toters » : statut en grand, heure estimée, progression, livreur, code, détail.
 */
export default function TrackingScr({ onBack, go, orderId }) {
  const { showToast } = useApp();
  const [data, setData] = useState(null);
  const [err, setErr] = useState(false);
  const [cancelAsk, setCancelAsk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [road, setRoad] = useState(null); // itinéraire par la route (distance réelle)
  const [recenter, setRecenter] = useState(0);

  const load = useCallback(() => orderSvc.track(orderId).then((r) => { setData(r); setErr(false); }).catch(() => setErr(true)), [orderId]);
  useEffect(() => { if (!orderId) return; load(); const t = setInterval(load, 15000); return () => clearInterval(t); }, [orderId, load]);

  if (!data) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Suivi</h1></div>
      <div className="t-empty">{err ? <><b>Suivi indisponible</b><p>Vérifiez votre connexion.</p><button className="t-pill-btn" onClick={load}>Réessayer</button></> : <span className="spinner" style={{ borderColor: "var(--t-line)", borderTopColor: "var(--acc)", width: 28, height: 28 }} />}</div>
    </div>
  );

  const o = data.order || {};
  const items = data.items || [];
  const d = data.delivery || {};
  const drv = data.driver;
  const cancelled = o.status === "cancelled" || o.status === "refunded";
  const stage = stageOf(o.status);
  const sched = o.scheduled_for ? new Date(String(o.scheduled_for).replace(" ", "T")) : null;
  const created = new Date(String(o.created_at).replace(" ", "T"));

  const pickup = o.establishment_lat ? { lat: +o.establishment_lat, lng: +o.establishment_lng } : null;
  const dest = o.delivery_lat ? { lat: +o.delivery_lat, lng: +o.delivery_lng } : null;
  const drvPos = drv?.current_lat ? { lat: +drv.current_lat, lng: +drv.current_lng } : null;
  // Heure estimée : programmée ; sinon temps de trajet par la route selon la circulation (calculé par le serveur :
  // vitesse mesurée sur les trajets des livreurs ou réglée dans le panneau, heures de pointe) ;
  // avant le retrait, on ajoute la préparation restante (au moins 10 min, et pas avant création + 45 min)
  const roadMin = road && !road.approx && road.eta_min ? road.eta_min : null;
  let eta = null;
  if (sched && stage < 2) eta = sched;
  else if (stage === 2 && drvPos && dest) {
    const min = roadMin ?? Math.round((km(drvPos, dest) * 1.3) / (road?.speed_kmh || 20) * 60);
    eta = new Date(Date.now() + Math.max(3, min) * 60000);
  }
  else if (stage < 3) eta = new Date(Math.max(Date.now() + (10 + (roadMin || 0)) * 60000, created.getTime() + 45 * 60000));

  const cancel = async () => {
    setBusy(true);
    try { await orderSvc.cancel(o.id, "Annulée par le client"); showToast("Commande annulée"); setCancelAsk(false); load(); }
    catch (e) { showToast(e.message || "Impossible d'annuler", "error"); }
    setBusy(false);
  };

  const helpLink = whatsappLink(`Bonjour, j'ai besoin d'aide pour ma commande ${o.ref}`);
  const drvName = drv ? [drv.first_name, drv.last_name].filter(Boolean).join(" ") : "";
  const chatDriver = () => go("chatDriver", { orderId: o.id, name: drvName, avatar: drv.avatar, phone: drv.phone });
  const chatVendor = () => go("chatVendor", { orderId: o.id, name: o.establishment_name, avatar: o.establishment_avatar });
  const etaTxt = eta ? hm(eta) : "—";
  const nItems = items.reduce((s, it) => s + (Number(it.quantity) || 1), 0);

  // Détail de la commande (articles, montants, adresse) : en bas du panneau sur la carte, ou dans la page
  const detail = (withStore) => (
    <div className="t-card" style={{ padding: 18 }}>
      {withStore && <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => go("vendor", { id: o.establishment_id, name: o.establishment_name })} role="button">
          <StoreLogo v={{ name: o.establishment_name, logo: o.establishment_avatar }} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontWeight: 700, fontSize: 16 }}>{o.establishment_name}</div><div className="t-mut">{created.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à {hm(created)}</div></div>
        </div>
        {!cancelled && <button className="t-round-btn" onClick={chatVendor} aria-label="Écrire au commerce"><Icon name="chat" size={20} /></button>}
      </div>}
      {!withStore && <div className="tk-h" style={{ marginBottom: 8 }}>Votre commande · {created.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à {hm(created)}</div>}
      {items.map((it) => {
        const ol = optionsLabel(parseOpts(it.options));
        return <div key={it.id} className="t-row" style={{ alignItems: "flex-start", gap: 10 }}>
          <span style={{ flex: 1 }}>{it.quantity} × {it.article_name}{ol && <span className="t-mut" style={{ display: "block" }}>{ol}</span>}</span>
          <span>{fmt(it.subtotal)}</span>
        </div>;
      })}
      <div style={{ borderTop: "1px solid var(--t-line)", margin: "10px 0" }} />
      <div className="t-row"><span className="t-sub">Sous-total</span><span>{fmt(o.subtotal)}</span></div>
      <div className="t-row"><span className="t-sub">Livraison</span>{Number(o.delivery_fee) > 0 ? <span>{fmt(o.delivery_fee)}</span> : <span style={{ color: "#16A34A", fontWeight: 600 }}>Offerte</span>}</div>
      {Number(o.discount) > 0 && <div className="t-row" style={{ color: "#16A34A" }}><span>Réductions</span><span>-{fmt(o.discount)}</span></div>}
      <div className="t-row" style={{ fontWeight: 700, fontSize: 18 }}><span>Total · espèces</span><span>{fmt(o.total)}</span></div>
      {o.delivery_address && <div className="t-row" style={{ alignItems: "flex-start", gap: 10, marginTop: 6 }}><span className="t-sub">Adresse</span><span style={{ textAlign: "right", whiteSpace: "normal" }}>{o.delivery_address}</span></div>}
      {Number(o.no_cutlery) === 1 && <div className="t-mut" style={{ marginTop: 4 }}>Sans couverts</div>}
      {o.note && <div className="t-mut" style={{ marginTop: 4 }}>Note : {o.note}</div>}
    </div>
  );
  const cancelBtn = o.status === "pending" && <div style={{ textAlign: "center", padding: "6px 0 10px" }}>
    <button className="t-pill-btn" style={{ color: "#DC2626", background: "none" }} onClick={() => setCancelAsk(true)}>Annuler la commande</button>
  </div>;
  const cancelSheet = cancelAsk && <Sheet onClose={() => !busy && setCancelAsk(false)}>
    <div style={{ padding: "10px 20px 22px" }}>
      <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Annuler la commande ?</div>
      <div className="t-sub" style={{ fontSize: 14, marginBottom: 18 }}>La boutique n'a pas encore accepté : vous pouvez annuler sans frais.</div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="t-cta ghost" onClick={() => setCancelAsk(false)} disabled={busy}>Garder</button>
        <button className="t-cta center" style={{ background: "#DC2626" }} onClick={cancel} disabled={busy}>{busy ? "…" : "Annuler"}</button>
      </div>
    </div>
  </Sheet>;

  // ── En cours, positions connues : carte plein écran + panneau (statut, livreur, commerce, code) ──
  if (!cancelled && stage < 3 && pickup && dest) return (
    <>
      <MapScreen
        map={(pad) => <RouteMap a={pickup} b={dest} me={stage >= 1 ? drvPos : null} meKind="driver" aLogo={o.establishment_avatar || undefined} next={stage >= 2 ? "b" : "a"}
          height="100%" interactive padTop={70} padBottom={pad + 24} recenter={recenter} routeLabel="total" onRoute={setRoad} />}
        top={<>
          <button className="tk-mapbtn" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={20} /></button>
          <span className="tm-chip">#{o.ref}</span>
          <span className="sp" />
          <button className="tk-mapbtn" onClick={() => setRecenter((n) => n + 1)} aria-label="Recentrer la carte"><Icon name="navigation" size={18} /></button>
          <a className="tk-mapbtn" href={helpLink} target="_blank" rel="noreferrer" aria-label="Aide"><Icon name="headphones" size={19} /></a>
        </>}
        peek={<>
          <div className="tm-card">
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>{etaTxt}</div>
              <div className="t-sub" style={{ fontSize: 14 }}>{sched && stage < 2 ? `livraison prévue ${sched.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}` : "arrivée estimée"}</div>
            </div>
            <div style={{ display: "flex", gap: 6, margin: "10px 0 10px" }}>
              {STAGES.map((s, i) => <div key={s.k} style={{ flex: 1, height: 5, borderRadius: 5, background: i <= stage ? "var(--acc)" : "var(--t-line)", position: "relative", overflow: "hidden" }}>
                {i === stage && <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)", animation: "sk-shimmer 1.6s ease-in-out infinite" }} />}
              </div>)}
            </div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{STAGES[stage].t}</div>
            <div className="t-sub" style={{ fontSize: 14 }}>{o.status === "assigned" ? "Un livreur va récupérer votre commande" : stage < 2 && !drv ? `${STAGES[stage].s} · recherche d'un livreur` : STAGES[stage].s}</div>
          </div>
          <div className="tm-card">
            {drv && <div className="tm-person">
              <div className="av">{drv.avatar ? <img src={drv.avatar} alt="" /> : (drv.first_name || "?")[0]}</div>
              <div className="nm"><b>{drvName}</b><small>Votre livreur{drv.vehicle_type ? ` · ${drv.vehicle_type}` : ""}{Number(drv.avg_rating) > 0 ? ` · ★ ${Number(drv.avg_rating).toFixed(1)}` : ""}</small></div>
              <div className="acts">
                <button className="t-round-btn" onClick={chatDriver} aria-label="Écrire au livreur"><Icon name="chat" size={20} /></button>
                {drv.phone && <a className="t-round-btn" href={`tel:${drv.phone}`} style={{ background: "var(--acc)", textDecoration: "none" }} aria-label="Appeler le livreur"><Icon name="phone" size={20} color="#fff" /></a>}
              </div>
            </div>}
            <div className="tm-person">
              <div className="av" onClick={() => go("vendor", { id: o.establishment_id, name: o.establishment_name })} role="button"><StoreLogo v={{ name: o.establishment_name, logo: o.establishment_avatar }} size={48} /></div>
              <div className="nm" onClick={() => go("vendor", { id: o.establishment_id, name: o.establishment_name })} role="button"><b>{o.establishment_name}</b><small>Commerce · {nItems} article{nItems > 1 ? "s" : ""} · {fmt(o.total)}</small></div>
              <div className="acts"><button className="t-round-btn" onClick={chatVendor} aria-label="Écrire au commerce"><Icon name="chat" size={20} /></button></div>
            </div>
            {d.delivery_code && <div className="tm-code"><Icon name="shield" size={20} color="var(--acc)" /><span>Code à donner au livreur</span><b>{d.delivery_code}</b></div>}
          </div>
        </>}
      >
        {detail(false)}
        {cancelBtn}
        <div className="t-mut" style={{ textAlign: "center", padding: "4px 20px 16px" }}>Besoin d'aide ? {CONTACT.phoneDisplay}</div>
      </MapScreen>
      {cancelSheet}
    </>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>#{o.ref}</h1>
        <a className="t-round-btn" href={helpLink} target="_blank" rel="noreferrer" aria-label="Aide" style={{ textDecoration: "none" }}><Icon name="headphones" size={20} /></a>
      </div>
      <div className="t-scr gray">
        {/* Statut */}
        <div className="t-card" style={{ padding: 20 }}>
          {cancelled ? <>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Commande annulée</div>
            <div className="t-sub" style={{ fontSize: 14, marginTop: 4 }}>{o.cancel_reason || "Cette commande a été annulée."}</div>
          </> : <>
            <div className="t-sub" style={{ fontSize: 14 }}>{stage === 3 ? "Livrée à" : sched && stage < 2 ? "Livraison prévue" : "Arrivée estimée"}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>
              {stage === 3 ? hm(new Date(String(o.delivered_at || o.updated_at).replace(" ", "T"))) : eta ? hm(eta) : "—"}
              {sched && stage < 2 && <span style={{ fontSize: 16, fontWeight: 600, color: "var(--t-sub)", marginLeft: 8 }}>{sched.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}</span>}
            </div>
            <div style={{ display: "flex", gap: 6, margin: "16px 0 14px" }}>
              {STAGES.map((s, i) => <div key={s.k} style={{ flex: 1, height: 6, borderRadius: 6, background: i <= stage ? "var(--acc)" : "var(--t-line)", position: "relative", overflow: "hidden" }}>
                {i === stage && stage < 3 && <span style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent)", animation: "sk-shimmer 1.6s ease-in-out infinite" }} />}
              </div>)}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 44, height: 44, borderRadius: 14, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={STAGES[stage].icon} size={22} color="var(--acc)" /></span>
              <div><div style={{ fontSize: 18, fontWeight: 700 }}>{STAGES[stage].t}</div><div className="t-sub" style={{ fontSize: 14 }}>{o.status === "assigned" ? "Un livreur va récupérer votre commande" : STAGES[stage].s}</div></div>
            </div>
          </>}
        </div>

        {/* Code de livraison */}
        {!cancelled && stage < 3 && d.delivery_code && <div className="t-card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <Icon name="shield" size={26} color="var(--acc)" />
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 16 }}>Code de livraison</div><div className="t-sub" style={{ fontSize: 13 }}>Donnez-le au livreur à la réception</div></div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3, color: "var(--acc)" }}>{d.delivery_code}</div>
        </div>}

        {/* Livreur */}
        {drv && stage < 3 && !cancelled && <div className="t-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, overflow: "hidden", background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--acc)", fontSize: 18 }}>{drv.avatar ? <img src={drv.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (drv.first_name || "?")[0]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{[drv.first_name, drv.last_name].filter(Boolean).join(" ")}</div>
            <div className="t-mut">Votre livreur{drv.vehicle_type ? ` · ${drv.vehicle_type}` : ""}{Number(drv.avg_rating) > 0 ? ` · ★ ${Number(drv.avg_rating).toFixed(1)}` : ""}</div>
          </div>
          <button className="t-round-btn" onClick={() => go("chatDriver", { orderId: o.id, name: [drv.first_name, drv.last_name].filter(Boolean).join(" "), avatar: drv.avatar, phone: drv.phone })} aria-label="Message"><Icon name="chat" size={20} /></button>
          {drv.phone && <a className="t-round-btn" href={`tel:${drv.phone}`} style={{ background: "var(--acc)", textDecoration: "none" }} aria-label="Appeler"><Icon name="phone" size={20} color="#fff" /></a>}
        </div>}

        {detail(true)}

        {(o.invoice || o.receipt) && <div style={{ padding: "0 16px 8px" }}>
          {/* Facture PDF (numéro FAC-…) téléchargée dans le téléphone ; reçu HTML pour les anciens serveurs */}
          <button className="t-cta ghost" style={{ width: "100%", height: 50 }} onClick={() => openDocument(o.invoice || o.receipt)}><Icon name="document" size={18} /><span>{o.invoice ? `Télécharger la facture ${o.invoice.number || ""}`.trim() : "Voir le reçu (PDF)"}</span></button>
        </div>}
        {stage === 3 && drv && <div style={{ padding: "4px 16px 8px" }}>
          <button className="t-cta center" style={{ width: "100%", height: 50 }} onClick={() => go("rateDriver", { name: [drv.first_name, drv.last_name].filter(Boolean).join(" "), deliveryId: d.id, orderId: o.id, rating: 0 })}><span>Noter le livreur</span></button>
        </div>}
        {cancelBtn}
        <div className="t-mut" style={{ textAlign: "center", padding: "4px 20px 30px" }}>Besoin d'aide ? {CONTACT.phoneDisplay}</div>
      </div>

      {cancelSheet}
    </div>
  );
}
