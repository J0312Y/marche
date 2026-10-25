import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/Icon";
import Sheet from "../../components/t/Sheet";
import LocationPicker from "../../components/t/LocationPicker";
import AddressForm from "../../components/t/AddressForm";
import { zoneOf, getDeliverTo, setDeliverTo, outOfZoneText } from "../../utils/zone";
import { StoreLogo } from "../../components/t/StoreCard";
import { useApp } from "../../context/AppContext";
import { useData } from "../../hooks";
import { addressesAPI, establishmentsAPI, errandsAPI } from "../../api";
import { order as orderService, buyer as buyerSvc } from "../../services";
import { fmt } from "../../utils/helpers";
import { cartSubtotal, couponDiscount, lineQty, lineTotal, optionsLabel } from "../../utils/cartMath";
import { parseDate, toApiDate, etaLabel } from "../../utils/storeStatus";
import { NO_CUTLERY_KEY } from "./CartScr";
import { useAppInfo, loyaltyRules } from "../../config/appInfo";

const DAYS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const pad = (n) => String(n).padStart(2, "0");

/** Créneaux de 30 min sur 7 jours, dans les horaires de la boutique (à partir de maintenant + 45 min) */
function buildSlots(hours) {
  const out = [];
  const start = new Date(Date.now() + 45 * 60000);
  for (let d = 0; d < 7; d++) {
    const day = new Date(); day.setDate(day.getDate() + d); day.setHours(0, 0, 0, 0);
    const h = hours.find((x) => Number(x.day) === day.getDay());
    let open = 8 * 60, close = 21 * 60;
    if (hours.length) {
      if (!h || Number(h.is_closed)) continue;
      const [oh, om] = String(h.open_time).split(":").map(Number);
      const [ch, cm] = String(h.close_time).split(":").map(Number);
      open = oh * 60 + om; close = ch * 60 + cm; if (close <= open) close = 24 * 60 - 30;
    }
    const times = [];
    for (let m = Math.ceil(open / 30) * 30 + 30; m <= close - 15; m += 30) {
      const t = new Date(day); t.setMinutes(m);
      if (t >= start) times.push(t);
    }
    if (times.length) out.push({ day, times });
  }
  return out;
}
const dayLabel = (d) => {
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const diff = Math.round((d - t) / 86400000);
  return diff === 0 ? "Aujourd'hui" : diff === 1 ? "Demain" : `${DAYS[d.getDay()]} ${d.getDate()}`;
};
const timeLabel = (t) => `${pad(t.getHours())}:${pad(t.getMinutes())}`;

/**
 * Paiement « Toters » sur une seule page : adresse, heure (maintenant / programmée), espèces,
 * consigne au livreur, récapitulatif avec les vrais frais de livraison, puis confirmation.
 */
// Bloc de la page de paiement — déclaré hors du composant : sinon il est recréé à chaque frappe
// et la note pour le livreur perd la saisie après chaque lettre.
const Section = ({ icon, title, children, action, onClick }) => (
  <div className="t-card" style={{ padding: 18, margin: "12px 16px" }} onClick={onClick} role={onClick ? "button" : undefined}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: children ? 12 : 0 }}>
      <Icon name={icon} size={22} color="var(--acc)" />
      <span style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>{title}</span>
      {action}
    </div>
    {children}
  </div>
);

