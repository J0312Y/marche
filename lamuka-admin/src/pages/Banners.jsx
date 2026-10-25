import { useState } from "react";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import api from "../api";
import ART, { art3d } from "../../../src/config/art3d";
import { INTRO_ART, INTRO_LABELS } from "../../../src/config/introArt";
import { useLoad, useAction, PageHead, Card, Badge, Modal, Confirm, Btn, Field, ImagePick, num, dt } from "../ui";
import { TYPES } from "./Stores";

const FILTERS = { free: "Livraison gratuite", offers: "Promos", top: "Mieux notés", new: "Nouveaux" };
const SCREENS = { loyalty: "Mes points (fidélité)", promos: "Codes promo", coursier: "Coursier", vendorReg: "Devenir commerçant", driverReg: "Devenir livreur", reorder: "Commander à nouveau (dernier commerce)" };
const ACTIONS = { none: "Rien (information)", filter: "Filtrer les commerces", store: "Ouvrir un commerce", category: "Ouvrir une catégorie", vertical: "Ouvrir un type de commerce", screen: "Ouvrir un écran de l'app", url: "Ouvrir un lien web" };
const AUD = { all: "Tout le monde", guests: "Visiteurs non connectés", users: "Clients connectés", non_vendors: "Pas encore commerçants" };
const PRESETS = [["#0B6B57", "#00B492"], ["#3A2A1A", "#6B4423"], ["#5B3FD6", "#8B6CF0"], ["#E5484D", "#F5A524"], ["#0F2B25", "#1E4D42"], ["#B42318", "#E5484D"], ["#1D4ED8", "#60A5FA"], ["#9A5B13", "#F5A524"]];
// Tuiles : fond pastel + couleur du surlignage de la 2e ligne
const TILE_PRESETS = [["#E6F7F3", "#B9EBDD"], ["#FDECEC", "#F9C9CC"], ["#FFF3D6", "#FFE08A"], ["#EEEAFD", "#D4CBFA"], ["#E8F1FD", "#C3DAFA"], ["#F3EFE9", "#E2D6C3"]];
const ARTS = Object.keys(ART).filter((k) => /^[a-z]+$/.test(k)); // illustrations « univers » de l'app (courier, cash, gift…)

// Les trois emplacements gérés ici
const PLACES = {
  carousel: { tab: "Carrousel", one: "annonce", the: "L'annonce", add: "Nouvelle annonce", fem: true, help: "Les grandes bannières qui défilent sur l'accueil, toutes les 4 secondes." },
  tile: { tab: "Tuiles", one: "tuile", the: "La tuile", add: "Nouvelle tuile", fem: true, help: "Les petites cartes illustrées en haut de l'accueil (Promos du jour, Commandez à nouveau…)." },
  intro: { tab: "Introduction", one: "écran", the: "L'écran", add: "Nouvel écran", fem: false, help: "Les écrans qui défilent au tout premier lancement de l'app, avant le choix de l'adresse." },
};
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const done = (p, verb) => `${cap(p.one)} ${p.fem ? verb + "e" : verb}`; // « Annonce créée », « Écran créé »

const imgOf = (b) => (b.image?.startsWith("art:") ? art3d(b.image.slice(4)) : b.image?.startsWith("intro:") ? null : b.image);
const live = (b) => {
  const now = new Date();
  if (String(b.is_active) !== "1") return ["Désactivé", "mut"];
  if (b.starts_at && new Date(b.starts_at.replace(" ", "T")) > now) return ["Programmé", "info"];
  if (b.ends_at && new Date(b.ends_at.replace(" ", "T")) <= now) return ["Terminé", "mut"];
  return ["En ligne", "ok"];
};

