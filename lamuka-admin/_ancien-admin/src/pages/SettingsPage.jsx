import { useState, useRef } from "react";
import { Settings, Palette, Gem, CreditCard, Map, Send, Camera, Trash2, Save, Star, Pencil, Plus, Pause, Play, Eye, AlertTriangle, Bell, Smartphone, Wallet, X as XIcon } from "lucide-react";
import { useI18n } from "../i18n";
import { useToast, ConfirmModal } from "../components/UI";

const DEFAULT_CONFIG = {
  commissionRate: 10, minOrderAmount: 2000, deliveryFeeBase: 1500, deliveryFeePerKm: 200, maxDeliveryRadius: 15,
  zones: [
    { id: "z1", name: "Bacongo", fee: 1500, active: true }, { id: "z2", name: "Poto-Poto", fee: 1500, active: true },
    { id: "z3", name: "Moungali", fee: 1500, active: true }, { id: "z4", name: "Ouenzé", fee: 2000, active: true },
    { id: "z5", name: "Talangaï", fee: 2000, active: true }, { id: "z6", name: "Mfilou", fee: 2500, active: true },
    { id: "z7", name: "Makélékélé", fee: 2000, active: true }, { id: "z8", name: "Madibou", fee: 3000, active: false },
    { id: "z9", name: "Djiri", fee: 3500, active: false },
  ],
};

const DEFAULT_PLANS = [
  { id: "starter", name: "Starter", icon: "free", price: 0, maxArticles: 20, maxImages: 3, commission: 12, color: "#E8E6E1", features: ["Boutique de base", "20 articles", "3 photos/article"] },
  { id: "pro", name: "Pro", icon: "star", price: 15000, maxArticles: 200, maxImages: 6, commission: 10, color: "#6366F1", features: ["200 articles", "6 photos/article", "Promos", "Analytics", "Équipe (3)"] },
  { id: "enterprise", name: "Enterprise", icon: "gem", price: 50000, maxArticles: -1, maxImages: 10, commission: 7, color: "#F59E0B", features: ["Articles illimités", "10 photos", "Multi-boutiques", "API", "Support prioritaire"] },
];

const DEFAULT_PAYMENTS = [
  { id: "airtel", name: "Airtel Money", icon: "smartphone", color: "#EF4444", active: true, fee: 1.5 },
  { id: "mtn", name: "MTN MoMo", icon: "smartphone", color: "#F59E0B", active: true, fee: 1.5 },
  { id: "orange", name: "Orange Money", icon: "smartphone", color: "#F97316", active: true, fee: 2.0 },
  { id: "kolo", name: "Kolo Wallet", icon: "gem", color: "#6366F1", active: true, fee: 0 },
  { id: "cash", name: "Cash à la livraison", nameEn: "Cash on Delivery", icon: "wallet", color: "#10B981", active: true, fee: 0 },
  { id: "visa", name: "Visa / Mastercard", icon: "creditcard", color: "#3B82F6", active: false, fee: 3.0 },
];

const PLAN_ICON_MAP = { free: <Gem size={18} style={{ opacity: 0.4 }} />, star: <Star size={18} />, gem: <Gem size={18} /> };
const getPlanIcon = (icon) => PLAN_ICON_MAP[icon] || <Star size={18} />;

const PAYMENT_ICON_MAP = { smartphone: <Smartphone size={20} />, gem: <Gem size={20} />, wallet: <Wallet size={20} />, creditcard: <CreditCard size={20} /> };
const getPaymentIcon = (icon) => PAYMENT_ICON_MAP[icon] || <CreditCard size={20} />;