export default function CheckoutScr({ onBack, cart: cartProp = [], eidParam, clearCart, appliedCoupon, setAppliedCoupon, go, goHome }) { // eslint-disable-line no-unused-vars
  const { showToast, reloadCart } = useApp();
  const { VENDORS } = useData();
  const [cartSnap, setCartSnap] = useState(null); // panier figé après la commande
  const cart = cartSnap || cartProp;
  const eid = Number(cart[0]?.establishment_id) || null;
  const vendor = VENDORS.find((v) => Number(v.id) === eid) || { id: eid, name: cart[0]?.establishment_name };

  const [store, setStore] = useState(null);
  const [hours, setHours] = useState([]);
  const [addrs, setAddrs] = useState(null);
  const [addrId, setAddrId] = useState(null);
  const [addrSheet, setAddrSheet] = useState(false);
  const [pick, setPick] = useState(null); // { start, fixId } : carte ouverte (nouvelle adresse ou adresse à replacer)
  const [spot, setSpot] = useState(null); // lieu choisi → détails de l'adresse
  const [when, setWhen] = useState("now"); // now | later
  const [slot, setSlot] = useState(null);
  const [slotSheet, setSlotSheet] = useState(false);
  const [dayIdx, setDayIdx] = useState(0);
  const [note, setNote] = useState("");
  const [fee, setFee] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // { id, ref, total }
  const [points, setPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const info = useAppInfo();
  const minPts = loyaltyRules(info).min; // seuil réglé dans le panneau
  const canUsePts = minPts != null && points >= minPts;
  const baseFee = Number(info?.delivery?.base_fee) || null; // frais de base (repli sans position)
  // « Pas de couverts » se choisit dans le panier (comme Toters) ; repris ici pour la commande
  const [noCutlery] = useState(() => { try { return sessionStorage.getItem(NO_CUTLERY_KEY) === "1"; } catch { return false; } });

  useEffect(() => {
    if (!eid) return;
    establishmentsAPI.getDetail(eid).then((r) => { setStore(r?.establishment || null); setHours(r?.hours || []); }).catch(() => {});
  }, [eid]);
  useEffect(() => { buyerSvc.getLoyalty().then((r) => setPoints(Number(r?.points) || 0)).catch(() => {}); }, []);
  useEffect(() => {
    addressesAPI.getAll().then((r) => {
      const list = Array.isArray(r) ? r : r?.addresses || [];
      setAddrs(list);
      const dt = getDeliverTo();
      const d = (dt?.addressId && list.find((a) => Number(a.id) === Number(dt.addressId))) || list.find((a) => Number(a.is_default) === 1) || list[0];
      if (d) setAddrId(Number(d.id));
      else if (dt?.lat && zoneOf(Number(dt.lat), Number(dt.lng))) setSpot({ lat: Number(dt.lat), lng: Number(dt.lng), quarter: dt.quarter, zone: zoneOf(Number(dt.lat), Number(dt.lng)) }); // lieu choisi en invité → détails
      else setPick({ start: dt || null });
    }).catch(() => setAddrs([]));
  }, []);

  const closed = store && store.is_open_now === false;
  const slots = useMemo(() => buildSlots(hours), [hours]);
  useEffect(() => { // boutique fermée → commande programmée obligatoire, premier créneau proposé
    if (!closed || slot) return;
    setWhen("later");
    const opens = parseDate(store?.opens_at);
    const first = slots.flatMap((s) => s.times).find((t) => !opens || t >= opens);
    if (first) setSlot(first);
  }, [closed, slots]); // eslint-disable-line react-hooks/exhaustive-deps

  const addr = addrs?.find((a) => Number(a.id) === addrId);
  const addrOk = addr && addr.latitude && zoneOf(Number(addr.latitude), Number(addr.longitude));
  const reloadAddrs = async (selectId) => {
    const list = await addressesAPI.getAll();
    setAddrs(Array.isArray(list) ? list : list?.addresses || []);
    if (selectId) setAddrId(Number(selectId));
  };
  // Frais réels : même calcul que le serveur (distance boutique → adresse et frais de la ville) ; frais de base sans position
  // Livraison offerte par la boutique : 0 F pour le client (le serveur applique la même règle)
  const freeDel = String(store?.free_delivery) === "1";
  useEffect(() => {
    if (!store) return;
    if (freeDel) { setFee(0); return; }
    const ok = addr?.latitude && addr?.longitude && store.latitude && store.longitude;
    if (!ok) { setFee(baseFee); return; }
    errandsAPI.quote({ pickup_lat: store.latitude, pickup_lng: store.longitude, dropoff_lat: addr.latitude, dropoff_lng: addr.longitude })
      .then((r) => setFee(Number(r?.fee) || baseFee)).catch(() => setFee(baseFee));
  }, [store, addr, freeDel, baseFee]);

  const subtotal = cartSubtotal(cart);
  const discount = couponDiscount(appliedCoupon, subtotal);
  const reward = store?.punch_card?.rewards_available > 0 ? Math.min(store.punch_card.reward_amount, subtotal - discount) : 0;
  const pointsOff = usePoints && canUsePts ? Math.min(points, Math.max(0, subtotal - discount - reward)) : 0;
  const total = Math.max(0, subtotal - discount - reward - pointsOff) + (fee || 0);


  const place = async () => {
    if (!addrId) { setAddrSheet(true); return; }
    if (!addrOk) { setPick({ start: addr?.latitude ? { lat: Number(addr.latitude), lng: Number(addr.longitude) } : null, fixId: addrId }); return; }
    if (when === "later" && !slot) { setSlotSheet(true); return; }
    setBusy(true);
    try {
      const r = await orderService.create({
        payment_method: "cash",
        address_id: addrId,
        coupon_code: appliedCoupon?.code || undefined,
        note: note.trim() || undefined,
        scheduled_for: when === "later" && slot ? toApiDate(slot) : undefined,
        no_cutlery: noCutlery || undefined,
        use_points: pointsOff > 0 || undefined,
        establishment_id: eid || undefined, // seul le panier de cette boutique est commandé ; les autres restent
      });
      const id = r?.order_ids?.[0];
      let ref = "", realTotal = total;
      try { const d = await orderService.getDetail(id); ref = d?.order?.ref || ""; realTotal = Number(d?.order?.total) || total; } catch {}
      setCartSnap(cartProp);
      setDone({ id, ref, total: realTotal });
      setAppliedCoupon?.(null);
      try { sessionStorage.removeItem(NO_CUTLERY_KEY); } catch {}
      await reloadCart(); // le serveur n'a retiré que les articles de cette boutique
    } catch (e) {
      showToast(e.message || "Erreur lors de la commande", "error");
      reloadCart();
    }
    setBusy(false);
  };

  if (done) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card)" }}>
      <div className="t-empty" style={{ flex: 1 }}>
        <div className="ic" style={{ background: "var(--acc-l)", width: 110, height: 110, borderRadius: 55 }}><Icon name="check" size={56} color="var(--acc)" strokeWidth={3} /></div>
        <b style={{ fontSize: 20 }}>Commande confirmée !</b>
        <p>{when === "later" && slot ? `Livraison prévue ${dayLabel(new Date(slot.getFullYear(), slot.getMonth(), slot.getDate())).toLowerCase()} à ${timeLabel(slot)}.` : `${vendor.name} prépare votre commande.`}<br />Préparez <b style={{ color: "var(--t-text)" }}>{fmt(done.total)}</b> en espèces pour le livreur.</p>
        {done.ref && <div style={{ marginTop: 6, padding: "8px 16px", borderRadius: 12, background: "var(--t-bg2)", fontWeight: 700, fontSize: 16, letterSpacing: 0.5 }}>#{done.ref}</div>}
      </div>
      <div className="t-bottom" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
        <button className="t-cta center" style={{ flex: "0 0 56px" }} onClick={() => go("tracking", { id: done.id })}>Suivre ma commande</button>
        <button className="t-cta ghost center" style={{ flex: "0 0 56px", justifyContent: "center" }} onClick={goHome}>Retour à l'accueil</button>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Paiement</h1></div>
      <div className="t-scr gray">
        <Section icon="map_pin" title="Adresse de livraison" action={<button className="t-pill-btn" onClick={() => setAddrSheet(true)}>{addr ? "Changer" : "Ajouter"}</button>}>
          {addr ? <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{addr.label || addr.quarter || "Adresse"}</div>
            <div className="t-sub" style={{ fontSize: 14, marginTop: 2 }}>{[addr.address, addr.quarter, addr.city].filter(Boolean).join(", ")}</div>
            {addr.instructions && <div className="t-mut" style={{ marginTop: 4 }}>Repère : {addr.instructions}</div>}
            {!addrOk && <div style={{ marginTop: 8, fontSize: 13, color: "#E5484D", fontWeight: 600 }}>{addr.latitude ? outOfZoneText() : "Placez cette adresse sur la carte pour commander."} <span style={{ color: "var(--acc)", cursor: "pointer" }} onClick={() => setPick({ start: addr.latitude ? { lat: Number(addr.latitude), lng: Number(addr.longitude) } : null, fixId: addr.id })}>Placer sur la carte</span></div>}
          </div> : <div className="t-sub">{addrs === null ? "Chargement…" : "Ajoutez l'adresse où livrer."}</div>}
        </Section>

        <Section icon="clock" title="Heure de livraison">
          <div style={{ display: "flex", gap: 10 }}>
            <button className={"t-chip" + (when === "now" ? " on" : "")} style={{ flex: 1, justifyContent: "center", opacity: closed ? 0.45 : 1 }} disabled={closed} onClick={() => setWhen("now")}>Dès que possible</button>
            <button className={"t-chip" + (when === "later" ? " on" : "")} style={{ flex: 1, justifyContent: "center" }} onClick={() => { setWhen("later"); setSlotSheet(true); }}>Programmer</button>
          </div>
          <div className="t-sub" style={{ marginTop: 10, fontSize: 14 }}>
            {when === "now" ? <>Livraison estimée : <b style={{ color: "var(--t-text)" }}>{etaLabel(vendor)}</b></>
              : slot ? <>Livraison prévue : <b style={{ color: "var(--t-text)" }}>{dayLabel(new Date(slot.getFullYear(), slot.getMonth(), slot.getDate()))} à {timeLabel(slot)}</b> · <span style={{ color: "var(--acc)", fontWeight: 700, cursor: "pointer" }} onClick={() => setSlotSheet(true)}>Modifier</span></>
              : "Choisissez un créneau"}
          </div>
          {closed && <div style={{ marginTop: 8, fontSize: 13, color: "#B45309" }}>{vendor.name} est fermé : votre commande sera préparée à l'heure choisie.</div>}
        </Section>

        <Section icon="cash" title="Paiement">
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 14, border: "1.5px solid var(--acc)", background: "var(--acc-l)" }}>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Espèces à la livraison</span>
            <span className="t-radio on" />
          </div>
        </Section>

        {points > 0 && <div className="t-card" style={{ padding: 18, margin: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="gift" size={22} color="var(--acc)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Utiliser mes points</div>
            <div className="t-sub" style={{ fontSize: 13 }}>{canUsePts ? `${points} points = ${fmt(points)} de réduction` : `${points} points${minPts ? ` · utilisables dès ${minPts}` : ""}`}</div>
          </div>
          <button className={"t-toggle" + (usePoints && canUsePts ? " on" : "")} disabled={!canUsePts} style={{ opacity: canUsePts ? 1 : 0.4 }} onClick={() => setUsePoints((x) => !x)} aria-label="Utiliser mes points" aria-pressed={usePoints} />
        </div>}

        <Section icon="tag" title={appliedCoupon ? `Code ${appliedCoupon.code} appliqué` : "Ajouter un code promo"} onClick={appliedCoupon ? undefined : () => go("coupons")}
          action={appliedCoupon ? <button className="t-pill-btn" onClick={() => setAppliedCoupon?.(null)}>Retirer</button> : <Icon name="chevron_right" size={20} color="var(--t-mut)" />} />


        <Section icon="chat" title="Note pour le livreur">
          <textarea className="t-note" style={{ minHeight: 76 }} maxLength={250} placeholder="Ex. : appelez en arrivant, portail bleu…" value={note} onChange={(e) => setNote(e.target.value)} />
        </Section>

        <div className="t-card" style={{ padding: 18, margin: "12px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <StoreLogo v={vendor} size={40} />
            <span style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>{vendor.name}</span>
          </div>
          {cart.map((c) => (
            <div key={c.id} className="t-row" style={{ alignItems: "flex-start", gap: 10 }}>
              <span style={{ flex: 1 }}>{lineQty(c)} × {c.name}{c.options?.length ? <span className="t-mut" style={{ display: "block" }}>{optionsLabel(c.options)}</span> : null}</span>
              <span>{fmt(lineTotal(c))}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--t-line)", margin: "10px 0" }} />
          <div className="t-row"><span className="t-sub">Sous-total</span><span>{fmt(subtotal)}</span></div>
          <div className="t-row"><span className="t-sub">Livraison</span><span style={freeDel ? { color: "#16A34A", fontWeight: 600 } : undefined}>{fee === null ? "…" : freeDel ? "Offerte" : fmt(fee)}</span></div>
          {discount > 0 && <div className="t-row" style={{ color: "#16A34A" }}><span>Code {appliedCoupon.code}</span><span>-{fmt(discount)}</span></div>}
          {reward > 0 && <div className="t-row" style={{ color: "#16A34A" }}><span>Carte fidélité</span><span>-{fmt(reward)}</span></div>}
          {pointsOff > 0 && <div className="t-row" style={{ color: "#16A34A" }}><span>Points ({pointsOff})</span><span>-{fmt(pointsOff)}</span></div>}
          {noCutlery && <div className="t-row"><span className="t-sub">Sans couverts</span><Icon name="check" size={18} color="#16A34A" /></div>}
          <div className="t-row" style={{ fontSize: 19, fontWeight: 700, marginTop: 6 }}><span>Total</span><span>{fmt(total)}</span></div>
        </div>
        <div style={{ height: 20 }} />
      </div>
      <div className="t-bottom">
        <button className="t-cta" disabled={busy || fee === null || !cart.length} onClick={place}>
          <span>{busy ? "Envoi…" : "Confirmer la commande"}</span><span>{fmt(total)}</span>
        </button>
      </div>

      {addrSheet && <Sheet onClose={() => addrs?.length && setAddrSheet(false)} title="Adresse de livraison">
        <div style={{ padding: "8px 20px 24px" }}>
          {addrs?.map((a) => (
            <div key={a.id} className="t-opt" onClick={() => { setAddrId(Number(a.id)); setAddrSheet(false); }} role="button" style={{ borderBottom: "1px solid var(--t-line)" }}>
              <Icon name="map_pin" size={20} color="var(--t-sub)" />
              <div className="l"><div style={{ fontWeight: 600 }}>{a.label || a.quarter}</div><small style={!(a.latitude && zoneOf(Number(a.latitude), Number(a.longitude))) ? { color: "#E5484D" } : undefined}>{a.latitude && zoneOf(Number(a.latitude), Number(a.longitude)) ? [a.address, a.quarter].filter(Boolean).join(", ") : a.latitude ? "Hors zone de livraison" : "À placer sur la carte"}</small></div>
              <span className={"t-radio" + (Number(a.id) === addrId ? " on" : "")} />
            </div>
          ))}
          <button className="t-opt" onClick={() => { setAddrSheet(false); setPick({ start: getDeliverTo() }); }} style={{ width: "100%", border: "none", background: "none", fontFamily: "inherit", textAlign: "left", padding: "14px 0" }}>
            <Icon name="plus" size={20} color="var(--acc)" /><div className="l"><div style={{ fontWeight: 600, color: "var(--acc)" }}>Ajouter une adresse</div><small>Choisir sur la carte</small></div>
          </button>
        </div>
      </Sheet>}

      {pick && <LocationPicker initial={pick.start} onClose={() => setPick(null)} onConfirm={async (p) => {
        if (pick.fixId) { // adresse existante replacée sur la carte
          try { await addressesAPI.update(pick.fixId, { latitude: p.lat, longitude: p.lng, quarter: p.quarter }); await reloadAddrs(pick.fixId); setPick(null); showToast("Adresse mise à jour"); }
          catch (e) { showToast(e.message || "Impossible de mettre à jour l'adresse", "error"); }
        } else { setPick(null); setSpot(p); }
      }} />}
      {spot && !pick && <AddressForm spot={spot} makeDefault={!addrs?.length} onClose={() => setSpot(null)} onMove={() => setPick({ start: spot })}
        onSaved={async (a) => { setSpot(null); setDeliverTo({ lat: a.latitude, lng: a.longitude, quarter: a.quarter, label: a.label, addressId: a.id }); await reloadAddrs(a.id); }} />}

      {slotSheet && <Sheet onClose={() => setSlotSheet(false)} title="Programmer la livraison">
        <div style={{ padding: "8px 0 20px" }}>
          {slots.length === 0 ? <div className="t-sub" style={{ padding: "8px 20px" }}>Aucun créneau disponible cette semaine.</div> : <>
            <div className="t-chips">
              {slots.map((s, i) => <button key={i} className={"t-chip" + (i === dayIdx ? " on" : "")} onClick={() => setDayIdx(i)}>{dayLabel(s.day)}</button>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "4px 20px", maxHeight: 280, overflowY: "auto" }}>
              {(slots[dayIdx] || slots[0]).times.map((t) => (
                <button key={t.getTime()} className={"t-chip" + (slot && slot.getTime() === t.getTime() ? " on" : "")} style={{ justifyContent: "center" }} onClick={() => { setSlot(t); setWhen("later"); setSlotSheet(false); }}>{timeLabel(t)}</button>
              ))}
            </div>
          </>}
        </div>
      </Sheet>}
    </div>
  );
}
