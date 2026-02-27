import { useEffect, useRef, useState } from "react";

/**
 * Reusable real map component - loads Leaflet from CDN (no npm install needed)
 */
function MapView({
  center=[-4.2634,15.2429],
  zoom=14,
  markers=[],
  route=null,
  routeColor="#6366F1",
  driverPos=null,
  style={},
  className="",
  children,
  onMapReady
}){
  const ref=useRef(null);
  const mapRef=useRef(null);
  const markersRef=useRef([]);
  const routeRef=useRef(null);
  const driverRef=useRef(null);
  const [ready,setReady]=useState(false);

  // Load Leaflet from CDN
  useEffect(()=>{
    let cancelled=false;
    
    const loadLeaflet=()=>{
      // Already loaded?
      if(window.L){ setReady(true); return; }

      // Load CSS
      if(!document.querySelector('link[href*="leaflet"]')){
        const link=document.createElement("link");
        link.rel="stylesheet";
        link.href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      // Load JS
      if(!document.querySelector('script[src*="leaflet"]')){
        const script=document.createElement("script");
        script.src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
        script.onload=()=>{ if(!cancelled) setReady(true); };
        document.head.appendChild(script);
      } else {
        // Script tag exists but maybe still loading
        const check=setInterval(()=>{
          if(window.L){ clearInterval(check); if(!cancelled) setReady(true); }
        },100);
      }
    };

    loadLeaflet();
    return ()=>{ cancelled=true; };
  },[]);

  // Init map once Leaflet is ready
  useEffect(()=>{
    if(!ready||!ref.current||mapRef.current||!window.L) return;
    const L=window.L;

    const map=L.map(ref.current,{center,zoom,zoomControl:false,attributionControl:false});
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(map);
    L.control.zoom({position:"bottomright"}).addTo(map);
    mapRef.current=map;
    onMapReady?.(map);

    return ()=>{map.remove();mapRef.current=null;};
  },[ready]);

  // Update center
  useEffect(()=>{
    if(mapRef.current) mapRef.current.setView(center,zoom);
  },[center[0],center[1],zoom]);

  // Update markers
  useEffect(()=>{
    if(!mapRef.current||!window.L) return;
    const L=window.L;
    markersRef.current.forEach(m=>m.remove());
    markersRef.current=[];
    markers.forEach(m=>{
      const icon=m.emoji?L.divIcon({
        html:`<div style="font-size:${m.size||28}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3));text-align:center;line-height:1">${m.emoji}</div>`,
        iconSize:[40,40],iconAnchor:[20,40],className:"",
      }):undefined;
      const marker=L.marker([m.lat,m.lng],icon?{icon}:{}).addTo(mapRef.current);
      if(m.popup) marker.bindPopup(m.popup);
      if(m.label) marker.bindTooltip(m.label,{permanent:true,direction:"top",offset:[0,-36],className:"map-tooltip"});
      markersRef.current.push(marker);
    });
  },[markers,ready]);

  // Update route
  useEffect(()=>{
    if(!mapRef.current||!window.L) return;
    if(routeRef.current) routeRef.current.remove();
    if(route&&route.length>1){
      routeRef.current=window.L.polyline(route.map(r=>[r.lat,r.lng]),{
        color:routeColor,weight:5,opacity:0.8,dashArray:"12 8",
      }).addTo(mapRef.current);
    }
  },[route,routeColor,ready]);

  // Update driver position
  useEffect(()=>{
    if(!mapRef.current||!window.L) return;
    if(!driverPos){
      if(driverRef.current){driverRef.current.remove();driverRef.current=null;}
      return;
    }
    const L=window.L;
    const icon=L.divIcon({
      html:`<div style="width:44px;height:44px;border-radius:50%;background:#10B981;border:4px solid #fff;box-shadow:0 4px 16px rgba(16,185,129,.4);display:flex;align-items:center;justify-content:center;font-size:20px">🛵</div>`,
      iconSize:[44,44],iconAnchor:[22,22],className:"",
    });
    if(driverRef.current){
      driverRef.current.setLatLng([driverPos.lat,driverPos.lng]);
    } else {
      driverRef.current=L.marker([driverPos.lat,driverPos.lng],{icon,zIndexOffset:1000}).addTo(mapRef.current);
    }
  },[driverPos?.lat,driverPos?.lng,ready]);

  return(
    <div className={`real-map ${className}`} style={{position:"relative",overflow:"hidden",...style}}>
      {!ready&&<div style={{width:"100%",height:"100%",background:"#F0EFEC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#908C82",gap:8}}>
        <div style={{width:20,height:20,border:"3px solid #E8E6E1",borderTopColor:"#6366F1",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
        Chargement de la carte...
      </div>}
      <div ref={ref} style={{width:"100%",height:"100%",display:ready?"block":"none"}}/>
      {children}
    </div>
  );
}

export default MapView;
