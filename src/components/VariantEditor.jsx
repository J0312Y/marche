import { useState } from "react";

/**
 * Variant configuration per shop type / category
 * Each variant type has: label, icon, presets (quick add), custom (free input), unit
 */
const VARIANT_CONFIGS = {
  // ═══ MODE / BOUTIQUE ═══
  boutique: {
    Mode: [
      { key:"taille", label:"Taille", icon:"📏", presets:["XS","S","M","L","XL","XXL","34","36","38","40","42","44","46"], unit:"", type:"preset" },
      { key:"couleur", label:"Couleur", icon:"🎨", presets:["Noir","Blanc","Rouge","Bleu","Vert","Jaune","Rose","Orange","Violet","Marron","Gris","Beige","Multicolore"], unit:"", type:"color" },
    ],
    Électronique: [
      { key:"stockage", label:"Stockage", icon:"💾", presets:["32 GB","64 GB","128 GB","256 GB","512 GB","1 TB"], unit:"", type:"preset" },
      { key:"couleur", label:"Couleur", icon:"🎨", presets:["Noir","Blanc","Bleu","Or","Argent","Rouge"], unit:"", type:"color" },
      { key:"ram", label:"RAM", icon:"🧠", presets:["2 GB","4 GB","6 GB","8 GB","12 GB","16 GB"], unit:"", type:"preset" },
    ],
    Beauté: [
      { key:"teinte", label:"Teinte", icon:"💄", presets:["Clair","Moyen","Foncé","Nude","Rose","Rouge","Corail","Brun"], unit:"", type:"color" },
      { key:"contenance", label:"Contenance", icon:"🧴", presets:["30 ml","50 ml","100 ml","150 ml","200 ml","250 ml"], unit:"", type:"preset" },
    ],
    Maison: [
      { key:"taille", label:"Dimension", icon:"📐", presets:["Petit","Moyen","Grand","XL"], unit:"", type:"preset" },
      { key:"couleur", label:"Couleur", icon:"🎨", presets:["Noir","Blanc","Bois","Gris","Beige","Marron"], unit:"", type:"color" },
      { key:"materiau", label:"Matériau", icon:"🪵", presets:["Bois","Métal","Plastique","Tissu","Verre","Cuir"], unit:"", type:"preset" },
    ],
    _default: [
      { key:"variante", label:"Variante", icon:"📦", presets:["Standard","Premium"], unit:"", type:"preset" },
      { key:"couleur", label:"Couleur", icon:"🎨", presets:["Noir","Blanc","Rouge","Bleu","Vert"], unit:"", type:"color" },
    ],
  },

  // ═══ RESTAURANT ═══
  restaurant: {
    _default: [
      { key:"portion", label:"Portion", icon:"🍽️", presets:["Normale","Grande","Familiale"], unit:"", type:"preset" },
      { key:"accompagnement", label:"Accompagnement", icon:"🥗", presets:["Riz","Frites","Plantain","Fufu","Salade","Attiéké","Semoule","Manioc"], unit:"", type:"multi" },
      { key:"piment", label:"Piment", icon:"🌶️", presets:["Sans piment","Doux","Moyen","Fort","Très fort"], unit:"", type:"preset" },
      { key:"boisson", label:"Boisson", icon:"🥤", presets:["Sans boisson","Eau","Jus","Coca","Fanta","Bière"], unit:"", type:"multi" },
    ],
  },

  // ═══ PÂTISSERIE ═══
  patisserie: {
    _default: [
      { key:"taille", label:"Taille", icon:"🎂", presets:["Individuel","4 parts","6 parts","8 parts","10 parts","12 parts","20 parts"], unit:"", type:"preset" },
      { key:"parfum", label:"Parfum", icon:"🍰", presets:["Vanille","Chocolat","Fraise","Citron","Caramel","Red Velvet","Tiramisu","Mangue","Coco","Pistache"], unit:"", type:"multi" },
      { key:"decoration", label:"Décoration", icon:"✨", presets:["Simple","Chantilly","Fruits","Personnalisée","Photo comestible","Fleurs"], unit:"", type:"preset" },
    ],
  },

  // ═══ PHARMACIE ═══
  pharmacie: {
    _default: [
      { key:"dosage", label:"Dosage", icon:"💊", presets:["100 mg","250 mg","500 mg","1000 mg","5 mg/ml","10 mg/ml"], unit:"", type:"preset" },
      { key:"conditionnement", label:"Conditionnement", icon:"📦", presets:["Boîte de 10","Boîte de 20","Boîte de 30","Flacon 60 ml","Flacon 100 ml","Flacon 150 ml","Tube 30 g","Tube 50 g"], unit:"", type:"preset" },
      { key:"forme", label:"Forme", icon:"💉", presets:["Comprimé","Gélule","Sirop","Pommade","Crème","Spray","Suppositoire","Injection"], unit:"", type:"preset" },
    ],
  },

  // ═══ SUPERMARCHÉ ═══
  supermarche: {
    Alimentation: [
      { key:"poids", label:"Poids / Volume", icon:"⚖️", presets:["100 g","250 g","500 g","1 kg","2 kg","5 kg","25 cl","50 cl","1 L","1.5 L","2 L","5 L"], unit:"", type:"preset" },
      { key:"pack", label:"Pack", icon:"📦", presets:["Unité","Lot de 3","Lot de 6","Lot de 12","Carton"], unit:"", type:"preset" },
    ],
    _default: [
      { key:"poids", label:"Poids / Volume", icon:"⚖️", presets:["100 g","250 g","500 g","1 kg","2 kg","25 cl","50 cl","1 L","1.5 L"], unit:"", type:"preset" },
      { key:"pack", label:"Pack / Lot", icon:"📦", presets:["Unité","Lot de 2","Lot de 3","Lot de 6","Lot de 12","Carton"], unit:"", type:"preset" },
      { key:"marque", label:"Marque", icon:"🏷️", presets:[], unit:"", type:"custom" },
    ],
  },

  // ═══ SERVICE ═══
  service: {
    _default: [
      { key:"duree", label:"Durée", icon:"⏱️", presets:["30 min","1h","1h30","2h","3h","Demi-journée","Journée"], unit:"", type:"preset" },
      { key:"formule", label:"Formule", icon:"📋", presets:["Basique","Standard","Premium","VIP"], unit:"", type:"preset" },
      { key:"lieu", label:"Lieu", icon:"📍", presets:["À domicile","En boutique","En ligne","Sur site"], unit:"", type:"preset" },
    ],
  },
};

