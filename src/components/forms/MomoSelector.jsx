import { useState } from "react";
import Icon from "./Icon";

/**
 * MomoSelector - Sélection Mobile Money (Airtel, MTN, Kolo Pay)
 * @param {string} selected - Clé sélectionnée
 * @param {function} onSelect - Callback(key)
 */
const PROVIDERS = [
  { k: "airtel", n: "Airtel Money", e: "" },
  { k: "mtn", n: "MTN MoMo", e: "" },
  { k: "kolo", n: "Kolo Pay", e: "" },
];

function MomoSelector({ selected = "airtel", onSelect }) {
  return (
    <div>
      {PROVIDERS.map(m => (
        <div
          key={m.k}
          className={`momo ${selected === m.k ? "on" : ""}`}
          onClick={() => onSelect(m.k)}
        >
          <span className="me">{m.e}</span>
          <span className="mn">{m.n}</span>
          {selected === m.k && <span className="mc"></span>}
        </div>
      ))}
    </div>
  );
}

export { PROVIDERS };
export default MomoSelector;
