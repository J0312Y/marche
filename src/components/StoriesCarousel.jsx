import { useState } from "react";

/**
 * Stories carousel — Instagram-style stories at top of Home
 * Tap → opens full-screen story viewer
 */
function StoriesCarousel({ vendors, go }) {
  const [openStoryIdx, setOpenStoryIdx] = useState(null);

  // Take vendors with logos as story sources
  const stories = (vendors || []).slice(0, 8).map((v, i) => ({
    id: v.id,
    name: v.name,
    avatar: v.logo || v.avatar || "🏪",
    isLive: i % 5 === 0,        // every 5th is "LIVE"
    isNew: i % 3 === 0,         // every 3rd has new content
    type: v.type,
    vendor: v,
  }));

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
                  {typeof s.avatar === "string" && s.avatar.startsWith("http") ? (
                    <img src={s.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, background: "var(--light)" }}>{s.avatar}</div>
                  )}
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

      {/* Full-screen story viewer */}
      {openStoryIdx !== null && (() => {
        const s = stories[openStoryIdx];
        return (
          <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column" }}>
            {/* Progress bars */}
            <div style={{ display: "flex", gap: 4, padding: "12px 12px 0" }}>
              {stories.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: "rgba(255,255,255,.3)", overflow: "hidden" }}>
                  <div style={{ width: i < openStoryIdx ? "100%" : i === openStoryIdx ? "100%" : "0%", height: "100%", background: "#fff", animation: i === openStoryIdx ? "storyProgress 4s linear forwards" : "none" }} />
                </div>
              ))}
            </div>

            <style>{`@keyframes storyProgress { from{width:0%}to{width:100%} }`}</style>

            {/* Story header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", overflow: "hidden", border: "2px solid #fff", background: "#fff" }}>
                {typeof s.avatar === "string" && s.avatar.startsWith("http") ? (
                  <img src={s.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{s.avatar}</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.name}{s.isLive && <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 4, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 800 }}>LIVE</span>}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)" }}>il y a 2h</div>
              </div>
              <button onClick={() => setOpenStoryIdx(null)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: 24, cursor: "pointer" }}>✕</button>
            </div>

            {/* Story content (mock) */}
            <div onClick={() => setOpenStoryIdx(openStoryIdx + 1 < stories.length ? openStoryIdx + 1 : null)} style={{ flex: 1, background: `linear-gradient(135deg,${s.isLive ? "#EF4444" : "#F97316"},#9333EA)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", padding: 32, textAlign: "center", cursor: "pointer" }}>
              <div>
                <div style={{ fontSize: 64, marginBottom: 16 }}>{s.isLive ? "🔴" : "✨"}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                  {s.isLive ? "Live shopping en cours !" : "Nouveautés du jour"}
                </div>
                <div style={{ fontSize: 14, opacity: .9 }}>
                  {s.isLive ? "Rejoignez et profitez des offres exclusives" : `Découvrez les produits chez ${s.name}`}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ padding: 16 }}>
              <button onClick={() => { setOpenStoryIdx(null); go("vendor", s.vendor); }} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: "rgba(255,255,255,.2)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", backdropFilter: "blur(10px)" }}>
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
