import { useState } from "react";

/**
 * Stories carousel — Instagram-style stories at top of Home
 * Tap → opens full-screen story viewer with real images
 */

// Real story background images mapped by vendor type
const STORY_IMAGES = {
  restaurant: [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=1400&fit=crop",
  ],
  patisserie: [
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=1400&fit=crop",
  ],
  supermarche: [
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=1400&fit=crop",
  ],
  boutique: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1400&fit=crop",
  ],
  pharmacie: [
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=1400&fit=crop",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&h=1400&fit=crop",
  ],
  service: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=1400&fit=crop",
  ],
};

const STORY_MESSAGES = {
  live: [
    { title: "Live shopping en cours !", desc: "Offres exclusives en direct" },
    { title: "Vente flash en LIVE", desc: "-30% pendant 15 minutes" },
  ],
  new: [
    { title: "Nouveautés du jour", desc: "Découvrez nos derniers arrivages" },
    { title: "Nouveau plat à la carte", desc: "À tester absolument" },
    { title: "Promo spéciale", desc: "Offre valable 24h seulement" },
  ],
  default: [
    { title: "Bienvenue !", desc: "Découvrez notre univers" },
  ],
};

function StoriesCarousel({ vendors, go }) {
  const [openStoryIdx, setOpenStoryIdx] = useState(null);

  const stories = (vendors || []).slice(0, 8).map((v, i) => {
    const pool = STORY_IMAGES[v.type] || STORY_IMAGES.boutique;
    const isLive = i % 5 === 0;
    const isNew = !isLive && i % 3 === 0;
    const msgPool = isLive ? STORY_MESSAGES.live : isNew ? STORY_MESSAGES.new : STORY_MESSAGES.default;
    return {
      id: v.id,
      name: v.name,
      avatar: v.logo || v.avatar || "🏪",
      bgImage: pool[i % pool.length],
      message: msgPool[i % msgPool.length],
      isLive,
      isNew,
      type: v.type,
      vendor: v,
    };
  });

  if (stories.length === 0) return null;

  return (
    <>
      <div style={{ padding: "12px 0 8px" }}>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 16px", scrollbarWidth: "none" }} className="hide-scroll">
          {stories.map((s, i) => (
            <div key={s.id} onClick={() => setOpenStoryIdx(i)} style={{ flexShrink: 0, textAlign: "center", cursor: "pointer", width: 64 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", padding: 2.5,
                background: s.isLive
                  ? "linear-gradient(135deg,#EF4444,#F97316)"
                  : s.isNew
                  ? "linear-gradient(135deg,#F97316,#EAB308,#EC4899)"
                  : "linear-gradient(135deg,var(--border),var(--border))",
                position: "relative",
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#fff", border: "2px solid #fff" }}>
                  {/* Use story bg image as thumbnail for richer preview */}
                  <img src={s.bgImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={s.name} />
                </div>
                {s.isLive && (
                  <div style={{ position: "absolute", bottom: -2, left: "50%", transform: "translateX(-50%)", padding: "1px 6px", borderRadius: 4, background: "#EF4444", color: "#fff", fontSize: 8, fontWeight: 800, letterSpacing: .5 }}>LIVE</div>
                )}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--sub)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name.split(" ")[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-screen story viewer with real background image */}
      {openStoryIdx !== null && (() => {
        const s = stories[openStoryIdx];
        return (
          <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column" }}>
            {/* Background image */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${s.bgImage})`,
              backgroundSize: "cover", backgroundPosition: "center",
            }} />
            {/* Dark gradient overlay for text readability */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.85) 100%)",
            }} />

            {/* Progress bars */}
            <div style={{ display: "flex", gap: 4, padding: "12px 12px 0", position: "relative", zIndex: 2 }}>
              {stories.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: "rgba(255,255,255,.3)", overflow: "hidden" }}>
                  <div style={{ width: i < openStoryIdx ? "100%" : i === openStoryIdx ? "100%" : "0%", height: "100%", background: "#fff", animation: i === openStoryIdx ? "storyProgress 5s linear forwards" : "none" }} />
                </div>
              ))}
            </div>

            <style>{`@keyframes storyProgress { from{width:0%}to{width:100%} }`}</style>

            {/* Story header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", position: "relative", zIndex: 2 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", background: "#fff" }}>
                {typeof s.avatar === "string" && s.avatar.startsWith("http") ? (
                  <img src={s.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{s.avatar}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{s.name}{s.isLive && <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800 }}>LIVE</span>}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>il y a 2h</div>
              </div>
              <button onClick={() => setOpenStoryIdx(null)} style={{ background: "rgba(0,0,0,0.3)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>

            {/* Story content — tap to next */}
            <div onClick={() => setOpenStoryIdx(openStoryIdx + 1 < stories.length ? openStoryIdx + 1 : null)} style={{ flex: 1, cursor: "pointer", position: "relative", zIndex: 2, display: "flex", alignItems: "flex-end", padding: "32px" }}>
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.7)" }}>
                  {s.message.title}
                </div>
                <div style={{ fontSize: 14, opacity: .95, textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                  {s.message.desc}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: 16, position: "relative", zIndex: 2 }}>
              <button onClick={() => { setOpenStoryIdx(null); go("vendor", s.vendor); }} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: "rgba(255,255,255,.95)", color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {s.isLive ? "🔴 Rejoindre le live" : `Voir ${s.name} →`}
              </button>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default StoriesCarousel;