/** Rendu identique à l'app : bannière du carrousel, tuile, écran d'introduction */
export function BannerPreview({ b }) {
  if (b.placement === "tile") return (
    <div className={"tile-prev" + (/\S{9,}/.test(`${b.title} ${b.subtitle || ""}`) ? " long" : "")} style={{ background: b.color_from }}>
      <b>{b.title}{b.subtitle && <><br /><span style={{ background: `linear-gradient(transparent 55%, ${b.color_to} 55%)` }}>{b.subtitle}</span></>}</b>
      {imgOf(b) && <img src={imgOf(b)} alt="" />}
      {b.tag && <span className="pct">{b.tag}</span>}
    </div>
  );
  if (b.placement === "intro") return (
    <div className="intro-prev">
      <h4>{b.title || "Titre de l'écran"}</h4>
      <p>{b.subtitle}</p>
      <div className="art">{b.image?.startsWith("intro:") ? INTRO_ART[b.image.slice(6)] : imgOf(b) && <img src={imgOf(b)} alt="" />}</div>
      <span className="cta">Commencer</span>
    </div>
  );
  if (b.style === "photo") return <div className="bn photo">{imgOf(b) ? <img className="full" src={imgOf(b)} alt="" /> : <span>Image 1200 × 480 à envoyer</span>}</div>;
  return (
    <div className="bn" style={{ background: `linear-gradient(120deg,${b.color_from},${b.color_to})` }}>
      <i>lamuka</i>
      {b.title && <b>{b.title}</b>}
      {b.subtitle && <span>{b.subtitle}</span>}
      {b.tag && <em style={{ color: b.color_from }}>{b.tag}</em>}
      {imgOf(b) && <img src={imgOf(b)} alt="" />}
    </div>
  );
}

