import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { StoreLogo } from "../../components/t/StoreCard";
import { buyer as buyerSvc } from "../../services";
import { fmt } from "../../utils/helpers";
import { useAppInfo, loyaltyRules } from "../../config/appInfo";

const fmtDate = (d) => {
  const t = d ? new Date(String(d).replace(" ", "T")) : null;
  return t && !isNaN(t) ? t.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "";
};

/**
 * Mes points : solde (règles réglées dans le panneau : montant pour 1 point, seuil d'utilisation ; 1 point = 1 F),
 * cartes à tampons des boutiques, points gagnés.
 */
export default function LoyaltyScr({ onBack, go }) {
  const [d, setD] = useState(null);
  const rules = loyaltyRules(useAppInfo());
  const MIN_USE = rules.min || 0;
  useEffect(() => { buyerSvc.getLoyalty().then(setD).catch(() => setD({ points: 0, punch_cards: [], history: [] })); }, []);

  const pts = d?.points || 0;
  const usable = pts >= MIN_USE;
  const cards = d?.punch_cards || [];
  const history = d?.history || [];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Mes points</h1></div>
      <div className="t-scr gray">
        <div className="t-card tk-box" style={{ padding: 20 }}>
          <div className="t-sub" style={{ fontSize: 14 }}>Solde</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "2px 0 6px" }}>
            <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>{d ? pts.toLocaleString("fr-FR") : "…"}</span>
            <span style={{ fontSize: 16, color: "var(--t-sub)" }}>points</span>
          </div>
          {d && (usable
            ? <div style={{ fontSize: 14 }}>Soit <b>{fmt(pts)}</b> de réduction, à utiliser au moment de payer.</div>
            : <>
              <div style={{ height: 6, borderRadius: 3, background: "var(--t-bg2)", overflow: "hidden", margin: "10px 0 8px" }}>
                <div style={{ height: "100%", width: (pts / MIN_USE) * 100 + "%", background: "var(--acc)", borderRadius: 3 }} />
              </div>
              <div className="t-sub" style={{ fontSize: 14 }}>Encore {MIN_USE - pts} points pour les utiliser.</div>
            </>)}
        </div>

        <div className="t-card tk-box">
          <div className="tk-h">Comment ça marche</div>
          {[
            ["Commandez", rules.per ? `1 point pour chaque tranche de ${fmt(rules.per)} d'articles, crédité à la livraison.` : "Des points à chaque commande, crédités à la livraison."],
            ["Cumulez", `Dès ${MIN_USE} points, activez « Utiliser mes points » au paiement.`],
            ["Économisez", `1 point = ${fmt(rules.value)} de réduction sur votre commande.`],
          ].map(([t, s], i) => (
            <div key={t} style={{ display: "flex", gap: 12, padding: "8px 0" }}>
              <span style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, background: "var(--t-bg2)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span>
              <span style={{ fontSize: 14, lineHeight: 1.45 }}><b style={{ fontWeight: 600 }}>{t}</b><span className="t-sub" style={{ display: "block" }}>{s}</span></span>
            </div>
          ))}
        </div>

        <div className="t-card tk-box">
          <div className="tk-h" style={{ marginBottom: 4 }}>Cartes à tampons</div>
          {cards.length === 0
            ? <>
              <div className="t-sub" style={{ fontSize: 14, lineHeight: 1.5 }}>Certaines boutiques offrent une réduction après plusieurs commandes. Vos cartes apparaîtront ici dès votre premier tampon.</div>
              <button className="t-pill-btn" style={{ marginTop: 12 }} onClick={() => go("search")}>Voir les boutiques</button>
            </>
            : cards.map((c) => {
              const n = Number(c.punches), req = Number(c.punches_required), ready = Number(c.rewards_available) > 0;
              return (
                <div key={c.establishment_id} style={{ padding: "12px 0", borderTop: "1px solid var(--t-line)", cursor: "pointer" }} onClick={() => go("vendor", { id: Number(c.establishment_id), name: c.name })} role="button">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <StoreLogo v={{ name: c.name, logo: c.avatar }} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                      <div className="t-sub" style={{ fontSize: 13 }}>{ready ? `${fmt(c.reward_amount)} offerts sur votre prochaine commande` : `${n}/${req} · ${fmt(c.reward_amount)} offerts à la carte pleine`}</div>
                    </div>
                    <Icon name="chevron_right" size={18} color="var(--t-mut)" />
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                    {Array.from({ length: req }).map((_, i) => <span key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: ready || i < n ? "var(--acc)" : "var(--t-bg2)" }} />)}
                  </div>
                </div>
              );
            })}
        </div>

        {history.length > 0 && <div className="t-card tk-box">
          <div className="tk-h" style={{ marginBottom: 4 }}>Points gagnés</div>
          {history.map((h) => (
            <div key={h.ref} className="t-row" style={{ padding: "10px 0", borderTop: "1px solid var(--t-line)" }}>
              <span style={{ minWidth: 0 }}><span style={{ display: "block", fontSize: 15 }}>{h.name}</span><span className="t-sub" style={{ fontSize: 13 }}>{fmtDate(h.delivered_at)} · commande {fmt(h.subtotal)}</span></span>
              <b style={{ color: "var(--acc-d)" }}>+{h.points}</b>
            </div>
          ))}
        </div>}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
