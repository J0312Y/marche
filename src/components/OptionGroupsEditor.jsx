import { useRef, useState } from "react";
import Icon from "./Icon";
import toast from "../utils/toast";
import { vendorAPI } from "../api";
import shrinkPhoto from "../utils/shrinkPhoto";

/**
 * Éditeur des options d'un article (comme Toters) :
 * groupes [{key, label, type: 'single'|'multi', required, max, options: [{name, price_delta, image?}]}]
 * image : photo de la variante (couleur, modèle…), montrée en vignette sur la fiche (comme Taobao).
 * Le serveur valide les choix du client et calcule les suppléments à partir de ces données.
 */
const PRESETS = {
  restaurant: [
    { label: "Accompagnement", type: "single", required: true, options: ["Riz", "Frites", "Bananes plantains", "Fufu", "Attiéké"] },
    { label: "Piment", type: "single", required: false, options: ["Sans piment", "Doux", "Fort"] },
    { label: "Suppléments", type: "multi", required: false, max: 3, options: ["Œuf", "Avocat", "Fromage", "Salade"] },
    { label: "Boisson", type: "single", required: false, options: ["Eau 50 cl", "Jus", "Soda 33 cl"] },
    { label: "Taille", type: "single", required: true, options: ["Normale", "Grande"] },
  ],
  patisserie: [
    { label: "Nombre de parts", type: "single", required: true, options: ["6 parts", "10 parts", "16 parts"] },
    { label: "Parfum", type: "single", required: true, options: ["Vanille", "Chocolat", "Fraise"] },
    { label: "Inscription", type: "single", required: false, options: ["Joyeux anniversaire", "Félicitations"] },
  ],
  boutique: [
    { label: "Taille", type: "single", required: true, options: ["S", "M", "L", "XL"] },
    { label: "Couleur", type: "single", required: true, options: ["Noir", "Blanc", "Bleu", "Rouge"] },
    { label: "Pointure", type: "single", required: true, options: ["38", "39", "40", "41", "42", "43"] },
  ],
  supermarche: [
    { label: "Format", type: "single", required: true, options: ["Unité", "Lot de 6", "Carton"] },
  ],
  pharmacie: [
    { label: "Conditionnement", type: "single", required: true, options: ["Boîte de 10", "Boîte de 20", "Flacon"] },
  ],
};

const slug = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "option";

const inp = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--light)", color: "var(--text)", fontFamily: "inherit", fontSize: 14, outline: "none" };
const pill = (on) => ({ padding: "6px 12px", borderRadius: 10, border: on ? "2px solid #F97316" : "1px solid var(--border)", background: on ? "rgba(249,115,22,.08)" : "var(--card)", color: on ? "#F97316" : "var(--sub)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" });

