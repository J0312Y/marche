import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import { StoreLogo } from "../../components/t/StoreCard";
import ClosedSheet from "../../components/t/ClosedSheet";
import Sheet from "../../components/t/Sheet";
import { storeStatus, whenLabel } from "../../utils/storeStatus";
import { useApp } from "../../context/AppContext";
import { useData } from "../../hooks";
import { establishmentsAPI } from "../../api";
import { fmt } from "../../utils/helpers";
import { cartSubtotal, lineQty, lineTotal, optionsLabel, couponDiscount, couponLabel } from "../../utils/cartMath";

export const NO_CUTLERY_KEY = "lk-no-cutlery";

/**
 * Panier « Toters » : une boutique, progression vers la carte à tampons, lignes avec quantité,
 * puis « Commander » (connexion demandée à ce moment-là). Couverts et code promo : écran de paiement.
 */
/** Paniers ouverts, un par boutique (articles regroupés par boutique, dans l'ordre d'ajout) */
export const cartGroups = (cart) => {
  const m = new Map();
  cart.forEach((c) => {
    const id = Number(c.establishment_id) || 0;
    if (!m.has(id)) m.set(id, { eid: id, name: c.establishment_name, logo: c.establishment_logo || c.establishment_avatar, items: [] });
    m.get(id).items.push(c);
  });
  return [...m.values()];
};

