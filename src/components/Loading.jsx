/**
 * Skeleton Loading System
 * Shimmer animation + preset skeletons for different page types
 */

// Base skeleton block
const S = ({w="100%",h=14,r=8,mb=0,style={}}) => (
  <div className="sk" style={{width:w,height:h,borderRadius:r,marginBottom:mb,...style}}/>
);

// Circle skeleton
const SC = ({size=40,mb=0,style={}}) => (
  <div className="sk" style={{width:size,height:size,borderRadius:size/2,flexShrink:0,marginBottom:mb,...style}}/>
);

// ── Default spinner (fallback)
function Loading({ text = "Chargement..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 12 }}>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: "rgba(99,102,241,.2)", borderTopColor: "#6366F1" }} />
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{text}</span>
    </div>
  );
}

// ── Product Grid Skeleton (HomeScr, VendorScr)
function SkeletonGrid({count=4}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 16px"}}>
      {Array(count).fill(0).map((_,i)=>(
        <div key={i} style={{background:"var(--card)",borderRadius:14,overflow:"hidden",border:"1px solid #F5F4F1"}}>
          <S w="100%" h={120} r={0} />
          <div style={{padding:"10px"}}>
            <S w="80%" h={12} mb={8}/>
            <S w="50%" h={10} mb={8}/>
            <S w="40%" h={14}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard Skeleton (VDashboardScr)
function SkeletonDashboard(){
  return(
    <div style={{padding:16}}>
      <S w={180} h={22} mb={14}/>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[1,2,3].map(i=><S key={i} w={80} h={32} r={20}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{padding:12,background:"var(--card)",borderRadius:14,border:"1px solid #F5F4F1"}}>
            <SC size={24} mb={8}/>
            <S w="60%" h={20} mb={4}/>
            <S w="40%" h={10}/>
          </div>
        ))}
      </div>
      <div style={{padding:14,background:"var(--card)",borderRadius:14,border:"1px solid #F5F4F1",marginBottom:14}}>
        <S w={160} h={14} mb={12}/>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
          {[40,65,50,80,70,45,60].map((h,i)=><S key={i} w="100%" h={h} r={4} style={{flex:1}}/>)}
        </div>
      </div>
      <div style={{padding:14,background:"var(--card)",borderRadius:14,border:"1px solid #F5F4F1"}}>
        <S w={120} h={14} mb={14}/>
        {[1,2,3].map(i=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:i>1?"1px solid #F5F4F1":"none"}}>
            <SC size={28}/>
            <div style={{flex:1}}><S w="60%" h={12} mb={4}/><S w="35%" h={10}/></div>
            <S w={70} h={12}/>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── List Skeleton (Orders, Notifications, Chats, Products, Reviews, Promos)
function SkeletonList({count=4,hasImage=false}){
  return(
    <div style={{padding:"0 16px"}}>
      {Array(count).fill(0).map((_,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
          {hasImage?<S w={44} h={44} r={12}/>:<SC size={42}/>}
          <div style={{flex:1}}>
            <S w="70%" h={12} mb={6}/>
            <S w="90%" h={10} mb={4}/>
            <S w="30%" h={9}/>
          </div>
          <S w={50} h={12}/>
        </div>
      ))}
    </div>
  );
}

// ── Card List Skeleton (Orders, Wallet transactions)
function SkeletonCards({count=3}){
  return(
    <div style={{padding:"0 16px"}}>
      {Array(count).fill(0).map((_,i)=>(
        <div key={i} style={{padding:14,background:"var(--card)",border:"1px solid #F5F4F1",borderRadius:14,marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <S w={100} h={14}/><S w={70} h={22} r={8}/>
          </div>
          <S w="60%" h={10} mb={8}/>
          <div style={{display:"flex",gap:6}}>
            <S w={80} h={28} r={10}/><S w={80} h={28} r={10}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
            <S w={90} h={14}/><S w={60} h={10}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Wallet Skeleton
function SkeletonWallet(){
  return(
    <div style={{padding:16}}>
      <div style={{padding:20,background:"var(--light)",borderRadius:18,marginBottom:14,textAlign:"center"}}>
        <S w={100} h={10} mb={8} style={{margin:"0 auto"}}/>
        <S w={160} h={28} mb={6} style={{margin:"0 auto"}}/>
        <S w={120} h={10} style={{margin:"0 auto"}}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        <S h={44} r={12} style={{flex:1}}/><S h={44} r={12} style={{flex:1}}/>
      </div>
      <S w={100} h={14} mb={12}/>
      <SkeletonList count={4}/>
    </div>
  );
}

// ── Stats Skeleton
function SkeletonStats(){
  return(
    <div style={{padding:16}}>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[1,2,3].map(i=><S key={i} w={80} h={32} r={20}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{padding:12,background:"var(--card)",borderRadius:14,border:"1px solid #F5F4F1"}}>
            <S w={24} h={24} r={6} mb={6}/>
            <S w="55%" h={18} mb={4}/>
            <S w="35%" h={10}/>
          </div>
        ))}
      </div>
      <div style={{padding:14,background:"var(--card)",borderRadius:14,border:"1px solid #F5F4F1"}}>
        <S w={140} h={14} mb={12}/>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
          {[50,70,55,85,75,50,65].map((h,i)=><S key={i} w="100%" h={h} r={4} style={{flex:1}}/>)}
        </div>
      </div>
    </div>
  );
}

// ── Home Skeleton
function SkeletonHome(){
  return(
    <div style={{padding:16}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><S w={100} h={10} mb={4}/><S w={150} h={18}/></div>
        <div style={{display:"flex",gap:8}}><SC size={38}/><SC size={38}/></div>
      </div>
      {/* Search */}
      <S h={44} r={14} mb={14}/>
      {/* Categories */}
      <div style={{display:"flex",gap:10,marginBottom:14,overflow:"hidden"}}>
        {[1,2,3,4].map(i=>(
          <div key={i} style={{flexShrink:0,width:110,borderRadius:14,overflow:"hidden",border:"1px solid #F5F4F1"}}>
            <S w="100%" h={70} r={0}/><div style={{padding:6}}><S w="70%" h={10} mb={3} style={{margin:"0 auto"}}/><S w="40%" h={8} style={{margin:"0 auto"}}/></div>
          </div>
        ))}
      </div>
      {/* Section */}
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><S w={140} h={16}/><S w={60} h={12}/></div>
      <SkeletonGrid count={4}/>
    </div>
  );
}

function ErrorMsg({ message = "Erreur de chargement", onRetry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 12, textAlign: "center" }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>{message}</span>
      {onRetry && <button onClick={onRetry} style={{ padding: "8px 20px", borderRadius: 10, border: "1px solid #E8E6E1", background: "var(--card)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🔄 Réessayer</button>}
    </div>
  );
}

function Empty({ icon = "📭", text = "Aucun résultat" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, gap: 8, textAlign: "center" }}>
      <span style={{ fontSize: 36 }}>{icon}</span>
      <span style={{ fontSize: 13, color: "var(--muted)" }}>{text}</span>
    </div>
  );
}

export { Loading, ErrorMsg, Empty, SkeletonGrid, SkeletonDashboard, SkeletonList, SkeletonCards, SkeletonWallet, SkeletonStats, SkeletonHome };
export default Loading;
