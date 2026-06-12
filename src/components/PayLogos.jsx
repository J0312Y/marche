// Payment method logos — official brand assets

function AirtelLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="32" fill="#ED1C24"/>
    <text x="32" y="38" textAnchor="middle" fontSize="11" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#fff" letterSpacing="0.5">airtel</text>
    <text x="32" y="50" textAnchor="middle" fontSize="6" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">money</text>
  </svg>;
}

function MTNLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#FFCC00"/>
    <ellipse cx="32" cy="32" rx="22" ry="14" fill="none" stroke="#003594" strokeWidth="3"/>
    <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#003594" letterSpacing="0.5">MTN</text>
  </svg>;
}

function OrangeLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#FF6600"/>
    <rect x="14" y="22" width="36" height="20" fill="#fff" rx="2"/>
    <text x="32" y="36" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#000" letterSpacing="0.3">orange</text>
  </svg>;
}

function KoloLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="koloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316"/>
        <stop offset="100%" stopColor="#7C3AED"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#koloGrad)"/>
    <text x="32" y="40" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#fff">Kolo</text>
  </svg>;
}

function CashLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect width="64" height="64" rx="14" fill="#10B981"/>
    <rect x="12" y="20" width="40" height="24" rx="3" fill="#fff" opacity=".95"/>
    <circle cx="32" cy="32" r="7" fill="none" stroke="#10B981" strokeWidth="2"/>
    <text x="32" y="36" textAnchor="middle" fontSize="11" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#10B981">F</text>
    <circle cx="18" cy="26" r="1.5" fill="#10B981"/>
    <circle cx="46" cy="38" r="1.5" fill="#10B981"/>
  </svg>;
}

function VisaLogo({size=24}) {
  return <svg width={size} height={size*0.62} viewBox="0 0 64 40" fill="none">
    <rect width="64" height="40" rx="6" fill="#fff" stroke="#E5E7EB"/>
    <text x="32" y="26" textAnchor="middle" fontSize="14" fontWeight="900" fontFamily="Arial Black, sans-serif" fill="#1A1F71" letterSpacing="1">VISA</text>
  </svg>;
}

function MastercardLogo({size=24}) {
  return <svg width={size} height={size*0.62} viewBox="0 0 64 40" fill="none">
    <rect width="64" height="40" rx="6" fill="#fff" stroke="#E5E7EB"/>
    <circle cx="26" cy="20" r="11" fill="#EB001B" opacity=".95"/>
    <circle cx="38" cy="20" r="11" fill="#F79E1B" opacity=".85"/>
  </svg>;
}

// Default export — takes method prop
function PayLogo({method, size=24}) {
  if (method === "airtel") return <AirtelLogo size={size}/>;
  if (method === "mtn") return <MTNLogo size={size}/>;
  if (method === "orange") return <OrangeLogo size={size}/>;
  if (method === "kolo") return <KoloLogo size={size}/>;
  if (method === "cash") return <CashLogo size={size}/>;
  if (method === "visa") return <VisaLogo size={size}/>;
  if (method === "mastercard") return <MastercardLogo size={size}/>;
  return null;
}

export { AirtelLogo, MTNLogo, OrangeLogo, KoloLogo, CashLogo, VisaLogo, MastercardLogo };
export default PayLogo;
