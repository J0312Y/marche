import Sheet from "./Sheet";

/** Date courte pour le bandeau : « dim. 11 oct. à 05:00 » */
export const shortWhen = (d) => d ? `${d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })} à ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : "";
/** Date longue façon Toters : « lundi 12 octobre à 09:43 » */
export const longWhen = (d) => d ? `${d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : "";

/**
 * Feuille « boutique fermée » (Toters : « This store is closed, but you can still preorder »).
 * st : storeStatus(v). onStay = « Voir la boutique » (ou « Programmer ma commande »), onLeave = autres boutiques.
 */
export default function ClosedSheet({ st, onStay, onLeave, onClose, stayLabel = "Voir la boutique" }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ padding: "6px 20px 18px" }}>
        <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3 }}>
          {st.preorder ? "Cette boutique est fermée, mais vous pouvez précommander" : "Cette boutique est fermée pour le moment"}
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.45, marginTop: 8, color: "var(--t-text)" }}>
          {st.preorder ? `Vous pourrez programmer votre commande au paiement pour ${longWhen(st.opens)}.` : "Revenez plus tard ou découvrez d'autres boutiques ouvertes."}
        </p>
        {st.preorder && <button className="t-cta center" style={{ width: "100%", height: 52, justifyContent: "center", fontSize: 17, marginTop: 20 }} onClick={onStay}>{stayLabel}</button>}
        <button className="t-cta ghost center" style={{ width: "100%", height: 52, justifyContent: "center", fontSize: 17, marginTop: 12 }} onClick={onLeave}>Voir d'autres boutiques</button>
      </div>
    </Sheet>
  );
}