/** « Vos paniers » (Toters « Your Carts ») : une carte par boutique, ajouter des articles, voir le panier, supprimer */
function CartsList({ groups, go, onBack }) {
  const { updateCartQty } = useApp();
  const { VENDORS } = useData();
  const [menu, setMenu] = useState(null); // groupe dont le menu « … » est ouvert
  const [busy, setBusy] = useState(false);
  const remove = async (g) => { setBusy(true); for (const c of g.items) await updateCartQty(c.id, 0); setBusy(false); setMenu(null); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1 className="tc-h">Vos paniers</h1></div>
      <div className="t-scr gray">
        <div className="tc-intro">Un panier par boutique : commandez-les séparément, chacun avec son livreur.</div>
        {groups.map((g) => {
          const v = VENDORS.find((x) => Number(x.id) === g.eid) || { id: g.eid, name: g.name, logo: g.logo };
          return (
            <div key={g.eid} className="tc-card tc-multi">
              <div className="tc-store">
                <StoreLogo v={v} size={47} />
                <div className="nm">{v.name}<small>{g.items.reduce((s, c) => s + lineQty(c), 0)} article{g.items.reduce((s, c) => s + lineQty(c), 0) > 1 ? "s" : ""}</small></div>
                <button className="go" onClick={() => setMenu(g)} aria-label="Plus d'options"><Icon name="more_h" size={20} /></button>
              </div>
              <div className="tc-thumbs">
                {g.items.slice(0, 5).map((c) => <span key={c.id} className="th">{(c.image || c.thumbnail_url) ? <Img src={c.image || c.thumbnail_url} alt="" style={{ width: "100%", height: "100%" }} /> : <Icon name="bag" size={20} color="var(--t-mut)" />}{lineQty(c) > 1 && <b>{lineQty(c)}</b>}</span>)}
                {g.items.length > 5 && <span className="th more">+{g.items.length - 5}</span>}
              </div>
              <div className="tc-sum">{fmt(cartSubtotal(g.items))}</div>
              <div className="tc-acts">
                <button className="t-cta ghost center" onClick={() => go("vendor", v)}>Ajouter des articles</button>
                <button className="t-cta center" onClick={() => go("cart", { eid: g.eid })}>Voir le panier</button>
              </div>
            </div>
          );
        })}
        <div style={{ height: 24 }} />
      </div>
      {menu && <Sheet onClose={() => !busy && setMenu(null)}>
        <div style={{ padding: "6px 20px 22px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{menu.name}</div>
          <button className="t-li" onClick={() => { setMenu(null); go("vendor", { id: menu.eid, name: menu.name }); }}><span className="ic"><Icon name="plus" size={20} color="var(--acc)" /></span><span>Ajouter des articles</span></button>
          <button className="t-li" disabled={busy} onClick={() => remove(menu)} style={{ color: "#DC2626" }}><span className="ic" style={{ background: "#FEE2E2" }}><Icon name="trash" size={20} color="#DC2626" /></span><span>{busy ? "Suppression…" : "Supprimer ce panier"}</span></button>
        </div>
      </Sheet>}
    </div>
  );
}

export default function CartScr({ go, onBack, appliedCoupon, setAppliedCoupon, eid: eidProp }) {
  const { cart: allCart, updateCartQty, requireLogin } = useApp();
  const { VENDORS } = useData();
  const [card, setCard] = useState(null);
  const [st, setSt] = useState(null); // ouverture de la boutique
  const [closedSheet, setClosedSheet] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [storeType, setStoreType] = useState(null);

  // Plusieurs boutiques et aucune choisie → « Vos paniers » ; sinon le panier de la boutique
  const groups = cartGroups(allCart);
  const cur = groups.find((g) => g.eid === Number(eidProp)) || (groups.length === 1 ? groups[0] : null);
  const cart = cur ? cur.items : [];
  const eid = cur?.eid || null;
  const vendor = VENDORS.find((v) => Number(v.id) === eid) || { id: eid, name: cart[0]?.establishment_name, logo: cart[0]?.establishment_logo };
  const subtotal = cartSubtotal(cart);
  const discount = couponDiscount(appliedCoupon, subtotal);

  useEffect(() => {
    if (!eid) return;
    establishmentsAPI.getDetail(eid).then((r) => {
      const e = r?.establishment;
      setCard(e?.punch_card || null);
      setStoreType(e?.type || null);
      // Achat repris alors que la boutique est fermée : on prévient tout de suite (comme Toters)
      const s2 = storeStatus(e ? { isOpenNow: e.is_open_now, opensAt: e.opens_at } : null);
      setSt(s2);
    }).catch(() => {});
  }, [eid]);

  const setQty = async (c, q) => { setBusyId(c.id); await updateCartQty(c.id, q); setBusyId(null); };
  // « Pas de couverts » (restauration) : dans le panier comme Toters, envoyé avec la commande
  const [noCutlery, setNoCutlery] = useState(() => { try { return sessionStorage.getItem(NO_CUTLERY_KEY) === "1"; } catch { return false; } });
  useEffect(() => { try { sessionStorage.setItem(NO_CUTLERY_KEY, noCutlery ? "1" : "0"); } catch { /* stockage indisponible */ } }, [noCutlery]);
  const isFood = ["restaurant", "patisserie"].includes(vendor?.type || storeType);

  if (!cur && groups.length > 1) return <CartsList groups={groups} go={go} onBack={onBack} />;
  if (!cart.length) return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--card)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Mon panier</h1></div>
      <div className="t-empty" style={{ flex: 1 }}>
        <div className="ic"><Icon name="bag" size={38} /></div>
        <b>Votre panier est vide</b>
        <p>Parcourez les boutiques et ajoutez vos articles préférés.</p>
        <button className="t-cta center" style={{ flex: "0 0 auto", width: 220, marginTop: 10 }} onClick={onBack}>Découvrir</button>
      </div>
    </div>
  );

  // Progression vers le tampon : de 0 au minimum de la carte
  const goal = card?.min_spend || 0;
  const pct = goal ? Math.min(100, (subtotal / goal) * 100) : 0;
  const reward = card?.rewards_available > 0;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1 className="tc-h">Mon panier</h1></div>
      <div className="t-scr gray">
        <div className={"tc-card" + (st && !st.open ? " closed" : "")}>
          {st && !st.open && <div className="tc-band"><Icon name="moon_closed" size={17} color="#111" /><b>Fermé</b>{st.preorder && <> · Précommande pour {whenLabel(st.opens)}</>}</div>}
          <div className="tc-store" onClick={() => go("vendor", vendor)} role="button">
            <StoreLogo v={vendor} size={47} />
            <div className="nm">{vendor.name}</div>
            <span className="go"><Icon name="arrow_right" size={20} strokeWidth={2.4} /></span>
          </div>


          {card && <div className="tc-goal">
            <div className="gmsg">
              <Icon name="award" size={26} color="var(--acc)" />
              <span>{reward ? <>Récompense de {fmt(card.reward_amount).replace("FCFA", "F")} appliquée</>
                : subtotal >= goal ? <>Cette commande vous rapporte un tampon</>
                : <>Dépensez {fmt(goal).replace("FCFA", "F")}, gagnez un tampon</>}</span>
            </div>
            <div className="bar">
              <i className="dot on" />
              <span className="trk"><span style={{ width: pct + "%" }} /></span>
              <i className={"dot" + (subtotal >= goal ? " on" : "")} />
            </div>
            <div className="lbl"><span>0 F</span><span>{fmt(goal).replace("FCFA", "F")}</span></div>
            <div className="cap">Un tampon sur votre carte fidélité</div>
          </div>}

          {cart.map((c) => {
            const q = lineQty(c);
            const opts = optionsLabel(c.options);
            return (
              <div key={c.id} className="tc-line" style={{ opacity: busyId === c.id ? 0.6 : 1 }}>
                <div className="ph">{(c.image || c.thumbnail_url) ? <Img src={c.image || c.thumbnail_url} alt="" style={{ width: "100%", height: "100%" }} /> : <Icon name="bag" size={26} color="var(--t-mut)" />}</div>
                <div className="info">
                  <div className="nm">{c.name}</div>
                  {c.size_label && <div className="sub">{c.size_label}</div>}
                  {opts && <div className="sub">{opts}</div>}
                  {c.note && <div className="sub" style={{ fontStyle: "italic" }}>« {c.note} »</div>}
                  <div className="pr">{fmt(lineTotal(c))}</div>
                  {c.options_error && <div style={{ fontSize: 13, color: "#E11D48", marginTop: 4 }}>{c.options_error} — retirez et ajoutez à nouveau l'article</div>}
                </div>
                <div className="tc-qty">
                  <button onClick={() => setQty(c, q - 1)} disabled={busyId === c.id} aria-label={q === 1 ? "Retirer" : "Moins"}>
                    <Icon name={q === 1 ? "trash" : "minus"} size={19} strokeWidth={2.2} />
                  </button>
                  <b>{q}</b>
                  <button onClick={() => setQty(c, q + 1)} disabled={busyId === c.id || q >= 99} aria-label="Plus"><Icon name="plus" size={20} strokeWidth={2.4} /></button>
                </div>
              </div>
            );
          })}
          <div className="tc-total">
            <div className="row"><span>Sous-total</span><span>{fmt(subtotal)}</span></div>
            {discount > 0 && <div className="row disc"><span>Code {appliedCoupon.code} ({couponLabel(appliedCoupon)})</span><span>-{fmt(discount)}</span></div>}
          </div>
        </div>
        {isFood && <div className="tc-card" style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 14px", cursor: "pointer" }} onClick={() => setNoCutlery((x) => !x)} role="switch" aria-checked={noCutlery} aria-label="Pas de couverts">
          <Icon name="utensils" size={22} color="var(--t-text)" />
          <span style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>Pas de couverts, merci</span>
          <span className={"t-toggle" + (noCutlery ? " on" : "")} aria-hidden="true" />
        </div>}
        <div style={{ height: 24 }} />
      </div>

      {closedSheet && st && <ClosedSheet st={st} stayLabel="Programmer ma commande" onClose={() => setClosedSheet(false)}
        onStay={() => { setClosedSheet(false); requireLogin("checkout", () => go("checkout", { eid })); }}
        onLeave={() => { setClosedSheet(false); onBack?.(); }} />}

      <div className="t-bottom sheet">
        <span className="grab" />
        <button className="t-cta ghost tc-add" onClick={() => go("vendor", vendor)}>Ajouter</button>
        <button className="t-cta tc-go" onClick={() => requireLogin("checkout", () => go("checkout", { eid }))}>
          <span>Commander</span><span className="p">{fmt(Math.max(0, subtotal - discount)).replace("FCFA", "F")}</span>
        </button>
      </div>
    </div>
  );
}