/**
 * Get variant config for a given shop type and category
 */
function getVariantConfig(shopType, category) {
  const typeConfig = VARIANT_CONFIGS[shopType] || VARIANT_CONFIGS.boutique;
  return typeConfig[category] || typeConfig._default || VARIANT_CONFIGS.boutique._default;
}

// Color dot mapping
const COLOR_MAP = {
  "Noir":"#000","Blanc":"#fff","Rouge":"#EF4444","Bleu":"#3B82F6","Vert":"#10B981",
  "Jaune":"#F59E0B","Rose":"#EC4899","Orange":"#F97316","Violet":"#8B5CF6",
  "Marron":"#92400E","Gris":"#6B7280","Beige":"#D2B48C","Multicolore":"linear-gradient(135deg,#EF4444,#F59E0B,#10B981,#3B82F6,#8B5CF6)",
  "Or":"#FFD700","Argent":"#C0C0C0","Corail":"#FF7F50","Brun":"#8B4513","Nude":"#E3BC9A",
  "Clair":"#FCEBD3","Moyen":"#D4A574","Foncé":"#8B6914",
  "Bois":"#DEB887",
};

/**
 * VariantEditor Component
 *
 * Props:
 * - shopType: 'boutique' | 'restaurant' | 'patisserie' | 'pharmacie' | 'supermarche' | 'service'
 * - category: category name (ex: "Mode", "Électronique", "Alimentation")
 * - value: current variants state [{key, values: [{name, stock, price_delta}]}]
 * - onChange: callback(variants)
 */
