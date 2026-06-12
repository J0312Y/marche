import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import Icon from "../../components/Icon";
import { useData } from "../../hooks";
import { fmt, getVendorPromo } from "../../utils/helpers";

function SearchScr({ go, onBack, fromTab, favs, toggleFav, isFav, defaultTab }) {
  const { P, VENDORS, CATS } = useData();
  const [q, setQ] = useState("");
  const [selectedCatId, setSelectedCatId] = useState(CATS[0].id);
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lk-search-history") || "[]") } catch { return [] }
  });

  const addToHistory = (query) => {
    if (!query.trim()) return;
    const newH = [query, ...searchHistory.filter(h => h.toLowerCase() !== query.toLowerCase())].slice(0, 10);
    setSearchHistory(newH);
    try { localStorage.setItem("lk-search-history", JSON.stringify(newH)) } catch {}
  };

  const ql = q.toLowerCase();
  const isSearching = q.trim().length > 0;

  // Search results
  const searchResults = P.filter(p =>
    p.name.toLowerCase().includes(ql) ||
    p.cat.toLowerCase().includes(ql) ||
    p.vendor.toLowerCase().includes(ql)
  );
  const vendorResults = VENDORS.filter(v =>
    v.name.toLowerCase().includes(ql) ||
    (v.desc || "").toLowerCase().includes(ql)
  );

  // Selected category for browse mode
  const selectedCat = CATS.find(c => c.id === selectedCatId) || CATS[0];
  const catProducts = P.filter(p => p.cat === selectedCat.name).slice(0, 10);

  // Trending searches (mock)
  const trending = ["Wax moderne", "Poulet DG", "Smartphone", "Croissants", "Robe enfant", "Doliprane"];

  return (
    <div className="scr" style={{ padding: 0, display: "flex", flexDirection: "column" }}>

      {/* Top search bar */}
      <div style={{ padding: "12px 14px", background: "var(--card)", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid var(--border)" }}>
        {!fromTab && <button onClick={onBack} style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="arrow_left" size={20} /></button>}
        <div style={{ flex: 1, height: 40, background: "var(--light)", border: "1.5px solid #F97316", borderRadius: 22, display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
          <Icon name="search" size={16} color="var(--muted)" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") addToHistory(q) }}
            placeholder="Rechercher un produit..."
            style={{ flex: 1, border: 0, background: "transparent", outline: 0, fontSize: 14, fontFamily: "inherit", color: "var(--text)" }}
          />
          <span onClick={() => go("qrScan")} style={{ cursor: "pointer", display: "flex", alignItems: "center", color: "var(--muted)" }}><Icon name="camera" size={18} /></span>
        </div>
        <button onClick={() => addToHistory(q)} style={{ padding: "8px 14px", borderRadius: 18, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Rechercher</button>
      </div>

      {/* SEARCH MODE — when typing */}
      {isSearching ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {/* Quick results */}
          {searchResults.length > 0 && (
            <>
              <div style={{ padding: "0 16px 8px", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                {searchResults.length} produit{searchResults.length > 1 ? "s" : ""}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
                {searchResults.slice(0, 8).map(p => {
                  const vp = getVendorPromo(p, VENDORS);
                  const price = vp ? vp.promoPrice : p.price;
                  return (
                    <div key={p.id} onClick={() => go("detail", p)} style={{ cursor: "pointer" }}>
                      <div style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "var(--light)", position: "relative" }}>
                        <Img src={p.photo} emoji={p.img} style={{ width: "100%", height: "100%" }} fit="cover" />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#F97316", marginTop: 2 }}>{fmt(price)}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {vendorResults.length > 0 && (
            <>
              <div style={{ padding: "16px 16px 8px", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                Boutiques
              </div>
              {vendorResults.slice(0, 5).map(v => (
                <div key={v.id} onClick={() => go("vendor", v)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, overflow: "hidden", background: "var(--light)" }}>
                    {v.logo ? <img src={v.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{v.avatar || "🏪"}</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{v.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>⭐ {v.rating} · {v.type}</div>
                  </div>
                  <span style={{ color: "var(--muted)" }}>›</span>
                </div>
              ))}
            </>
          )}
          {searchResults.length === 0 && vendorResults.length === 0 && (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 12, opacity: .3 }}>🔍</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>Aucun résultat pour "{q}"</div>
            </div>
          )}
        </div>
      ) : (
        /* BROWSE MODE — Taobao-style sidebar + content */
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* LEFT SIDEBAR — vertical categories */}
          <div style={{ width: 92, background: "var(--light)", overflowY: "auto", flexShrink: 0, scrollbarWidth: "none" }} className="hide-scroll">
            {CATS.map(c => {
              const active = c.id === selectedCatId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCatId(c.id)}
                  style={{
                    padding: "16px 8px",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#F97316" : "var(--text)",
                    cursor: "pointer",
                    textAlign: "center",
                    background: active ? "var(--card)" : "transparent",
                    borderLeft: active ? "3px solid #F97316" : "3px solid transparent",
                    position: "relative",
                  }}
                >
                  {c.name}
                </div>
              );
            })}
          </div>

          {/* RIGHT CONTENT — selected category */}
          <div style={{ flex: 1, overflowY: "auto", background: "var(--card)", padding: "14px 14px 30px" }}>

            {/* Category banner */}
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 14, position: "relative", aspectRatio: "21/9" }}>
              {selectedCat.photo ? (
                <img src={selectedCat.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #F97316, #FB923C)" }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 70%)", padding: 14, display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -.3 }}>{selectedCat.icon} {selectedCat.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{selectedCat.count} produits disponibles</div>
                </div>
              </div>
            </div>

            {/* Sub-categories grid */}
            {selectedCat.subs && (
              <>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Catégories populaires</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
                  {selectedCat.subs.map((s, i) => (
                    <div key={i} onClick={() => { setQ(s.name); }} style={{ textAlign: "center", cursor: "pointer" }}>
                      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 10, overflow: "hidden", background: "var(--light)" }}>
                        <img src={s.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                    </div>
                  ))}
                </div>
                <div onClick={() => go("allProducts")} style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 18, cursor: "pointer" }}>
                  Voir plus ▾
                </div>
              </>
            )}

            {/* Products in this category */}
            {catProducts.length > 0 && (
              <>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>Recommandé pour toi</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {catProducts.map(p => {
                    const vp = getVendorPromo(p, VENDORS);
                    const price = vp ? vp.promoPrice : p.price;
                    return (
                      <div key={p.id} onClick={() => go("detail", p)} style={{ cursor: "pointer" }}>
                        <div style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", background: "var(--light)", position: "relative" }}>
                          <Img src={p.photo} emoji={p.img} style={{ width: "100%", height: "100%" }} fit="cover" />
                          {p.old && <span style={{ position: "absolute", top: 6, left: 6, padding: "2px 6px", borderRadius: 5, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800 }}>-{Math.round((1-p.price/p.old)*100)}%</span>}
                        </div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3, minHeight: 30 }}>{p.name}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#F97316" }}>{fmt(price)}</span>
                          {p.reviews && <span style={{ fontSize: 9, color: "var(--muted)" }}>{p.reviews}+ vendus</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {catProducts.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 10, opacity: .3 }}>{selectedCat.icon}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Aucun produit dans cette catégorie pour le moment</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trending searches — shown when search is focused but empty */}
      {!isSearching && false && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 8 }}>Tendances</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {trending.map(t => (
              <span key={t} onClick={() => setQ(t)} style={{ padding: "5px 10px", borderRadius: 14, background: "var(--light)", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchScr;
