import { NOTIFS } from "../../data";

function NotifScr({onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications</h2><div style={{width:38}}/></div>
    {NOTIFS.map(n=><div key={n.id} className={`notif-item ${!n.read?"unread":""}`}><div className="ni-icon">{n.icon}</div><div className="ni-body"><h4>{n.title}</h4><p>{n.desc}</p><div className="ni-t">{n.time}</div></div></div>)}
  </div>);
}

/* 24 ── PROFILE ── */

export default NotifScr;
