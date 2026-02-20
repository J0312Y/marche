

function VMessagesScr({go}){
  const vChats=[
    {id:"vc1",name:"Marie Koumba",avatar:"👩",lastMsg:"La robe est disponible en L ?",time:"14:42",unread:1},
    {id:"vc2",name:"Patrick Mbemba",avatar:"👨",lastMsg:"Merci pour la livraison rapide !",time:"12:15",unread:0},
    {id:"vc3",name:"Celine Nzaba",avatar:"👩‍🦱",lastMsg:"Quand sera de retour le sac ?",time:"Hier",unread:2},
    {id:"vc4",name:"David Tsaty",avatar:"🧑",lastMsg:"OK je comprends",time:"Il y a 3j",unread:0},
  ];
  return(<div className="scr"><div className="appbar"><h2>Messages</h2></div>
    {vChats.map(c=><div key={c.id} className="chat-list-item" onClick={()=>go("vChat",c)}>
      <div className="cl-av">{c.avatar}</div>
      <div className="cl-info"><h4>{c.name}</h4><p>{c.lastMsg}</p></div>
      <div className="cl-meta"><span>{c.time}</span>{c.unread>0&&<div className="cl-badge">{c.unread}</div>}</div>
    </div>)}
  </div>);
}

/* V9 ── VENDOR CHAT ── */

export default VMessagesScr;
