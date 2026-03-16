/**
 * LoadingSpinner — Suspense fallback with skeleton layout
 */
const S=({w="100%",h=14,r=8,mb=0,style={}})=>(<div style={{width:w,height:h,borderRadius:r,marginBottom:mb,background:"linear-gradient(90deg,#F5F4F1 25%,#E8E6E1 37%,#F5F4F1 63%)",backgroundSize:"400% 100%",animation:"sk-shimmer 1.4s ease infinite",...style}}/>);

export default function LoadingSpinner() {
  return (
    <div style={{flex:1,padding:16,overflow:"hidden"}}>
      <style>{`@keyframes sk-shimmer{0%{background-position:100% 50%}100%{background-position:0 50%}}`}</style>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div><S w={100} h={10} mb={4}/><S w={150} h={18}/></div>
        <div style={{display:"flex",gap:8}}><S w={38} h={38} r={12}/><S w={38} h={38} r={12}/></div>
      </div>
      {/* Search */}
      <S h={42} r={14} mb={14}/>
      {/* Categories */}
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[1,2,3,4].map(i=>(<div key={i} style={{flexShrink:0,width:100}}><S w="100%" h={65} r={12} mb={4}/><S w="60%" h={8} style={{margin:"0 auto"}}/></div>))}
      </div>
      {/* Section */}
      <S w={140} h={14} mb={10}/>
      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[1,2,3,4].map(i=>(<div key={i} style={{borderRadius:14,overflow:"hidden",border:"1px solid #F5F4F1"}}><S w="100%" h={110} r={0}/><div style={{padding:8}}><S w="80%" h={10} mb={6}/><S w="40%" h={12}/></div></div>))}
      </div>
    </div>
  );
}
