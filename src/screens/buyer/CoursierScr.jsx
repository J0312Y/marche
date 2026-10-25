import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import Sheet from "../../components/t/Sheet";
import { useApp } from "../../context/AppContext";
import { errandsAPI } from "../../api";
import { fmt } from "../../utils/helpers";
import { appInfo } from "../../config/appInfo";

export const ERRAND_STATUS = {
  pending: { label: "Recherche d'un coursier", color: "#B45309", bg: "#FEF3C7", icon: "clock" },
  assigned: { label: "Coursier en route", color: "#1D4ED8", bg: "#DBEAFE", icon: "bike" },
  picked_up: { label: "En cours de livraison", color: "#7C3AED", bg: "#EDE9FE", icon: "truck" },
  delivered: { label: "Livrée", color: "#15803D", bg: "#DCFCE7", icon: "check_circle" },
  cancelled: { label: "Annulée", color: "#6B7280", bg: "#F3F4F6", icon: "x_circle" },
};
const ERRAND_ACTIVE = ["pending", "assigned", "picked_up"];
const FILTERS = [["all", "Toutes"], ["active", "En cours"], ["delivered", "Livrées"], ["cancelled", "Annulées"]];
const longDate = (s) => { const d = new Date(String(s).replace(" ", "T")); return isNaN(d) ? "" : `Demandée le ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} à ${d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`; };
const shortPlace = (s) => String(s || "").split(/\n| · |,/)[0].trim() || "—"; // première partie de l'adresse (repère)

// Illustrations (couleurs Toters : vert + rouge)
const Scooter = () => (
  <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
    <circle cx="20" cy="62" r="8" fill="#fff" stroke="#0B6B57" strokeWidth="5" /><circle cx="62" cy="62" r="8" fill="#fff" stroke="#0B6B57" strokeWidth="5" />
    <path d="M14 56c2-10 10-14 22-14h10l6 14H14z" fill="#00B492" /><path d="M46 42l8-20h8" stroke="#0B6B57" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="18" y="20" width="24" height="20" rx="3" fill="#E5484D" transform="rotate(-12 30 30)" /><path d="M28 21l3 18" stroke="#fff" strokeWidth="2" transform="rotate(-12 30 30)" />
    <circle cx="44" cy="16" r="6" fill="#0B6B57" />
  </svg>
);
const Bags = () => (
  <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
    <path d="M10 32h32l-4 38H14z" fill="#E5484D" /><path d="M19 32v-7a7 7 0 0 1 14 0v7" stroke="#B42318" strokeWidth="3.5" />
    <path d="M38 40h30l-4 30H42z" fill="#00B492" /><path d="M46 40v-6a7 7 0 0 1 14 0v6" stroke="#0B6B57" strokeWidth="3.5" />
  </svg>
);
const LIMITS = () => [ // lu à l'affichage : poids maximum réglé dans le panneau
  ["package", "Doit tenir à l'arrière d'une moto"],
  ["weight", appInfo()?.errand?.max_weight_kg ? `Poids maximum de ${appInfo().errand.max_weight_kg} kg` : "Ce qui tient à l'arrière d'une moto"],
  ["map_pin", "Doit se trouver dans votre ville"],
];

/**
 * Onglet Coursier : « Nous livrons tout ce qui tient sur une moto ! »
 */
