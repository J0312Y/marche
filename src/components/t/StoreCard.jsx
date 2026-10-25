import Img from "../Img";
import Icon from "../Icon";
import { storeStatus, etaLabel } from "../../utils/storeStatus";
import { fmt } from "../../utils/helpers";

const initials = (n = "") => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/** Visuel de couverture : photo de couverture, sinon logo, sinon initiales sur fond doux */
export function StoreCover({ v, children }) {
  const src = v.cover || v.cover_image || v.logo || v.avatar;
  return (
    <>
      {src ? <Img src={src} alt={v.name} style={{ width: "100%", height: "100%" }} />
        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--acc-l)", color: "var(--acc)", fontSize: 40, fontWeight: 700 }}>{initials(v.name)}</div>}
      {children}
    </>
  );
}

function ClosedOverlay({ st, small }) {
  if (st.open) return null;
  return (
    <div className="t-closed" style={small ? { gap: 6 } : undefined}>
      <b><Icon name="moon_closed" size={small ? 13 : 16} color="#fff" />Fermé</b>
      {st.preorder && <span style={small ? { fontSize: 12, padding: "5px 8px" } : undefined}>{small ? "Précommande" : st.label}</span>}
    </div>
  );
}

const Rating = ({ v }) => v.rating > 0 ? <span><Icon name="star_full" size={13} color="var(--acc)" />{Number(v.rating).toFixed(1)}</span> : <span style={{ color: "var(--acc)", fontWeight: 700 }}>Nouveau</span>;

/** Badges sur la photo (comme Toters) : « % −20 % » rouge, puis tampons « ✓✓✓ Gagnez 3 000 F » sur fond sombre */
export function Badges({ v }) {
  const pc = v.punchCard;
  const n = pc ? Math.min(5, Number(pc.punches_required) || 0) : 0;
  if (!v.maxOff && !pc) return null;
  return (
    <div className="t-badges">
      {v.maxOff >= 5 && <span className="off"><Icon name="percent" size={13} color="#fff" strokeWidth={2.6} />−{v.maxOff} %</span>}
      {pc && <span className="punch"><i className="dots">{Array.from({ length: n }).map((_, k) => <i key={k} />)}</i>Gagnez {fmt(pc.reward_amount).replace("FCFA", "F")}</span>}
    </div>
  );
}

/** Grande carte boutique (liste principale) */
export default function StoreCard({ v, onOpen, fav, onFav }) {
  const st = storeStatus(v);
  return (
    <div className="t-store" onClick={() => onOpen(v)}>
      <div className="cover">
        <StoreCover v={v}>
          <Badges v={v} />
          {onFav && <button className="t-fav" onClick={(e) => { e.stopPropagation(); onFav(v); }} aria-label="Favori">
            <Icon name={fav ? "heart-fill" : "heart"} size={24} color={fav ? "var(--acc)" : "#fff"} strokeWidth={2} />
          </button>}
          <ClosedOverlay st={st} />
        </StoreCover>
      </div>
      <div className="body">
        <div className="name">{v.name}</div>
        <div className="t-meta">
          {v.freeDelivery && <span className="free"><Icon name="bike" size={14} color="#E5484D" />LIVRAISON GRATUITE</span>}
          <span><Icon name="timer" size={13} color="var(--t-text)" />{etaLabel(v)}</span>
          <Rating v={v} />
        </div>
      </div>
    </div>
  );
}

/** Carte compacte (carrousels « Nouveau sur Lamuka ») */
export function StoreCardSmall({ v, onOpen }) {
  const st = storeStatus(v);
  return (
    <div className="t-store-sm" onClick={() => onOpen(v)}>
      <div className="ph"><StoreCover v={v}>{st.open && v.maxOff >= 5 && <span className="t-off" style={{ top: 6, left: 6, fontSize: 11, padding: "3px 6px" }}>−{v.maxOff} %</span>}<ClosedOverlay st={st} small /></StoreCover></div>
      <div className="in">
        <b>{v.name}</b>
        {v.freeDelivery && <div className="t-meta" style={{ fontSize: 12, marginTop: 2 }}><span className="free"><Icon name="bike" size={13} color="#E5484D" />LIVRAISON GRATUITE</span></div>}
        <div className="t-meta" style={{ fontSize: 13, flexWrap: "wrap", gap: 8, marginTop: v.freeDelivery ? 2 : 4 }}>
          {st.open ? <span>{etaLabel(v)}</span> : null}
          <Rating v={v} />
        </div>
      </div>
    </div>
  );
}

/** Logo rond (page boutique, panier) */
export function StoreLogo({ v, size = 48 }) {
  const src = v?.logo || v?.avatar || v?.establishment_logo;
  return (
    <div className="t-logo" style={{ width: size, height: size }}>
      {src ? <Img src={src} alt="" style={{ width: "100%", height: "100%" }} /> : <span style={{ fontSize: size * 0.36 }}>{initials(v?.name || v?.establishment_name)}</span>}
    </div>
  );
}
