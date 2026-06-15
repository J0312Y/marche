import { useState } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";

/**
 * VWebCMSScr — Web CMS dashboard for Enterprise vendors
 * WordPress/Webflow-like admin for managing the vendor's web storefront
 */
function VWebCMSScr({ onBack, go }) {
  const [active, setActive] = useState("dashboard");

  // ═══════════════════════════════════════════════════════
  //  SECTIONS
  // ═══════════════════════════════════════════════════════

  const NAV_SECTIONS = [
    { id: "dashboard", icon: "dashboard", label: "Tableau de bord" },
    { id: "pages", icon: "document", label: "Pages" },
    { id: "blog", icon: "edit", label: "Blog" },
    { id: "products", icon: "package", label: "Produits" },
    { id: "media", icon: "photo", label: "Médiathèque" },
    { id: "seo", icon: "search", label: "SEO" },
    { id: "theme", icon: "sparkle", label: "Thème" },
    { id: "menus", icon: "settings", label: "Menus" },
    { id: "analytics", icon: "chart_pie", label: "Analytics" },
    { id: "forms", icon: "mail", label: "Formulaires" },
    { id: "settings", icon: "tool", label: "Paramètres" },
  ];

  return (
    <div className="scr" style={{ background: "#F9FAFB", minHeight: "100vh", paddingBottom: 100 }}>
      {/* HEADER */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#0F172A",
        padding: "14px 16px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.1)",
            border: "none", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <Icon name="arrow_left" size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>Lamuka CMS Enterprise</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>Mon site web</div>
          </div>
          <button onClick={() => toast.success("Modifications publiées !")} style={{
            padding: "8px 14px", borderRadius: 8,
            border: "none", background: "#10B981",
            color: "#fff", fontSize: 11, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <Icon name="check" size={12} color="#fff" />
            Publier
          </button>
        </div>

        {/* Domain pill */}
        <div style={{
          marginTop: 12,
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: 100,
          fontSize: 11, color: "#94A3B8", fontWeight: 600,
        }}>
          <Icon name="globe" size={12} color="#10B981" />
          modeafrique.lamuka.cg
          <span style={{ marginLeft: 4, padding: "2px 6px", background: "#10B981", borderRadius: 6, color: "#fff", fontWeight: 700, fontSize: 9 }}>EN LIGNE</span>
        </div>
      </div>

      {/* NAV TABS - horizontal scroll */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #E5E7EB",
        overflowX: "auto",
        scrollbarWidth: "none",
        position: "sticky", top: 78, zIndex: 9,
      }} className="hide-scroll">
        <div style={{ display: "flex", padding: "0 12px", gap: 4 }}>
          {NAV_SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              padding: "12px 14px",
              border: "none",
              background: "transparent",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: 12, fontWeight: 600,
              color: active === s.id ? "#F97316" : "#6B7280",
              borderBottom: active === s.id ? "3px solid #F97316" : "3px solid transparent",
              display: "flex", alignItems: "center", gap: 6,
              whiteSpace: "nowrap",
              transition: "all .15s",
            }}>
              <Icon name={s.icon} size={14} color={active === s.id ? "#F97316" : "#6B7280"} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "16px" }}>
        {active === "dashboard" && <DashboardSection toast={toast} />}
        {active === "pages" && <PagesSection toast={toast} />}
        {active === "blog" && <BlogSection toast={toast} />}
        {active === "products" && <ProductsSection toast={toast} />}
        {active === "media" && <MediaSection toast={toast} />}
        {active === "seo" && <SEOSection toast={toast} />}
        {active === "theme" && <ThemeSection toast={toast} />}
        {active === "menus" && <MenusSection toast={toast} />}
        {active === "analytics" && <AnalyticsSection />}
        {active === "forms" && <FormsSection toast={toast} />}
        {active === "settings" && <SettingsSection toast={toast} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: DASHBOARD
// ═══════════════════════════════════════════════════════

function DashboardSection({ toast }) {
  const stats = [
    { label: "Visiteurs aujourd'hui", value: "1 247", delta: "+12%", color: "#3B82F6", icon: "user" },
    { label: "Pages vues", value: "4 892", delta: "+8%", color: "#10B981", icon: "document" },
    { label: "Conversions", value: "47", delta: "+23%", color: "#F97316", icon: "target" },
    { label: "Score SEO", value: "82/100", delta: "+5", color: "#8B5CF6", icon: "trendUp" },
  ];

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "#fff", padding: 14, borderRadius: 14,
            border: "1px solid #E5E7EB",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `${s.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={s.icon} size={16} color={s.color} />
              </div>
              <span style={{ fontSize: 10, color: "#10B981", fontWeight: 700, background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 4 }}>{s.delta}</span>
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: "#1F2937", letterSpacing: -0.3 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <SectionTitle title="Actions rapides" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { icon: "plus", label: "Nouvelle page", color: "#3B82F6" },
          { icon: "edit", label: "Nouvel article", color: "#F97316" },
          { icon: "photo", label: "Uploader image", color: "#10B981" },
          { icon: "sparkle", label: "Changer thème", color: "#8B5CF6" },
        ].map((a, i) => (
          <button key={i} onClick={() => toast.success("Action : " + a.label)} style={{
            padding: 14, borderRadius: 14,
            background: "#fff", border: "1px solid #E5E7EB",
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: `${a.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={a.icon} size={18} color={a.color} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1F2937" }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* Recent activity */}
      <SectionTitle title="Activité récente" />
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {[
          { icon: "check_circle", label: "Page \"Accueil\" publiée", time: "Il y a 2h", color: "#10B981" },
          { icon: "edit", label: "Article \"Mode 2026\" modifié", time: "Il y a 5h", color: "#F97316" },
          { icon: "photo", label: "5 images ajoutées", time: "Hier", color: "#3B82F6" },
          { icon: "globe", label: "Domaine vérifié", time: "Il y a 2 jours", color: "#8B5CF6" },
        ].map((a, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px",
            borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `${a.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon name={a.icon} size={14} color={a.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{a.label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 1 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: PAGES
// ═══════════════════════════════════════════════════════

function PagesSection({ toast }) {
  const [pages] = useState([
    { id: 1, title: "Accueil", slug: "/", status: "published", views: 2451, updated: "Il y a 2h" },
    { id: 2, title: "À propos", slug: "/about", status: "published", views: 482, updated: "Hier" },
    { id: 3, title: "Contact", slug: "/contact", status: "published", views: 1289, updated: "Il y a 3j" },
    { id: 4, title: "FAQ", slug: "/faq", status: "draft", views: 0, updated: "Il y a 5j" },
    { id: 5, title: "Conditions générales", slug: "/cgv", status: "published", views: 47, updated: "Il y a 2 sem." },
  ]);

  return (
    <div>
      <ListHeader title="Pages" count={pages.length} onAdd={() => toast.success("Nouvelle page créée")} />
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {pages.map((p, i) => (
          <div key={p.id} style={{
            padding: "14px",
            borderBottom: i < pages.length - 1 ? "1px solid #F3F4F6" : "none",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(249,115,22,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, color: "#F97316",
            }}>
              <Icon name="document" size={16} color="#F97316" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{p.title}</div>
                <StatusBadge status={p.status} />
              </div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{p.slug} · {p.views} vues · {p.updated}</div>
            </div>
            <button onClick={() => toast.success("Édition : " + p.title)} style={{
              width: 30, height: 30, borderRadius: 8,
              border: "none", background: "rgba(0,0,0,0.04)",
              cursor: "pointer", color: "#6B7280",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="edit" size={14} color="#6B7280" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: BLOG
// ═══════════════════════════════════════════════════════

function BlogSection({ toast }) {
  const [articles] = useState([
    { id: 1, title: "Les tendances mode 2026 au Congo", category: "Mode", views: 1842, comments: 23, status: "published", date: "12 Fév 2026" },
    { id: 2, title: "Comment porter le wax cette saison", category: "Mode", views: 967, comments: 12, status: "published", date: "5 Fév 2026" },
    { id: 3, title: "Nouveau partenariat avec MTN Mobile Money", category: "News", views: 2103, comments: 45, status: "published", date: "28 Jan 2026" },
    { id: 4, title: "Brouillon — Nos engagements RSE", category: "Engagement", views: 0, comments: 0, status: "draft", date: "—" },
  ]);

  return (
    <div>
      <ListHeader title="Articles de blog" count={articles.length} onAdd={() => toast.success("Nouvel article créé")} />
      <div style={{ display: "grid", gap: 10 }}>
        {articles.map(a => (
          <div key={a.id} style={{
            background: "#fff", padding: 14, borderRadius: 14,
            border: "1px solid #E5E7EB",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#F97316", background: "rgba(249,115,22,0.08)", padding: "2px 7px", borderRadius: 4 }}>{a.category}</span>
              <StatusBadge status={a.status} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 8 }}>{a.title}</div>
            <div style={{ display: "flex", gap: 14, fontSize: 10, color: "#9CA3AF" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Icon name="user" size={11} color="#9CA3AF" />{a.views} vues</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Icon name="chat" size={11} color="#9CA3AF" />{a.comments} comm.</span>
              <span>{a.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: PRODUCTS
// ═══════════════════════════════════════════════════════

function ProductsSection({ toast }) {
  return (
    <div>
      <ListHeader title="Affichage produits" count={67} onAdd={() => toast.success("Configurer l'affichage")} addLabel="Configurer" />
      
      <div style={{ background: "#fff", padding: 16, borderRadius: 14, border: "1px solid #E5E7EB", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 12, letterSpacing: 0.4 }}>VITRINE PUBLIQUE</div>
        {[
          { label: "Afficher les produits hors stock", on: false },
          { label: "Trier par popularité par défaut", on: true },
          { label: "Afficher la note moyenne", on: true },
          { label: "Activer le zoom au survol", on: true },
          { label: "Afficher les avis clients", on: true },
        ].map((o, i, arr) => (
          <ToggleRow key={i} label={o.label} initial={o.on} last={i === arr.length - 1} />
        ))}
      </div>

      <SectionTitle title="Mise en avant" />
      <div style={{ background: "#fff", padding: 16, borderRadius: 14, border: "1px solid #E5E7EB" }}>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Sélectionnez jusqu'à 8 produits à mettre en avant sur la page d'accueil de votre site.</div>
        <button onClick={() => toast.success("Sélection de produits")} style={{
          width: "100%", padding: 11, borderRadius: 10,
          border: "1.5px dashed #F97316", background: "rgba(249,115,22,0.04)",
          color: "#F97316", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <Icon name="plus" size={14} color="#F97316" />
          Choisir les produits vedettes
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: MEDIA
// ═══════════════════════════════════════════════════════

function MediaSection({ toast }) {
  const mediaCount = 142;
  return (
    <div>
      <ListHeader title="Médiathèque" count={mediaCount} onAdd={() => toast.success("Upload de média")} addLabel="Uploader" />
      
      <button onClick={() => toast.success("Sélecteur de fichier")} style={{
        width: "100%", padding: 30, borderRadius: 14,
        border: "2px dashed #E5E7EB", background: "#fff",
        cursor: "pointer", fontFamily: "inherit",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        marginBottom: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "rgba(249,115,22,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="photo" size={24} color="#F97316" />
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>Glissez vos fichiers ici</div>
        <div style={{ fontSize: 10, color: "#9CA3AF" }}>PNG, JPG, MP4 · Max 50 MB</div>
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: "1 / 1", borderRadius: 10,
            background: `linear-gradient(135deg, #${(["F97316", "10B981", "3B82F6", "8B5CF6", "F59E0B", "EF4444"][i % 6])}30, #${(["F97316", "10B981", "3B82F6", "8B5CF6", "F59E0B", "EF4444"][i % 6])}15)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 10, fontWeight: 700,
          }}>
            <Icon name="image" size={22} color={`#${["F97316", "10B981", "3B82F6", "8B5CF6", "F59E0B", "EF4444"][i % 6]}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: SEO
// ═══════════════════════════════════════════════════════

function SEOSection({ toast }) {
  const score = 82;
  return (
    <div>
      {/* Score circle */}
      <div style={{
        background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        padding: 20, borderRadius: 16,
        color: "#fff", marginBottom: 16,
        textAlign: "center",
      }}>
        <div style={{ fontSize: 11, opacity: 0.9, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>SCORE SEO GLOBAL</div>
        <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>{score}<span style={{ fontSize: 18, opacity: 0.7 }}>/100</span></div>
        <div style={{ fontSize: 11, opacity: 0.9, marginTop: 6 }}>Bon · Quelques optimisations possibles</div>
      </div>

      <SectionTitle title="Diagnostic" />
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden", marginBottom: 16 }}>
        {[
          { label: "Balises title optimisées", ok: true },
          { label: "Meta descriptions présentes", ok: true },
          { label: "Images avec balises alt", ok: false, hint: "12 images sans alt" },
          { label: "Sitemap XML généré", ok: true },
          { label: "Temps de chargement < 3s", ok: true },
          { label: "HTTPS activé", ok: true },
          { label: "Mots-clés ciblés", ok: false, hint: "Page Contact non optimisée" },
        ].map((c, i, arr) => (
          <div key={i} style={{
            padding: "12px 14px",
            borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: c.ok ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={c.ok ? "check" : "close"} size={12} color={c.ok ? "#10B981" : "#EF4444"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{c.label}</div>
              {c.hint && <div style={{ fontSize: 10, color: "#EF4444", marginTop: 1 }}>{c.hint}</div>}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => toast.success("Optimisation automatique lancée")} style={{
        width: "100%", padding: 13, borderRadius: 14,
        border: "none", background: "#F97316",
        color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <Icon name="sparkle" size={14} color="#fff" />
        Optimiser automatiquement
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: THEME
// ═══════════════════════════════════════════════════════

function ThemeSection({ toast }) {
  const [selectedTheme, setSelectedTheme] = useState("classic");

  const themes = [
    { id: "classic", name: "Classique", color1: "#F97316", color2: "#FFF7ED" },
    { id: "modern", name: "Moderne", color1: "#3B82F6", color2: "#EFF6FF" },
    { id: "luxe", name: "Luxe", color1: "#1F2937", color2: "#F9FAFB" },
    { id: "nature", name: "Nature", color1: "#10B981", color2: "#F0FDF4" },
    { id: "vibrant", name: "Vibrant", color1: "#8B5CF6", color2: "#FAF5FF" },
  ];

  return (
    <div>
      <SectionTitle title="Thèmes disponibles" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {themes.map(t => (
          <div key={t.id} onClick={() => { setSelectedTheme(t.id); toast.success("Thème " + t.name + " sélectionné") }} style={{
            background: "#fff",
            borderRadius: 14,
            border: selectedTheme === t.id ? "2px solid #F97316" : "1px solid #E5E7EB",
            cursor: "pointer", overflow: "hidden",
          }}>
            <div style={{
              height: 80,
              background: `linear-gradient(135deg, ${t.color1}, ${t.color2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative",
            }}>
              {selectedTheme === t.id && <div style={{ position: "absolute", top: 6, right: 6, width: 22, height: 22, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={12} color="#F97316" /></div>}
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: "rgba(255,255,255,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: t.color1,
              }}>
                <Icon name="store" size={16} color={t.color1} />
              </div>
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{t.name}</div>
              <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>Personnalisable</div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle title="Personnalisation" />
      <div style={{ background: "#fff", padding: 16, borderRadius: 14, border: "1px solid #E5E7EB" }}>
        {[
          { label: "Couleur principale", value: "#F97316", swatch: true },
          { label: "Couleur secondaire", value: "#FFF7ED", swatch: true },
          { label: "Police titres", value: "Inter Bold" },
          { label: "Police texte", value: "Inter Regular" },
          { label: "Border radius", value: "14px" },
        ].map((opt, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none",
          }}>
            <div style={{ fontSize: 12, color: "#1F2937", fontWeight: 600 }}>{opt.label}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {opt.swatch && <div style={{ width: 18, height: 18, borderRadius: 5, background: opt.value, border: "1px solid #E5E7EB" }} />}
              <div style={{ fontSize: 11, color: "#6B7280", fontFamily: "monospace" }}>{opt.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: MENUS
// ═══════════════════════════════════════════════════════

function MenusSection({ toast }) {
  return (
    <div>
      <SectionTitle title="Menu principal" />
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden", marginBottom: 16 }}>
        {[
          { label: "Accueil", link: "/" },
          { label: "Boutique", link: "/shop" },
          { label: "À propos", link: "/about" },
          { label: "Blog", link: "/blog" },
          { label: "Contact", link: "/contact" },
        ].map((m, i, arr) => (
          <div key={i} style={{
            padding: "12px 14px",
            borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Icon name="settings" size={14} color="#9CA3AF" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{m.label}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{m.link}</div>
            </div>
            <Icon name="edit" size={14} color="#6B7280" />
          </div>
        ))}
      </div>
      <button onClick={() => toast.success("Élément ajouté")} style={{
        width: "100%", padding: 12, borderRadius: 12,
        border: "1.5px dashed #F97316", background: "rgba(249,115,22,0.04)",
        color: "#F97316", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <Icon name="plus" size={14} color="#F97316" />
        Ajouter un élément
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: ANALYTICS
// ═══════════════════════════════════════════════════════

function AnalyticsSection() {
  return (
    <div>
      <div style={{
        background: "#0F172A",
        borderRadius: 16, padding: 18,
        color: "#fff", marginBottom: 16,
      }}>
        <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, letterSpacing: 0.5 }}>VISITEURS · 7 DERNIERS JOURS</div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, marginTop: 4 }}>8 421</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, padding: "3px 8px", background: "rgba(16,185,129,0.2)", borderRadius: 6, fontSize: 10, color: "#10B981", fontWeight: 700 }}>
          <Icon name="trendUp" size={10} color="#10B981" /> +24% vs semaine dernière
        </div>
        {/* Mini chart bars */}
        <div style={{ display: "flex", gap: 4, marginTop: 16, alignItems: "flex-end", height: 50 }}>
          {[60, 80, 45, 90, 75, 100, 85].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: "rgba(249,115,22,0.7)", borderRadius: 3 }} />
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, marginTop: 6, fontSize: 9, color: "#94A3B8" }}>
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} style={{ flex: 1, textAlign: "center" }}>{d}</div>)}
        </div>
      </div>

      <SectionTitle title="Pages les plus vues" />
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        {[
          { label: "Accueil", views: 2451, pct: 92 },
          { label: "Boutique", views: 1289, pct: 48 },
          { label: "À propos", views: 482, pct: 18 },
          { label: "Contact", views: 287, pct: 11 },
        ].map((p, i, arr) => (
          <div key={i} style={{
            padding: 12,
            borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{p.label}</div>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 700 }}>{p.views}</div>
            </div>
            <div style={{ height: 5, borderRadius: 4, background: "#F3F4F6", overflow: "hidden" }}>
              <div style={{ width: p.pct + "%", height: "100%", background: "linear-gradient(90deg, #F97316, #EA580C)", borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: FORMS
// ═══════════════════════════════════════════════════════

function FormsSection({ toast }) {
  return (
    <div>
      <ListHeader title="Formulaires" count={3} onAdd={() => toast.success("Nouveau formulaire créé")} />
      <div style={{ display: "grid", gap: 10 }}>
        {[
          { name: "Contact", submissions: 47, fields: 4 },
          { name: "Newsletter", submissions: 312, fields: 1 },
          { name: "Devis sur mesure", submissions: 18, fields: 8 },
        ].map(f => (
          <div key={f.name} style={{ background: "#fff", padding: 14, borderRadius: 14, border: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{f.name}</div>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#10B981", background: "rgba(16,185,129,0.1)", padding: "2px 7px", borderRadius: 4 }}>ACTIF</span>
            </div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{f.fields} champs · {f.submissions} soumissions</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  SECTION: SETTINGS
// ═══════════════════════════════════════════════════════

function SettingsSection({ toast }) {
  return (
    <div>
      <SectionTitle title="Informations générales" />
      <div style={{ background: "#fff", padding: 14, borderRadius: 14, border: "1px solid #E5E7EB", marginBottom: 16 }}>
        {[
          { label: "Nom du site", value: "Mode Afrique" },
          { label: "Slogan", value: "L'élégance africaine" },
          { label: "Domaine", value: "modeafrique.lamuka.cg" },
          { label: "Email contact", value: "contact@modeafrique.cg" },
        ].map((s, i, arr) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, marginBottom: 4 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontSize: 13, color: "#1F2937", fontWeight: 600 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <SectionTitle title="Réseaux sociaux" />
      <div style={{ background: "#fff", padding: 14, borderRadius: 14, border: "1px solid #E5E7EB", marginBottom: 16 }}>
        {[
          { label: "Facebook", value: "@modeafrique", icon: "globe" },
          { label: "Instagram", value: "@modeafrique_off", icon: "camera" },
          { label: "WhatsApp", value: "+242 06 466 34 69", icon: "chat" },
        ].map((s, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
            <Icon name={s.icon} size={14} color="#6B7280" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.label}</div>
              <div style={{ fontSize: 12, color: "#1F2937", fontWeight: 600 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => toast.error("Action irréversible")} style={{
        width: "100%", padding: 13, borderRadius: 12,
        border: "1px solid #EF4444", background: "#fff",
        color: "#EF4444", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
      }}>
        Mettre le site en maintenance
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  HELPER COMPONENTS
// ═══════════════════════════════════════════════════════

function SectionTitle({ title }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: 0.5, margin: "16px 4px 8px" }}>
      {title.toUpperCase()}
    </div>
  );
}

function ListHeader({ title, count, onAdd, addLabel = "Ajouter" }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", letterSpacing: -0.3 }}>{title}</div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>{count} éléments</div>
      </div>
      <button onClick={onAdd} style={{
        padding: "8px 14px", borderRadius: 10,
        border: "none", background: "#F97316",
        color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        <Icon name="plus" size={12} color="#fff" />
        {addLabel}
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    published: { bg: "rgba(16,185,129,0.1)", color: "#10B981", label: "PUBLIÉ" },
    draft: { bg: "rgba(156,163,175,0.15)", color: "#6B7280", label: "BROUILLON" },
  };
  const s = styles[status] || styles.draft;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700,
      color: s.color, background: s.bg,
      padding: "2px 7px", borderRadius: 4,
    }}>{s.label}</span>
  );
}

function ToggleRow({ label, initial, last }) {
  const [on, setOn] = useState(initial);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: last ? "none" : "1px solid #F3F4F6",
    }}>
      <div style={{ fontSize: 12, color: "#1F2937", fontWeight: 600 }}>{label}</div>
      <div onClick={() => setOn(!on)} style={{
        width: 38, height: 22, borderRadius: 100,
        background: on ? "#10B981" : "#E5E7EB",
        position: "relative", cursor: "pointer",
        transition: "all .15s",
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff",
          position: "absolute", top: 2,
          left: on ? 18 : 2,
          transition: "all .15s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

export default VWebCMSScr;
