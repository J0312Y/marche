/**
 * Share utility — custom bottom sheet instead of native share
 * Stays inside the phone frame
 */
import toast from './toast';

let showShareSheet = null;

// Register the share sheet handler (called from App.jsx)
export function registerShareSheet(handler) {
  showShareSheet = handler;
}

export async function share({ title, text, url }) {
  if (showShareSheet) {
    showShareSheet({ title, text, url });
  } else {
    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(url || text || title);
      toast.success("Lien copié ! 📋");
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
  text: `${v.name} sur Lamuka Market — ${v.desc}`,
  url: `https://lamuka.market/boutique/${v.id}`,
});