export default function SettingsPage({ branding, onBrandingChange }) {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [tab, setTab] = useState("general");
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [payments, setPayments] = useState(DEFAULT_PAYMENTS);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");

  // Branding
  const [localBranding, setLocalBranding] = useState(branding || { appName: "Lamuka", appLogo: null, appSubtitle: "Super Admin", mobileLogo: null });
  const logoRef = useRef(null);
  const mobileLogoRef = useRef(null);

  // Plans editing
  const [editPlan, setEditPlan] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Zones editing
  const [newZone, setNewZone] = useState({ name: "", fee: 2000 });
  const [showAddZone, setShowAddZone] = useState(false);

  const save = () => { toast.success(lang === "fr" ? "Paramètres enregistrés" : "Settings saved"); };

  const handleLogoUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert(lang === "fr" ? "Max 2 Mo" : "Max 2MB"); return; }
    const reader = new FileReader();
    reader.onload = () => setLocalBranding(b => ({ ...b, [field]: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveBranding = () => {
    if (onBrandingChange) onBrandingChange(localBranding);
    toast.success(lang === "fr" ? "Branding mis à jour" : "Branding updated");
  };

  const toggleZone = (idx) => {
    const zones = [...config.zones];
    zones[idx] = { ...zones[idx], active: !zones[idx].active };
    setConfig({ ...config, zones });
  };

  const addZone = () => {
    if (!newZone.name.trim()) return;
    setConfig(c => ({ ...c, zones: [...c.zones, { id: "z" + Date.now(), name: newZone.name, fee: newZone.fee, active: true }] }));
    setNewZone({ name: "", fee: 2000 });
    setShowAddZone(false);
    toast.success(lang === "fr" ? "Zone ajoutée" : "Zone added");
  };

  const deleteZone = (idx) => {
    setConfig(c => ({ ...c, zones: c.zones.filter((_, i) => i !== idx) }));
    toast.success(lang === "fr" ? "Zone supprimée" : "Zone deleted");
  };

  // Plans CRUD
  const savePlan = (plan) => {
    setPlans(prev => {
      const idx = prev.findIndex(p => p.id === plan.id);
      if (idx >= 0) { const arr = [...prev]; arr[idx] = plan; return arr; }
      return [...prev, plan];
    });
    setEditPlan(null);
    toast.success(lang === "fr" ? `Plan "${plan.name}" enregistré` : `Plan "${plan.name}" saved`);
  };

  const deletePlan = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
    toast.success(lang === "fr" ? "Plan supprimé" : "Plan deleted");
  };

  const togglePayment = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const TABS = [
    ["general", <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Settings size={16} />{lang === "fr" ? "Général" : "General"}</span>],
    ["branding", <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Palette size={16} />Branding</span>],
    ["plans", <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Gem size={16} />Plans</span>],
    ["payments", <span style={{ display: "flex", alignItems: "center", gap: 6 }}><CreditCard size={16} />{lang === "fr" ? "Paiements" : "Payments"}</span>],
    ["zones", <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Map size={16} />Zones</span>],
    ["notifs", <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Send size={16} />Notifications</span>],
  ];

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("settings")}</h1>
      <p className="page-subtitle">{lang === "fr" ? "Configuration de la plateforme" : "Platform configuration"}</p>

      <div className="tab-bar" style={{ flexWrap: "wrap" }}>
        {TABS.map(([k, l]) => (
          <button key={k} className={`tab-btn ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ═══ GENERAL ═══ */}
      {tab === "general" && (
        <div className="card">
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {[["commissionRate", t("commissionRates") + " (%)", config.commissionRate],
                ["minOrderAmount", lang === "fr" ? "Commande minimum (FCFA)" : "Min order (FCFA)", config.minOrderAmount],
                ["deliveryFeeBase", lang === "fr" ? "Frais livraison base (FCFA)" : "Base delivery fee (FCFA)", config.deliveryFeeBase],
                ["deliveryFeePerKm", lang === "fr" ? "Frais par km (FCFA)" : "Fee per km (FCFA)", config.deliveryFeePerKm],
                ["maxDeliveryRadius", lang === "fr" ? "Rayon max livraison (km)" : "Max delivery radius (km)", config.maxDeliveryRadius],
              ].map(([key, label, val]) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" type="number" value={val} onChange={e => setConfig({ ...config, [key]: Number(e.target.value) })} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 }}><button className="btn btn-primary" onClick={save}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Save size={14} />{t("save")}</span></button></div>
          </div>
        </div>
      )}

      {/* ═══ BRANDING + MOBILE LOGO ═══ */}
      {tab === "branding" && (
        <div className="card">
          <div className="card-body">
            {/* Admin Dashboard Logo */}
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Palette size={16} />{lang === "fr" ? "Logo Dashboard Admin" : "Admin Dashboard Logo"}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: 20, background: "var(--surface-2)", borderRadius: 16 }}>
              <div style={{ position: "relative" }}>
                {localBranding.appLogo ? (
                  <img src={localBranding.appLogo} alt="logo" style={{ width: 80, height: 80, borderRadius: 18, objectFit: "cover", border: "3px solid var(--primary-light)" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: 18, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 32 }}>{localBranding.appName?.[0] || "L"}</div>
                )}
                <button onClick={() => logoRef.current?.click()} style={{ position: "absolute", bottom: -4, right: -4, width: 30, height: 30, borderRadius: 8, background: "var(--primary)", color: "#fff", border: "2px solid var(--surface)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}><Camera size={14} /></button>
                <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleLogoUpload(e, "appLogo")} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{lang === "fr" ? "Logo du dashboard" : "Dashboard Logo"}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>{lang === "fr" ? "Sidebar, page de connexion, notifications" : "Sidebar, login page, notifications"}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => logoRef.current?.click()}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Camera size={14} />{lang === "fr" ? "Changer" : "Change"}</span></button>
                  {localBranding.appLogo && <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setLocalBranding(b => ({ ...b, appLogo: null }))}><Trash2 size={14} /></button>}
                </div>
              </div>
            </div>

            {/* ═══ MOBILE APP LOGO ═══ */}
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Smartphone size={16} />{lang === "fr" ? "Logo Application Mobile (Lamuka Market)" : "Mobile App Logo (Lamuka Market)"}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, padding: 20, background: "var(--surface-2)", borderRadius: 16 }}>
              <div style={{ position: "relative" }}>
                {localBranding.mobileLogo ? (
                  <img src={localBranding.mobileLogo} alt="mobile logo" style={{ width: 80, height: 80, borderRadius: 18, objectFit: "cover", border: "3px solid #10B981" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: 18, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 32 }}><Smartphone size={32} /></div>
                )}
                <button onClick={() => mobileLogoRef.current?.click()} style={{ position: "absolute", bottom: -4, right: -4, width: 30, height: 30, borderRadius: 8, background: "#10B981", color: "#fff", border: "2px solid var(--surface)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}><Camera size={14} /></button>
                <input ref={mobileLogoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleLogoUpload(e, "mobileLogo")} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Logo Lamuka Market</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10 }}>{lang === "fr" ? "Logo affiché dans l'application mobile (splash screen, header, navigation). PNG transparent recommandé. Max 2 Mo." : "Logo displayed in mobile app (splash, header, nav). Transparent PNG recommended. Max 2MB."}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-outline" onClick={() => mobileLogoRef.current?.click()}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Camera size={14} />{lang === "fr" ? "Changer le logo mobile" : "Change mobile logo"}</span></button>
                  {localBranding.mobileLogo && <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setLocalBranding(b => ({ ...b, mobileLogo: null }))}><Trash2 size={14} /></button>}
                </div>
              </div>
            </div>

            {/* Mobile preview */}
            {localBranding.mobileLogo && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Smartphone size={15} /> {lang === "fr" ? "Aperçu mobile" : "Mobile Preview"}</div>
                <div style={{ background: "#000", borderRadius: 24, padding: "32px 20px 20px", maxWidth: 280, margin: "0 auto" }}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: "24px 16px", textAlign: "center" }}>
                    <img src={localBranding.mobileLogo} alt="" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", marginBottom: 12 }} />
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{localBranding.appName || "Lamuka"} Market</div>
                    <div style={{ fontSize: 11, color: "#908C82" }}>{lang === "fr" ? "Votre marketplace" : "Your marketplace"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Name & Subtitle */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Nom de l'application" : "App Name"}</label>
                <input className="form-input" value={localBranding.appName} onChange={e => setLocalBranding(b => ({ ...b, appName: e.target.value }))} placeholder="Lamuka" />
              </div>
              <div className="form-group">
                <label className="form-label">{lang === "fr" ? "Sous-titre" : "Subtitle"}</label>
                <input className="form-input" value={localBranding.appSubtitle} onChange={e => setLocalBranding(b => ({ ...b, appSubtitle: e.target.value }))} placeholder="Super Admin" />
              </div>
            </div>

            {/* Live Preview */}
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Eye size={15} /> {lang === "fr" ? "Aperçu sidebar" : "Sidebar Preview"}</div>
            <div style={{ background: "#1A1916", borderRadius: 16, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {localBranding.appLogo ? <img src={localBranding.appLogo} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} /> : <div style={{ width: 36, height: 36, borderRadius: 10, background: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>{localBranding.appName?.[0] || "L"}</div>}
                <div><div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{localBranding.appName || "Lamuka"}</div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{localBranding.appSubtitle}</div></div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveBranding}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Save size={14} />{lang === "fr" ? "Enregistrer tout le branding" : "Save All Branding"}</span></button>
          </div>
        </div>
      )}

      {/* ═══ PLANS CRUD ═══ */}
      {tab === "plans" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button className="btn btn-primary" onClick={() => setEditPlan({ id: "plan_" + Date.now(), name: "", icon: "star", price: 0, maxArticles: 50, maxImages: 5, commission: 10, color: "#6366F1", features: [] })}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} />{lang === "fr" ? "Nouveau plan" : "New Plan"}</span>
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {plans.map(plan => (
              <div key={plan.id} className="card" style={{ borderTop: `3px solid ${plan.color}` }}>
                <div className="card-header" style={{ background: plan.color + "10" }}>
                  <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 6 }}>{getPlanIcon(plan.icon)} {plan.name}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => setEditPlan({ ...plan })}><Pencil size={14} /></button>
                    <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setConfirmDelete(plan)}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="card-body">
                  <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, fontFamily: "var(--font-mono)" }}>
                    {plan.price === 0 ? (lang === "fr" ? "Gratuit" : "Free") : plan.price.toLocaleString() + " F"}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-3)" }}>/mois</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16, fontSize: 12 }}>
                    <div><span style={{ color: "var(--text-3)" }}>Commission:</span> <strong>{plan.commission}%</strong></div>
                    <div><span style={{ color: "var(--text-3)" }}>Articles:</span> <strong>{plan.maxArticles === -1 ? "∞" : plan.maxArticles}</strong></div>
                    <div><span style={{ color: "var(--text-3)" }}>Images:</span> <strong>{plan.maxImages}</strong></div>
                  </div>
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ fontSize: 12, color: "var(--text-2)", padding: "3px 0" }}>✓ {f}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit/Add Plan Modal */}
          {editPlan && (
            <div className="modal-overlay" onClick={() => setEditPlan(null)}>
              <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 style={{ display: "flex", alignItems: "center", gap: 8 }}>{editPlan.name ? <><Pencil size={16} /> {editPlan.name}</> : <><Plus size={16} /> {lang === "fr" ? "Nouveau plan" : "New Plan"}</>}</h3>
                  <button className="modal-close" onClick={() => setEditPlan(null)}><XIcon size={16} /></button>
                </div>
                <div className="modal-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">{lang === "fr" ? "Nom du plan" : "Plan Name"} *</label>
                      <input className="form-input" value={editPlan.name} onChange={e => setEditPlan({ ...editPlan, name: e.target.value })} placeholder="Ex: Business" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang === "fr" ? "Icône" : "Icon"}</label>
                      <select className="form-input" value={editPlan.icon} onChange={e => setEditPlan({ ...editPlan, icon: e.target.value })} style={{ cursor: "pointer" }}>
                        <option value="free">Free</option>
                        <option value="star">Star</option>
                        <option value="gem">Gem</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">{lang === "fr" ? "Prix mensuel (FCFA)" : "Monthly price (FCFA)"}</label>
                      <input className="form-input" type="number" value={editPlan.price} onChange={e => setEditPlan({ ...editPlan, price: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Commission (%)</label>
                      <input className="form-input" type="number" value={editPlan.commission} onChange={e => setEditPlan({ ...editPlan, commission: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max articles (-1 = ∞)</label>
                      <input className="form-input" type="number" value={editPlan.maxArticles} onChange={e => setEditPlan({ ...editPlan, maxArticles: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max images</label>
                      <input className="form-input" type="number" value={editPlan.maxImages} onChange={e => setEditPlan({ ...editPlan, maxImages: Number(e.target.value) })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label className="form-label">{lang === "fr" ? "Couleur" : "Color"}</label>
                      <input type="color" value={editPlan.color} onChange={e => setEditPlan({ ...editPlan, color: e.target.value })} style={{ width: 60, height: 36, border: "none", cursor: "pointer", borderRadius: 8 }} />
                    </div>
                  </div>
                  {/* Features */}
                  <div style={{ marginTop: 16 }}>
                    <label className="form-label">{lang === "fr" ? "Fonctionnalités incluses" : "Included features"}</label>
                    {editPlan.features.map((f, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                        <input className="form-input" style={{ flex: 1 }} value={f} onChange={e => { const ft = [...editPlan.features]; ft[i] = e.target.value; setEditPlan({ ...editPlan, features: ft }); }} />
                        <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setEditPlan({ ...editPlan, features: editPlan.features.filter((_, j) => j !== i) })}>✗</button>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <input className="form-input" style={{ flex: 1 }} value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder={lang === "fr" ? "Ajouter une fonctionnalité..." : "Add a feature..."} onKeyDown={e => { if (e.key === "Enter" && newFeature.trim()) { setEditPlan({ ...editPlan, features: [...editPlan.features, newFeature] }); setNewFeature(""); } }} />
                      <button className="btn btn-sm btn-outline" disabled={!newFeature.trim()} onClick={() => { setEditPlan({ ...editPlan, features: [...editPlan.features, newFeature] }); setNewFeature(""); }}>+</button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" disabled={!editPlan.name.trim()} onClick={() => savePlan(editPlan)}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Save size={14} />{t("save")}</span></button>
                  <button className="btn btn-outline" onClick={() => setEditPlan(null)}>{t("cancel")}</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ PAYMENT METHODS ═══ */}
      {tab === "payments" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 6 }}><CreditCard size={18} /> {lang === "fr" ? "Méthodes de paiement" : "Payment Methods"}</span>
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>{lang === "fr" ? "Activer/désactiver les méthodes visibles par les clients" : "Enable/disable methods visible to clients"}</span>
          </div>
          <div className="card-body">
            {payments.map(pm => (
              <div key={pm.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: pm.color + "15", display: "flex", alignItems: "center", justifyContent: "center", color: pm.color }}>{getPaymentIcon(pm.icon)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === "en" && pm.nameEn ? pm.nameEn : pm.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {pm.fee > 0 ? `${lang === "fr" ? "Frais" : "Fee"}: ${pm.fee}%` : (lang === "fr" ? "Sans frais" : "No fee")}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span className={`badge ${pm.active ? "badge-success" : "badge-neutral"}`}>
                    {pm.active ? (lang === "fr" ? "Activé" : "Enabled") : (lang === "fr" ? "Désactivé" : "Disabled")}
                  </span>
                  {/* Toggle switch */}
                  <button onClick={() => togglePayment(pm.id)} style={{
                    width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
                    background: pm.active ? "var(--success)" : "var(--border)",
                    position: "relative", transition: "all 0.2s",
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: 10, background: "#fff",
                      position: "absolute", top: 3,
                      left: pm.active ? 25 : 3,
                      transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }} />
                  </button>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 16, background: "var(--warning-light)", borderRadius: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--warning)", marginBottom: 4 }}>
                <AlertTriangle size={14} style={{ marginRight: 4 }} /> {lang === "fr" ? "Attention" : "Warning"}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                {lang === "fr"
                  ? "Désactiver une méthode de paiement la masquera immédiatement de l'application mobile. Les transactions en cours ne seront pas affectées."
                  : "Disabling a payment method will immediately hide it from the mobile app. Ongoing transactions won't be affected."}
              </div>
            </div>
            <div style={{ marginTop: 16 }}><button className="btn btn-primary" onClick={save}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Save size={14} />{t("save")}</span></button></div>
          </div>
        </div>
      )}

      {/* ═══ DELIVERY ZONES ═══ */}
      {tab === "zones" && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t("deliveryZones")} — Brazzaville</span>
            <button className="btn btn-sm btn-primary" onClick={() => setShowAddZone(true)}>+ {lang === "fr" ? "Ajouter zone" : "Add zone"}</button>
          </div>
          {showAddZone && (
            <div style={{ padding: "12px 16px", background: "var(--primary-light)", display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>{lang === "fr" ? "Nom" : "Name"}</label>
                <input className="form-input" value={newZone.name} onChange={e => setNewZone({ ...newZone, name: e.target.value })} placeholder="Ex: Kintélé" />
              </div>
              <div className="form-group" style={{ width: 120, marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: 11 }}>{lang === "fr" ? "Frais" : "Fee"} (F)</label>
                <input className="form-input" type="number" value={newZone.fee} onChange={e => setNewZone({ ...newZone, fee: Number(e.target.value) })} />
              </div>
              <button className="btn btn-sm btn-success" onClick={addZone} disabled={!newZone.name.trim()}>✓</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowAddZone(false)}>✗</button>
            </div>
          )}
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th>{lang === "fr" ? "Arrondissement" : "District"}</th>
            <th>{lang === "fr" ? "Frais (FCFA)" : "Fee (FCFA)"}</th>
            <th>{t("status")}</th><th>{t("actions")}</th>
          </tr></thead><tbody>
            {config.zones.map((z, i) => (
              <tr key={z.id || i}>
                <td style={{ fontWeight: 600 }}>{z.name}</td>
                <td><input className="form-input" style={{ width: 100, padding: "4px 8px" }} type="number" value={z.fee} onChange={e => { const zones = [...config.zones]; zones[i] = { ...z, fee: Number(e.target.value) }; setConfig({ ...config, zones }); }} /></td>
                <td><span className={`badge ${z.active ? "badge-success" : "badge-neutral"}`}>{z.active ? (lang === "fr" ? "Actif" : "Active") : (lang === "fr" ? "Inactif" : "Inactive")}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className={`btn btn-sm ${z.active ? "btn-outline" : "btn-success"}`} onClick={() => toggleZone(i)}>{z.active ? <Pause size={14} /> : <Play size={14} />}</button>
                    <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => deleteZone(i)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
          <div style={{ padding: 16 }}><button className="btn btn-primary" onClick={save}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Save size={14} />{t("save")}</span></button></div>
        </div>
      )}

      {/* ═══ PUSH NOTIFICATIONS ═══ */}
      {tab === "notifs" && (
        <div className="card">
          <div className="card-header"><span className="card-title">{t("pushNotifications")}</span></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">{lang === "fr" ? "Titre" : "Title"}</label>
              <input className="form-input" value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder={lang === "fr" ? "Ex: Soldes de février !" : "Ex: February Sales!"} />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" rows={3} value={notifBody} onChange={e => setNotifBody(e.target.value)} style={{ resize: "vertical" }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              {[lang === "fr" ? "Tous" : "All", "Clients", lang === "fr" ? "Commerçants" : "Vendors", lang === "fr" ? "Livreurs" : "Drivers"].map((t, i) => (
                <label key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><input type="radio" name="target" defaultChecked={i === 0} /> {t}</label>
              ))}
            </div>
            {(notifTitle || notifBody) && (
              <div style={{ background: "var(--surface-2)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 8 }}>{lang === "fr" ? "Aperçu" : "Preview"}</div>
                <div style={{ background: "#fff", borderRadius: 12, padding: 14, boxShadow: "var(--shadow)", display: "flex", alignItems: "center", gap: 12 }}>
                  {localBranding.appLogo ? <img src={localBranding.appLogo} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} /> : <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>{localBranding.appName?.[0] || "L"}</div>}
                  <div><div style={{ fontWeight: 700, fontSize: 13 }}>{notifTitle || "..."}</div><div style={{ fontSize: 12, color: "var(--text-2)" }}>{notifBody || "..."}</div></div>
                </div>
              </div>
            )}
            <button className="btn btn-primary" disabled={!notifTitle.trim() || !notifBody.trim()}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Send size={14} />{t("sendToAll")}</span></button>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirmDelete} title={lang === "fr" ? "Supprimer ce plan ?" : "Delete this plan?"} message={confirmDelete?.name} danger confirmText={lang === "fr" ? "Supprimer" : "Delete"} onConfirm={() => deletePlan(confirmDelete?.id)} onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}