export default function OptionGroupsEditor({ value = [], onChange, shopType = "restaurant" }) {
  const groups = value;
  const fileRef = useRef(null);
  const [target, setTarget] = useState(null); // [groupe, choix] dont on choisit la photo
  const [uploading, setUploading] = useState(null);
  const pickPhoto = (i, j) => { setTarget([i, j]); fileRef.current?.click(); };
  const onFile = async (e) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f || !target) return;
    const [i, j] = target; setUploading(`${i}-${j}`);
    try { const r = await vendorAPI.uploadOptionImage(await shrinkPhoto(f)); setOpt(i, j, { image: r.url }); }
    catch (err) { toast.error(err?.message || "Photo non envoyée"); }
    setUploading(null);
  };
  const set = (i, patch) => onChange(groups.map((g, k) => (k === i ? { ...g, ...patch } : g)));
  const setOpt = (i, j, patch) => set(i, { options: groups[i].options.map((o, k) => (k === j ? { ...o, ...patch } : o)) });
  const addGroup = (p) => {
    const label = p?.label || "Nouvelle option";
    let key = slug(label), n = 2;
    while (groups.some((g) => g.key === key)) key = slug(label) + "_" + n++;
    onChange([...groups, { key, label, type: p?.type || "single", required: p?.required ?? true, max: p?.max || 0, options: (p?.options || [""]).map((name) => ({ name, price_delta: 0 })) }]);
  };
  const presets = (PRESETS[shopType] || PRESETS.restaurant).filter((p) => !groups.some((g) => g.label === p.label));

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Options proposées au client</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Ex. : accompagnement obligatoire, suppléments payants. Le client les choisit sur la fiche de l'article.</div>

      {groups.map((g, i) => (
        <div key={g.key} style={{ border: "1px solid var(--border)", borderRadius: 14, padding: 12, marginBottom: 12, background: "var(--card)" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <input style={{ ...inp, fontWeight: 700 }} value={g.label} placeholder="Nom du groupe (ex. : Accompagnement)" onChange={(e) => set(i, { label: e.target.value })} />
            <button onClick={() => onChange(groups.filter((_, k) => k !== i))} aria-label="Supprimer le groupe" style={{ border: "none", background: "rgba(239,68,68,.08)", borderRadius: 10, width: 40, height: 40, cursor: "pointer", flexShrink: 0 }}><Icon name="trash" size={16} color="#EF4444" /></button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            <button style={pill(g.type === "single")} onClick={() => set(i, { type: "single", max: 1 })}>Un seul choix</button>
            <button style={pill(g.type === "multi")} onClick={() => set(i, { type: "multi", max: g.max > 1 ? g.max : 0 })}>Plusieurs choix</button>
            <button style={pill(g.required)} onClick={() => set(i, { required: !g.required })}>{g.required ? "Obligatoire" : "Facultatif"}</button>
            {g.type === "multi" && <select value={g.max || 0} onChange={(e) => set(i, { max: Number(e.target.value) })} style={{ width: "auto", padding: "6px 30px 6px 10px", fontSize: 12, borderRadius: 10 }}>
              <option value={0}>Sans limite</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} max</option>)}
            </select>}
          </div>
          {g.options.map((o, j) => (
            <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
              <button onClick={() => (o.image ? setOpt(i, j, { image: undefined }) : pickPhoto(i, j))} aria-label={o.image ? "Retirer la photo du choix" : "Ajouter une photo du choix"} title={o.image ? "Retirer la photo" : "Photo du choix (couleur, modèle…)"}
                style={{ width: 40, height: 40, borderRadius: 10, border: o.image ? "none" : "1.5px dashed var(--border)", background: "var(--light)", padding: 0, overflow: "hidden", flexShrink: 0, cursor: "pointer", position: "relative", opacity: uploading === `${i}-${j}` ? 0.5 : 1 }}>
                {o.image ? <><img src={o.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /><span style={{ position: "absolute", right: 1, top: 1, background: "rgba(0,0,0,.55)", borderRadius: 6, lineHeight: 0, padding: 1 }}><Icon name="close" size={10} color="#fff" /></span></>
                  : <Icon name="camera" size={16} color="var(--muted)" />}
              </button>
              <input style={{ ...inp, flex: 2 }} value={o.name} placeholder="Choix (ex. : Frites)" onChange={(e) => setOpt(i, j, { name: e.target.value })} />
              <div style={{ position: "relative", flex: 1 }}>
                <input style={{ ...inp, paddingLeft: 22 }} inputMode="numeric" value={o.price_delta || ""} placeholder="0" onChange={(e) => setOpt(i, j, { price_delta: Number(e.target.value.replace(/\D/g, "").slice(0, 6)) || 0 })} />
                <span style={{ position: "absolute", left: 10, top: 10, fontSize: 14, color: "var(--muted)" }}>+</span>
              </div>
              <button onClick={() => set(i, { options: g.options.filter((_, k) => k !== j) })} aria-label="Retirer" style={{ border: "none", background: "none", cursor: "pointer", padding: 6 }}><Icon name="close" size={16} color="var(--muted)" /></button>
            </div>
          ))}
          <button onClick={() => set(i, { options: [...g.options, { name: "", price_delta: 0 }] })} style={{ border: "none", background: "none", color: "#F97316", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "6px 0", fontFamily: "inherit" }}>+ Ajouter un choix</button>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Prix en FCFA ajouté au prix de l'article (laisser vide si gratuit). Touchez <Icon name="camera" size={11} /> pour la photo d'un choix (couleur, modèle…) : le client la voit en vignette.</div>
        </div>
      ))}

      {presets.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {presets.map((p) => <button key={p.label} style={pill(false)} onClick={() => addGroup(p)}>+ {p.label}</button>)}
      </div>}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
      <button onClick={() => addGroup()} style={{ width: "100%", padding: 12, borderRadius: 12, border: "1.5px dashed var(--border)", background: "transparent", color: "var(--text)", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Nouveau groupe d'options</button>
    </div>
  );
}

/** Nettoie les groupes avant l'envoi (retire les choix vides et les groupes sans choix) */
export function cleanOptionGroups(groups = []) {
  return groups
    .map((g) => ({ ...g, label: (g.label || "").trim(), options: (g.options || []).filter((o) => (o.name || "").trim()).map((o) => ({ name: o.name.trim(), price_delta: Math.max(0, Number(o.price_delta) || 0), ...(o.image ? { image: o.image } : {}) })) }))
    .filter((g) => g.label && g.options.length);
}
