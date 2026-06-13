import { useState } from "react";
import FilterSheet from "../../components/FilterSheet";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import Icon from "../../components/Icon";
import { useData } from "../../hooks";
import { fmt, getVendorPromo } from "../../utils/helpers";

// Normalize string for matching (lowercase, no accents, strip plurals)
const normalize = (s) => (s || "")
  .toString()
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/s$/, ""); // remove trailing plural s

function SearchScr({ go, onBack, fromTab, favs, toggleFav, isFav, defaultTab }) {
  const { P, VENDORS, CATS } = useData();
  const [q, setQ] = useState("");
  const [selectedCatId, setSelectedCatId] = useState("all"); // "all" or category id
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("popular");
  const [tab, setTab] = useState(defaultTab || "products");
  const [searchHistory, setSearchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lk-search-history") || "[]") } catch { return [] }
  });

  const addToHistory = (query) => {
    if (!query.trim()) return;
    const newH = [query, ...searchHistory.filter(h => h.toLowerCase() !== query.toLowerCase())].slice(0, 10);
    setSearchHistory(newH);
    try { localStorage.setItem("lk-search-history", JSON.stringify(newH)) } catch {}
  };
  const removeFromHistory = (query) => {
    const newH = searchHistory.filter(h => h !== query);
    setSearchHistory(newH);
    try { localStorage.setItem("lk-search-history", JSON.stringify(newH)) } catch {}
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== 0 && v !== "popular").length;
  const ql = q.toLowerCase();
  const isSearching = q.trim().length > 0;

  // Apply filters
  const applyFilters = (list) => {
    let r = [...list];
    if (filters.priceMin) r = r.filter(p => p.price >= filters.priceMin);
    if (filters.priceMax) r = r.filter(p => p.price <= filters.priceMax);
    if (filters.minRating) r = r.filter(p => p.rating >= filters.minRating);
    if (filters.onlyPromo) r = r.filter(p => p.old && p.old > p.price);
    return r;
  };

  // Search results
  const qn = normalize(q);
  const searchResults = applyFilters(P.filter(p =>
    normalize(p.name).includes(qn) ||
    normalize(p.cat).includes(qn) ||
    normalize(p.desc || "").includes(qn) ||
    normalize(p.vendor).includes(qn)
  )).sort((a, b) =>
    sortBy === "priceAsc" ? a.price - b.price :
    sortBy === "priceDesc" ? b.price - a.price :
    sortBy === "rating" ? b.rating - a.rating :
    b.reviews - a.reviews
  );
  const vendorResults = VENDORS.filter(v =>
    normalize(v.name).includes(qn) || normalize(v.desc || "").includes(qn)
  );

  const isAllSelected = selectedCatId === "all";
  const selectedCat = isAllSelected ? { id: "all", name: "Toutes catégories", icon: "📦", count: P.length, photo: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop", subs: null } : (CATS.find(c => c.id === selectedCatId) || CATS[0]);
  const catProducts = applyFilters(isAllSelected ? P : P.filter(p => p.cat === selectedCat.name));

  return (
    <div className="scr" style={{ padding: 0, display: "flex", flexDirection: "column" }}>

      {/* Top search bar */}
      <div style={{ padding: "12px 14px", background: "var(--card)", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid var(--border)" }}>
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
        <button onClick={() => setShowFilter(true)} style={{ width: 40, height: 40, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="filter" size={18} />
          {activeFilterCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: 8, background: "#F97316", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{activeFilterCount}</span>}
        </button>
      </div>

      {/* Sort & filters bar (when searching) */}
      {isSearching && (
        <div style={{ display: "flex", gap: 6, padding: "8px 14px", overflowX: "auto", scrollbarWidth: "none", background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          {[["popular", "🔥 Populaires"], ["rating", "⭐ Mieux notés"], ["priceAsc", "💰 Prix ↑"], ["priceDesc", "💰 Prix ↓"]].map(([k, l]) => (
            <button key={k} onClick={() => setSortBy(k)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 16, border: sortBy === k ? "2px solid #F97316" : "1px solid var(--border)", background: sortBy === k ? "rgba(249,115,22,0.06)" : "var(--card)", fontSize: 11, fontWeight: 600, color: sortBy === k ? "#F97316" : "var(--muted)", cursor: "pointer", fontFamily: "inherit" }}>{l}</button>
          ))}
        </div>
      )}

      {/* SEARCH MODE */}
      {isSearching ? (
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0", scrollbarWidth: "none" }} className="hide-scroll">
          {/* Tabs */}
          <div style={{ display: "flex", gap: 18, padding: "0 16px 12px", borderBottom: "1px solid var(--border)", marginBottom: 12 }}>
            <button onClick={() => setTab("products")} style={{ padding: "6px 0", border: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: tab === "products" ? "#F97316" : "var(--muted)", borderBottom: tab === "products" ? "2px solid #F97316" : "2px solid transparent", cursor: "pointer", fontFamily: "inherit" }}>Produits ({searchResults.length})</button>
            <button onClick={() => setTab("vendors")} style={{ padding: "6px 0", border: "none", background: "transparent", fontSize: 13, fontWeight: 700, color: tab === "vendors" ? "#F97316" : "var(--muted)", borderBottom: tab === "vendors" ? "2px solid #F97316" : "2px solid transparent", cursor: "pointer", fontFamily: "inherit" }}>Boutiques ({vendorResults.length})</button>
          </div>

          {tab === "products" ? (
            searchResults.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
                {searchResults.map(p => {
                  const vp = getVendorPromo(p, VENDORS);
                  const price = vp ? vp.promoPrice : p.price;
                  return (
                    <div key={p.id} onClick={() => go("detail", p)} style={{ cursor: "pointer" }}>
                      <div style={{ aspectRatio: "1 / 1", borderRadius: 12, overflow: "hidden", background: "var(--light)", position: "relative" }}>
                        <Img src={p.photo} emoji={p.img} style={{ width: "100%", height: "100%" }} fit="cover" />
                        {p.old && <span style={{ position: "absolute", top: 6, left: 6, padding: "2px 6px", borderRadius: 5, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800 }}>-{Math.round((1 - p.price / p.old) * 100)}%</span>}
                        <span onClick={e => { e.stopPropagation(); toggleFav(p.id) }} style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: isFav(p.id) ? "#EF4444" : "var(--muted)", cursor: "pointer" }}>{isFav(p.id) ? "♥" : "♡"}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3, minHeight: 31 }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.vendor}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 3 }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#F97316" }}>{fmt(price)}</span>
                        {p.old && <span style={{ fontSize: 10, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(p.old)}</span>}
                      </div>
                      <div style={{ fontSize: 10, color: "#F59E0B", marginTop: 2 }}>⭐ {p.rating} ({p.reviews})</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ marginBottom: 12, opacity: .3, display: "flex", justifyContent: "center" }}><Icon name="search" size={48} color="var(--muted)"/></div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>Aucun produit pour "{q}"</div>
              </div>
            )
          ) : (
            vendorResults.length > 0 ? (
              <div style={{ padding: "0 16px" }}>
                {vendorResults.map(v => (
                  <div key={v.id} onClick={() => go("vendor", v)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", cursor: "pointer", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 50, height: 50, borderRadius: 14, overflow: "hidden", background: "var(--light)", flexShrink: 0 }}>
                      {v.logo ? <img src={v.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{v.avatar || "🏪"}</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>⭐ {v.rating} · {v.type} · {v.eta || "30 min"}</div>
                    </div>
                    <Icon name="chevron_right" size={18} color="var(--muted)" />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <div style={{ marginBottom: 12, opacity: .3, display: "flex", justifyContent: "center" }}><Icon name="store" size={48} color="var(--muted)"/></div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>Aucune boutique pour "{q}"</div>
              </div>
            )
          )}
        </div>
      ) : (
        /* BROWSE MODE — sidebar + content */
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ width: 78, background: "var(--light)", overflowY: "auto", flexShrink: 0, scrollbarWidth: "none" }} className="hide-scroll">
            {/* "Toutes" as first item */}
            {(() => {
              const active = selectedCatId === "all";
              return (
                <div onClick={() => setSelectedCatId("all")} style={{ padding: "16px 8px", fontSize: 11.5, fontWeight: active ? 700 : 600, color: active ? "#F97316" : "var(--text)", cursor: "pointer", textAlign: "center", background: active ? "var(--card)" : "transparent", borderLeft: active ? "3px solid #F97316" : "3px solid transparent" }}>
                  Toutes
                </div>
              );
            })()}
            {CATS.map(c => {
              const active = c.id === selectedCatId;
              return (
                <div key={c.id} onClick={() => setSelectedCatId(c.id)} style={{ padding: "16px 8px", fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? "#F97316" : "var(--text)", cursor: "pointer", textAlign: "center", background: active ? "var(--card)" : "transparent", borderLeft: active ? "3px solid #F97316" : "3px solid transparent" }}>
                  {c.name}
                </div>
              );
            })}
          </div>

          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", background: "var(--card)", padding: "12px 12px 30px", scrollbarWidth: "none", boxSizing: "border-box", minWidth: 0 }} className="hide-scroll">
            {/* Category banner */}
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 14, position: "relative", aspectRatio: "16 / 8" }}>
              <img src={selectedCat.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 70%)", padding: 14, display: "flex", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -.3 }}>{selectedCat.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{catProducts.length} produits disponibles</div>
                </div>
              </div>
            </div>

            {/* Sub-categories OR All categories grid */}
            {isAllSelected ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Toutes les catégories</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 18 }}>
                  {CATS.map(c => (
                    <div key={c.id} onClick={() => setSelectedCatId(c.id)} style={{ textAlign: "center", cursor: "pointer" }}>
                      <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 10, overflow: "hidden", background: "var(--light)" }}>
                        <img src={c.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 5, color: "var(--text)", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 26 }}>{c.name}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : selectedCat.subs && (
              <>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10 }}>Catégories populaires</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 18 }}>
                  {selectedCat.subs.map((s, i) => (
                    <div key={i} onClick={() => setQ(s.name)} style={{ textAlign: "center", cursor: "pointer" }}>
                      <div style={{ width: "100%", aspectRatio: "1 / 1", borderRadius: 10, overflow: "hidden", background: "var(--light)" }}>
                        <img src={s.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 5, color: "var(--text)", lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 26 }}>{s.name}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Products */}
            {catProducts.length > 0 ? (
              <>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
                  <span>Recommandé ({catProducts.length})</span>
                  {activeFilterCount > 0 && <span style={{ fontSize: 11, color: "#F97316", fontWeight: 600 }}>{activeFilterCount} filtre{activeFilterCount > 1 ? "s" : ""}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {catProducts.map(p => {
                    const vp = getVendorPromo(p, VENDORS);
                    const price = vp ? vp.promoPrice : p.price;
                    return (
                      <div key={p.id} onClick={() => go("detail", p)} style={{ cursor: "pointer" }}>
                        <div style={{ aspectRatio: "1 / 1", borderRadius: 12, overflow: "hidden", background: "var(--light)", position: "relative" }}>
                          <Img src={p.photo} emoji={p.img} style={{ width: "100%", height: "100%" }} fit="cover" />
                          {p.old && <span style={{ position: "absolute", top: 6, left: 6, padding: "2px 6px", borderRadius: 5, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800 }}>-{Math.round((1 - p.price / p.old) * 100)}%</span>}
                          <span onClick={e => { e.stopPropagation(); toggleFav(p.id) }} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isFav(p.id) ? "#EF4444" : "var(--muted)", cursor: "pointer" }}>{isFav(p.id) ? "♥" : "♡"}</span>
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
            ) : (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ marginBottom: 10, opacity: .3, display: "flex", justifyContent: "center" }}><Icon name="package" size={40} color="var(--muted)"/></div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Aucun produit dans cette catégorie</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter sheet */}
      {showFilter && <FilterSheet filters={filters} setFilters={setFilters} onClose={() => setShowFilter(false)} />}
    </div>
  );
}

export default SearchScr;
