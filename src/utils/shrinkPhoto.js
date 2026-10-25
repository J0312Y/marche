/**
 * Réduit une photo du téléphone avant envoi (1600 px max, JPEG) : envoi rapide sur réseau mobile.
 * Le serveur la remet ensuite au format de l'application. En cas d'échec, le fichier d'origine est rendu.
 */
export default async function shrinkPhoto(file, max = 1600) {
  try {
    const url = URL.createObjectURL(file);
    const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = url; });
    URL.revokeObjectURL(url);
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    if (k === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.85));
    return blob ? new File([blob], "photo.jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}
