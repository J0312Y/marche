/**
 * Share utility — menu natif sur le téléphone, feuille maison sur le web
 */
import toast from './toast';

let showShareSheet = null;

// Register the share sheet handler (called from App.jsx)
export function registerShareSheet(handler) {
  showShareSheet = handler;
}

export async function share({ title, text, url }) {
  // Sur le téléphone : menu de partage natif d'Android (comme Toters)
  try {
    const { Capacitor } = await import("@capacitor/core");
    if (Capacitor.isNativePlatform()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title, text, url, dialogTitle: "Partager" });
      return;
    }
  } catch (e) {
    if (/cancel/i.test(e?.message || "")) return;   // l'utilisateur a fermé le menu
  }
  if (showShareSheet) {
    showShareSheet({ title, text, url });
  } else {
    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(url || text || title);
      toast.success("Lien copié ! ");
    } catch {
      toast.info(url || text);
    }
  }
}

export const shareProduct = (p) => share({
  title: p.name,
  text: `${p.name} — ${p.price?.toLocaleString?.()} FCFA sur Lamuka Market`,
  url: `https://lamuka.market/article/${p.id}`,
});

export const shareVendor = (v) => share({
  title: v.name,
  text: `${v.name} sur Lamuka Market${v.desc || v.description ? " — " + (v.desc || v.description) : ""}`,
  url: `https://lamuka.market/boutique/${v.id}`,
});