function VariantEditor({ shopType = "boutique", category = "", value = [], onChange }) {
  const config = getVariantConfig(shopType, category);
  const [variants, setVariants] = useState(() => {
    if (value.length > 0) return value;
    // Init with empty variant groups from config
    return config.map(c => ({ key: c.key, label: c.label, values: [] }));
  });
  const [customInputs, setCustomInputs] = useState({});
  const [expanded, setExpanded] = useState(config[0]?.key || "");

  const update = (newVars) => {
    setVariants(newVars);
    onChange?.(newVars);
  };

  const toggleValue = (varKey, valueName) => {
    const newVars = variants.map(v => {
      if (v.key !== varKey) return v;
      const exists = v.values.find(val => val.name === valueName);
      if (exists) {
        return { ...v, values: v.values.filter(val => val.name !== valueName) };
      } else {
        return { ...v, values: [...v.values, { name: valueName, stock: "", price_delta: "" }] };
      }
    });
    // If variant group doesn't exist yet, create it
    if (!newVars.find(v => v.key === varKey)) {
      const cfg = config.find(c => c.key === varKey);
      newVars.push({ key: varKey, label: cfg?.label || varKey, values: [{ name: valueName, stock: "", price_delta: "" }] });
    }
    update(newVars);
  };

  const updateValueField = (varKey, valueName, field, val) => {
    update(variants.map(v => {
      if (v.key !== varKey) return v;
      return { ...v, values: v.values.map(vv => vv.name === valueName ? { ...vv, [field]: val } : vv) };
    }));
  };

  const addCustom = (varKey) => {
    const name = (customInputs[varKey] || "").trim();
    if (!name) return;
    toggleValue(varKey, name);
    setCustomInputs({ ...customInputs, [varKey]: "" });
  };

  const totalCombinations = variants.reduce((acc, v) => {
    const count = v.values.length;
    return count > 0 ? acc * count : acc;
  }, 1);
  const activeVariants = variants.filter(v => v.values.length > 0);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Variantes</div>
        {activeVariants.length > 0 && (
          <span style={{ fontSize: 11, color: "#6366F1", fontWeight: 600 }}>
            {activeVariants.map(v => v.values.length).join(" × ")} = {totalCombinations} combinaison{totalCombinations > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Type indicator */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", paddingBottom: 2 }}>
        {config.map(c => {
          const varGroup = variants.find(v => v.key === c.key);
          const count = varGroup?.values?.length || 0;
          const isActive = expanded === c.key;
          return (
            <button key={c.key} onClick={() => setExpanded(isActive ? "" : c.key)} style={{
              padding: "6px 12px", borderRadius: 10, border: count > 0 ? "2px solid #6366F1" : "1px solid #E8E6E1",
              background: isActive ? "rgba(99,102,241,0.06)" : count > 0 ? "rgba(99,102,241,0.02)" : "var(--card)",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              color: count > 0 ? "#6366F1" : "var(--sub)", transition: "all .2s",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              {c.icon} {c.label}
              {count > 0 && <span style={{ background: "#6366F1", color: "#fff", borderRadius: 6, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Expanded variant editor */}
      {config.map(c => {
        if (expanded !== c.key) return null;
        const varGroup = variants.find(v => v.key === c.key) || { values: [] };
        const selectedNames = varGroup.values.map(v => v.name);

        return (
          <div key={c.key} style={{ padding: 14, background: "var(--light)", borderRadius: 14, border: "1px solid #E8E6E1", marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              {c.icon} {c.label}
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)" }}>— Sélectionnez les options disponibles</span>
            </div>

            {/* Preset chips */}
            {c.presets.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {c.presets.map(preset => {
                  const isSelected = selectedNames.includes(preset);
                  const colorDot = c.type === "color" ? COLOR_MAP[preset] : null;
                  return (
                    <button key={preset} onClick={() => toggleValue(c.key, preset)} style={{
                      padding: colorDot ? "5px 10px 5px 6px" : "5px 12px",
                      borderRadius: 8,
                      border: isSelected ? "2px solid #6366F1" : "1px solid #E8E6E1",
                      background: isSelected ? "rgba(99,102,241,0.06)" : "var(--card)",
                      fontSize: 12, fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer", fontFamily: "inherit",
                      color: isSelected ? "#6366F1" : "var(--sub)",
                      display: "flex", alignItems: "center", gap: 5, transition: "all .15s",
                    }}>
                      {colorDot && <span style={{
                        width: 14, height: 14, borderRadius: 7, flexShrink: 0,
                        background: colorDot, border: preset === "Blanc" ? "1px solid #E8E6E1" : "none",
                        boxShadow: isSelected ? "0 0 0 2px rgba(99,102,241,0.3)" : "none",
                      }} />}
                      {isSelected && !colorDot && "✓ "}{preset}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Custom input */}
            <div style={{ display: "flex", gap: 6, marginBottom: varGroup.values.length > 0 ? 14 : 0 }}>
              <input
                value={customInputs[c.key] || ""}
                onChange={e => setCustomInputs({ ...customInputs, [c.key]: e.target.value })}
                onKeyDown={e => e.key === "Enter" && addCustom(c.key)}
                placeholder={`Ajouter un(e) ${c.label.toLowerCase()} personnalisé(e)...`}
                style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid #E8E6E1", background: "var(--card)", fontSize: 12, fontFamily: "inherit", outline: "none" }}
              />
              <button onClick={() => addCustom(c.key)} style={{
                padding: "0 14px", borderRadius: 10, border: "none",
                background: (customInputs[c.key] || "").trim() ? "#6366F1" : "var(--border)",
                color: (customInputs[c.key] || "").trim() ? "var(--card)" : "var(--muted)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>+</button>
            </div>

            {/* Selected values with stock & price delta */}
            {varGroup.values.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>
                  {varGroup.values.length} option{varGroup.values.length > 1 ? "s" : ""} sélectionnée{varGroup.values.length > 1 ? "s" : ""}
                </div>
                {varGroup.values.map(val => (
                  <div key={val.name} style={{
                    display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
                    padding: "8px 10px", background: "var(--card)", borderRadius: 10, border: "1px solid #E8E6E1",
                  }}>
                    {c.type === "color" && COLOR_MAP[val.name] && (
                      <span style={{ width: 16, height: 16, borderRadius: 8, background: COLOR_MAP[val.name], flexShrink: 0, border: val.name === "Blanc" ? "1px solid #E8E6E1" : "none" }} />
                    )}
                    <span style={{ fontSize: 12, fontWeight: 600, minWidth: 60 }}>{val.name}</span>
                    <input
                      type="number" placeholder="Stock" value={val.stock}
                      onChange={e => updateValueField(c.key, val.name, "stock", e.target.value)}
                      style={{ width: 60, padding: "5px 8px", borderRadius: 6, border: "1px solid #E8E6E1", fontSize: 11, fontFamily: "inherit", outline: "none", textAlign: "center" }}
                    />
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>unités</span>
                    <input
                      type="number" placeholder="± Prix" value={val.price_delta}
                      onChange={e => updateValueField(c.key, val.name, "price_delta", e.target.value)}
                      style={{ width: 70, padding: "5px 8px", borderRadius: 6, border: "1px solid #E8E6E1", fontSize: 11, fontFamily: "inherit", outline: "none", textAlign: "center" }}
                    />
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>FCFA</span>
                    <button onClick={() => toggleValue(c.key, val.name)} style={{
                      width: 22, height: 22, borderRadius: 6, border: "none",
                      background: "rgba(239,68,68,0.08)", color: "#EF4444",
                      fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "auto", flexShrink: 0,
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Summary: combinations preview */}
      {activeVariants.length >= 2 && (
        <div style={{ padding: 12, background: "rgba(99,102,241,0.04)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.12)", marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", marginBottom: 6 }}>
            📊 {totalCombinations} combinaison{totalCombinations > 1 ? "s" : ""} générée{totalCombinations > 1 ? "s" : ""}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {(() => {
              // Show first 8 combinations
              const groups = activeVariants.map(v => v.values.map(vv => vv.name));
              const combos = [];
              const gen = (arr, idx, current) => {
                if (idx === arr.length) { combos.push(current.join(" · ")); return; }
                for (const val of arr[idx]) {
                  if (combos.length >= 8) return;
                  gen(arr, idx + 1, [...current, val]);
                }
              };
              gen(groups, 0, []);
              return combos.map((combo, i) => (
                <span key={i} style={{ padding: "3px 8px", borderRadius: 6, background: "var(--card)", border: "1px solid #E8E6E1", fontSize: 10, color: "var(--sub)" }}>
                  {combo}
                </span>
              ));
            })()}
            {totalCombinations > 8 && <span style={{ fontSize: 10, color: "var(--muted)", padding: "3px 4px" }}>+{totalCombinations - 8} autres</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export { VARIANT_CONFIGS, getVariantConfig };
export default VariantEditor;
