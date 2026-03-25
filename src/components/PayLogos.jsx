// Payment method logos — Airtel Money, MTN MoMo, Kolo Pay, Cash

function AirtelLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#ED1C24"/>
    <path d="M12 30c4-8 8-14 12-14s8 6 12 14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <path d="M18 30c2.5-5 5-9 6-9s3.5 4 6 9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <circle cx="24" cy="18" r="2" fill="#fff"/>
  </svg>;
}

function MTNLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#FFCB05"/>
    <text x="24" y="30" textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" fill="#003087">MTN</text>
  </svg>;
}

function KoloLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#7C3AED"/>
    <text x="24" y="32" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="Arial,sans-serif" fill="#fff">K</text>
  </svg>;
}

function CashLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#10B981"/>
    <rect x="8" y="14" width="32" height="20" rx="4" fill="#fff" opacity=".3"/>
    <circle cx="24" cy="24" r="6" fill="#fff" opacity=".5"/>
    <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif" fill="#10B981">F</text>
  </svg>;
}

// Default export — takes method prop
function PayLogo({method, size=24}) {
  if (method === "airtel") return <AirtelLogo size={size}/>;
  if (method === "mtn") return <MTNLogo size={size}/>;
  if (method === "kolo") return <KoloLogo size={size}/>;
  if (method === "cash") return <CashLogo size={size}/>;
  return <KoloLogo size={size}/>;
}

export { AirtelLogo, MTNLogo, KoloLogo, CashLogo };
export default PayLogo;
