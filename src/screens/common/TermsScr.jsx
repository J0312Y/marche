import ContentPage from "./ContentPage";

/** Texte géré dans le panneau (Informations › Pages de texte) */
export default function TermsScr({ onBack }) {
  return <ContentPage slug="terms" fallbackTitle="Conditions d'utilisation" onBack={onBack}></ContentPage>;
}
