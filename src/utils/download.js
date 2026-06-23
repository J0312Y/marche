// download.js — Utilitaires de téléchargement de fichiers
// Génère et déclenche le téléchargement réel d'un fichier sur le téléphone

/**
 * Télécharge un texte (CSV, TXT, JSON) comme fichier
 */
export function downloadText(filename, content, mimeType = "text/plain") {
  const blob = new Blob([content], { type: mimeType + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Génère et télécharge un CSV depuis un tableau d'objets
 */
export function downloadCSV(filename, rows, columns) {
  if (!rows || rows.length === 0) {
    rows = [{}]; // CSV vide avec juste les en-têtes
  }
  const headers = columns || Object.keys(rows[0]);
  const escapeCsv = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const csvRows = [
    headers.join(","),
    ...rows.map(row => headers.map(h => escapeCsv(row[h])).join(",")),
  ];
  downloadText(filename, csvRows.join("\n"), "text/csv");
}

/**
 * Convertit un élément SVG en image PNG et télécharge
 */
export function downloadSvgAsPng(svgElement, filename, size = 512) {
  if (!svgElement) return false;
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, size, size);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) { resolve(false); return; }
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(pngUrl), 100);
        resolve(true);
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(false); };
    img.src = url;
  });
}

/**
 * Génère un reçu de paiement en HTML imprimable et ouvre la fenêtre d'impression
 * (peut être "imprimé" en PDF sur mobile)
 */
export function printReceipt(receipt) {
  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Reçu ${receipt.ref || ""}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding:30px; max-width:480px; margin:auto; color:#191815; }
  .header { text-align:center; padding-bottom:20px; border-bottom:2px solid #F97316; margin-bottom:20px; }
  .logo { font-size:24px; font-weight:800; color:#F97316; letter-spacing:-0.5px; }
  .sub { font-size:11px; color:#908C82; margin-top:4px; }
  h2 { font-size:20px; font-weight:700; margin:18px 0 12px; }
  .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #E8E6E1; font-size:13px; }
  .row.total { font-weight:800; font-size:16px; border:none; border-top:2px solid #191815; padding-top:12px; margin-top:8px; }
  .label { color:#5E5B53; }
  .footer { text-align:center; margin-top:30px; padding-top:16px; border-top:1px solid #E8E6E1; font-size:10px; color:#908C82; }
  @media print { body { padding:0; } .noprint { display:none; } }
</style></head>
<body>
  <div class="header">
    <div class="logo">LAMUKA MARKET</div>
    <div class="sub">Reçu officiel</div>
  </div>
  <h2>${receipt.title || "Reçu"}</h2>
  <div class="row"><span class="label">Référence</span><span>${receipt.ref || "—"}</span></div>
  <div class="row"><span class="label">Date</span><span>${receipt.date || new Date().toLocaleDateString("fr-FR")}</span></div>
  ${receipt.vendor ? `<div class="row"><span class="label">Vendeur</span><span>${receipt.vendor}</span></div>` : ""}
  ${receipt.customer ? `<div class="row"><span class="label">Client</span><span>${receipt.customer}</span></div>` : ""}
  ${receipt.method ? `<div class="row"><span class="label">Méthode paiement</span><span>${receipt.method}</span></div>` : ""}
  ${receipt.items ? receipt.items.map(it => `<div class="row"><span class="label">${it.name}</span><span>${it.amount}</span></div>`).join("") : ""}
  <div class="row total"><span>TOTAL</span><span>${receipt.total}</span></div>
  ${receipt.note ? `<p style="margin-top:14px; font-size:11px; color:#5E5B53; font-style:italic;">${receipt.note}</p>` : ""}
  <div class="footer">
    Lamuka Tech · Brazzaville, Congo<br/>
    support@lamuka.market · +242 064 663 469<br/>
    Ce reçu est généré automatiquement par Lamuka Market.
  </div>
  <div class="noprint" style="text-align:center; margin-top:20px;">
    <button onclick="window.print()" style="padding:12px 24px; background:#F97316; color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;">Imprimer / Enregistrer en PDF</button>
  </div>
</body></html>`;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
    return true;
  }
  return false;
}
