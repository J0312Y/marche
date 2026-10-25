import { useEffect, useState } from "react";
import toast from "../../utils/toast";
import Sheet from "../../components/t/Sheet";
import { RouteMap, fmtDistance } from "../../components/t/Route";
import MapScreen from "../../components/t/MapScreen";
import useDriverPosition from "../../hooks/useDriverPosition";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";
import { useAction } from "../../hooks/useData";
import driverService from "../../services/driverService";
import { whatsappLink } from "../../config/contact";

const tel = (p) => (p ? `tel:${String(p).replace(/\s/g, "")}` : null);

/**
 * Livraison en cours (livreur) : carte + itinéraire, étape courante (retrait puis livraison),
 * code de retrait vérifié par le serveur, encaissement en espèces, aide en cas de problème.
 */
function DrDeliveryScr({ delivery: rawDl, go, onBack }) {
  // L'API renvoie des champs à plat ou des objets imbriqués selon l'écran d'origine
  const dl = {
    ...rawDl,
    vendor: typeof rawDl.vendor === "object" && rawDl.vendor ? rawDl.vendor : {
      name: rawDl.vendor || rawDl.vendor_name || rawDl.establishment_name || "Commerce",
      phone: rawDl.vendor_phone || rawDl.establishment_phone || "",
    },
    client: typeof rawDl.client === "object" && rawDl.client ? rawDl.client : {
      name: rawDl.client || rawDl.client_name || rawDl.customer_name || "Client",
      addr: rawDl.client_addr || rawDl.dropoff_address || rawDl.delivery_address || rawDl.address || "",
      phone: rawDl.client_phone || rawDl.customer_phone || "",
      lat: rawDl.client_lat || rawDl.dropoff_lat || rawDl.delivery_lat || null,
      lng: rawDl.client_lng || rawDl.dropoff_lng || rawDl.delivery_lng || null,
    },
    payment: rawDl.payment || rawDl.payment_method || "cash",
    ref: rawDl.ref || rawDl.order_ref || rawDl.order_id || "—",
    items: rawDl.items || rawDl.order_items || [],
    // Gain du livreur (driver_earning) ; « fee » = frais payés par le client
    fee: parseFloat(rawDl.driver_earning || rawDl.fee || rawDl.delivery_fee || rawDl.driver_fee || 0),
    tip: parseFloat(rawDl.tip || rawDl.driver_tip || 0),
    total: parseFloat(rawDl.total || rawDl.order_total || rawDl.subtotal || rawDl.amount || 0),
    pickup: rawDl.pickup_address_text || rawDl.pickup_address || rawDl.establishment_address || rawDl.vendor_address || "",
    distance: rawDl.distance_km ? parseFloat(rawDl.distance_km).toFixed(1) + " km" : "",
    note: rawDl.note || rawDl.delivery_note || rawDl.customer_note || "",
  };
  const picked = ["active", "picked_up", "delivering"].includes(dl.status);
  // 0 : vers le commerce · 1 : au commerce (code de retrait) · 2 : vers le client
  const [step, setStep] = useState(picked ? 2 : 0);
  // Statut réel au retour sur l'écran (ex. après une discussion) : l'objet reçu peut être périmé
  useEffect(() => {
    let alive = true;
    driverService.getDashboard().then((r) => {
      const cur = (r?.active || []).find((x) => Number(x.id) === Number(dl.id));
      if (alive && cur && ["picked_up", "delivering"].includes(cur.status)) setStep(2);
    }).catch(() => {});
    return () => { alive = false; };
  }, [dl.id]);
  const { run, loading } = useAction();
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const [help, setHelp] = useState(false);

  const pickup = rawDl.pickup_lat && rawDl.pickup_lng ? { lat: parseFloat(rawDl.pickup_lat), lng: parseFloat(rawDl.pickup_lng) } : null;
  const client = dl.client?.lat && dl.client?.lng ? { lat: parseFloat(dl.client.lat), lng: parseFloat(dl.client.lng) } : null;
  const me = useDriverPosition(true);
  const target = step < 2 ? pickup : client;
  // Distance par la route jusqu'à la prochaine étape (depuis la position du livreur si connue)
  const [road, setRoad] = useState(null);
  const [recenter, setRecenter] = useState(0);
  const toNext = road && !road.approx && me && road.legs?.length ? fmtDistance(road.legs[0]) : step < 2 ? dl.distance : "";
  const cash = dl.payment === "cash";

  const next = async () => {
    if (step === 0) { setStep(1); return; }
    if (step === 1) {
      const c = code.trim();
      if (c.length !== 6) { setCodeErr("Entrez le code à 6 chiffres"); return; }
      try { await run(() => driverService.pickup(dl.id, c)); }
      catch (err) { setCodeErr(err.message || "Code de retrait invalide"); return; }
      toast.success("Commande récupérée");
      setStep(2);
      return;
    }
    go("drConfirm", dl);
  };
  const cta = ["Je suis au commerce", loading ? "Vérification…" : "Valider le retrait", "Je suis chez le client"][step];

  const who = step < 2
    ? { label: `Retrait · commande ${dl.ref}`, name: dl.vendor.name, sub: dl.pickup, phone: dl.vendor.phone, chat: () => go("drChatVendor", dl), icon: "store" }
    : { label: `Livraison · commande ${dl.ref}`, name: dl.client.name, sub: dl.client.addr, phone: dl.client.phone, chat: () => go("drChatClient", dl), icon: "user" };
  const openNav = () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${target.lat},${target.lng}&travelmode=driving`, "_blank");

  return (
    <>
    <MapScreen
      map={(pad) => <RouteMap a={pickup} b={client} me={me} next={step < 2 ? "a" : "b"} height="100%" interactive padTop={70} padBottom={pad + 24} recenter={recenter} routeLabel="next" alternatives onRoute={setRoad} />}
      top={<>
        <button onClick={onBack} className="tk-mapbtn" aria-label="Retour"><Icon name="arrow_left" size={20} /></button>
        <span className="tm-chip">{dl.ref}</span>
        <span className="sp" />
        <button className="tk-mapbtn" onClick={() => setRecenter((n) => n + 1)} aria-label="Recentrer la carte"><Icon name="navigation" size={18} /></button>
      </>}
      footer={<button className="t-cta center" disabled={loading} onClick={next}><span>{cta}</span></button>}
      peek={<>
        <div className="tm-card">
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {["Retrait", "Livraison"].map((l, i) => {
              const on = i === 0 ? true : step === 2;
              return <div key={l} style={{ flex: 1 }}>
                <div style={{ height: 4, borderRadius: 2, background: on ? "var(--acc)" : "var(--t-line)" }} />
                <div style={{ fontSize: 13, marginTop: 6, fontWeight: (i === 0) === (step < 2) ? 600 : 400, color: on ? "var(--t-text)" : "var(--t-sub)" }}>{l}</div>
              </div>;
            })}
          </div>
          <div className="t-sub" style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{who.label}</div>
          <div className="tm-person">
            <div className="av"><Icon name={who.icon} size={22} color="var(--acc)" /></div>
            <div className="nm"><b>{who.name}</b>{who.sub && <small>{who.sub}</small>}</div>
            <div className="acts">
              <button className="t-round-btn" onClick={who.chat} aria-label="Message"><Icon name="chat" size={20} /></button>
              {who.phone && <a className="t-round-btn" href={tel(who.phone)} style={{ background: "var(--acc)", textDecoration: "none" }} aria-label="Appeler"><Icon name="phone" size={20} color="#fff" /></a>}
            </div>
          </div>
          {target && <button className="t-cta ghost center" style={{ width: "100%", height: 44, marginTop: 12, fontSize: 15 }} onClick={openNav}>
            <Icon name="navigation" size={17} />{step < 2 ? "Y aller (commerce)" : "Y aller (client)"}{toNext ? " · " + String(toNext).replace(".", ",") : ""}
          </button>}
        </div>
        {step === 1 && <div className="tm-card">
          <div className="tk-h" style={{ marginBottom: 4 }}>Code de retrait</div>
          <div className="t-sub" style={{ fontSize: 14, marginBottom: 12 }}>Demandez au commerçant le code à 6 chiffres affiché sur la commande.</div>
          <input className="t-input" value={code} inputMode="numeric" maxLength={6} placeholder="••••••" autoFocus
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeErr(""); }}
            style={{ height: 56, fontSize: 24, fontWeight: 700, letterSpacing: 10, textAlign: "center", borderColor: codeErr ? "#E11D48" : undefined }} />
          {codeErr && <div style={{ color: "#E11D48", fontSize: 13, marginTop: 6 }}>{codeErr}</div>}
        </div>}

        {cash && <div className="tm-card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="cash" size={22} color="var(--acc)" /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>À encaisser auprès du client</div>
            <div className="t-sub" style={{ fontSize: 13 }}>Paiement en espèces à la livraison</div>
          </div>
          <b style={{ fontSize: 17 }}>{fmt(dl.total)}</b>
        </div>}
      </>}
    >
        <div className="t-card tk-box">
          {dl.items.length > 0 && <div className="tk-h" style={{ marginBottom: 6 }}>Commande</div>}
          {dl.items.map((it, i) => (
            <div key={i} className="t-row"><span>{it.quantity || it.qty || 1} × {it.name || it.article_name}</span></div>
          ))}
          {dl.note && <div className="tk-note" style={{ marginTop: 0, marginBottom: 10 }}><Icon name="info" size={16} color="var(--acc-d)" /><span>{dl.note}</span></div>}
          <div className="t-row" style={dl.items.length ? { borderTop: "1px solid var(--t-line)", marginTop: 8, paddingTop: 10 } : undefined}>
            <span className="t-sub">Votre gain</span><b>{fmt(dl.fee + dl.tip)}{dl.tip > 0 ? ` (dont ${fmt(dl.tip)} de pourboire)` : ""}</b>
          </div>
        </div>

        <button className="t-pill-btn" style={{ margin: "4px 16px 20px", height: 36 }} onClick={() => setHelp(true)}>Un problème ?</button>
    </MapScreen>

      {help && <Sheet onClose={() => setHelp(false)} title="Un problème ?">
        <div style={{ padding: "0 20px 24px" }}>
          <p className="t-sub" style={{ fontSize: 14, marginBottom: 8 }}>Client absent, adresse introuvable, commande incomplète : appelez d'abord, puis prévenez Lamuka si le problème persiste.</p>
          {dl.client.phone && <a className="t-li" href={tel(dl.client.phone)} style={{ textDecoration: "none" }}><span className="ic"><Icon name="phone" size={20} color="var(--acc)" /></span><span>Appeler le client</span></a>}
          {dl.vendor.phone && <a className="t-li" href={tel(dl.vendor.phone)} style={{ textDecoration: "none" }}><span className="ic"><Icon name="store" size={20} color="var(--acc)" /></span><span>Appeler le commerce</span></a>}
          <a className="t-li" href={whatsappLink(`Bonjour Lamuka, problème sur la livraison de la commande ${dl.ref}`)} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><span className="ic"><Icon name="chat" size={20} color="#16A34A" /></span><span>Prévenir le support Lamuka</span></a>
        </div>
      </Sheet>}
    </>
  );
}

export default DrDeliveryScr;
