/**
 * Share utility — uses Web Share API with fallback to clipboard
 */
import toast from './toast';

export async function share({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      toast.success("Partagé avec succès 📤");
    } catch (e) {
      if (e.name !== 'AbortError') toast.info("Partage annulé");
    }
  } else {
    // Fallback: copy link
    try {
      await navigator.clipboard.writeText(url || text || title);
      toast.success("Lien copié ! 📋");
    } catch {
      toast.info("Partagez: " + (url || text));
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
