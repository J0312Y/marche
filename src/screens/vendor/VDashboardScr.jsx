import { useState } from "react";
import { useLoad, useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import { vendor } from "../../services";
import { SkeletonDashboard } from "../../components/Loading";
import PullToRefresh from "../../components/PullToRefresh";
import Icon from "../../components/Icon";
import { fmt } from "../../utils/helpers";

const Svg = {
  bell:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chart:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  trendUp:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  clock:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>,
  minus:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  plus:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  catalogue:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  tag:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  star:<svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  warn:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  reply:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>,
  lightning:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  store:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l1-5h16l1 5"/><path d="M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9"/><path d="M3 9c0 1.5 1 3 3 3s3-1.5 3-3 1 3 3 3 3-1.5 3-3 1 3 3 3 3-1.5 3-3"/></svg>,
  chevDown:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  loc:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  layers:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  plusIcon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

function VDashboardScr({ go, currentVendor }){
  const { VENDORS } = useData();
  const { vendorPlan } = useApp(); // actual plan from session
  // Use the session plan as the source of truth
  const plan = vendorPlan || "starter";
  const isStarter = plan === "starter";
  const isPro = plan === "pro";
  const isEnterprise = plan === "enterprise";
  // Pick the vendor based on the session plan (so the data matches what the user can do)
  const myVendor = currentVendor || (
    isEnterprise ? VENDORS.find(v=>v.plan==="enterprise"&&v.shops?.length>1)
    : isPro ? VENDORS.find(v=>v.plan==="pro")
    : VENDORS.find(v=>v.plan==="starter") || VENDORS[0]
  );

  // Multi-shops logic
  const hasMultiShops = isEnterprise && myVendor?.shops?.length > 1;
  const shops = myVendor?.shops || [];
  const [selectedShopId, setSelectedShopId] = useState("overview"); // "overview" or shop.id (only matters when hasMultiShops)
  const [showShopPicker, setShowShopPicker] = useState(false);

  const selectedShop = selectedShopId === "overview" ? null : shops.find(s=>s.id===selectedShopId);
  // Only treat as overview mode when we actually have multiple shops to overview
  const isOverview = hasMultiShops && selectedShopId === "overview";

  const [shopOpen, setShopOpen] = useState(selectedShop?.isOpen ?? myVendor?.isOpen !== false);
  const [prepTime, setPrepTime] = useState(20);

  const { data, loading, reload } = useLoad(() => vendor.getDashboard("today"), []);
  if(loading || !data) return <div className="scr" style={{padding:16}}><h2 style={{marginBottom:12}}>Tableau de bord</h2><SkeletonDashboard/></div>;

  // Aggregate stats logic
  const getStats = () => {
    if (isOverview && hasMultiShops) {
      return {
        revenue: shops.reduce((s,sh)=>s+(sh.todayRevenue||0),0),
        orders: shops.reduce((s,sh)=>s+(sh.todayOrders||0),0),
        goal: shops.reduce((s,sh)=>s+(sh.goal||0),0),
        rating: (shops.reduce((s,sh)=>s+(sh.rating||0),0)/shops.length).toFixed(1),
        avgBasket: 0
      };
    }
    if (selectedShop) {
      return {
        revenue: selectedShop.todayRevenue,
        orders: selectedShop.todayOrders,
        goal: selectedShop.goal,
        rating: selectedShop.rating,
        avgBasket: selectedShop.avgBasket
      };
    }
    return {
      revenue: data?.stats?.revenue || 684000,
      orders: data?.stats?.orders || 47,
      goal: 800000,
      rating: 4.8,
      avgBasket: 14555
    };
  };

  const stats = getStats();
  const todayRevenue = stats.revenue;
  const dailyGoal = stats.goal;
  const goalProgress = dailyGoal > 0 ? Math.min(100, (todayRevenue / dailyGoal) * 100) : 0;
  const trend = 12.4;
  const ordersCount = stats.orders;
  const avgBasket = stats.avgBasket || (ordersCount > 0 ? Math.round(todayRevenue / ordersCount) : 0);
  const rating = stats.rating;

  const outOfStock = [
    { name: "Sac à Main Cuir", stock: 0 },
    { name: "Bracelet Perles", stock: 0 },
    { name: "Écharpe Kente", stock: 0 },
  ];

  const messages = [
    { id: "m1", initials: "AL", name: "Amélie L.", text: "Bonjour, possible sans gingembre sur la commande #4821 ?", time: "2 min", unread: true, color: "#10B981" },
    { id: "m2", initials: "TM", name: "Thomas M.", text: "Merci, tout était parfait, à très vite !", time: "24 min", unread: false, color: "#D97706" },
  ];
  const unreadMessages = messages.filter(m=>m.unread).length;

  const inPreparation = [
    { ref: "#4820", status: "preparing", items: "1× Menu Bento", price: 16900, time: 5, progress: 50 },
    { ref: "#4819", status: "ready", items: "3× Maki, 2× Edamame", price: 34200, time: 0, progress: 100, waiting: true },
    { ref: "#4818", status: "preparing", items: "1× Poke saumon", price: 13500, time: 9, progress: 25 },
  ];

  const lastReview = {
    initials: "SC", name: "Sophie C.", rating: 5,
    text: "« Sushis ultra frais et livraison rapide. Le menu Bento est top, je recommande ! »"
  };

  const sparkline = [40, 55, 45, 70, 65, 80, 75, 90];
  const sparkMax = Math.max(...sparkline);

  const newOrders = data?.new_orders || 1;

  return(<PullToRefresh onRefresh={reload}><div className="scr" style={{padding:0, paddingBottom:24}}>

    {/* HEADER */}
    <div style={{padding:"16px 16px 12px", display:"flex", alignItems:"center", gap:12}}>
      <div style={{width:44, height:44, borderRadius:14, overflow:"hidden", background:"var(--light)", flexShrink:0, border:"1px solid var(--border)"}}>
        {myVendor?.logo
          ? <img src={myVendor.logo} alt={myVendor?.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
          : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#F97316,#EA580C)",color:"#fff",fontSize:18,fontWeight:800}}>{(myVendor?.name||"M").charAt(0)}</div>
        }
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:"flex", alignItems:"center", gap:6}}>
          <h2 style={{fontSize:17, fontWeight:800, letterSpacing:-.3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", minWidth:0}}>{myVendor?.name||"Ma Boutique"}</h2>
          {isPro&&<span style={{padding:"1px 6px", background:"rgba(249,115,22,0.1)", color:"#F97316", borderRadius:4, fontSize:9, fontWeight:800, flexShrink:0}}>PRO</span>}
          {isEnterprise&&<span style={{padding:"1px 6px", background:"linear-gradient(135deg,#F59E0B,#D97706)", color:"#fff", borderRadius:4, fontSize:9, fontWeight:800, flexShrink:0}}>ENTERPRISE</span>}
        </div>
        <div style={{fontSize:11, color:"var(--muted)", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
          {myVendor?.loc||"Brazzaville"} · {myVendor?.type==="restaurant"?"Restaurant":myVendor?.type==="patisserie"?"Pâtisserie":myVendor?.type==="supermarche"?"Supermarché":myVendor?.type==="pharmacie"?"Pharmacie":"Boutique"}
        </div>
      </div>
      <button onClick={()=>setShopOpen(!shopOpen)} style={{display:"flex", alignItems:"center", gap:8, padding:"6px 8px 6px 14px", border:"none", background:shopOpen?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)", borderRadius:22, cursor:"pointer", fontFamily:"inherit"}}>
        <span style={{fontSize:12, fontWeight:700, color:shopOpen?"#10B981":"#EF4444"}}>{shopOpen?"Ouvert":"Fermé"}</span>
        <div style={{width:32, height:18, borderRadius:10, background:shopOpen?"#10B981":"#EF4444", position:"relative"}}>
          <div style={{position:"absolute", top:2, left:shopOpen?16:2, width:14, height:14, borderRadius:7, background:"#fff", transition:"left 0.2s"}}/>
        </div>
      </button>
      <button onClick={()=>go("vNotif")} style={{width:38, height:38, borderRadius:12, background:"var(--light)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text)", position:"relative"}}>
        {Svg.bell}
        {newOrders>0&&<span style={{position:"absolute", top:6, right:6, width:8, height:8, borderRadius:4, background:"#EF4444", border:"1.5px solid var(--card)"}}/>}
      </button>
    </div>

    {/* ═══ MULTI-SHOPS SELECTOR — Enterprise only ═══ */}
    {hasMultiShops && (
      <div style={{padding:"0 16px 14px"}}>
        <div onClick={()=>setShowShopPicker(true)} style={{padding:"12px 14px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, display:"flex", alignItems:"center", gap:12, cursor:"pointer"}}>
          <div style={{width:38, height:38, borderRadius:10, background:isOverview?"linear-gradient(135deg,#F59E0B,#D97706)":"rgba(249,115,22,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color:isOverview?"#fff":"#F97316", flexShrink:0}}>
            {isOverview ? Svg.layers : Svg.store}
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontSize:10, color:"var(--muted)", fontWeight:700, letterSpacing:.5}}>BOUTIQUE</div>
            <div style={{fontSize:14, fontWeight:800, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:1}}>
              {isOverview ? `Vue d'ensemble (${shops.length} boutiques)` : selectedShop?.name}
            </div>
            {!isOverview && selectedShop && (
              <div style={{fontSize:10, color:"var(--muted)", marginTop:2, display:"flex", alignItems:"center", gap:3}}>
                {Svg.loc} {selectedShop.loc}
              </div>
            )}
          </div>
          <div style={{color:"var(--muted)"}}>{Svg.chevDown}</div>
        </div>
      </div>
    )}

    {/* HERO — TODAY'S REVENUE */}
    <div style={{margin:"0 16px 14px", padding:"22px 20px", background:"#0F172A", borderRadius:20, color:"#fff", position:"relative"}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:10, letterSpacing:1.5, fontWeight:700, color:"rgba(255,255,255,0.55)"}}>AUJOURD'HUI</div>
          {isOverview && hasMultiShops && <div style={{fontSize:9, color:"rgba(255,255,255,0.4)", marginTop:2}}>Toutes boutiques · {shops.length} établissements</div>}
        </div>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <svg width="60" height="22" viewBox="0 0 60 22" style={{overflow:"visible"}}>
            <polyline
              points={sparkline.map((v,i)=>`${(i/(sparkline.length-1))*60},${22-(v/sparkMax)*20}`).join(" ")}
              fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          <span style={{padding:"3px 10px", background:"rgba(16,185,129,0.18)", color:"#10B981", borderRadius:6, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", gap:3}}>
            {Svg.trendUp} {trend}%
          </span>
        </div>
      </div>

      <div style={{fontSize:42, fontWeight:800, letterSpacing:-1, marginTop:8, marginBottom:18}}>{fmt(todayRevenue)}</div>

      <div style={{display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:8}}>
        <span style={{color:"rgba(255,255,255,0.7)"}}>Objectif du jour</span>
        <span style={{fontWeight:700}}>{fmt(todayRevenue)} / {fmt(dailyGoal)} · {Math.round(goalProgress)}%</span>
      </div>
      <div style={{width:"100%", height:6, background:"rgba(255,255,255,0.12)", borderRadius:3, overflow:"hidden"}}>
        <div style={{width:`${goalProgress}%`, height:"100%", background:"linear-gradient(90deg,#10B981,#34D399)", borderRadius:3}}/>
      </div>

      <div style={{display:"flex", marginTop:18, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.1)"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:24, fontWeight:800, letterSpacing:-.5}}>{ordersCount}</div>
          <div style={{fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2}}>Commandes</div>
        </div>
        <div style={{width:1, background:"rgba(255,255,255,0.1)", margin:"0 14px"}}/>
        <div style={{flex:1.2}}>
          <div style={{fontSize:24, fontWeight:800, letterSpacing:-.5}}>{fmt(avgBasket)}</div>
          <div style={{fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2}}>Panier moy.</div>
        </div>
        <div style={{width:1, background:"rgba(255,255,255,0.1)", margin:"0 14px"}}/>
        <div style={{flex:.9}}>
          <div style={{fontSize:24, fontWeight:800, letterSpacing:-.5, display:"flex", alignItems:"center", gap:4}}>{rating} {Svg.star}</div>
          <div style={{fontSize:10, color:"rgba(255,255,255,0.55)", marginTop:2}}>Note</div>
        </div>
      </div>
    </div>

    {/* ═══ OVERVIEW MODE — Show each shop card with mini stats ═══ */}
    {isOverview && hasMultiShops && (
      <>
        <div style={{padding:"6px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <h3 style={{fontSize:16, fontWeight:800, letterSpacing:-.3}}>Mes boutiques</h3>
          <span onClick={()=>go("vShops")} style={{fontSize:12, color:"#F97316", fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4}}>
            {Svg.plusIcon} Ajouter
          </span>
        </div>
        <div style={{padding:"0 16px 14px"}}>
          {shops.map(s=>{
            const sProgress = Math.min(100, (s.todayRevenue/s.goal)*100);
            return(
              <div key={s.id} onClick={()=>setSelectedShopId(s.id)} style={{padding:14, background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, marginBottom:10, cursor:"pointer"}}>
                <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:10}}>
                  <div style={{width:50, height:50, borderRadius:12, overflow:"hidden", background:"var(--light)", flexShrink:0}}>
                    {s.cover && <img src={s.cover} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      <div style={{fontSize:14, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{s.name}</div>
                      <span style={{padding:"2px 8px", background:s.isOpen?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)", color:s.isOpen?"#10B981":"#EF4444", borderRadius:5, fontSize:9, fontWeight:700, flexShrink:0, marginLeft:8}}>{s.isOpen?"Ouvert":"Fermé"}</span>
                    </div>
                    <div style={{fontSize:11, color:"var(--muted)", marginTop:2, display:"flex", alignItems:"center", gap:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                      {Svg.loc} {s.loc}
                    </div>
                  </div>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:6}}>
                  <span style={{color:"var(--muted)"}}>{s.todayOrders} commandes</span>
                  <span style={{fontWeight:800}}>{fmt(s.todayRevenue)}</span>
                </div>
                <div style={{height:4, background:"var(--border)", borderRadius:2, overflow:"hidden"}}>
                  <div style={{width:`${sProgress}%`, height:"100%", background:"linear-gradient(90deg,#10B981,#34D399)"}}/>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--muted)", marginTop:4}}>
                  <span>{Math.round(sProgress)}% de l'objectif</span>
                  <span style={{display:"flex", alignItems:"center", gap:3}}>{Svg.star} {s.rating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </>
    )}

    {/* PREPARATION TIME — restaurants/patisseries only, per-shop or globally */}
    {!isOverview && (myVendor?.type==="restaurant"||myVendor?.type==="patisserie") && (
      <div style={{margin:"0 16px 14px", padding:16, background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, display:"flex", alignItems:"center", gap:14}}>
        <div style={{width:44, height:44, borderRadius:14, background:"var(--light)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text)", flexShrink:0}}>{Svg.clock}</div>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:14, fontWeight:700}}>Temps de préparation</div>
          <div style={{fontSize:11, color:"var(--muted)", marginTop:1}}>Affiché aux clients</div>
        </div>
        <button onClick={()=>setPrepTime(Math.max(5,prepTime-5))} style={{width:32, height:32, borderRadius:"50%", border:"none", background:"var(--light)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>{Svg.minus}</button>
        <div style={{fontSize:18, fontWeight:800, minWidth:54, textAlign:"center"}}>{prepTime} min</div>
        <button onClick={()=>setPrepTime(prepTime+5)} style={{width:32, height:32, borderRadius:"50%", border:"none", background:"#10B981", color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center"}}>{Svg.plus}</button>
      </div>
    )}

    {/* QUICK ACTIONS */}
    <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, padding:"0 16px 14px"}}>
      <div onClick={()=>go("vProducts")} style={{padding:"14px 8px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
        <div style={{color:"var(--text)"}}>{Svg.catalogue}</div>
        <div style={{fontSize:11, fontWeight:700}}>Catalogue</div>
      </div>
      <div onClick={()=>go("vPromos")} style={{padding:"14px 8px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, position:"relative"}}>
        <div style={{color:"#F97316"}}>{Svg.tag}</div>
        <div style={{fontSize:11, fontWeight:700}}>Promotions</div>
        {isStarter&&<span style={{position:"absolute", top:6, right:6, padding:"1px 5px", background:"#F59E0B", color:"#fff", borderRadius:3, fontSize:8, fontWeight:800}}>PRO</span>}
      </div>
      <div onClick={()=>go("vStats")} style={{padding:"14px 8px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8, position:"relative"}}>
        <div style={{color:"#10B981"}}>{Svg.chart}</div>
        <div style={{fontSize:11, fontWeight:700}}>Stats</div>
        {isStarter&&<span style={{position:"absolute", top:6, right:6, padding:"1px 5px", background:"#F59E0B", color:"#fff", borderRadius:3, fontSize:8, fontWeight:800}}>PRO</span>}
      </div>
      <div onClick={()=>hasMultiShops?go("vShops"):go("vSettings")} style={{padding:"14px 8px", background:"var(--card)", border:"1px solid var(--border)", borderRadius:16, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8}}>
        <div style={{color:"var(--text)"}}>{hasMultiShops ? Svg.store : Svg.clock}</div>
        <div style={{fontSize:11, fontWeight:700}}>{hasMultiShops?"Boutiques":"Horaires"}</div>
      </div>
    </div>

    {/* The remaining sections — only show when a specific shop is selected (not in overview mode for multi-shops) */}
    {!isOverview && (
      <>
        {outOfStock.length>0&&(
          <div onClick={()=>go("vProducts")} style={{margin:"0 16px 14px", padding:14, background:"rgba(245,158,11,0.08)", border:"1px solid rgba(245,158,11,0.2)", borderRadius:14, display:"flex", alignItems:"center", gap:12, cursor:"pointer"}}>
            <div style={{width:38, height:38, borderRadius:10, background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>{Svg.warn}</div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{fontSize:13, fontWeight:700}}>{outOfStock.length} produits en rupture</div>
              <div style={{fontSize:11, color:"#D97706", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{outOfStock.map(p=>p.name).join(" · ")}</div>
            </div>
            <span style={{fontSize:12, fontWeight:700, color:"#D97706"}}>Gérer →</span>
          </div>
        )}

        {newOrders>0&&(
          <div style={{margin:"0 16px 14px", padding:14, background:"var(--card)", border:"2px solid #F97316", borderRadius:14}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div style={{width:8, height:8, borderRadius:4, background:"#F97316", animation:"pulse-dot 1.5s ease-in-out infinite"}}/>
                <div style={{fontSize:14, fontWeight:800, color:"#F97316"}}>Nouvelle commande</div>
              </div>
              <span style={{fontSize:11, fontWeight:700, color:"var(--muted)"}}>#4821</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
              <div style={{fontSize:13}}>2× California, 1× Soupe Miso</div>
              <div style={{fontSize:14, fontWeight:800}}>{fmt(28400)}</div>
            </div>
            <div style={{display:"flex", gap:8}}>
              <button style={{flex:.4, padding:"10px 14px", borderRadius:10, border:"1px solid var(--border)", background:"var(--card)", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit"}}>Refuser</button>
              <button onClick={()=>go("vOrdersList")} style={{flex:1, padding:"10px 14px", borderRadius:10, border:"none", background:"#10B981", color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6}}>
                {Svg.check} Accepter · {prepTime} min
              </button>
            </div>
          </div>
        )}

        <div style={{padding:"6px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <div style={{display:"flex", alignItems:"center", gap:8}}>
            <h3 style={{fontSize:16, fontWeight:800, letterSpacing:-.3}}>Messages</h3>
            {unreadMessages>0&&<span style={{padding:"2px 8px", background:"#EF4444", color:"#fff", borderRadius:10, fontSize:10, fontWeight:700}}>{unreadMessages} non lus</span>}
          </div>
          <span onClick={()=>go("vMessages")} style={{fontSize:12, color:"#10B981", fontWeight:700, cursor:"pointer"}}>Tout voir</span>
        </div>
        <div style={{padding:"0 16px 14px"}}>
          {messages.map(m=>(
            <div key={m.id} onClick={()=>go("vMessages")} style={{padding:14, background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, marginBottom:8, display:"flex", gap:12, cursor:"pointer"}}>
              <div style={{width:38, height:38, borderRadius:"50%", background:m.color, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0}}>{m.initials}</div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                  <div style={{fontSize:13, fontWeight:700}}>{m.name}</div>
                  <div style={{fontSize:10, color:"var(--muted)"}}>{m.time}</div>
                </div>
                <div style={{fontSize:12, color:"var(--muted)", marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{m.text}</div>
              </div>
              {m.unread&&<div style={{width:8, height:8, borderRadius:4, background:"#EF4444", marginTop:6, flexShrink:0}}/>}
            </div>
          ))}
        </div>

        <div style={{padding:"6px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <h3 style={{fontSize:16, fontWeight:800, letterSpacing:-.3}}>En préparation</h3>
          <span onClick={()=>go("vOrdersList")} style={{fontSize:12, color:"#10B981", fontWeight:700, cursor:"pointer"}}>Tout voir</span>
        </div>
        <div style={{padding:"0 16px 14px"}}>
          {inPreparation.map(o=>(
            <div key={o.ref} onClick={()=>go("vOrdersList")} style={{padding:14, background:"var(--card)", border:"1px solid var(--border)", borderRadius:14, marginBottom:8, cursor:"pointer"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <span style={{fontSize:13, fontWeight:700, color:"var(--muted)"}}>{o.ref}</span>
                  <span style={{padding:"2px 8px", background:o.status==="ready"?"rgba(16,185,129,0.12)":"rgba(217,119,6,0.12)", color:o.status==="ready"?"#10B981":"#D97706", borderRadius:5, fontSize:10, fontWeight:700}}>{o.status==="ready"?"Prêt":"En cours"}</span>
                </div>
                <div style={{fontSize:14, fontWeight:800}}>{fmt(o.price)}</div>
              </div>
              <div style={{fontSize:12}}>{o.items}</div>
              <div style={{marginTop:8, display:"flex", alignItems:"center", gap:8}}>
                <div style={{flex:1, height:5, borderRadius:3, background:"var(--border)", overflow:"hidden"}}>
                  <div style={{width:`${o.progress}%`, height:"100%", background:o.status==="ready"?"#10B981":"#D97706", borderRadius:3}}/>
                </div>
                <span style={{fontSize:10, color:"var(--muted)", fontWeight:600, minWidth:64, textAlign:"right"}}>{o.waiting?"Attente livreur":`${o.time} min`}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{padding:"6px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10}}>
          <h3 style={{fontSize:16, fontWeight:800, letterSpacing:-.3}}>Dernier avis</h3>
          <span onClick={()=>go("vReviews")} style={{fontSize:12, color:"#F59E0B", fontWeight:700, display:"flex", alignItems:"center", gap:4}}>{Svg.star} {rating} · 312 avis</span>
        </div>
        <div style={{padding:"0 16px 14px"}}>
          <div style={{padding:14, background:"var(--card)", border:"1px solid var(--border)", borderRadius:14}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
              <div style={{display:"flex", alignItems:"center", gap:10}}>
                <div style={{width:34, height:34, borderRadius:"50%", background:"#1A1F2E", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800}}>{lastReview.initials}</div>
                <div style={{fontSize:13, fontWeight:700}}>{lastReview.name}</div>
              </div>
              <div style={{display:"flex", gap:2}}>{[1,2,3,4,5].map(i=><span key={i}>{Svg.star}</span>)}</div>
            </div>
            <div style={{fontSize:12, lineHeight:1.5, marginBottom:10}}>{lastReview.text}</div>
            <button onClick={()=>go("vReviews")} style={{width:"100%", padding:"9px", background:"rgba(16,185,129,0.08)", border:"none", borderRadius:10, fontSize:12, fontWeight:700, color:"#10B981", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6}}>
              {Svg.reply} Répondre
            </button>
          </div>
        </div>
      </>
    )}

    {/* PLAN CTAs */}
    {isStarter&&(
      <div onClick={()=>go("vUpgradePlan")} style={{margin:"0 16px 14px", padding:"14px 18px", background:"linear-gradient(135deg,#10B981,#059669)", borderRadius:16, cursor:"pointer", display:"flex", alignItems:"center", gap:12}}>
        <div style={{color:"#fff"}}>{Svg.lightning}</div>
        <div style={{flex:1, color:"#fff"}}>
          <div style={{fontSize:14, fontWeight:800}}>Passez au plan Pro</div>
          <div style={{fontSize:11, opacity:.85, marginTop:2}}>Articles illimités · Promotions · Stats avancées · Badge vérifié</div>
        </div>
        <span style={{fontSize:13, color:"#fff", fontWeight:800}}>→</span>
      </div>
    )}
    {isPro&&(
      <div onClick={()=>go("vUpgradePlan")} style={{margin:"0 16px 14px", padding:"14px 18px", background:"linear-gradient(135deg,#F59E0B,#D97706)", borderRadius:16, cursor:"pointer", display:"flex", alignItems:"center", gap:12}}>
        <div style={{color:"#fff"}}>{Svg.lightning}</div>
        <div style={{flex:1, color:"#fff"}}>
          <div style={{fontSize:14, fontWeight:800}}>Passez au plan Enterprise</div>
          <div style={{fontSize:11, opacity:.85, marginTop:2}}>Multi-boutiques · Site web · API · Manager dédié</div>
        </div>
        <span style={{fontSize:13, color:"#fff", fontWeight:800}}>→</span>
      </div>
    )}

    {/* ═══ SHOP PICKER MODAL ═══ */}
    {showShopPicker && hasMultiShops && (
      <div onClick={()=>setShowShopPicker(false)} style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999, display:"flex", alignItems:"flex-end", justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:480, padding:"20px 0", maxHeight:"75vh", overflowY:"auto"}}>
          <div style={{width:36, height:4, background:"#E5E7EB", borderRadius:2, margin:"0 auto 16px"}}/>
          <div style={{padding:"0 20px 16px"}}>
            <h3 style={{fontSize:18, fontWeight:800, letterSpacing:-.3}}>Choisir une boutique</h3>
            <div style={{fontSize:12, color:"#6B7280", marginTop:4}}>Vous gérez {shops.length} établissements</div>
          </div>

          {/* Overview option */}
          <div onClick={()=>{setSelectedShopId("overview");setShowShopPicker(false)}} style={{margin:"0 16px 10px", padding:14, background:isOverview?"rgba(245,158,11,0.08)":"#F9FAFB", border:isOverview?"2px solid #F59E0B":"1px solid #EDEDF0", borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12}}>
            <div style={{width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#F59E0B,#D97706)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0}}>{Svg.layers}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14, fontWeight:800}}>Vue d'ensemble</div>
              <div style={{fontSize:11, color:"#6B7280", marginTop:2}}>Stats agrégées des {shops.length} boutiques</div>
            </div>
            {isOverview && <div style={{width:24, height:24, borderRadius:"50%", background:"#F59E0B", display:"flex", alignItems:"center", justifyContent:"center"}}>{Svg.check}</div>}
          </div>

          {/* Individual shops */}
          {shops.map(s=>{
            const isSelected = s.id === selectedShopId;
            return(
              <div key={s.id} onClick={()=>{setSelectedShopId(s.id);setShowShopPicker(false)}} style={{margin:"0 16px 10px", padding:14, background:isSelected?"rgba(249,115,22,0.08)":"#fff", border:isSelected?"2px solid #F97316":"1px solid #EDEDF0", borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12}}>
                <div style={{width:50, height:50, borderRadius:12, overflow:"hidden", background:"#F5F5F7", flexShrink:0}}>
                  {s.cover && <img src={s.cover} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <div style={{fontSize:14, fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{s.name}</div>
                    <span style={{padding:"1px 7px", background:s.isOpen?"rgba(16,185,129,0.12)":"rgba(239,68,68,0.12)", color:s.isOpen?"#10B981":"#EF4444", borderRadius:4, fontSize:9, fontWeight:700, marginLeft:6, flexShrink:0}}>{s.isOpen?"Ouvert":"Fermé"}</span>
                  </div>
                  <div style={{fontSize:10, color:"#6B7280", marginTop:2, display:"flex", alignItems:"center", gap:3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                    {Svg.loc} {s.loc}
                  </div>
                  <div style={{display:"flex", gap:10, fontSize:10, color:"#6B7280", marginTop:4}}>
                    <span>{s.todayOrders} cmd</span>
                    <span>{fmt(s.todayRevenue)}</span>
                    <span style={{display:"flex", alignItems:"center", gap:2}}>{Svg.star} {s.rating}</span>
                  </div>
                </div>
                {isSelected && <div style={{width:24, height:24, borderRadius:"50%", background:"#F97316", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>{Svg.check}</div>}
              </div>
            );
          })}

          <div onClick={()=>{setShowShopPicker(false);go("vAddShop")}} style={{margin:"6px 16px 12px", padding:14, background:"#fff", border:"1.5px dashed #F97316", borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:"#F97316"}}>
            {Svg.plusIcon}
            <span style={{fontSize:13, fontWeight:700}}>Ajouter une nouvelle boutique</span>
          </div>
        </div>
      </div>
    )}

  </div></PullToRefresh>);
}

export default VDashboardScr;
