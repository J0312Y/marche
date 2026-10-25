import { setLanguage } from "../../utils/i18n";
import { useState, useEffect } from "react";
import Select from "../../components/Select";
import { useApp } from "../../context/AppContext";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import LocationPicker from "../../components/t/LocationPicker";
import { useLoad, useAction } from "../../hooks/useData";
import vendor from "../../services/vendorService";

// Champs réellement enregistrés par l'API (PUT /vendor/settings)
const FIELDS = ["name", "description", "phone", "email", "address", "city", "min_order", "eta_min", "eta_max"];
const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const ORDER = [1, 2, 3, 4, 5, 6, 0];
const hm = (t) => String(t || "").slice(0, 5);
const digits = (v, n = 9) => v.replace(/\D/g, "").slice(0, n);
const timeStyle = { flex: 1, minWidth: 0, height: 40, padding: "0 8px", borderRadius: 10, border: "1px solid var(--t-line)", background: "var(--card)", color: "var(--t-text)", fontFamily: "var(--t-font)", fontSize: 15 };

const Toggle = ({ title, sub, on, onClick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>{sub && <div className="t-sub" style={{ marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}</div>
    <button className={"t-toggle" + (on ? " on" : "")} onClick={onClick} aria-label={title} />
  </div>
);
const Field = ({ label, children, style }) => <div className="t-field" style={style}><label>{label}</label>{children}</div>;

/** Paramètres du commerce : fiche, ouverture, livraison, position, horaires, carte à tampons (GET/PUT /vendor/settings). */
function VSettingsScr({ onBack, go }) {
  const { setLang: ctxSetLang, lang: currentLang } = useApp();
  const [lang, setLang] = useState(currentLang || "fr");
  const { data, loading, error } = useLoad(() => vendor.getSettings());
  const { run, loading: saving } = useAction();
  const estab = data?.establishment || null;

  const [form, setForm] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [freeDel, setFreeDel] = useState(false);
  const [hours, setHours] = useState([]);
  const [card, setCard] = useState({ is_active: false, min_spend: "5000", punches_required: "5", reward_amount: "2000" });
  const [pos, setPos] = useState(null);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    if (!estab) return;
    setForm(Object.fromEntries(FIELDS.map((k) => [k, estab[k] == null ? "" : String(estab[k])])));
    setIsOpen(String(estab.is_open) !== "0");
    setFreeDel(String(estab.free_delivery) === "1");
    if (estab.latitude && estab.longitude) setPos({ lat: Number(estab.latitude), lng: Number(estab.longitude) });
    const h = data?.hours || [];
    setHours(ORDER.map((d) => { const x = h.find((r) => Number(r.day) === d); return { day: d, open_time: x ? hm(x.open_time) : "08:00", close_time: x ? hm(x.close_time) : "20:00", is_closed: x ? Number(x.is_closed) === 1 : false }; }));
    const pc = data?.punch_card;
    if (pc) setCard({ is_active: Number(pc.is_active) === 1, min_spend: String(pc.min_spend), punches_required: String(pc.punches_required), reward_amount: String(pc.reward_amount) });
  }, [estab]);

  const setDay = (d, patch) => setHours((hs) => hs.map((h) => (h.day === d ? { ...h, ...patch } : h)));
  const set = (k, fn = (v) => v) => (e) => setForm((f) => ({ ...f, [k]: fn(e.target.value) }));

  const save = async () => {
    if (!form.name.trim()) { toast.error("Le nom du commerce est requis"); return; }
    try {
      await run(() => vendor.updateSettings({
        ...form,
        name: form.name.trim(),
        min_order: parseInt(form.min_order) || 0,
        eta_min: parseInt(form.eta_min) || 30,
        eta_max: parseInt(form.eta_max) || 45,
        is_open: isOpen ? 1 : 0,
        free_delivery: freeDel ? 1 : 0,
        ...(pos ? { latitude: pos.lat, longitude: pos.lng } : {}),
        hours: hours.map((h) => ({ day: h.day, open_time: h.open_time, close_time: h.close_time, is_closed: h.is_closed ? 1 : 0 })),
        punch_card: { is_active: card.is_active ? 1 : 0, min_spend: parseInt(card.min_spend) || 5000, punches_required: parseInt(card.punches_required) || 5, reward_amount: parseInt(card.reward_amount) || 2000 },
      }));
    } catch (err) { toast.error(err.message || "Erreur lors de l'enregistrement"); return; }
    toast.success("Paramètres enregistrés");
  };

  if (picking) return <LocationPicker initial={pos} title="Position du commerce" here="Les livreurs viendront ici" hint="Placez l'épingle sur l'entrée de votre commerce." cta="Enregistrer cette position"
    onClose={() => setPicking(false)} onConfirm={(p) => { setPos({ lat: p.lat, lng: p.lng }); setPicking(false); toast.success("Position choisie — pensez à enregistrer"); }} />;

  return (
    <div className="t-scr gray" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="t-head">
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
        <h1>Paramètres du commerce</h1>
      </div>

      <div style={{ flex: 1 }}>
        {loading && <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div className="spinner" /></div>}
        {error && <div className="t-card tk-box t-sub">{error}</div>}

        {form && <>
          {estab?.status && estab.status !== "active" && <div className="tk-note" style={{ margin: "12px 16px 0" }}><Icon name="info" size={16} />{estab.status === "pending" ? "En attente de validation par l'équipe Lamuka." : "Statut : " + estab.status}</div>}

          <div className="tk-h" style={{ margin: "18px 16px 0" }}>Votre commerce</div>
          <div className="t-card tk-box">
            <Field label="Nom du commerce"><input className="t-input" value={form.name} onChange={set("name")} maxLength={100} /></Field>
            <Field label="Description"><textarea className="t-input" rows={3} style={{ height: "auto", padding: "12px 14px", resize: "none", lineHeight: 1.4 }} value={form.description} onChange={set("description")} placeholder="Vos spécialités, vos produits phares…" /></Field>
            <div className="tk-two">
              <Field label="Téléphone"><input className="t-input" value={form.phone} onChange={set("phone")} type="tel" placeholder="+242 06…" /></Field>
              <Field label="Email"><input className="t-input" value={form.email} onChange={set("email")} type="email" placeholder="Facultatif" /></Field>
            </div>
            <div className="tk-two">
              <Field label="Adresse" style={{ marginBottom: 0 }}><input className="t-input" value={form.address} onChange={set("address")} placeholder="Quartier, rue, repère" /></Field>
              <Field label="Ville" style={{ marginBottom: 0 }}><input className="t-input" value={form.city} onChange={set("city")} placeholder="Brazzaville" /></Field>
            </div>
          </div>

          <div className="tk-h" style={{ margin: "18px 16px 0" }}>Commandes et livraison</div>
          <div className="t-card tk-box" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Toggle title={isOpen ? "Commerce ouvert" : "Commerce fermé"} sub={isOpen ? "Les clients peuvent commander." : "Les commandes sont suspendues."} on={isOpen} onClick={() => setIsOpen(!isOpen)} />
            <div style={{ borderTop: "1px solid var(--t-line)" }} />
            <Toggle title="Livraison offerte" sub={freeDel ? "Vos clients ne paient pas la livraison : le livreur est payé sur vos revenus." : "Activez-la pour afficher « Livraison offerte » sur votre commerce."} on={freeDel} onClick={() => setFreeDel(!freeDel)} />
            <div style={{ borderTop: "1px solid var(--t-line)" }} />
            <div>
              <div className="tk-two">
                <Field label="Délai min. (min)" style={{ marginBottom: 0 }}><input className="t-input" inputMode="numeric" value={form.eta_min} onChange={set("eta_min", (v) => digits(v, 3))} placeholder="30" /></Field>
                <Field label="Délai max. (min)" style={{ marginBottom: 0 }}><input className="t-input" inputMode="numeric" value={form.eta_max} onChange={set("eta_max", (v) => digits(v, 3))} placeholder="45" /></Field>
              </div>
              <div className="t-mut" style={{ marginTop: 6 }}>Affiché aux clients : « {form.eta_min || 30} - {form.eta_max || 45} min ».</div>
            </div>
            <Field label="Commande minimum (FCFA)" style={{ marginBottom: 0 }}><input className="t-input" inputMode="numeric" value={form.min_order} onChange={set("min_order", digits)} placeholder="0 = pas de minimum" /></Field>
          </div>

          <div className="tk-h" style={{ margin: "18px 16px 0" }}>Position pour les livreurs</div>
          <div className="t-card tk-box" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="tk-kind"><Icon name="map_pin" size={20} color="var(--acc)" /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{pos ? "Position enregistrée" : "Position non renseignée"}</div>
              <div className="t-sub">{pos ? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : "Frais de livraison forfaitaires en attendant."}</div>
            </div>
            <button className="t-pill-btn" style={{ height: 36 }} onClick={() => setPicking(true)}>{pos ? "Modifier" : "Placer"}</button>
          </div>

          <div className="tk-h" style={{ margin: "18px 16px 0" }}>Horaires d'ouverture</div>
          <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
            {hours.map((h, i) => (
              <div key={h.day} style={{ padding: "12px 0", borderTop: i ? "1px solid var(--t-line)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{DAYS[h.day]}</span>
                  <span className="t-sub">{h.is_closed ? "Fermé" : "Ouvert"}</span>
                  <button className={"t-toggle" + (!h.is_closed ? " on" : "")} onClick={() => setDay(h.day, { is_closed: !h.is_closed })} aria-label={h.is_closed ? `Ouvrir le ${DAYS[h.day]}` : `Fermer le ${DAYS[h.day]}`} />
                </div>
                {!h.is_closed && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <input type="time" value={h.open_time} onChange={(e) => setDay(h.day, { open_time: e.target.value })} style={timeStyle} aria-label={`Ouverture ${DAYS[h.day]}`} />
                  <span className="t-mut">à</span>
                  <input type="time" value={h.close_time} onChange={(e) => setDay(h.day, { close_time: e.target.value })} style={timeStyle} aria-label={`Fermeture ${DAYS[h.day]}`} />
                </div>}
              </div>
            ))}
          </div>
          <div className="t-mut" style={{ margin: "-4px 16px 0" }}>En dehors de ces horaires, les clients peuvent programmer leur commande.</div>

          <div className="tk-h" style={{ margin: "18px 16px 0" }}>Carte à tampons</div>
          <div className="t-card tk-box">
            <Toggle title="Fidéliser mes clients" sub="Une réduction offerte quand la carte est pleine." on={card.is_active} onClick={() => setCard((c) => ({ ...c, is_active: !c.is_active }))} />
            {card.is_active && <div style={{ marginTop: 14 }}>
              <div className="tk-two">
                <Field label="Achat minimum (F)"><input className="t-input" inputMode="numeric" value={card.min_spend} onChange={(e) => setCard((c) => ({ ...c, min_spend: digits(e.target.value, 7) }))} /></Field>
                <Field label="Tampons"><input className="t-input" inputMode="numeric" value={card.punches_required} onChange={(e) => setCard((c) => ({ ...c, punches_required: digits(e.target.value, 2) }))} /></Field>
              </div>
              <Field label="Réduction offerte (F)" style={{ marginBottom: 0 }}><input className="t-input" inputMode="numeric" value={card.reward_amount} onChange={(e) => setCard((c) => ({ ...c, reward_amount: digits(e.target.value, 6) }))} /></Field>
              <div className="tk-note">« Dépensez {parseInt(card.min_spend) || 0} F, gagnez un tampon. {parseInt(card.punches_required) || 0} tampons = {parseInt(card.reward_amount) || 0} F offerts. »</div>
            </div>}
          </div>
        </>}

        <div className="tk-h" style={{ margin: "18px 16px 0" }}>Général</div>
        <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          <div className="t-li" style={{ cursor: "default" }}>
            <span className="ic"><Icon name="globe" size={20} /></span><span>Langue</span>
            <Select value={lang} onChange={(v) => { setLang(v); setLanguage(v); ctxSetLang(v); }} options={[{ value: "fr", label: "Français" }, { value: "en", label: "English" }, { value: "ln", label: "Lingala" }]} />
          </div>
          <button className="t-li" onClick={() => go("terms")}><span className="ic"><Icon name="document" size={20} /></span><span>Conditions générales</span><Icon name="chevron_right" size={20} color="var(--t-mut)" /></button>
          <button className="t-li" onClick={() => go("privacy")}><span className="ic"><Icon name="key" size={20} /></span><span>Confidentialité</span><Icon name="chevron_right" size={20} color="var(--t-mut)" /></button>
        </div>
        <div style={{ height: 20 }} />
      </div>

      {form && <div style={{ padding: "12px 16px", background: "var(--card)", borderTop: "1px solid var(--t-line)", position: "sticky", bottom: 0 }}>
        <button className="t-cta center" style={{ width: "100%" }} onClick={save} disabled={saving}><span>{saving ? "Enregistrement…" : "Enregistrer"}</span></button>
      </div>}
    </div>
  );
}

export default VSettingsScr;
