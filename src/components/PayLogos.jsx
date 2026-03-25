/**
 * Payment provider logos — Airtel Money, MTN MoMo, Kolo Pay
 */
export function AirtelLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#ED1C24"/>
    <path d="M14 32 C14 32 18 16 24 16 C30 16 34 32 34 32" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    <circle cx="24" cy="14" r="2.5" fill="#fff"/>
  </svg>;
}

export function MTNLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#FFCC00"/>
    <text x="24" y="29" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="16" fill="#003478">MTN</text>
  </svg>;
}

export function KoloLogo({size=24}) {
  return <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill="#7C3AED"/>
    <text x="24" y="30" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="18" fill="#fff">K</text>
  </svg>;
}

export function CashLogo({size=24}) {
  return <div style={{width:size,height:size,borderRadius:size/2,background:"#10B981",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.55}}>💵</div>;
}

export function PayLogo({method, size=24}) {
  if (method === "airtel") return <AirtelLogo size={size}/>;
  if (method === "mtn") return <MTNLogo size={size}/>;
  if (method === "kolo") return <KoloLogo size={size}/>;
  if (method === "cash") return <CashLogo size={size}/>;
  return null;
}

export default PayLogo;
