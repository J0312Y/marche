import ContentPage from "./ContentPage";

/** Texte géré dans le panneau (Informations › Pages de texte) */
export default function PrivacyScr({ onBack }) {
  return <ContentPage slug="privacy" fallbackTitle="Confidentialité" onBack={onBack}></ContentPage>;
}
