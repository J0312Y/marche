import { useState } from "react";
import { D_DELIVERIES } from "../../data/driverData";
import { fmt } from "../../utils/helpers";
import PullToRefresh from "../../components/PullToRefresh";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";

function DrDeliveriesScr({ go, onBack }) {
  const [filter, setFilter] = useState("active"); // active | pending | done
  const [accepting, setAccepting] = useState(null);

  const pending = D_DELIVERIES.filter(x => x.status === "pending");
  const active = D_DELIVERIES.filter(x => x.status === "active");
  const done = D_DELIVERIES.filter(x => x.status === "done");

  const list = filter === "active" ? active : filter === "pending" ? pending : done;

  const acceptOrder = (id) => {
    setAccepting(id);
    setTimeout(() => {
      setAccepting(null);
      toast.success("✅ Course acceptée");
      setFilter("active");
    }, 700);
  };

  const refuseOrder = (id) => {
    toast.info("Course refusée");
  };

  return (
    <PullToRefresh onRefresh={async () => toast.success("Actualisé")}>
      <div className="scr" style={{ padding: 0, paddingBottom: 24 }}>
        {/* HEADER */}
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: -.4, flex: 1 }}>Mes courses</h1>
          <button onClick={() => active.length > 0 ? go("drNavigation", active[0]) : (filter === "pending" && list[0]) ? go("drNavigation", list[0]) : null} disabled={active.length === 0 && !(filter === "pending" && list[0])} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--light)", border: "none", cursor: active.length > 0 || (filter === "pending" && list[0]) ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", color: active.length > 0 ? "#10B981" : "var(--muted)", opacity: active.length > 0 || (filter === "pending" && list[0]) ? 1 : 0.5 }}>
            <Icon name="map" size={18}/>
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: "flex", padding: "14px 16px 0", gap: 8 }}>
          {[
            { key: "active", label: "En cours", count: active.length, color: "#10B981" },
            { key: "pending", label: "Nouvelles", count: pending.length, color: "#F97316" },
            { key: "done", label: "Terminées", count: done.length, color: "var(--muted)" },
          ].map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              flex: 1, padding: "10px 8px",
              background: filter === t.key ? t.color : "var(--card)",
              color: filter === t.key ? "#fff" : "var(--text)",
              border: `1px solid ${filter === t.key ? t.color : "var(--border)"}`,
              borderRadius: 12, fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              {t.label}
              {t.count > 0 && <span style={{
                padding: "1px 7px",
                background: filter === t.key ? "rgba(255,255,255,0.25)" : t.color,
                color: filter === t.key ? "#fff" : "#fff",
                borderRadius: 10, fontSize: 10, fontWeight: 800,
              }}>{t.count}</span>}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div style={{ padding: "16px" }}>
          {list.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--muted)" }}>
                <Icon name={filter === "active" ? "truck" : filter === "pending" ? "bell" : "check_circle"} size={36}/>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                {filter === "active" ? "Aucune course en cours" : filter === "pending" ? "Aucune nouvelle demande" : "Aucune course terminée"}
              </h3>
              <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                {filter === "active" ? "Acceptez une nouvelle demande pour commencer." : filter === "pending" ? "Restez en ligne pour recevoir des demandes." : "Vos livraisons terminées apparaîtront ici."}
              </p>
              {filter !== "pending" && pending.length > 0 && (
                <button onClick={() => setFilter("pending")} style={{ marginTop: 14, padding: "10px 20px", border: "none", borderRadius: 10, background: "#F97316", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                  Voir {pending.length} nouvelle{pending.length > 1 ? "s" : ""} demande{pending.length > 1 ? "s" : ""}
                </button>
              )}
            </div>
          )}

          {/* ACTIVE - in progress */}
          {filter === "active" && list.map(d => (
            <div key={d.id} onClick={() => go("drDelivery", d)} style={{ padding: 16, background: "var(--card)", border: "2px solid #10B981", borderRadius: 16, marginBottom: 12, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "4px 12px", background: "linear-gradient(90deg,#10B981,#059669)", color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: 1, textAlign: "center" }}>
                EN COURS · LIVRAISON
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>#{d.id}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{d.vendor?.name||d.vendor}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>{fmt(d.fee || 1500)}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>frais</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px dashed var(--border)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F97316", flexShrink: 0 }}>
                  <Icon name="store" size={14}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Point de retrait</div>
                  <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.from || d.vendor?.name||d.vendor}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}>
                  <Icon name="location" size={14}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Livrer chez {d.client?.name || "Client"}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.client?.addr || d.address || ""}</div>
                </div>
              </div>

              <div style={{ marginTop: 10, padding: "6px 10px", background: "rgba(16,185,129,0.08)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="clock" size={12} color="#059669"/> {d.eta || "10 min"}
                </span>
                <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>Continuer →</span>
              </div>
            </div>
          ))}

          {/* PENDING - new requests */}
          {filter === "pending" && list.map(d => (
            <div key={d.id} style={{ padding: 16, background: "var(--card)", border: "2px solid #F97316", borderRadius: 16, marginBottom: 12, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: "#F97316", animation: "pulse-dot 1.5s ease-in-out infinite" }}/>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#F97316", letterSpacing: .5 }}>NOUVELLE DEMANDE</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>#{d.id}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{d.vendor?.name||d.vendor}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{fmt(d.fee || 1500)}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: "1px dashed var(--border)", borderBottom: "1px dashed var(--border)", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Distance</div>
                  <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="map_pin" size={12}/>{d.distance || "2.4 km"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Durée</div>
                  <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="clock" size={12}/>{d.eta || "12 min"}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>Articles</div>
                  <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon name="package" size={12}/>{(Array.isArray(d.items) ? d.items.reduce((s,i)=>s+(i.qty||1),0) : 3)}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
                <div style={{ marginBottom: 4 }}><b style={{ color: "var(--text)" }}>De :</b> {d.from || d.vendor?.name||d.vendor}</div>
                <div><b style={{ color: "var(--text)" }}>Vers :</b> {d.client?.addr || d.address || ""}</div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => refuseOrder(d.id)} style={{ flex: .4, padding: "11px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12, fontWeight: 700, color: "var(--text)", cursor: "pointer", fontFamily: "inherit" }}>Refuser</button>
                <button onClick={() => acceptOrder(d.id)} disabled={accepting === d.id} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: accepting === d.id ? "#059669" : "#10B981", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {accepting === d.id ? <><span className="loader" style={{ width: 14, height: 14, borderWidth: 2 }}/>...</> : <><Icon name="check" size={14} color="#fff"/>Accepter</>}
                </button>
              </div>
            </div>
          ))}

          {/* DONE - completed today */}
          {filter === "done" && list.map(d => (
            <div key={d.id} style={{ padding: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}>
                <Icon name="check_circle" size={20}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.vendor?.name||d.vendor}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#10B981" }}>+{fmt(d.fee || 1500)}</div>
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, display: "flex", justifyContent: "space-between" }}>
                  <span>#{d.id} · {d.time || "Aujourd'hui"}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Icon name="star_full" size={11}/>{d.rating || 5}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PullToRefresh>
  );
}

export default DrDeliveriesScr;
