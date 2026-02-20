import { D_NOTIFS } from "../../data/driverData";

function DrNotifScr({onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications</h2><div style={{width:38}}/></div>
    {D_NOTIFS.map((n,i)=><div key={i} className={`notif-item ${!n.read?"unread":""}`}><div className="ni-icon">{n.icon}</div><div className="ni-body"><h4>{n.title}</h4><p>{n.desc}</p><div className="ni-t">{n.time}</div></div></div>)}
  </div>);
}

/* D10 ── DRIVER PROFILE ── */

export default DrNotifScr;
