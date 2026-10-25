import { useEffect, useState } from "react";
import pkg from "../../../package.json";
import { installedVersion, checkForUpdate } from "./UpdatePrompt";

/** Bas des pages Compte : version réellement installée + « Rechercher une mise à jour » */
export default function AppVersion({ style }) {
  const [v, setV] = useState(null);
  useEffect(() => { installedVersion().then(setV); }, []);
  return (
    <div style={{ textAlign: "center", padding: "10px 0 36px", color: "var(--t-mut)", ...style }}>
      <div style={{ fontSize: 22, fontWeight: 700, fontStyle: "italic", color: "#9CA0AA", letterSpacing: -0.5 }}>lamuka</div>
      <div style={{ fontSize: 13 }}>Version {v || pkg.version}</div>
      <button onClick={checkForUpdate} style={{ marginTop: 6, border: "none", background: "none", color: "var(--acc)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 6 }}>Rechercher une mise à jour</button>
    </div>
  );
}
