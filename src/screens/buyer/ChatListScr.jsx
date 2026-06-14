import { useLoad } from "../../hooks";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import { CHAT_AVATARS } from "../../data/images";
import { social } from "../../services";
import { SkeletonList } from "../../components/Loading";

function ChatListScr({go}){
  const { isGuest, exitGuestToLogin, setTab } = useApp();
  if (isGuest) return (
    <div className="scr" style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 24px 100px",textAlign:"center",minHeight:"100%",boxSizing:"border-box"}}>
      <div style={{width:80,height:80,borderRadius:24,background:"rgba(249,115,22,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,color:"#F97316"}}>
        <Icon name="chat" size={36} color="#F97316"/>
      </div>
      <h2 style={{fontSize:20,fontWeight:800,letterSpacing:-.4,marginBottom:10}}>Connexion requise</h2>
      <p style={{fontSize:13,color:"var(--muted)",marginBottom:24,maxWidth:280,lineHeight:1.5}}>Connectez-vous pour discuter avec vendeurs et livreurs.</p>
      <button onClick={()=>exitGuestToLogin()} style={{padding:"12px 28px",borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Se connecter</button>
      <button onClick={()=>setTab(0)} style={{marginTop:14,padding:"12px 24px",borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"inline-flex",alignItems:"center",gap:8}}><Icon name="home" size={16}/>Retour à l&apos;accueil</button>
    </div>
  );

  const { data: CHATS, loading } = useLoad(() => social.getConversations());
  return(<PullToRefresh onRefresh={async()=>{toast.success("Messages actualisés")}}><div className="scr"><div className="appbar"><button onClick={()=>onBack&&onBack()}>←</button><h2>Messages</h2><div style={{width:38}}/></div>
    {loading?<SkeletonList count={4}/>:(CHATS||[]).map(c=><div key={c.id} className="chat-list-item" onClick={()=>go("chatDriver")}>
      <div className="cl-av" style={{overflow:"hidden",padding:0}}><img src={c.avatar||CHAT_AVATARS[c.type||"client"]} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div>
      <div className="cl-info"><h4>{c.name}</h4><p>{c.lastMsg}</p></div>
      <div className="cl-meta"><span>{c.time}</span>{c.unread>0&&<div className="cl-badge">{c.unread}</div>}</div>
    </div>)}
  </div></PullToRefresh>);
}

export default ChatListScr;
