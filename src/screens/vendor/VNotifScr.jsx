import { V_NOTIFS } from "../../data/vendorData";

function VNotifScr({onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications</h2><div style={{width:38}}/></div>
    {V_NOTIFS.map((n,i)=><div key={i} className={`notif-item ${!n.read?"unread":""}`}><div className="ni-icon">{n.icon}</div><div className="ni-body"><h4>{n.title}</h4><p>{n.desc}</p><div className="ni-t">{n.time}</div></div></div>)}
  </div>);
}

/* V14 ── VENDOR SHOP SETTINGS ── */

export default VNotifScr;
