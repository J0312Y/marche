import { useState } from "react";
import PermissionSheet from "../../components/PermissionSheet";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import { useData } from "../../hooks";
import { fmt } from "../../utils/helpers";

// Codes produits/vendeurs automatiques
export const generateProductCode = (productId) => `LMK-PROD-${productId}`;
export const generateVendorCode = (vendorId) => `LMK-VEND-${vendorId}`;

export const parseCode = (code) => {
  if (!code) return null;
  const upper = code.toUpperCase();
  if (upper.startsWith("LMK-PROD-")) return { type: "product", id: upper.replace("LMK-PROD-", "").toLowerCase() };
  if (upper.startsWith("LMK-VEND-")) return { type: "vendor", id: upper.replace("LMK-VEND-", "").toLowerCase() };
  return { type: "external", code };
};

function QRScanScr({ onBack, go }) {
  const { P, VENDORS } = useData();
  const [permGranted, setPermGranted] = useState(false);
  const [showPerm, setShowPerm] = useState(true);
  const [scanMode, setScanMode] = useState("qr");
  const [scanned, setScanned] = useState(false);
  const [foundProduct, setFoundProduct] = useState(null);
  const [foundVendor, setFoundVendor] = useState(null);

  const handleScanResult = (code) => {
    const parsed = parseCode(code);
    if (!parsed) { toast.error("Code non reconnu"); return; }
    if (parsed.type === "product") {
      const p = P.find(x => x.id === parsed.id);
      if (p) { setFoundProduct(p); setScanned(true); toast.success("Produit trouvé !"); }
      else toast.error("Produit introuvable");
    } else if (parsed.type === "vendor") {
      const v = VENDORS.find(x => x.id === parsed.id);
      if (v) { setFoundVendor(v); setScanned(true); toast.success("Vendeur trouvé !"); }
      else toast.error("Vendeur introuvable");
    } else {
      toast.info("Recherche du produit...");
      setTimeout(() => {
        const random = P[Math.floor(Math.random() * P.length)];
        setFoundProduct(random); setScanned(true);
        toast.success("Correspondance trouvée !");
      }, 800);
    }
  };

  const simulateScan = () => {
    const random = P[Math.floor(Math.random() * P.length)];
    handleScanResult(generateProductCode(random.id));
  };

  const resetScan = () => { setScanned(false); setFoundProduct(null); setFoundVendor(null); };

  if (showPerm && !permGranted) return (
    <div className="scr">
      <div className="appbar"><button onClick={onBack}>←</button><h2>Scanner</h2><div style={{ width: 38 }} /></div>
      <PermissionSheet type="camera" onAllow={() => { setPermGranted(true); setShowPerm(false); }} onDeny={onBack} />
    </div>
  );

  return (
    <div className="scr" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#000" }}>
      <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff" }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow_left" size={20} color="#fff" />
        </button>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Scanner</h2>
        <button onClick={() => toast.info("Flash activé")} style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", color: "#fff", fontSize: 16 }}><Icon name="lightning" size={18}/></button>
      </div>

      {!scanned && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "0 16px 16px" }}>
          <button onClick={() => setScanMode("qr")} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: scanMode === "qr" ? "#fff" : "rgba(255,255,255,0.1)", color: scanMode === "qr" ? "#000" : "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="qr_code" size={14} color={scanMode === "qr" ? "#000" : "#fff"} /> QR Code
          </button>
          <button onClick={() => setScanMode("barcode")} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: scanMode === "barcode" ? "#fff" : "rgba(255,255,255,0.1)", color: scanMode === "barcode" ? "#000" : "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="barcode" size={14} color={scanMode === "barcode" ? "#000" : "#fff"} /> Code-barres
          </button>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        {!scanned ? (
          <>
            <div style={{ position: "relative", width: scanMode === "qr" ? 240 : 280, height: scanMode === "qr" ? 240 : 160 }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.03)", borderRadius: 16 }} />
              <div style={{ position: "absolute", top: -2, left: -2, width: 36, height: 36, borderTop: "4px solid #F97316", borderLeft: "4px solid #F97316", borderRadius: "8px 0 0 0" }} />
              <div style={{ position: "absolute", top: -2, right: -2, width: 36, height: 36, borderTop: "4px solid #F97316", borderRight: "4px solid #F97316", borderRadius: "0 8px 0 0" }} />
              <div style={{ position: "absolute", bottom: -2, left: -2, width: 36, height: 36, borderBottom: "4px solid #F97316", borderLeft: "4px solid #F97316", borderRadius: "0 0 0 8px" }} />
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 36, height: 36, borderBottom: "4px solid #F97316", borderRight: "4px solid #F97316", borderRadius: "0 0 8px 0" }} />
              <div style={{ position: "absolute", left: "8%", right: "8%", height: 2, background: "linear-gradient(90deg, transparent, #F97316, transparent)", boxShadow: "0 0 16px #F97316", top: "50%", animation: "scanLineFull 2s ease-in-out infinite" }} />
              <style>{`@keyframes scanLineFull { 0%,100% { top: 12% } 50% { top: 88% } }`}</style>
            </div>

            <p style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginTop: 28, textAlign: "center" }}>
              {scanMode === "qr" ? "Scannez un QR code Lamuka" : "Scannez un code-barres produit"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 6, textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>
              {scanMode === "qr" ? "Pointez vers le QR code d'un produit ou d'un vendeur" : "Tous les produits Lamuka ont un code-barres unique."}
            </p>

            <button onClick={simulateScan} style={{ marginTop: 28, padding: "12px 28px", borderRadius: 14, border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="scan" size={16} color="#fff" /> Simuler un scan
            </button>
          </>
        ) : foundProduct ? (
          <div onClick={() => { onBack(); setTimeout(() => go("detail", foundProduct), 100); }} style={{ width: "100%", maxWidth: 320, background: "#fff", borderRadius: 20, padding: 20, cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}><Icon name="check_circle" size={18}/></div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Produit trouvé !</h3>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 16, fontFamily: "monospace" }}>{generateProductCode(foundProduct.id)}</div>
            <div style={{ background: "var(--light)", borderRadius: 14, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                {foundProduct.photo ? <img src={foundProduct.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{foundProduct.img}</div>}
              </div>
              <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{foundProduct.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{foundProduct.vendor}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#F97316", marginTop: 4 }}>{fmt(foundProduct.price)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button onClick={(e) => { e.stopPropagation(); resetScan(); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Scanner à nouveau</button>
              <button onClick={() => { onBack(); setTimeout(() => go("detail", foundProduct), 100); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Voir le produit</button>
            </div>
          </div>
        ) : foundVendor ? (
          <div onClick={() => { onBack(); setTimeout(() => go("vendor", foundVendor), 100); }} style={{ width: "100%", maxWidth: 320, background: "#fff", borderRadius: 20, padding: 20, cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}><Icon name="store" size={18}/></div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Vendeur trouvé !</h3>
            <div style={{ fontSize: 14, color: "var(--text)", marginTop: 8 }}>{foundVendor.name}</div>
            <button onClick={() => { onBack(); setTimeout(() => go("vendor", foundVendor), 100); }} style={{ marginTop: 16, padding: "12px 24px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Voir la boutique</button>
          </div>
        ) : null}
      </div>

      {!scanned && <div style={{ padding: 16, color: "rgba(255,255,255,0.5)", fontSize: 11, textAlign: "center" }}><Icon name="info" size={16}/>{" "}Astuce : chaque produit Lamuka a un QR code unique</div>}
    </div>
  );
}

export default QRScanScr;
