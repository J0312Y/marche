import ContentPage, { ContactCard } from "./ContentPage";

/** Texte géré dans le panneau (Informations › Pages de texte) */
export default function DeliveryPolicyScr({ onBack }) {
  return <ContentPage slug="delivery" fallbackTitle="Livraison et retours" onBack={onBack}><ContactCard /></ContentPage>;
}
