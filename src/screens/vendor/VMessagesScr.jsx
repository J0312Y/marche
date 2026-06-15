

import { CHAT_AVATARS } from "../../data/images";
import Icon from "../../components/Icon";
const PHOTOS=["https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"];
function VMessagesScr({go,onBack}){
  const vChats=[
    {id:"vc1",name:"Marie Koumba",photo:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",lastMsg:"La robe est disponible en L ?",time:"14:42",unread:1},
    {id:"vc2",name:"Patrick Mbemba",photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",lastMsg:"Merci pour la livraison rapide !",time:"12:15",unread:0},
    {id:"vc3",name:"Celine Nzaba",photo:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",lastMsg:"Quand sera de retour le sac ?",time:"Hier",unread:2},
    {id:"vc4",name:"David Tsaty",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",lastMsg:"OK je comprends",time:"Il y a 3j",unread:0},
  ];
  return(<div className="scr"><div className="appbar">{onBack && <button onClick={()=>onBack()} style={{width:36,height:36,borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>}<h2>Messages</h2>{onBack && <div style={{width:38}}/>}</div>
    {vChats.map(c=><div key={c.id} className="chat-list-item" onClick={()=>go("vChat",c)}>
      <div className="cl-av"><img src={c.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <div className="cl-info"><h4>{c.name}</h4><p>{c.lastMsg}</p></div>
      <div className="cl-meta"><span>{c.time}</span>{c.unread>0&&<div className="cl-badge">{c.unread}</div>}</div>
    </div>)}
  </div>);
}

/* V9 ── VENDOR CHAT ── */

export default VMessagesScr;
