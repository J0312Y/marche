import { useEffect, useState } from "react";
import ContentPage, { ContactCard } from "./ContentPage";
import pkg from "../../../package.json";
import { installedVersion } from "../../components/t/UpdatePrompt";

/** Texte géré dans le panneau (Informations › Pages de texte) */
export default function AboutScr({ onBack }) {
  const [v, setV] = useState(null);
  useEffect(() => { installedVersion().then(setV); }, []);
  return <ContentPage slug="about" fallbackTitle="À propos" onBack={onBack}>
      <div className="t-card tk-box" style={{ padding: 20 }}><div className="t-sub" style={{ fontSize: 14 }}>Version de l'application</div><div style={{ fontSize: 16, fontWeight: 600 }}>{v || pkg.version}</div></div>
      <ContactCard />
    </ContentPage>;
}