function Edit({ banner, placement, onClose, onDone }) {
  const P = PLACES[placement];
  const tile = placement === "tile", intro = placement === "intro";
  const [f, setF] = useState({
    placement, title: banner?.title || "", subtitle: banner?.subtitle || "", tag: banner?.tag || "", style: banner?.style || "art",
    color_from: banner?.color_from || (tile ? TILE_PRESETS[0][0] : "#0B6B57"), color_to: banner?.color_to || (tile ? TILE_PRESETS[0][1] : "#00B492"),
    image: banner?.image || (intro ? "intro:food" : "art:gift"),
    action_type: banner?.action_type || "none", action_value: banner?.action_value || "", audience: banner?.audience || "all",
    starts_at: (banner?.starts_at || "").slice(0, 16).replace(" ", "T"), ends_at: (banner?.ends_at || "").slice(0, 16).replace(" ", "T"),
    is_active: banner ? String(banner.is_active) === "1" : true,
  });
  const [id, setId] = useState(banner?.id || null);
  const { run, busy } = useAction();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const [q, setQ] = useState("");
  const stores = useLoad(() => (f.action_type === "store" ? api.get("/admin/establishments", { status: "active", limit: 50, ...(q.trim() ? { search: q.trim() } : {}) }) : Promise.resolve(null)), [f.action_type, q]);
  const storeOpts = [...(stores.data?.establishments || [])];
  if (f.action_value && banner?.target_name && f.action_type === "store" && !storeOpts.some((e) => String(e.id) === String(f.action_value))) storeOpts.unshift({ id: f.action_value, name: banner.target_name });
  const cats = useLoad(() => (f.action_type === "category" ? api.get("/admin/categories") : Promise.resolve(null)), [f.action_type]);
  const builtIn = (v) => v?.startsWith("art:") || v?.startsWith("intro:");
  const body = () => ({ ...f, style: tile || intro ? "art" : f.style, image: builtIn(f.image) ? f.image : undefined, action_value: f.action_type === "none" ? "" : f.action_value, is_active: f.is_active ? 1 : 0 });
  const save = async () => {
    const r = await run(() => (id ? api.put(`/admin/banners/${id}`, body()) : api.post("/admin/banners", body())), done(P, id ? "enregistré" : "créé"));
    if (r) onDone();
  };
  const upload = async (file) => {
    let bid = id;
    if (!bid) { const r = await run(() => api.post("/admin/banners", { ...body(), is_active: 0 })); if (!r?.id) return; bid = r.id; setId(r.id); }
    else await run(() => api.put(`/admin/banners/${bid}`, { style: body().style }));
    const r = await run(() => api.upload(`/admin/banners/${bid}/image`, "image", file), "Image enregistrée");
    if (r?.url) setF((x) => ({ ...x, image: r.url }));
  };
  const valueField = {
    filter: <select value={f.action_value} onChange={set("action_value")}><option value="">Choisir…</option>{Object.entries(FILTERS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>,
    screen: <select value={f.action_value} onChange={set("action_value")}><option value="">Choisir…</option>{Object.entries(SCREENS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>,
    vertical: <select value={f.action_value} onChange={set("action_value")}><option value="">Choisir…</option>{Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>,
    store: <div className="pick-store"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un commerce…" />
      <select value={f.action_value} onChange={set("action_value")}><option value="">{stores.loading ? "Chargement…" : storeOpts.length ? "Choisir…" : "Aucun commerce actif trouvé"}</option>{storeOpts.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>,
    category: <select value={f.action_value} onChange={set("action_value")}><option value="">{cats.loading ? "Chargement…" : "Choisir…"}</option>{(Array.isArray(cats.data) ? cats.data : []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>,
    url: <input value={f.action_value} onChange={set("action_value")} placeholder="https://…" />,
  }[f.action_type];
  const artPicker = (
    <Field label="Illustration" hint="Une illustration de l'app, ou votre image (objet détouré, fond blanc ou transparent : le serveur la recadre).">
      {intro && <div className="arts intro">{Object.keys(INTRO_ART).map((k) => <button key={k} title={INTRO_LABELS[k]} className={f.image === "intro:" + k ? "on" : ""} onClick={() => setF({ ...f, image: "intro:" + k })}>{INTRO_ART[k]}</button>)}</div>}
      <div className="arts">{ARTS.map((k) => <button key={k} className={f.image === "art:" + k ? "on" : ""} onClick={() => setF({ ...f, image: "art:" + k })}><img src={art3d(k)} alt={k} /></button>)}</div>
    </Field>
  );
  const ownImg = f.image && !builtIn(f.image) ? f.image : null;
  return (
    <Modal title={id ? `Modifier ${tile ? "la tuile" : intro ? "l'écran" : "l'annonce"}` : P.add} onClose={onClose} footer={<><Btn kind="ghost" onClick={id && !banner ? onDone : onClose}>Annuler</Btn><Btn disabled={busy} onClick={save}>Enregistrer</Btn></>}>
      <div className="bn-stage"><BannerPreview b={f} /><small className="muted">Aperçu dans l'app</small></div>
      {tile ? <>
        <div className="form-grid">
          <Field label="1re ligne"><input value={f.title} maxLength={20} onChange={set("title")} placeholder="Ex. : Promos" /></Field>
          <Field label="2e ligne (surlignée)"><input value={f.subtitle} maxLength={20} onChange={set("subtitle")} placeholder="Ex. : du jour" /></Field>
        </div>
        <Field label="Pastille (facultatif)" hint="Petit rond rouge en bas à gauche : %, -20 %, NOUVEAU…"><input value={f.tag} maxLength={8} onChange={set("tag")} placeholder="%" /></Field>
        <Field label="Couleurs">
          <div className="swatches">{TILE_PRESETS.map(([a, b]) => <button key={a + b} title={`${a} / ${b}`} className={f.color_from === a && f.color_to === b ? "on" : ""} style={{ background: `linear-gradient(135deg,${a} 55%,${b} 55%)` }} onClick={() => setF({ ...f, color_from: a, color_to: b })} />)}
            <input type="color" value={f.color_from} onChange={set("color_from")} title="Fond" /><input type="color" value={f.color_to} onChange={set("color_to")} title="Surlignage" /></div>
        </Field>
        {artPicker}
        <ImagePick label="Ou votre image" shape="round" current={ownImg} busy={busy} onPick={upload} />
      </> : intro ? <>
        <Field label="Titre"><input value={f.title} maxLength={80} onChange={set("title")} placeholder="Ex. : Des restaurants jusqu'à votre porte" /></Field>
        <Field label="Texte"><textarea rows={3} value={f.subtitle} maxLength={140} onChange={set("subtitle")} placeholder="Une ou deux phrases." /></Field>
        {artPicker}
        <ImagePick label="Ou votre image" shape="round" current={ownImg} busy={busy} onPick={upload} />
      </> : <>
        <div className="seg">
          {[["art", "Couleur + texte + illustration"], ["photo", "Image complète"]].map(([k, l]) => <button key={k} className={f.style === k ? "on" : ""} onClick={() => setF({ ...f, style: k, image: k === "photo" ? (f.image?.startsWith("art:") ? "" : f.image) : f.image || "art:gift" })}>{l}</button>)}
        </div>
        {f.style === "art" ? <>
          <Field label="Titre"><input value={f.title} maxLength={80} onChange={set("title")} placeholder="Ex. : -20 % sur les pizzas" /></Field>
          <Field label="Texte"><input value={f.subtitle} maxLength={140} onChange={set("subtitle")} placeholder="Ex. : Ce week-end chez nos pizzerias partenaires." /></Field>
          <Field label="Étiquette"><input value={f.tag} maxLength={40} onChange={(e) => setF({ ...f, tag: e.target.value.toUpperCase() })} placeholder="Ex. : WEEK-END" /></Field>
          <Field label="Couleurs">
            <div className="swatches">{PRESETS.map(([a, b]) => <button key={a + b} title={`${a} → ${b}`} className={f.color_from === a && f.color_to === b ? "on" : ""} style={{ background: `linear-gradient(120deg,${a},${b})` }} onClick={() => setF({ ...f, color_from: a, color_to: b })} />)}
              <input type="color" value={f.color_from} onChange={set("color_from")} title="Couleur de gauche" /><input type="color" value={f.color_to} onChange={set("color_to")} title="Couleur de droite" /></div>
          </Field>
          {artPicker}
          <ImagePick label="Ou votre image" shape="round" current={ownImg} busy={busy} onPick={upload} />
        </> : <ImagePick label="Image de l'annonce" shape="wide" current={ownImg} busy={busy} onPick={upload}
            hint="Le texte doit être dans l'image. Format final 1200 × 480 (recadré au centre) : gardez l'essentiel au milieu." />}
      </>}
      {!intro && <div className="form-grid">
        <Field label={`Quand on touche ${tile ? "la tuile" : "l'annonce"}`}><select value={f.action_type} onChange={(e) => setF({ ...f, action_type: e.target.value, action_value: "" })}>{Object.entries(ACTIONS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        {valueField && <Field label="Destination">{valueField}</Field>}
        <Field label="Visible pour"><select value={f.audience} onChange={set("audience")}>{Object.entries(AUD).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <span />
        <Field label="Début (facultatif)"><input type="datetime-local" value={f.starts_at} onChange={set("starts_at")} /></Field>
        <Field label="Fin (facultatif)"><input type="datetime-local" value={f.ends_at} onChange={set("ends_at")} /></Field>
      </div>}
      <label className="check"><input type="checkbox" checked={f.is_active} onChange={set("is_active")} />{cap(P.one)} {P.fem ? "activée" : "activé"}</label>
    </Modal>
  );
}

export default function Banners() {
  const [place, setPlace] = useState("carousel");
  const P = PLACES[place];
  const { data, loading, error, reload } = useLoad(() => api.get("/admin/banners"), []);
  const { run, busy } = useAction();
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const all = Array.isArray(data) ? data : [];
  const rows = all.filter((b) => (b.placement || "carousel") === place);
  const target = (b) => b.target_name || FILTERS[b.action_value] || SCREENS[b.action_value] || TYPES[b.action_value] || b.action_value;
  const move = async (i, d) => {
    const ids = rows.map((b) => b.id); const j = i + d; if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    if (await run(() => api.put("/admin/banners/order", { ids }))) reload();
  };
  const on = (b) => String(b.is_active) === "1";
  const toggle = async (b) => { if (await run(() => api.put(`/admin/banners/${b.id}`, { is_active: on(b) ? 0 : 1 }), done(P, on(b) ? "désactivé" : "activé"))) reload(); };
  return (
    <div className="page">
      <PageHead title="Contenu de l'app" sub="Ce que voient les utilisateurs sur l'accueil et au premier lancement : contenu, ordre, destination, dates et public"><Btn onClick={() => setEdit({})}><Plus size={18} />{P.add}</Btn></PageHead>
      <div className="seg page-seg">{Object.entries(PLACES).map(([k, p]) => <button key={k} className={place === k ? "on" : ""} onClick={() => setPlace(k)}>{p.tab} <small>{all.filter((b) => (b.placement || "carousel") === k).length}</small></button>)}</div>
      <p className="muted small" style={{ margin: "-6px 0 14px" }}>{P.help}</p>
      {error && <p className="err">{error}</p>}
      {loading && !all.length ? <p className="muted">Chargement…</p> : !rows.length ? <Card><p className="muted">{place === "intro" ? "Aucun écran : l'app affiche ses écrans d'origine." : place === "tile" ? "Aucune tuile : la rangée de tuiles n'apparaît pas dans l'app." : "Aucune annonce : le carrousel n'apparaît pas dans l'app."}</p></Card> :
        <div className={"bn-list " + place}>{rows.map((b, i) => {
          const [st, tone] = live(b);
          return (
            <div key={b.id} className="bn-row">
              <div className="bn-order"><button className="icon-btn" disabled={i === 0 || busy} onClick={() => move(i, -1)} aria-label="Monter"><ArrowUp size={16} /></button><b>{i + 1}</b><button className="icon-btn" disabled={i === rows.length - 1 || busy} onClick={() => move(i, 1)} aria-label="Descendre"><ArrowDown size={16} /></button></div>
              <button className="bn-click" onClick={() => setEdit(b)}><BannerPreview b={b} /></button>
              <div className="bn-info">
                <div className="inline"><Badge tone={tone}>{P.fem && st !== "En ligne" ? st + "e" : st}</Badge>{place !== "intro" && <span className="muted small">{AUD[b.audience]}</span>}</div>
                {place !== "intro" && <p><b>{ACTIONS[b.action_type]}</b>{b.action_value ? <span className="muted"> · {target(b)}</span> : null}</p>}
                {place === "intro" && b.subtitle && <p className="muted clamp">{b.subtitle}</p>}
                {place !== "intro" && <p className="muted small">{b.starts_at || b.ends_at ? `${b.starts_at ? "du " + dt(b.starts_at) : ""} ${b.ends_at ? "au " + dt(b.ends_at) : ""}` : "Sans date de fin"} · {num(b.clicks)} clic{Number(b.clicks) > 1 ? "s" : ""}</p>}
                <div className="inline"><Btn kind="ghost" size="sm" onClick={() => setEdit(b)}>Modifier</Btn><Btn kind="ghost" size="sm" disabled={busy} onClick={() => toggle(b)}>{on(b) ? "Désactiver" : "Activer"}</Btn><Btn kind="link" onClick={() => setDel(b)}>Supprimer</Btn></div>
              </div>
            </div>
          );
        })}</div>}
      <p className="muted small note">{place === "intro" ? "Les écrans activés défilent dans cet ordre, 4 secondes chacun. Sans aucun écran activé, l'app garde ses écrans d'origine." : `L'app affiche les ${P.one}s activé${P.fem ? "e" : ""}s, dans cet ordre, entre leurs dates de début et de fin, selon le public choisi.`}</p>
      {edit && <Edit banner={edit.id ? edit : null} placement={edit.id ? edit.placement || "carousel" : place} onClose={() => { setEdit(null); reload(); }} onDone={() => { setEdit(null); reload(); }} />}
      {del && <Confirm title={`Supprimer ${place === "intro" ? "cet écran" : place === "tile" ? "cette tuile" : "cette annonce"} ?`} danger text={`${P.the} disparaît de l'app. Pour ${P.fem ? "la" : "le"} retirer temporairement, désactivez-${P.fem ? "la" : "le"} plutôt.`} confirm="Supprimer" busy={busy} onCancel={() => setDel(null)} onConfirm={async () => { if (await run(() => api.del(`/admin/banners/${del.id}`), done(P, "supprimé"))) { setDel(null); reload(); } }} />}
    </div>
  );
}
