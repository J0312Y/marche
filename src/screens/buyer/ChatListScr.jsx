import { useLoad } from "../../hooks";
import { social } from "../../services";
import { SkeletonList } from "../../components/Loading";

function ChatListScr({go,onBack}){
  const { data: CHATS, loading } = useLoad(() => social.getConversations());
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Messages</h2><div style={{width:38}}/></div>
    {loading?<SkeletonList count={4}/>:(CHATS||[]).map(c=><div key={c.id} className="chat-list-item" onClick={()=>go("chatDriver")}>
      <div className="cl-av">{c.avatar}</div>
      <div className="cl-info"><h4>{c.name}</h4><p>{c.lastMsg}</p></div>
      <div className="cl-meta"><span>{c.time}</span>{c.unread>0&&<div className="cl-badge">{c.unread}</div>}</div>
    </div>)}
  </div>);
}

export default ChatListScr;