export default function CoursierScr({ go }) {
  const { user, requireLogin } = useApp();
  const [info, setInfo] = useState(false);
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) { setList([]); return; }
    errandsAPI.list().then((r) => setList(r?.errands || [])).catch(() => {});
  }, [user]);

  const start = (type) => requireLogin("errand", () => go("errand", { type }));

  return (
    <div className="t-scr gray">
      <div className="t-head" style={{ background: "var(--card)" }}><h1 className="tc-h" style={{ marginLeft: 0 }}>Coursier</h1></div>
      <div className="t-info" onClick={() => setInfo(true)} role="button" style={{ cursor: "pointer" }}>
        <span>On livre tout ce qui tient sur une moto !</span>
        <Icon name="info" size={22} color="var(--acc-d)" />
      </div>

      <button className="t-big" onClick={() => start("send")}>
        <div className="ill"><Scooter /></div>
        <div style={{ flex: 1 }}><b>Envoyer un colis</b><p>Ex. : vous avez oublié votre chargeur à la maison et il doit arriver au bureau.</p></div>
        <Icon name="chevron_right" size={22} color="var(--acc)" />
      </button>
      <button className="t-big" onClick={() => start("buy")}>
        <div className="ill"><Bags /></div>
        <div style={{ flex: 1 }}><b>Faire un achat</b><p>Introuvable dans nos boutiques ? Un coursier l'achète dans le magasin de votre choix.</p></div>
        <Icon name="chevron_right" size={22} color="var(--acc)" />
      </button>

      {list.length > 0 && <>
        <div className="t-h2" style={{ padding: "12px 16px 4px" }}>Mes courses</div>
        <div className="t-chips" style={{ paddingTop: 6 }}>
          {FILTERS.map(([k, l]) => {
            const n = k === "all" ? list.length : list.filter((e) => (k === "active" ? ERRAND_ACTIVE.includes(e.status) : e.status === k)).length;
            return <button key={k} className={"t-chip" + (filter === k ? " on" : "")} style={{ height: 34 }} onClick={() => setFilter(k)}>{l}{n ? ` (${n})` : ""}</button>;
          })}
        </div>
        {list.filter((e) => filter === "all" || (filter === "active" ? ERRAND_ACTIVE.includes(e.status) : e.status === filter)).map((e) => {
          const st = ERRAND_STATUS[e.status] || ERRAND_STATUS.pending;
          const active = ERRAND_ACTIVE.includes(e.status);
          const total = Number(e.delivery_fee || 0) + Number(e.items_cost || 0);
          return (
            <div key={e.id} className="t-card" style={{ margin: "0 16px 12px", padding: 16, borderRadius: 16 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>#{e.ref}</div>
                  <div className="t-mut" style={{ marginTop: 2 }}>{longDate(e.created_at)}</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 10, background: st.bg, color: st.color, fontSize: 13, fontWeight: 600, flexShrink: 0, maxWidth: "50%" }}>
                  <Icon name={st.icon} size={14} color={st.color} /><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{st.label}</span>
                </span>
              </div>
              <div onClick={() => go("errandDetail", { id: e.id })} role="button" style={{ marginTop: 12, padding: 10, background: "var(--t-bg2)", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
                <span style={{ width: 64, height: 64, borderRadius: 10, background: "var(--acc-l)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={e.type === "buy" ? "bag" : "bike"} size={28} color="var(--acc)" /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.3 }}>{e.description}</div>
                  {/* Départ → arrivée : chacun garde sa moitié de ligne (une adresse longue ne cache pas l'autre) */}
                  <div className="t-mut" style={{ marginTop: 3, display: "flex", gap: 4, minWidth: 0 }}>
                    <span style={{ flex: "0 1 auto", minWidth: 0, maxWidth: "48%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.type === "buy" ? (e.store_name || "Achat") : shortPlace(e.pickup_address)}</span>
                    <span style={{ flexShrink: 0 }}>→</span>
                    <span style={{ flex: "0 1 auto", minWidth: 0, maxWidth: "48%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortPlace(e.dropoff_address)}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{fmt(total)}{e.type === "buy" && !Number(e.items_cost) ? <span className="t-mut" style={{ fontWeight: 400 }}> + achats</span> : null}</div>
                </div>
              </div>
              {e.status === "cancelled" && e.cancel_reason && <div className="t-mut" style={{ marginTop: 10 }}>{e.cancel_reason}</div>}
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                {!active && <button className="t-cta ghost center" style={{ flex: 1, height: 44, justifyContent: "center", fontSize: 15, whiteSpace: "nowrap", padding: "0 10px" }} onClick={() => requireLogin("errand", () => go("errand", { type: e.type, again: e }))}>Refaire</button>}
                <button className="t-cta center" style={{ flex: 1, height: 44, justifyContent: "center", fontSize: 15, whiteSpace: "nowrap", padding: "0 10px" }} onClick={() => go("errandDetail", { id: e.id })}>
                  {active ? <>Suivre la course <Icon name="arrow_right" size={16} color="#fff" /></> : "Voir le détail"}
                </button>
              </div>
            </div>
          );
        })}
      </>}
      <div style={{ height: 30 }} />

      {info && <Sheet onClose={() => setInfo(false)} title="Limites de livraison">
        <div style={{ padding: "8px 20px 4px" }}>
          {LIMITS().map(([ic, t]) => (
            <div key={ic} className="tk-limit"><span className="ic"><Icon name={ic} size={30} color="var(--acc-d)" /></span><span>{t}</span></div>
          ))}
        </div>
        <div style={{ padding: "12px 16px 16px" }}><button className="t-cta center" style={{ width: "100%", justifyContent: "center", fontSize: 17 }} onClick={() => setInfo(false)}>Compris</button></div>
      </Sheet>}
    </div>
  );
}
