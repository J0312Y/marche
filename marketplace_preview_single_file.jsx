import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════
   LAMUKA MARKETPLACE — 35+ SCREENS UI KIT
   By Lamuka Tech · Brazzaville, Congo 🇨🇬
   ═══════════════════════════════════════════ */

/* ═══ DATA ═══ */
const CATS = [
  { id:"1",name:"Électronique",icon:"📱",count:124,type:"boutique" },
  { id:"2",name:"Mode",icon:"👗",count:89,type:"boutique" },
  { id:"3",name:"Restaurants",icon:"🍽️",count:56,type:"restaurant" },
  { id:"4",name:"Pâtisseries",icon:"🧁",count:28,type:"patisserie" },
  { id:"5",name:"Supermarchés",icon:"🛒",count:34,type:"supermarche" },
  { id:"6",name:"Pharmacie",icon:"💊",count:19,type:"pharmacie" },
  { id:"7",name:"Beauté",icon:"💄",count:45,type:"boutique" },
  { id:"8",name:"Alimentation",icon:"🍎",count:92,type:"supermarche" },
  { id:"9",name:"Services",icon:"🔧",count:23,type:"service" },
  { id:"10",name:"Maison",icon:"🏠",count:67,type:"boutique" },
];
const VENDORS=[
  {id:"v1",name:"Tech Congo",avatar:"🏪",desc:"Électronique et gadgets de qualité",loc:"Brazzaville",rating:4.8,products:45,followers:1200,verified:true,lat:-4.267,lng:15.283,type:"boutique"},
  {id:"v2",name:"Mode Afrique",avatar:"👔",desc:"Vêtements africains modernes",loc:"Pointe-Noire",rating:4.6,products:78,followers:890,verified:true,lat:-4.271,lng:15.289,type:"boutique"},
  {id:"v3",name:"Chez Mama Ngudi",avatar:"🍽️",desc:"Cuisine congolaise traditionnelle & braisé",loc:"Brazzaville",rating:4.9,products:22,followers:2100,verified:true,lat:-4.262,lng:15.278,type:"restaurant",eta:"30-45 min"},
  {id:"v4",name:"Pâtisserie La Congolaise",avatar:"🧁",desc:"Gâteaux, pains frais et viennoiseries",loc:"Brazzaville",rating:4.7,products:35,followers:760,verified:true,lat:-4.258,lng:15.295,type:"patisserie",eta:"20-30 min"},
  {id:"v5",name:"Super U Bacongo",avatar:"🛒",desc:"Supermarché — produits du quotidien",loc:"Brazzaville",rating:4.3,products:520,followers:3400,verified:true,lat:-4.274,lng:15.280,type:"supermarche"},
  {id:"v6",name:"Pharma Santé Plus",avatar:"💊",desc:"Pharmacie agréée — médicaments & cosmétiques",loc:"Brazzaville",rating:4.5,products:180,followers:1450,verified:true,lat:-4.265,lng:15.285,type:"pharmacie"},
  {id:"v7",name:"Le Braiseur du Congo",avatar:"🔥",desc:"Grillades, poisson braisé, poulet DG",loc:"Pointe-Noire",rating:4.8,products:15,followers:1800,verified:false,lat:-4.770,lng:11.866,type:"restaurant",eta:"25-40 min"},
  {id:"v8",name:"Pressing Express BZV",avatar:"🔧",desc:"Nettoyage à sec, repassage, retouches",loc:"Brazzaville",rating:4.2,products:12,followers:340,verified:false,lat:-4.260,lng:15.290,type:"service"},
];
const P=[
  {id:"p1",name:"Smartphone Galaxy A54",desc:"Samsung Galaxy A54 5G, 128GB, écran AMOLED 6.4\"",price:185000,old:220000,img:"📱",cat:"Électronique",vendor:"Tech Congo",va:"🏪",rating:4.7,reviews:89,tags:["Promo","Populaire"],imgs:["📱","📱","📱"],type:"boutique"},
  {id:"p2",name:"Robe Wax Moderne",desc:"Robe en wax africain, coupe moderne, tailles S-XL",price:25000,img:"👗",cat:"Mode",vendor:"Mode Afrique",va:"👔",rating:4.5,reviews:45,tags:["Nouveau"],imgs:["👗","👗"],type:"boutique"},
  {id:"p3",name:"Poulet DG",desc:"Poulet directeur général — plantains, légumes sautés",price:5500,img:"🍗",cat:"Restaurants",vendor:"Chez Mama Ngudi",va:"🍽️",rating:4.9,reviews:120,tags:["⭐ Best-seller"],imgs:["🍗"],type:"restaurant",eta:"35 min"},
  {id:"p4",name:"Écouteurs Bluetooth Pro",desc:"Écouteurs sans fil avec réduction de bruit active",price:35000,old:45000,img:"🎧",cat:"Électronique",vendor:"Tech Congo",va:"🏪",rating:4.3,reviews:67,tags:["Promo"],imgs:["🎧","🎧"],type:"boutique"},
  {id:"p5",name:"Gâteau Forêt Noire",desc:"Gâteau au chocolat, cerises et crème chantilly — 8 parts",price:12000,img:"🎂",cat:"Pâtisseries",vendor:"Pâtisserie La Congolaise",va:"🧁",rating:4.8,reviews:73,tags:["Populaire"],imgs:["🎂"],type:"patisserie"},
  {id:"p6",name:"Poisson Braisé Complet",desc:"Poisson braisé, banane, manioc, piment, salade",price:4000,img:"🐟",cat:"Restaurants",vendor:"Le Braiseur du Congo",va:"🔥",rating:4.8,reviews:95,tags:["🔥 Braisé"],imgs:["🐟"],type:"restaurant",eta:"25 min"},
  {id:"p7",name:"Doliprane 1000mg x16",desc:"Paracétamol — douleurs et fièvre",price:2500,img:"💊",cat:"Pharmacie",vendor:"Pharma Santé Plus",va:"💊",rating:4.5,reviews:42,tags:[],imgs:["💊"],type:"pharmacie"},
  {id:"p8",name:"Sac à Main Cuir",desc:"Sac en cuir véritable, fabrication artisanale congolaise",price:42000,img:"👜",cat:"Mode",vendor:"Mode Afrique",va:"👔",rating:4.7,reviews:51,tags:["Artisanal"],imgs:["👜","👜"],type:"boutique"},
  {id:"p9",name:"Pack Ménage Complet",desc:"Eau de Javel, lessive, savon, éponges — tout pour la maison",price:8500,img:"🧹",cat:"Supermarchés",vendor:"Super U Bacongo",va:"🛒",rating:4.2,reviews:38,tags:["Promo"],imgs:["🧹"],type:"supermarche"},
  {id:"p10",name:"Croissants x6",desc:"Croissants pur beurre, cuits le matin",price:3000,img:"🥐",cat:"Pâtisseries",vendor:"Pâtisserie La Congolaise",va:"🧁",rating:4.6,reviews:88,tags:["Frais du jour"],imgs:["🥐"],type:"patisserie"},
  {id:"p11",name:"Pressing Costume",desc:"Nettoyage + repassage costume complet",price:5000,img:"👔",cat:"Services",vendor:"Pressing Express BZV",va:"🔧",rating:4.2,reviews:19,tags:[],imgs:["👔"],type:"service",eta:"24h"},
  {id:"p12",name:"Riz Parfumé 25kg",desc:"Riz long grain premium — sac de 25kg",price:18000,old:21000,img:"🍚",cat:"Supermarchés",vendor:"Super U Bacongo",va:"🛒",rating:4.4,reviews:156,tags:["Promo"],imgs:["🍚"],type:"supermarche"},
];
const COUPONS=[
  {id:"c1",code:"LAMUKA20",discount:20,desc:"20% sur tout le site",expires:"28 Fév 2026",min:15000},
  {id:"c2",code:"TECH10",discount:10,desc:"10% sur l'Électronique",expires:"14 Mars 2026",min:50000},
  {id:"c3",code:"NOUVEAU",discount:15,desc:"15% première commande",expires:"31 Mars 2026",min:0},
  {id:"c4",code:"FREESHIP",discount:0,desc:"Livraison gratuite",expires:"20 Fév 2026",min:25000,free:true},
];
const NOTIFS=[
  {id:"n1",icon:"📦",title:"Commande en route",desc:"Votre commande #LMK-0214 est en livraison",time:"Il y a 12 min",read:false},
  {id:"n2",icon:"🎉",title:"Offre spéciale",desc:"Soldes de février : -40% sur l'électronique",time:"Il y a 2h",read:false},
  {id:"n3",icon:"✅",title:"Commande livrée",desc:"#LMK-0210 a été livrée avec succès",time:"Il y a 4 jours",read:true},
  {id:"n4",icon:"💬",title:"Nouveau message",desc:"Mode Afrique vous a répondu",time:"Il y a 5 jours",read:true},
  {id:"n5",icon:"⭐",title:"Laissez un avis",desc:"Comment était votre Chemise Bogolan ?",time:"Il y a 1 sem",read:true},
];
const REVIEWS=[
  {name:"Marie K.",rating:5,text:"Excellent produit, livraison rapide ! Je recommande.",date:"12 Fév 2026",avatar:"👩"},
  {name:"Patrick M.",rating:4,text:"Bon rapport qualité-prix. L'emballage pourrait être meilleur.",date:"8 Fév 2026",avatar:"👨"},
  {name:"Celine N.",rating:5,text:"Deuxième achat, toujours satisfaite. Commerce très réactif.",date:"3 Fév 2026",avatar:"👩‍🦱"},
  {name:"David T.",rating:3,text:"Produit conforme mais livraison un peu lente (4 jours).",date:"28 Jan 2026",avatar:"🧑"},
];
const ADDRS=[
  {id:"a1",label:"Maison",addr:"Quartier Bacongo, Rue 14, N°42",city:"Brazzaville",def:true},
  {id:"a2",label:"Bureau",addr:"Avenue Amilcar Cabral, Imm. ONPT",city:"Brazzaville",def:false},
];
const CHATS=[
  {id:"ch1",name:"Tech Congo",avatar:"🏪",lastMsg:"Votre commande est prête !",time:"14:35",unread:2},
  {id:"ch2",name:"Chez Mama Ngudi",avatar:"🍽️",lastMsg:"Votre poulet DG est prêt !",time:"14:22",unread:1},
  {id:"ch3",name:"Patrick (Livreur)",avatar:"🧑",lastMsg:"Je suis en route !",time:"14:22",unread:1},
  {id:"ch4",name:"Pharma Santé Plus",avatar:"💊",lastMsg:"Votre ordonnance est prête",time:"Hier",unread:0},
];

const fmt=n=>n.toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")+" FCFA";
const disc=p=>p.old?Math.round((1-p.price/p.old)*100):0;

/* ═══ VENDOR DATA ═══ */
const V_ORDERS=[
  {id:"vo1",ref:"#CMD-0891",client:"Marie Koumba",phone:"+242 06X XXX",addr:"Bacongo, Rue 14",items:[{name:"Robe Wax Moderne",qty:2,price:25000,img:"👗"},{name:"Sac à Main Cuir",qty:1,price:42000,img:"👜"}],total:92000,status:"new",date:"14 Fév 14:42",payment:"Airtel Money"},
  {id:"vo2",ref:"#CMD-0890",client:"Patrick Mbemba",phone:"+242 06X XXX",addr:"Poto-Poto, Av. de la Paix",items:[{name:"Chemise Bogolan",qty:1,price:18000,img:"👔"}],total:18000,status:"preparing",date:"14 Fév 11:20",payment:"MTN MoMo"},
  {id:"vo3",ref:"#CMD-0889",client:"Celine Nzaba",phone:"+242 06X XXX",addr:"Moungali, Rue 8",items:[{name:"Robe Wax Moderne",qty:1,price:25000,img:"👗"}],total:25000,status:"shipped",date:"13 Fév 16:05",payment:"MTN MoMo"},
  {id:"vo4",ref:"#CMD-0885",client:"David Tsaty",phone:"+242 06X XXX",addr:"Talangaï",items:[{name:"Sac à Main Cuir",qty:1,price:42000,img:"👜"},{name:"Chemise Bogolan",qty:2,price:18000,img:"👔"}],total:78000,status:"delivered",date:"12 Fév 09:30",payment:"Airtel Money"},
  {id:"vo5",ref:"#CMD-0880",client:"Grace Mouanda",phone:"+242 06X XXX",addr:"Bacongo",items:[{name:"Robe Wax Moderne",qty:3,price:25000,img:"👗"}],total:75000,status:"delivered",date:"10 Fév 15:12",payment:"MTN MoMo"},
];
const V_PRODUCTS=[
  {id:"vp1",name:"Robe Wax Moderne",price:25000,stock:23,sold:45,img:"👗",active:true,cat:"Mode"},
  {id:"vp2",name:"Chemise Bogolan",price:18000,stock:8,sold:33,img:"👔",active:true,cat:"Mode"},
  {id:"vp3",name:"Sac à Main Cuir",price:42000,stock:3,sold:51,img:"👜",active:true,cat:"Mode"},
  {id:"vp4",name:"Bracelet Perles",price:8500,stock:0,sold:12,img:"📿",active:false,cat:"Beauté"},
  {id:"vp5",name:"Sandales Cuir",price:15000,stock:15,sold:28,img:"👡",active:true,cat:"Mode"},
  {id:"vp6",name:"Écharpe Kente",price:12000,stock:20,sold:19,img:"🧣",active:true,cat:"Mode"},
];
const V_WALLET=[
  {id:"w1",type:"+",label:"Commande #CMD-0891",amount:92000,date:"14 Fév",status:"En attente"},
  {id:"w2",type:"+",label:"Commande #CMD-0890",amount:18000,date:"14 Fév",status:"Confirmé"},
  {id:"w3",type:"-",label:"Retrait Airtel Money",amount:150000,date:"13 Fév",status:"Effectué"},
  {id:"w4",type:"+",label:"Commande #CMD-0889",amount:25000,date:"13 Fév",status:"Confirmé"},
  {id:"w5",type:"+",label:"Commande #CMD-0885",amount:78000,date:"12 Fév",status:"Confirmé"},
  {id:"w6",type:"-",label:"Commission Lamuka (4%)",amount:5200,date:"12 Fév",status:"Déduit"},
];
const V_REVIEWS=[
  {client:"Marie K.",rating:5,text:"Robe magnifique ! Qualité au top.",date:"14 Fév",product:"Robe Wax Moderne",replied:false},
  {client:"Patrick M.",rating:4,text:"Bien mais taille un peu grande.",date:"12 Fév",product:"Chemise Bogolan",replied:true,reply:"Merci ! Consultez notre guide des tailles."},
  {client:"Celine N.",rating:5,text:"Sac superbe, cuir de qualité.",date:"10 Fév",product:"Sac à Main Cuir",replied:false},
  {client:"David T.",rating:3,text:"Livraison un peu lente.",date:"8 Fév",product:"Chemise Bogolan",replied:true,reply:"Désolé, nous améliorons nos délais !"},
];
const V_PROMOS=[
  {id:"pr1",name:"Soldes Février",discount:20,type:"%",products:"Tous les articles",start:"1 Fév",end:"28 Fév",active:true,used:34},
  {id:"pr2",name:"Nouveau Client",discount:15,type:"%",code:"WELCOME15",products:"Premier achat",start:"1 Jan",end:"31 Mars",active:true,used:12},
];
const V_STATS={today:{revenue:110000,orders:3,visitors:89},week:{revenue:583000,orders:14,visitors:412},month:{revenue:2150000,orders:52,visitors:1650},chartWeek:[85,120,95,160,140,110,180],topProducts:[{name:"Robe Wax",sold:45,revenue:1125000},{name:"Sac Cuir",sold:51,revenue:2142000},{name:"Chemise Bogolan",sold:33,revenue:594000}]};
const V_NOTIFS=[
  {icon:"🆕",title:"Nouvelle commande !",desc:"Marie Koumba — 92 000 FCFA",time:"Il y a 18 min",read:false},
  {icon:"💰",title:"Paiement reçu",desc:"#CMD-0890 confirmé par MTN MoMo",time:"Il y a 3h",read:false},
  {icon:"⭐",title:"Nouvel avis",desc:"Marie K. a laissé 5 étoiles",time:"Il y a 5h",read:true},
  {icon:"⚠️",title:"Stock faible",desc:"Sac à Main Cuir — 3 restants",time:"Hier",read:true},
  {icon:"📊",title:"Rapport hebdomadaire",desc:"Vos ventes ont augmenté de 23%",time:"Il y a 2 jours",read:true},
];

/* ═══ DRIVER DATA ═══ */
const D_DELIVERIES=[
  {id:"dl1",ref:"#CMD-0891",vendor:{name:"Mode Afrique",avatar:"👔",phone:"+242 06X XXX"},client:{name:"Marie Koumba",phone:"+242 06X XXX",addr:"Quartier Bacongo, Rue 14, N°42",lat:-4.277,lng:15.283},items:[{name:"Robe Wax Moderne",qty:2,img:"👗"},{name:"Sac à Main Cuir",qty:1,img:"👜"}],total:92000,pickup:"Marché Total, Stand 42",status:"active",distance:"3.2 km",eta:"12 min",fee:2500,tip:500},
  {id:"dl2",ref:"#CMD-0890",vendor:{name:"Tech Congo",avatar:"🏪",phone:"+242 06X XXX"},client:{name:"Patrick Mbemba",phone:"+242 06X XXX",addr:"Poto-Poto, Avenue de la Paix, N°8",lat:-4.269,lng:15.289},items:[{name:"Chemise Bogolan",qty:1,img:"👔"}],total:18000,pickup:"Marché Total, Stand 15",status:"pending",distance:"4.8 km",eta:"20 min",fee:2500,tip:0},
];
const D_HISTORY=[
  {id:"dh1",ref:"#CMD-0885",client:"David Tsaty",vendor:"Mode Afrique",date:"12 Fév",duration:"32 min",distance:"2.8 km",fee:2500,tip:300,rating:5},
  {id:"dh2",ref:"#CMD-0880",client:"Grace Mouanda",vendor:"Tech Congo",date:"10 Fév",duration:"28 min",distance:"3.5 km",fee:2500,tip:500,rating:5},
  {id:"dh3",ref:"#CMD-0878",client:"Paul Nkaya",vendor:"Bio Market",date:"8 Fév",duration:"45 min",distance:"6.1 km",fee:3500,tip:0,rating:4},
  {id:"dh4",ref:"#CMD-0870",client:"Marie Koumba",vendor:"Mode Afrique",date:"5 Fév",duration:"22 min",distance:"1.9 km",fee:2500,tip:1000,rating:5},
  {id:"dh5",ref:"#CMD-0865",client:"Alain Mboumba",vendor:"Bio Market",date:"3 Fév",duration:"35 min",distance:"4.2 km",fee:2500,tip:200,rating:4},
];
const D_STATS={today:{deliveries:3,earned:9300,distance:9.5,hours:2.5},week:{deliveries:18,earned:52800,distance:62,hours:16},month:{deliveries:64,earned:198000,distance:215,hours:58}};
const D_NOTIFS=[
  {icon:"🆕",title:"Nouvelle livraison !",desc:"Mode Afrique → Marie Koumba · 92 000 FCFA",time:"Il y a 2 min",read:false},
  {icon:"💰",title:"Paiement reçu",desc:"+2 500 FCFA pour #CMD-0885",time:"Il y a 1h",read:false},
  {icon:"⭐",title:"Nouvel avis",desc:"David Tsaty vous a donné 5 étoiles",time:"Il y a 3h",read:true},
  {icon:"🎯",title:"Bonus atteint !",desc:"10 livraisons cette semaine = +5 000 FCFA bonus",time:"Hier",read:true},
  {icon:"📢",title:"Info Lamuka",desc:"Nouveaux tarifs Pointe-Noire à partir du 1er Mars",time:"Il y a 2 jours",read:true},
];

/* ═══ CSS ═══ */
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
.phone{width:393px;height:852px;background:#FAF9F6;border-radius:55px;overflow:hidden;position:relative;font-family:'Inter',sans-serif;color:#191815;display:flex;flex-direction:column;box-shadow:0 50px 100px rgba(0,0,0,.25),0 0 0 .5px rgba(255,255,255,.15) inset;border:6px solid #2c2c2e}
.scr{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}.scr::-webkit-scrollbar{display:none}
.bnav{display:flex;align-items:flex-end;justify-content:space-around;padding:6px 8px 22px;background:#fff;border-top:1px solid #E8E6E1;flex-shrink:0;position:relative}
.bni{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 14px;border-radius:14px;border:none;background:transparent;cursor:pointer;font-family:inherit;transition:all .2s;font-size:10px;color:#908C82;font-weight:500}
.bni.on{background:rgba(99,102,241,0.1);color:#6366F1}.bni .bico{font-size:20px;line-height:1}
.appbar{display:flex;align-items:center;padding:12px 20px;gap:12px;flex-shrink:0}
.appbar button{width:38px;height:38px;border-radius:12px;border:1px solid #E8E6E1;background:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
.appbar h2{flex:1;font-size:17px;font-weight:600;text-align:center}
.btn-primary{width:100%;padding:14px;border-radius:14px;border:none;background:#6366F1;color:#fff;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity .15s}.btn-primary:hover{opacity:.85}
.btn-outline{width:100%;padding:14px;border-radius:14px;border:1px solid #E8E6E1;background:#fff;color:#191815;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit}
.field{margin-bottom:14px}.field label{display:block;font-size:12px;font-weight:600;color:#5E5B53;margin-bottom:5px}.field input,.field textarea,.field select{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #E8E6E1;background:#F5F4F1;font-family:inherit;font-size:14px;outline:none;color:#191815;resize:none}.field input:focus,.field textarea:focus{border-color:#6366F1}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.chip{display:inline-block;padding:6px 14px;border-radius:10px;font-size:12px;font-weight:600}

/* Splash & Auth */
.splash{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;background:linear-gradient(135deg,#6366F1,#8B5CF6,#A855F7);color:#fff;text-align:center}
.splash .logo{width:100px;height:100px;border-radius:30px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:48px;margin-bottom:20px;animation:splash-pop .6s ease}
@keyframes splash-pop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
.splash h1{font-size:28px;font-weight:700;letter-spacing:-1px;margin-bottom:4px;animation:splash-up .6s ease .2s both}
.splash p{font-size:13px;opacity:.7;animation:splash-up .6s ease .3s both}
@keyframes splash-up{0%{transform:translateY(16px);opacity:0}100%{transform:translateY(0);opacity:1}}
.splash .loader{margin-top:40px;width:36px;height:36px;border:3px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes marquee{0%{transform:translateX(0%)}100%{transform:translateX(-50%)}}
.marquee-wrap{overflow:hidden;padding:0 0 12px;position:relative}
.marquee-track{display:inline-flex;gap:8px;white-space:nowrap;animation:marquee 14s linear infinite}
.marquee-track:hover,.marquee-track-resto:hover{animation-play-state:paused}
.marquee-track-resto{display:inline-flex;gap:10px;white-space:nowrap;animation:marquee 18s linear infinite}

.onb{display:flex;flex-direction:column;height:100%;padding:40px 24px 30px;text-align:center}
.onb-img{flex:1;display:flex;align-items:center;justify-content:center;font-size:90px}
.onb h2{font-size:24px;font-weight:700;letter-spacing:-.5px;margin-bottom:8px}
.onb p{font-size:14px;color:#5E5B53;line-height:1.6;margin-bottom:24px}
.onb-dots{display:flex;justify-content:center;gap:8px;margin-bottom:24px}
.onb-dot{width:8px;height:8px;border-radius:50%;background:#E8E6E1;transition:all .3s}.onb-dot.on{width:24px;border-radius:4px;background:#6366F1}

.auth{display:flex;flex-direction:column;height:100%;padding:40px 24px 30px}
.auth h2{font-size:26px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px}
.auth .sub{font-size:14px;color:#908C82;margin-bottom:28px}
.phone-input{display:flex;gap:10px;margin-bottom:20px}
.phone-input .prefix{width:80px;padding:14px;border-radius:14px;border:1px solid #E8E6E1;background:#F5F4F1;font-size:15px;font-weight:600;text-align:center;display:flex;align-items:center;justify-content:center;gap:4px}
.phone-input input{flex:1;padding:14px;border-radius:14px;border:1px solid #E8E6E1;background:#F5F4F1;font-size:15px;outline:none;font-family:inherit}
.phone-input input:focus{border-color:#6366F1}
.divider{display:flex;align-items:center;gap:12px;margin:24px 0;font-size:12px;color:#908C82}.divider::before,.divider::after{content:'';flex:1;height:1px;background:#E8E6E1}
.social-btns{display:flex;gap:10px}
.social-btn{flex:1;padding:14px;border-radius:14px;border:1px solid #E8E6E1;background:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;transition:all .15s}
.social-btn:hover{background:#F5F4F1}
.social-btn span{font-size:13px;font-weight:600;color:#191815}

.otp-inputs{display:flex;gap:12px;justify-content:center;margin:30px 0}
.otp-box{width:56px;height:64px;border-radius:16px;border:2px solid #E8E6E1;background:#F5F4F1;font-size:24px;font-weight:700;text-align:center;outline:none;font-family:inherit;color:#191815}
.otp-box:focus{border-color:#6366F1;background:#fff}
.otp-timer{text-align:center;font-size:13px;color:#908C82;margin-bottom:24px}
.otp-timer b{color:#6366F1}

/* Home */
.hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 0}
.hdr-t{font-size:12px;color:#908C82}.hdr-h{font-size:22px;font-weight:700;letter-spacing:-.5px}
.hdr-r{display:flex;gap:8px}
.hdr-btn{width:42px;height:42px;border-radius:14px;border:1px solid #E8E6E1;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:18px;position:relative}
.hdr-btn .notif-badge{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:#EF4444}
.sbar{margin:12px 20px 14px;padding:10px 14px;background:#F5F4F1;border-radius:12px;border:1px solid #E8E6E1;display:flex;align-items:center;gap:10px;color:#908C82;font-size:13px;cursor:pointer}
.sbar input{flex:1;border:none;background:transparent;outline:none;font-family:inherit;font-size:13px;color:#191815}.sbar input::placeholder{color:#908C82}
.banner{margin:20px;padding:24px;border-radius:24px;background:linear-gradient(135deg,#6366F1,#8B5CF6,#A855F7);color:#fff;display:flex;align-items:center}
.banner-l{flex:1}.banner-l h3{font-size:18px;font-weight:700;margin-bottom:4px}.banner-l p{font-size:12px;opacity:.7;margin-bottom:14px}
.banner-btn{display:inline-block;padding:10px 20px;background:#fff;border-radius:12px;font-size:12px;font-weight:700;color:#6366F1;cursor:pointer}
.sec{display:flex;align-items:center;justify-content:space-between;padding:0 20px;margin-top:24px;margin-bottom:14px}
.sec h3{font-size:18px;font-weight:700;letter-spacing:-.3px}.sec span{font-size:13px;color:#6366F1;font-weight:600;cursor:pointer}

/* Categories */
.cats{display:flex;gap:8px;padding:0 20px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;flex-wrap:nowrap}.cats::-webkit-scrollbar{display:none}
.cat{min-width:0;flex:0 0 auto;width:72px;padding:10px 4px 8px;border-radius:16px;border:1px solid #E8E6E1;background:#fff;text-align:center;cursor:pointer;transition:all .15s;box-sizing:border-box}
.cat{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 18px;border-radius:16px;border:1px solid #E8E6E1;background:#fff;cursor:pointer;flex-shrink:0;transition:all .2s;min-width:76px}
.cat.on{background:#6366F1;border-color:#6366F1;color:#fff}.cat .ci{font-size:22px}.cat .cn{font-size:10px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:64px;display:block}
.cat-full{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 16px}
.cat-card{padding:14px;border-radius:16px;border:1px solid #E8E6E1;background:#fff;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all .15s;overflow:hidden;min-width:0;box-sizing:border-box}
.cat-card:hover{border-color:#6366F1}.cat-card .cci{font-size:28px;flex-shrink:0}.cat-card h4{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cat-card p{font-size:10px;color:#908C82;white-space:nowrap}

/* Vendor cards */
.vlist{padding:0 20px;display:flex;flex-direction:column;gap:10px}
.vcard{display:flex;align-items:center;padding:16px;background:#fff;border-radius:18px;border:1px solid #E8E6E1;gap:14px;cursor:pointer;transition:all .2s}.vcard:hover{border-color:#bbb}
.vav{width:50px;height:50px;background:#FAF9F6;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0}
.vi{flex:1;min-width:0}.vi h4{font-size:15px;font-weight:600;display:flex;align-items:center;gap:5px}.vi h4 .vf{font-size:13px;color:#6366F1}
.vi .vloc{font-size:11px;color:#908C82;margin:2px 0 5px}.vi .vst{font-size:11px;color:#908C82;display:flex;gap:10px}.vi .vst b{color:#191815}

/* Product grid & cards */
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:0 20px 100px}
.pcard{background:#fff;border:1px solid #E8E6E1;border-radius:18px;overflow:hidden;cursor:pointer;transition:all .2s}.pcard:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.06)}
.pimg{height:140px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;position:relative}.pimg .pe{font-size:52px}
.pimg .badge{position:absolute;top:8px;left:8px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700;color:#fff;background:#EF4444}
.pimg .tag{position:absolute;top:8px;right:8px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:600;color:#6366F1;background:rgba(99,102,241,0.1);cursor:pointer;transition:all .15s;z-index:2}.pimg .tag:active{transform:scale(.95)}
.pimg .fav{position:absolute;bottom:8px;right:8px;width:32px;height:32px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.08);font-size:14px;cursor:pointer}
.pbody{padding:12px}.pbody h4{font-size:13px;font-weight:600;line-height:1.3;margin-bottom:3px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.pbody .pv{font-size:11px;color:#908C82;display:flex;align-items:center;gap:4px;margin-bottom:8px}
.pbody .pp{font-size:16px;font-weight:700;color:#6366F1;display:flex;align-items:center;gap:6px}
.pbody .pp .po{font-size:11px;color:#908C82;text-decoration:line-through;font-weight:400}
.pbody .pr{font-size:11px;color:#F59E0B;margin-top:4px;cursor:pointer;display:inline-flex;align-items:center;gap:2px;padding:2px 6px;border-radius:6px;margin-left:-6px;transition:all .15s}.pbody .pr:active{background:rgba(245,158,11,.1)}

/* Detail */
.det-img{height:280px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;position:relative}.det-img .pe{font-size:96px}
.det-top{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between}
.det-top button{width:40px;height:40px;border-radius:50%;background:#fff;border:none;cursor:pointer;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center}
.det-body{padding:20px}
.det-vendor{display:flex;align-items:center;gap:6px;font-size:13px;color:#6366F1;font-weight:600;margin-bottom:10px}
.det-body h2{font-size:22px;font-weight:700;letter-spacing:-.5px;margin-bottom:8px}
.det-stars{display:flex;align-items:center;gap:6px;margin-bottom:14px;font-size:13px;color:#F59E0B}.det-stars .rc{color:#908C82}
.det-price{display:flex;align-items:end;gap:10px;margin-bottom:18px}.det-price .dp{font-size:24px;font-weight:700;color:#6366F1}.det-price .dpo{font-size:14px;color:#908C82;text-decoration:line-through}
.det-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}.det-tags span{padding:6px 14px;border-radius:10px;background:rgba(99,102,241,0.08);color:#6366F1;font-size:12px;font-weight:600}
.det-info{padding:14px;border-radius:14px;border:1px solid #E8E6E1;background:#F5F4F1;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer}
.det-info .dii{font-size:18px}.det-info .dit{flex:1}.det-info .dit h4{font-size:13px;font-weight:600}.det-info .dit p{font-size:11px;color:#908C82}
.det-info .div{font-size:13px;font-weight:700;color:#10B981}
.det-bar{display:flex;align-items:center;gap:12px;padding:14px 20px;border-top:1px solid #E8E6E1;background:#fff;flex-shrink:0}
.qty{display:flex;align-items:center;border:1px solid #E8E6E1;border-radius:12px;overflow:hidden}
.qty button{width:40px;height:40px;border:none;background:transparent;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5E5B53}
.qty span{width:36px;text-align:center;font-weight:700;font-size:15px}
.add-btn{flex:1;padding:14px;border-radius:14px;border:none;background:#6366F1;color:#fff;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit}

/* Gallery */
.gallery{position:absolute;inset:0;background:#000;z-index:20;display:flex;flex-direction:column}
.gallery-img{flex:1;display:flex;align-items:center;justify-content:center;font-size:140px}
.gallery-dots{display:flex;justify-content:center;gap:6px;padding:16px}.gallery-dots span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3)}.gallery-dots span.on{background:#fff}
.gallery-close{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.gallery-nav{position:absolute;top:50%;transform:translateY(-50%);width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.gallery-nav.l{left:12px}.gallery-nav.r{right:12px}
.gallery-count{position:absolute;top:16px;left:16px;padding:6px 14px;border-radius:10px;background:rgba(0,0,0,.5);color:#fff;font-size:12px;font-weight:600}

/* Cart */
.cart-item{display:flex;gap:14px;padding:14px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px}
.cart-img{width:68px;height:68px;background:#F5F4F1;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:32px;flex-shrink:0}
.cart-info{flex:1;min-width:0}.cart-info h4{font-size:14px;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cart-info .cv{font-size:11px;color:#908C82;margin-bottom:8px}
.cart-bot{display:flex;justify-content:space-between;align-items:center}.cart-bot .cp{font-size:14px;font-weight:700;color:#6366F1}
.cart-summary{padding:18px 20px;background:#fff;border-top:1px solid #E8E6E1;flex-shrink:0}
.cs-row{display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;color:#908C82}
.cs-row.tot{color:#191815;font-size:16px;font-weight:700;margin-top:10px;padding-top:10px;border-top:1px solid #E8E6E1}.cs-row.tot .ctp{color:#6366F1}

/* Checkout */
.steps{display:flex;align-items:center;justify-content:center;gap:0;padding:16px 20px}
.sdot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid #E8E6E1;color:#908C82;background:#FAF9F6}
.sdot.on{background:#6366F1;border-color:#6366F1;color:#fff}
.sline{width:28px;height:2px;background:#E8E6E1}.sline.on{background:#6366F1}
.step-col{display:flex;flex-direction:column;align-items:center}.slbl{font-size:9px;color:#908C82;text-align:center;margin-top:4px}.slbl.on{color:#6366F1}
.momo{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:14px;border:2px solid #E8E6E1;margin-bottom:8px;cursor:pointer;transition:all .15s;background:#fff}
.momo.on{border-color:#6366F1;background:rgba(99,102,241,0.04)}.momo .me{font-size:22px}.momo .mn{font-size:14px;font-weight:600;flex:1}.momo .mc{font-size:18px;color:#6366F1}
.confirm-card{padding:14px;border-radius:14px;border:1px solid #E8E6E1;background:#F5F4F1;display:flex;align-items:center;gap:12px;margin-bottom:10px}
.confirm-card .cci{font-size:20px;color:#6366F1}.confirm-card .ccb{flex:1}.confirm-card .ccb small{font-size:11px;color:#908C82}.confirm-card .ccb p{font-size:14px;font-weight:600;margin:0}.confirm-card .cce{font-size:11px;color:#6366F1;font-weight:600;cursor:pointer}
.success-modal{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:end;z-index:10}
.success-box{width:100%;background:#fff;border-radius:28px 28px 0 0;padding:32px;text-align:center}
.success-box .si{width:72px;height:72px;border-radius:50%;background:rgba(16,185,129,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;font-size:40px}
.success-box h2{font-size:22px;font-weight:700;margin-bottom:6px}.success-box p{font-size:14px;color:#5E5B53;margin-bottom:4px}.success-box .ref{font-size:13px;color:#6366F1;font-weight:600;margin-bottom:20px}

/* Orders */
.ocard{padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:18px;margin-bottom:12px;cursor:pointer;transition:all .15s}.ocard:hover{border-color:#bbb}
.ocard-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.ocard-h h4{font-size:14px;font-weight:700}
.ost{padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600}.ost.ship{background:rgba(245,158,11,0.1);color:#F59E0B}.ost.done{background:rgba(16,185,129,0.1);color:#10B981}
.odate{font-size:11px;color:#908C82;margin-bottom:10px}

/* Tracking */
.track-map{position:relative;height:240px;background:linear-gradient(135deg,#e8f4e8,#d4ebd4);overflow:hidden;border-bottom:1px solid #E8E6E1}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px);background-size:32px 32px}
.map-road{position:absolute;top:45%;left:0;right:0;height:8px;background:rgba(255,255,255,.7);border-radius:4px}
.map-route{position:absolute;top:calc(45% + 2px);left:15%;width:30%;height:4px;background:repeating-linear-gradient(90deg,#6366F1 0,#6366F1 8px,transparent 8px,transparent 14px);border-radius:2px;animation:rpulse 2s infinite}
@keyframes rpulse{0%,100%{opacity:1}50%{opacity:.5}}
.map-pin{position:absolute;font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}
.map-driver{position:absolute;top:calc(45% - 20px);left:32%;font-size:22px;background:#fff;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(99,102,241,.3);border:3px solid #6366F1;animation:dmove 3s ease-in-out infinite alternate}
@keyframes dmove{0%{left:28%}100%{left:38%}}
.map-label{position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:#fff;padding:8px 16px;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,.1);font-size:12px;font-weight:600;display:flex;align-items:center;gap:6px;white-space:nowrap}
.track-driver{display:flex;align-items:center;gap:14px;padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:18px;margin-bottom:14px}
.td-av{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#6366F1,#A855F7);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.td-info{flex:1}.td-info h4{font-size:15px;font-weight:600}.td-info p{font-size:12px;color:#908C82}.td-info .td-r{font-size:12px;color:#F59E0B;margin-top:3px}
.track-actions{display:flex;gap:10px;margin-bottom:14px}
.track-actions button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:14px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.ta-call{background:#10B981;color:#fff}.ta-chat{background:#6366F1;color:#fff}
.eta-box{padding:14px;background:#fff;border:1px solid #E8E6E1;border-radius:14px;margin-bottom:14px}
.eta-box h4{font-size:14px;font-weight:600;margin-bottom:10px}
.eta-bar{height:6px;background:#E8E6E1;border-radius:3px;overflow:hidden;margin-bottom:8px}.eta-fill{height:100%;background:linear-gradient(90deg,#6366F1,#A855F7);border-radius:3px}
.eta-info{display:flex;justify-content:space-between;font-size:12px;color:#908C82}.eta-info b{color:#191815}
.track-detail{padding:12px;background:#fff;border:1px solid #E8E6E1;border-radius:14px;margin-bottom:8px;display:flex;align-items:center;gap:12px}
.track-detail .tdi{font-size:18px}.track-detail .tdt{flex:1}.track-detail .tdt h5{font-size:13px;font-weight:600;margin:0}.track-detail .tdt p{font-size:11px;color:#908C82;margin:2px 0 0}

/* Chat */
.chat-head{display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid #E8E6E1;flex-shrink:0;background:#fff}
.chat-head .ch-av{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#6366F1,#A855F7);display:flex;align-items:center;justify-content:center;font-size:20px}
.chat-head .ch-info{flex:1}.chat-head .ch-info h4{font-size:14px;font-weight:600}.chat-head .ch-info p{font-size:11px;color:#10B981}
.chat-head .ch-call{width:36px;height:36px;border-radius:10px;background:#10B981;border:none;color:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center}
.chat-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:10px}.chat-body::-webkit-scrollbar{display:none}
.msg{max-width:78%;padding:12px 16px;border-radius:18px;font-size:13px;line-height:1.5;animation:msgin .25s ease}
@keyframes msgin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg.bot{align-self:flex-start;background:#F5F4F1;border:1px solid #E8E6E1;border-bottom-left-radius:6px}
.msg.user{align-self:flex-end;background:#6366F1;color:#fff;border-bottom-right-radius:6px}
.msg-time{font-size:10px;color:#908C82;margin-top:4px}.msg.user .msg-time{color:rgba(255,255,255,.6)}
.chat-input{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid #E8E6E1;background:#fff;flex-shrink:0}
.chat-input input{flex:1;padding:12px 16px;border-radius:24px;border:1px solid #E8E6E1;background:#F5F4F1;font-size:13px;font-family:inherit;outline:none;color:#191815}.chat-input input:focus{border-color:#6366F1}
.chat-input button{width:42px;height:42px;border-radius:50%;background:#6366F1;border:none;color:#fff;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.chat-attach{width:42px;height:42px;border-radius:50%;background:#F5F4F1;border:1px solid #E8E6E1;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.chat-list-item{display:flex;align-items:center;gap:14px;padding:14px 20px;border-bottom:1px solid #F5F4F1;cursor:pointer;transition:background .15s}.chat-list-item:hover{background:#F5F4F1}
.chat-list-item .cl-av{width:48px;height:48px;border-radius:14px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0}
.chat-list-item .cl-info{flex:1;min-width:0}.chat-list-item .cl-info h4{font-size:14px;font-weight:600}.chat-list-item .cl-info p{font-size:12px;color:#908C82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.chat-list-item .cl-meta{text-align:right;flex-shrink:0}.chat-list-item .cl-meta span{font-size:11px;color:#908C82;display:block}
.cl-badge{display:inline-block;min-width:18px;height:18px;border-radius:50%;background:#6366F1;color:#fff;font-size:10px;font-weight:700;text-align:center;line-height:18px;margin-top:4px}

/* Vendor registration */
.vr-steps{display:flex;align-items:center;justify-content:center;gap:0;padding:16px 20px}
.vr-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:2px solid #E8E6E1;color:#908C82;background:#FAF9F6}
.vr-dot.on{background:#6366F1;border-color:#6366F1;color:#fff}.vr-dot.done{background:#10B981;border-color:#10B981;color:#fff}
.vr-line{width:16px;height:2px;background:#E8E6E1}.vr-line.on{background:#6366F1}
.vr-lbl{font-size:7px;color:#908C82;text-align:center;margin-top:3px;white-space:nowrap}.vr-lbl.on{color:#6366F1}
.vr-section h3{font-size:16px;font-weight:700;margin-bottom:4px}.vr-section p{font-size:12px;color:#908C82;margin-bottom:14px}
.vr-upload{padding:32px;border:2px dashed #E8E6E1;border-radius:18px;text-align:center;cursor:pointer;background:#FAFAF8;margin-bottom:14px}.vr-upload:hover{border-color:#6366F1}
.vr-upload .vu-icon{font-size:36px;margin-bottom:8px}.vr-upload p{font-size:13px;color:#908C82}.vr-upload b{font-size:14px;color:#6366F1}
.vr-cat-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:14px}
.vr-cat{padding:14px 8px;border-radius:14px;border:1px solid #E8E6E1;background:#fff;text-align:center;cursor:pointer;transition:all .15s}
.vr-cat.on{border-color:#6366F1;background:rgba(99,102,241,0.06)}.vr-cat .vci{font-size:24px;margin-bottom:4px}.vr-cat .vcn{font-size:11px;font-weight:600}
.vr-plan{padding:16px;border-radius:16px;border:2px solid #E8E6E1;margin-bottom:10px;cursor:pointer;background:#fff}.vr-plan.on{border-color:#6366F1;background:rgba(99,102,241,0.03)}
.vr-plan h4{font-size:15px;font-weight:700;display:flex;justify-content:space-between}.vr-plan h4 span{font-size:13px;color:#6366F1}
.vr-plan p{font-size:12px;color:#908C82;margin-top:4px;line-height:1.5}
.vr-plan .vrf{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.vr-plan .vrf span{padding:4px 10px;background:#F5F4F1;border-radius:8px;font-size:10px;font-weight:600;color:#5E5B53}
.vr-doc{display:flex;align-items:center;gap:12px;padding:14px;border-radius:14px;border:1px solid #E8E6E1;margin-bottom:8px;cursor:pointer;background:#fff}.vr-doc:hover{border-color:#6366F1}
.vr-doc .vdi{font-size:22px}.vr-doc .vdt{flex:1}.vr-doc .vdt h5{font-size:13px;font-weight:600;margin:0}.vr-doc .vdt p{font-size:11px;color:#908C82;margin:2px 0 0}
.vr-doc .vds{font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px}.vds.up{color:#10B981;background:rgba(16,185,129,0.1)}.vds.pend{color:#F59E0B;background:rgba(245,158,11,0.1)}
.vr-summary .vs-row{display:flex;justify-content:space-between;padding:8px 0;font-size:13px;border-bottom:1px solid #F5F4F1}.vr-summary .vs-row:last-child{border:none}.vr-summary .vs-row span:first-child{color:#908C82}

/* Nearby vendors map */
.nv-map{position:relative;height:320px;background:linear-gradient(135deg,#e0e7ff,#c7d2fe);overflow:hidden}
.nv-pin{position:absolute;cursor:pointer;transition:transform .2s;font-size:28px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.2))}.nv-pin:hover{transform:scale(1.2)}
.nv-me{position:absolute;width:16px;height:16px;border-radius:50%;background:#6366F1;border:3px solid #fff;box-shadow:0 2px 8px rgba(99,102,241,.4)}
.nv-popup{position:absolute;bottom:16px;left:16px;right:16px;background:#fff;border-radius:18px;padding:14px;box-shadow:0 4px 20px rgba(0,0,0,.12);display:flex;align-items:center;gap:12px}
.nv-popup .npav{width:44px;height:44px;border-radius:12px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:22px}
.nv-popup .npi{flex:1}.nv-popup .npi h4{font-size:14px;font-weight:600;display:flex;align-items:center;gap:4px}.nv-popup .npi p{font-size:11px;color:#908C82;margin-top:1px}
.nv-popup button{padding:8px 14px;border-radius:10px;border:none;background:#6366F1;color:#fff;font-size:12px;font-weight:600;cursor:pointer}

/* Compare */
.compare{display:grid;grid-template-columns:1fr 1fr;border:1px solid #E8E6E1;border-radius:18px;overflow:hidden;margin-bottom:14px;background:#fff}
.compare-col{padding:14px;text-align:center}.compare-col+.compare-col{border-left:1px solid #E8E6E1}
.compare-col .ci{font-size:48px;margin-bottom:8px}.compare-col h4{font-size:13px;font-weight:600;margin-bottom:4px}.compare-col .cp{font-size:14px;font-weight:700;color:#6366F1}
.compare-row{display:grid;grid-template-columns:1fr 1fr;border:1px solid #E8E6E1;border-radius:14px;overflow:hidden;margin-bottom:8px;background:#fff}
.compare-row .cr-label{grid-column:1/-1;padding:8px 14px;background:#F5F4F1;font-size:11px;font-weight:600;color:#908C82}
.compare-row .cr-val{padding:10px 14px;font-size:13px;text-align:center;font-weight:500}.compare-row .cr-val+.cr-val{border-left:1px solid #E8E6E1}

/* Flash sales */
.flash-banner{margin:0 20px 14px;padding:18px;border-radius:18px;background:linear-gradient(135deg,#EF4444,#F97316);color:#fff;display:flex;align-items:center;justify-content:space-between}
.flash-banner h3{font-size:16px;font-weight:700}.flash-banner p{font-size:12px;opacity:.8;margin-top:2px}
.flash-timer{display:flex;gap:6px}
.flash-timer .ft{background:rgba(0,0,0,.2);padding:6px 8px;border-radius:8px;font-size:14px;font-weight:700;min-width:32px;text-align:center}

/* Coupons */
.coupon{display:flex;background:#fff;border:1px solid #E8E6E1;border-radius:16px;overflow:hidden;margin-bottom:10px}
.coupon-left{width:80px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#6366F1,#A855F7);color:#fff;font-size:20px;font-weight:700;position:relative}
.coupon-left::after{content:'';position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:16px;height:16px;border-radius:50%;background:#FAF9F6}
.coupon-right{flex:1;padding:14px}.coupon-right h4{font-size:14px;font-weight:600;margin-bottom:2px}.coupon-right p{font-size:12px;color:#908C82}
.coupon-right .cc{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:6px;background:#F5F4F1;font-size:12px;font-weight:700;color:#6366F1;letter-spacing:.5px;cursor:pointer}

/* Notifications */
.notif-item{display:flex;gap:12px;padding:14px 20px;border-bottom:1px solid #F5F4F1;transition:background .15s}.notif-item:hover{background:#F5F4F1}
.notif-item.unread{background:rgba(99,102,241,0.03)}.notif-item.unread::before{content:'';width:6px;height:6px;border-radius:50%;background:#6366F1;flex-shrink:0;margin-top:6px}
.ni-icon{width:40px;height:40px;border-radius:12px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.ni-body{flex:1;min-width:0}.ni-body h4{font-size:13px;font-weight:600;margin-bottom:2px}.ni-body p{font-size:12px;color:#908C82;line-height:1.4}.ni-body .ni-t{font-size:11px;color:#bbb;margin-top:4px}

/* Wishlist */
.wish-item{display:flex;gap:14px;padding:14px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px}
.wish-img{width:80px;height:80px;background:#F5F4F1;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:38px;flex-shrink:0}
.wish-info{flex:1;min-width:0}.wish-info h4{font-size:14px;font-weight:600;margin-bottom:2px}.wish-info .wv{font-size:11px;color:#908C82;margin-bottom:6px}
.wish-info .wp{font-size:15px;font-weight:700;color:#6366F1}.wish-info .wr{font-size:11px;color:#F59E0B;margin-top:4px}
.wish-actions{display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center}
.wish-actions button{width:34px;height:34px;border-radius:10px;border:1px solid #E8E6E1;background:#fff;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center}

/* Reviews */
.review-card{padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px}
.review-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.review-top .rav{width:38px;height:38px;border-radius:12px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:20px}
.review-top h4{font-size:14px;font-weight:600;flex:1}.review-top .rd{font-size:11px;color:#908C82}
.review-stars{font-size:13px;color:#F59E0B;margin-bottom:6px}.review-text{font-size:13px;color:#5E5B53;line-height:1.5}

/* Profile */
.prof-card{margin:0 20px 16px;padding:24px;background:#fff;border:1px solid #E8E6E1;border-radius:22px;text-align:center}
.prof-av{width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#6366F1,#A855F7);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:32px;font-weight:700;color:#fff}
.prof-stats{display:flex;justify-content:center;gap:0;margin-top:16px}
.prof-stats .ps{flex:1;text-align:center}.prof-stats .ps b{display:block;font-size:18px;color:#6366F1}.prof-stats .ps span{font-size:11px;color:#908C82}
.prof-stats .psd{width:1px;height:32px;background:#E8E6E1;align-self:center}
.wallet{margin:0 20px 16px;padding:18px;border-radius:18px;background:linear-gradient(135deg,#6366F1,#8B5CF6,#A855F7);color:#fff;display:flex;align-items:center;justify-content:space-between}
.wallet p{font-size:11px;opacity:.7}.wallet h3{font-size:20px;font-weight:700;margin-top:2px}.wallet button{padding:8px 16px;border-radius:10px;background:rgba(255,255,255,.2);border:none;color:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit}
.menu-item{display:flex;align-items:center;gap:12px;padding:13px 16px;margin:0 20px 6px;background:#fff;border:1px solid #E8E6E1;border-radius:14px;cursor:pointer;transition:all .15s}.menu-item:hover{border-color:#bbb}
.menu-item .mi-i{width:36px;height:36px;border-radius:10px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.menu-item .mi-t{flex:1;font-size:14px;font-weight:500}.menu-item .mi-s{font-size:11px;color:#908C82}.menu-item .mi-c{color:#908C82;font-size:14px}
.vendor-cta{margin:0 20px 16px;padding:18px;border-radius:18px;background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;cursor:pointer;display:flex;align-items:center;gap:14px}

/* Vendor profile */
.vp-head{padding:32px 20px 20px;background:linear-gradient(135deg,#6366F1,#8B5CF6,#A855F7);color:#fff;text-align:center;position:relative}
.vp-av{width:64px;height:64px;border-radius:18px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 10px}
.vp-stats{display:flex;gap:10px;padding:16px 20px}
.vps{flex:1;padding:14px;border-radius:14px;text-align:center}
.vps.r{background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12)}
.vps.p{background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.12)}
.vps.f{background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.12)}
.vps .vsi{font-size:16px;margin-bottom:4px}.vps b{font-size:18px;font-weight:700;display:block}.vps span{font-size:10px;color:#908C82}
.vp-btns{display:flex;gap:10px;padding:0 20px;margin-bottom:20px}
.vp-btns button{flex:1;padding:12px;border-radius:14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit}
.vp-btns .vb1{border:none;background:#6366F1;color:#fff}.vp-btns .vb2{border:1px solid #E8E6E1;background:#fff;color:#191815}

/* Addresses */
.addr-card{padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px;display:flex;gap:14px;cursor:pointer}
.addr-card.def{border-color:#6366F1;background:rgba(99,102,241,0.02)}
.addr-card .ai{width:40px;height:40px;border-radius:12px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.addr-card .ab{flex:1}.addr-card .ab h4{font-size:14px;font-weight:600;display:flex;align-items:center;gap:6px}
.addr-card .ab h4 .def-badge{font-size:10px;padding:2px 8px;border-radius:4px;background:rgba(99,102,241,0.1);color:#6366F1;font-weight:600}
.addr-card .ab p{font-size:12px;color:#908C82;margin-top:2px;line-height:1.4}

/* Settings */
.setting-group{margin:0 20px 16px}.setting-group h4,.setting-group .setting-label{font-size:11px;font-weight:600;color:#908C82;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;padding-left:4px}
.setting-item{display:flex;align-items:center;gap:12px;padding:13px 14px;background:#fff;border:1px solid #E8E6E1;border-radius:14px;margin-bottom:6px}
.setting-item .si-i{font-size:18px}.setting-item .si-t{flex:1;font-size:14px;font-weight:500}.setting-item .si-v{font-size:12px;color:#908C82}
.toggle{width:44px;height:24px;border-radius:12px;background:#E8E6E1;position:relative;cursor:pointer;transition:background .2s}
.toggle.on{background:#6366F1}
.toggle::after{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.15)}
.toggle.on::after{transform:translateX(20px)}

/* FAQ */
.faq-item{margin:0 20px 8px;background:#fff;border:1px solid #E8E6E1;border-radius:14px;overflow:hidden;cursor:pointer}
.faq-q{padding:14px 16px;font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.faq-q span{font-size:16px;color:#908C82;transition:transform .2s}.faq-q span.open{transform:rotate(45deg)}
.faq-a{padding:0 16px 14px;font-size:13px;color:#5E5B53;line-height:1.6}

/* Search filters */
.sfilters{display:flex;gap:6px;padding:0 20px;overflow-x:auto;margin-top:12px}.sfilters::-webkit-scrollbar{display:none}
.sf{padding:8px 16px;border-radius:100px;border:1px solid #E8E6E1;background:#fff;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;color:#5E5B53;transition:all .15s}
.sf.on{background:#6366F1;border-color:#6366F1;color:#fff}
.scount{padding:8px 20px;font-size:12px;color:#908C82;display:flex;justify-content:space-between;margin-top:10px}

/* Info box */
.info-box{padding:12px;border-radius:12px;display:flex;gap:10px;align-items:center;margin-bottom:14px}
.info-box.blue{background:rgba(59,130,246,0.06);border:1px solid rgba(59,130,246,0.12)}
.info-box.green{background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.12)}
.info-box.yellow{background:rgba(245,158,11,0.06);border:1px solid rgba(245,158,11,0.12)}
.info-box span:first-child{font-size:16px}.info-box span:last-child{font-size:12px;color:#5E5B53;line-height:1.5;flex:1}

/* ═══ VENDOR DASHBOARD ═══ */
.vd-switch{display:flex;margin:0 20px 14px;background:#F5F4F1;border-radius:14px;padding:4px;border:1px solid #E8E6E1}
.vd-switch button{flex:1;padding:10px;border-radius:11px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;background:transparent;color:#908C82;transition:all .2s}
.vd-switch button.on{background:#6366F1;color:#fff;box-shadow:0 2px 8px rgba(99,102,241,.3)}

.vd-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 20px;margin-bottom:16px}
.vd-stat{padding:16px;border-radius:16px;background:#fff;border:1px solid #E8E6E1}
.vd-stat .vs-icon{font-size:20px;margin-bottom:6px}
.vd-stat .vs-val{font-size:22px;font-weight:700;color:#191815;margin-bottom:2px}
.vd-stat .vs-lbl{font-size:11px;color:#908C82}
.vd-stat .vs-trend{font-size:11px;font-weight:600;margin-top:4px}
.vd-stat .vs-trend.up{color:#10B981}.vd-stat .vs-trend.down{color:#EF4444}

.vd-chart{margin:0 20px 16px;padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:18px}
.vd-chart h4{font-size:14px;font-weight:700;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center}
.vd-chart h4 span{font-size:12px;color:#6366F1;font-weight:600;cursor:pointer}
.chart-bars{display:flex;align-items:end;gap:6px;height:100px}
.chart-bar{flex:1;border-radius:6px 6px 0 0;background:linear-gradient(180deg,#6366F1,#A855F7);min-height:8px;transition:height .3s;position:relative;cursor:pointer}
.chart-bar:hover{opacity:.8}
.chart-bar .cb-tip{display:none;position:absolute;top:-24px;left:50%;transform:translateX(-50%);background:#191815;color:#fff;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:600;white-space:nowrap}
.chart-bar:hover .cb-tip{display:block}
.chart-labels{display:flex;gap:6px;margin-top:6px}.chart-labels span{flex:1;text-align:center;font-size:10px;color:#908C82}

.vd-top{margin:0 20px 16px;padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:16px}
.vd-top h4{font-size:14px;font-weight:700;margin-bottom:12px}
.vd-top-item{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F5F4F1}
.vd-top-item:last-child{border:none}
.vd-top-item .rank{width:22px;height:22px;border-radius:6px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#908C82;flex-shrink:0}
.vd-top-item .rank.g{background:rgba(245,158,11,0.1);color:#F59E0B}
.vd-top-item .ti-info{flex:1}.vd-top-item .ti-info h5{font-size:13px;font-weight:600;margin:0}.vd-top-item .ti-info p{font-size:11px;color:#908C82;margin:0}
.vd-top-item .ti-rev{font-size:12px;font-weight:700;color:#6366F1}

/* Vendor orders */
.vo-card{padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px;cursor:pointer;transition:all .15s}
.vo-card:hover{border-color:#bbb}
.vo-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.vo-head h4{font-size:14px;font-weight:700}
.vo-status{padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600}
.vo-status.new{background:rgba(59,130,246,0.1);color:#3B82F6}
.vo-status.preparing{background:rgba(245,158,11,0.1);color:#F59E0B}
.vo-status.shipped{background:rgba(139,92,246,0.1);color:#8B5CF6}
.vo-status.delivered{background:rgba(16,185,129,0.1);color:#10B981}
.vo-status.cancelled{background:rgba(239,68,68,0.1);color:#EF4444}
.vo-client{font-size:12px;color:#5E5B53;margin-bottom:4px}.vo-date{font-size:11px;color:#908C82;margin-bottom:10px}
.vo-items{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
.vo-item{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#F5F4F1;border-radius:8px;font-size:11px;font-weight:500}
.vo-foot{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid #F5F4F1}
.vo-foot .vo-total{font-size:16px;font-weight:700;color:#6366F1}
.vo-foot .vo-pay{font-size:11px;color:#908C82;display:flex;align-items:center;gap:4px}

.vo-actions{display:flex;gap:8px;margin-top:12px}
.vo-actions button{flex:1;padding:10px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;border:none}
.vo-accept{background:#10B981;color:#fff}.vo-prepare{background:#F59E0B;color:#fff}.vo-ship{background:#6366F1;color:#fff}
.vo-reject{background:transparent;border:1px solid rgba(239,68,68,0.3)!important;color:#EF4444}

/* Vendor products */
.vp-card{display:flex;gap:14px;padding:14px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px;transition:all .15s;cursor:pointer}
.vp-card:hover{border-color:#bbb}
.vp-img{width:64px;height:64px;background:#F5F4F1;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0}
.vp-info{flex:1;min-width:0}.vp-info h4{font-size:14px;font-weight:600;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.vp-info .vp-meta{display:flex;gap:10px;font-size:11px;color:#908C82;margin-bottom:4px}
.vp-info .vp-price{font-size:15px;font-weight:700;color:#6366F1}
.vp-info .vp-stock{font-size:11px;font-weight:600;margin-top:3px}
.vp-info .vp-stock.ok{color:#10B981}.vp-info .vp-stock.low{color:#F59E0B}.vp-info .vp-stock.out{color:#EF4444}
.vp-toggle{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px}

/* Product form */
.pf-photos{display:flex;gap:10px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px}
.pf-photo{width:80px;height:80px;border-radius:14px;background:#F5F4F1;border:1px solid #E8E6E1;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;position:relative;cursor:pointer}
.pf-photo.add{border:2px dashed #E8E6E1;font-size:24px;color:#908C82}
.pf-photo .pf-del{position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:#EF4444;color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.pf-variants{margin-bottom:14px}
.pf-variant{display:flex;gap:8px;margin-bottom:8px;align-items:center}
.pf-variant input{flex:1;padding:10px;border-radius:10px;border:1px solid #E8E6E1;background:#F5F4F1;font-size:13px;font-family:inherit;outline:none}

/* Wallet */
.vw-card{margin:0 20px 16px;padding:24px;border-radius:22px;background:linear-gradient(135deg,#6366F1,#8B5CF6,#A855F7);color:#fff;text-align:center;position:relative;overflow:hidden}
.vw-card::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.08)}
.vw-card::after{content:'';position:absolute;bottom:-30px;left:-30px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.05)}
.vw-card .vw-lbl{font-size:12px;opacity:.7}.vw-card .vw-bal{font-size:28px;font-weight:700;margin:6px 0}
.vw-card .vw-pend{font-size:12px;opacity:.6}
.vw-btns{display:flex;gap:10px;padding:0 20px;margin-bottom:16px}
.vw-btns button{flex:1;padding:12px;border-radius:14px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px}
.vw-withdraw{border:none;background:#10B981;color:#fff}.vw-history{border:1px solid #E8E6E1;background:#fff;color:#191815}
.vw-tx{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid #F5F4F1}
.vw-tx .tx-icon{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.vw-tx .tx-icon.plus{background:rgba(16,185,129,0.1);color:#10B981}.vw-tx .tx-icon.minus{background:rgba(239,68,68,0.1);color:#EF4444}
.vw-tx .tx-info{flex:1;min-width:0}.vw-tx .tx-info h5{font-size:13px;font-weight:600;margin:0}.vw-tx .tx-info p{font-size:11px;color:#908C82;margin:2px 0 0}
.vw-tx .tx-amt{text-align:right;font-size:14px;font-weight:700}.vw-tx .tx-amt.plus{color:#10B981}.vw-tx .tx-amt.minus{color:#EF4444}

/* Promo */
.promo-card{padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px}
.promo-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.promo-head h4{font-size:14px;font-weight:700;display:flex;align-items:center;gap:6px}
.promo-head h4 .active-dot{width:8px;height:8px;border-radius:50%;background:#10B981}
.promo-meta{display:flex;gap:10px;font-size:11px;color:#908C82;margin-bottom:8px;flex-wrap:wrap}
.promo-meta span{display:flex;align-items:center;gap:4px}
.promo-bar{height:6px;background:#E8E6E1;border-radius:3px;overflow:hidden;margin-bottom:4px}
.promo-bar .pbar-fill{height:100%;background:linear-gradient(90deg,#6366F1,#A855F7);border-radius:3px}
.promo-usage{font-size:11px;color:#908C82;display:flex;justify-content:space-between}

/* Vendor settings */
.vs-header{text-align:center;padding:20px;margin:0 20px 16px;background:#fff;border:1px solid #E8E6E1;border-radius:18px}
.vs-logo{width:72px;height:72px;border-radius:20px;background:linear-gradient(135deg,#6366F1,#A855F7);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:34px}
.vs-header .edit-logo{font-size:12px;color:#6366F1;font-weight:600;cursor:pointer;margin-top:6px}

/* Delivery */
.del-card{display:flex;align-items:center;gap:14px;padding:14px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px}
.del-card .del-av{width:48px;height:48px;border-radius:14px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.del-card .del-info{flex:1}.del-card .del-info h4{font-size:14px;font-weight:600}.del-card .del-info p{font-size:11px;color:#908C82;margin-top:1px}
.del-card .del-status{padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600}
.del-card .del-status.available{background:rgba(16,185,129,0.1);color:#10B981}
.del-card .del-status.busy{background:rgba(245,158,11,0.1);color:#F59E0B}

/* Report */
.rpt-card{padding:16px;background:#fff;border:1px solid #E8E6E1;border-radius:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;cursor:pointer}
.rpt-card:hover{border-color:#bbb}
.rpt-card .rpt-icon{width:44px;height:44px;border-radius:12px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.rpt-card .rpt-info{flex:1}.rpt-card .rpt-info h4{font-size:14px;font-weight:600}.rpt-card .rpt-info p{font-size:11px;color:#908C82;margin-top:1px}
.rpt-card .rpt-dl{padding:6px 12px;border-radius:8px;background:rgba(99,102,241,0.08);color:#6366F1;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:inherit}

.vd-period{display:flex;gap:6px;padding:0 20px;margin-bottom:14px}
.vd-period button{padding:8px 16px;border-radius:100px;border:1px solid #E8E6E1;background:#fff;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;color:#5E5B53;transition:all .15s}
.vd-period button.on{background:#6366F1;border-color:#6366F1;color:#fff}

.vo-filter{display:flex;gap:6px;padding:0 20px;margin-bottom:12px;overflow-x:auto}.vo-filter::-webkit-scrollbar{display:none}
.vo-filter button{padding:8px 14px;border-radius:100px;border:1px solid #E8E6E1;background:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;color:#5E5B53;white-space:nowrap;display:flex;align-items:center;gap:4px}
.vo-filter button.on{background:#6366F1;border-color:#6366F1;color:#fff}

/* ═══ DRIVER MODE ═══ */
.dr-hero{padding:20px;background:linear-gradient(135deg,#10B981,#059669);color:#fff;border-radius:0 0 28px 28px;margin-bottom:16px}
.dr-hero .dr-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.dr-hero .dr-av{width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px}
.dr-hero .dr-name{font-size:18px;font-weight:700}.dr-hero .dr-sub{font-size:12px;opacity:.7}
.dr-toggle-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;background:rgba(255,255,255,.12);border-radius:14px}
.dr-toggle-bar .dt-dot{width:10px;height:10px;border-radius:50%}.dt-dot.on{background:#4ADE80;box-shadow:0 0 8px rgba(74,222,128,.5)}.dt-dot.off{background:rgba(255,255,255,.3)}
.dr-toggle-bar span{flex:1;font-size:13px;font-weight:600}
.dr-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:14px}
.dr-stat{background:rgba(255,255,255,.12);padding:12px;border-radius:12px;text-align:center}
.dr-stat b{display:block;font-size:18px;font-weight:700}.dr-stat span{font-size:10px;opacity:.7}

.dr-request{margin:0 20px 14px;padding:18px;border-radius:20px;border:2px solid #10B981;background:rgba(16,185,129,0.03);position:relative;overflow:hidden}
.dr-request::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#10B981,#34D399);animation:dr-pulse 2s infinite}
@keyframes dr-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.dr-req-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.dr-req-head h4{font-size:16px;font-weight:700;display:flex;align-items:center;gap:6px}.dr-req-head .dr-new{padding:3px 8px;border-radius:6px;background:#10B981;color:#fff;font-size:10px;font-weight:700}
.dr-req-fee{font-size:20px;font-weight:700;color:#10B981}
.dr-req-route{padding:12px;background:#F5F4F1;border-radius:12px;margin-bottom:12px}
.dr-req-point{display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px}
.dr-req-point .drp-icon{width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.drp-pickup{background:rgba(99,102,241,0.1);color:#6366F1}.drp-drop{background:rgba(16,185,129,0.1);color:#10B981}
.dr-req-line{width:2px;height:16px;background:#E8E6E1;margin-left:13px}
.dr-req-meta{display:flex;gap:10px;font-size:12px;color:#908C82;margin-bottom:12px;flex-wrap:wrap}.dr-req-meta span{display:flex;align-items:center;gap:4px}
.dr-req-actions{display:flex;gap:10px}
.dr-req-actions button{flex:1;padding:14px;border-radius:14px;border:none;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
.dr-accept{background:#10B981;color:#fff}.dr-decline{background:#F5F4F1;color:#5E5B53}

.dr-active{margin:0 20px 14px;padding:16px;border-radius:18px;border:1px solid #E8E6E1;background:#fff;cursor:pointer}
.dr-active-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.dr-active-head h4{font-size:14px;font-weight:700}.dr-active-head .dr-st{padding:4px 10px;border-radius:8px;font-size:11px;font-weight:600;background:rgba(99,102,241,0.1);color:#6366F1}

.dr-step-bar{display:flex;align-items:center;gap:0;margin-bottom:14px}
.dr-step-dot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;border:2px solid #E8E6E1;color:#908C82;background:#FAF9F6;flex-shrink:0}
.dr-step-dot.done{background:#10B981;border-color:#10B981;color:#fff}
.dr-step-dot.cur{background:#6366F1;border-color:#6366F1;color:#fff;box-shadow:0 0 0 4px rgba(99,102,241,.15)}
.dr-step-line{flex:1;height:3px;background:#E8E6E1;min-width:8px}.dr-step-line.done{background:#10B981}

.dr-nav-map{position:relative;height:280px;background:linear-gradient(135deg,#e0f2e9,#c6f0d9);overflow:hidden}
.dr-nav-road{position:absolute;top:30%;left:0;right:0;height:6px;background:rgba(255,255,255,.7);border-radius:3px}
.dr-nav-road2{position:absolute;top:60%;left:10%;right:30%;height:6px;background:rgba(255,255,255,.7);border-radius:3px;transform:rotate(2deg)}
.dr-nav-route{position:absolute;top:30%;left:20%;height:4px;width:25%;background:repeating-linear-gradient(90deg,#10B981 0,#10B981 8px,transparent 8px,transparent 14px);border-radius:2px;animation:rpulse 2s infinite}
.dr-nav-me{position:absolute;top:calc(30% - 22px);left:18%;width:44px;height:44px;border-radius:50%;background:#10B981;border:4px solid #fff;box-shadow:0 4px 16px rgba(16,185,129,.4);display:flex;align-items:center;justify-content:center;font-size:20px;animation:dmove 3s ease-in-out infinite alternate}
.dr-nav-dest{position:absolute;font-size:28px;filter:drop-shadow(0 2px 6px rgba(0,0,0,.2))}
.dr-nav-info{position:absolute;bottom:16px;left:16px;right:16px;background:#fff;padding:14px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.12)}
.dr-nav-info h3{font-size:18px;font-weight:700;margin-bottom:2px}.dr-nav-info p{font-size:12px;color:#908C82}
.dr-nav-dir{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:#10B981;color:#fff;padding:8px 18px;border-radius:12px;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(16,185,129,.3);display:flex;align-items:center;gap:6px}

.dr-confirm{text-align:center;padding:20px}
.dr-confirm-icon{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:40px}
.dr-confirm-options{display:flex;gap:10px;margin:16px 0}
.dr-confirm-opt{flex:1;padding:16px 10px;border-radius:16px;border:2px solid #E8E6E1;background:#fff;cursor:pointer;text-align:center;transition:all .2s}
.dr-confirm-opt.on{border-color:#10B981;background:rgba(16,185,129,0.04)}
.dr-confirm-opt .dco-icon{font-size:28px;margin-bottom:6px}.dr-confirm-opt .dco-label{font-size:12px;font-weight:600}
`;

/* ═══════════════════════════
   SCREENS (35+)
   ═══════════════════════════ */

/* 1 ── SPLASH ── */
function SplashScr({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2200);return()=>clearTimeout(t)},[]);
  return <div className="splash"><div className="logo">🛒</div><h1>Lamuka Market</h1><p>Le Marketplace du Congo 🇨🇬</p><div className="loader"/></div>
}

/* 2 ── ONBOARDING ── */
function OnboardingScr({onDone}){
  const [s,setS]=useState(0);
  const slides=[
    {img:"🛍️",title:"Tout le Congo en une app",desc:"Restos, boutiques, pharmacies, pâtisseries, supermarchés et services — commandez et faites-vous livrer à Brazzaville et Pointe-Noire."},
    {img:"🍽️",title:"Commandez à manger, achetez, réservez",desc:"Des milliers de commerces vérifiés : restaurants, boutiques de mode, boulangeries, pressing et plus encore."},
    {img:"💳",title:"Paiement Mobile Money",desc:"Payez facilement avec Airtel Money ou MTN MoMo. Sécurisé via Kolo Pay."},
  ];
  return(
    <div className="onb">
      <div className="onb-img">{slides[s].img}</div>
      <h2>{slides[s].title}</h2>
      <p>{slides[s].desc}</p>
      <div className="onb-dots">{slides.map((_,i)=><div key={i} className={`onb-dot ${i===s?"on":""}`}/>)}</div>
      <button className="btn-primary" onClick={()=>s<2?setS(s+1):onDone()}>{s<2?"Suivant":"Commencer"}</button>
      {s<2&&<button className="btn-outline" style={{marginTop:10}} onClick={onDone}>Passer</button>}
    </div>
  );
}

/* 3 ── LOGIN ── */
function LoginScr({onDone,onSocial}){
  const [legal,setLegal]=useState(null);
  const [socialLoading,setSocialLoading]=useState(null);
  const doSocial=(provider)=>{setSocialLoading(provider);setTimeout(()=>{setSocialLoading(null);onSocial(provider)},1500)};
  if(legal)return legal==="terms"?<TermsScr onBack={()=>setLegal(null)}/>:<PrivacyScr onBack={()=>setLegal(null)}/>;
  return(
    <div className="auth">
      <div style={{textAlign:"center",margin:"20px 0 30px"}}><span style={{fontSize:48}}>🛒</span></div>
      <h2>Bienvenue !</h2>
      <div className="sub">Connectez-vous pour accéder au marketplace</div>
      <div className="phone-input">
        <div className="prefix">🇨🇬 +242</div>
        <input placeholder="06X XXX XXX" type="tel"/>
      </div>
      <button className="btn-primary" onClick={onDone}>Continuer</button>
      <div className="divider">ou continuer avec</div>
      <div className="social-btns">
        <button className="social-btn" onClick={()=>doSocial("google")} style={socialLoading==="google"?{background:"rgba(66,133,244,0.08)",borderColor:"#4285F4"}:{}}>{socialLoading==="google"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="loader" style={{width:14,height:14,borderWidth:2}}/>Connexion...</span>:<><span style={{fontSize:16}}>🔵</span> <span>Google</span></>}</button>
        <button className="social-btn" onClick={()=>doSocial("apple")} style={socialLoading==="apple"?{background:"rgba(0,0,0,0.04)",borderColor:"#333"}:{}}>{socialLoading==="apple"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="loader" style={{width:14,height:14,borderWidth:2}}/>Connexion...</span>:<><span style={{fontSize:16}}>⚫</span> <span>Apple</span></>}</button>
        <button className="social-btn" onClick={()=>doSocial("facebook")} style={socialLoading==="facebook"?{background:"rgba(24,119,242,0.08)",borderColor:"#1877F2"}:{}}>{socialLoading==="facebook"?<span style={{display:"flex",alignItems:"center",gap:6}}><span className="loader" style={{width:14,height:14,borderWidth:2}}/>Connexion...</span>:<><span style={{fontSize:16}}>🔷</span> <span>Facebook</span></>}</button>
      </div>
      <p style={{textAlign:"center",fontSize:12,color:"#908C82",marginTop:24}}>En continuant, vous acceptez nos <b style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setLegal("terms")}>Conditions</b> et <b style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>setLegal("privacy")}>Politique de confidentialité</b></p>
    </div>
  );
}

/* 4 ── OTP ── */
function OTPScr({onDone}){
  const [timer,setTimer]=useState(45);
  useEffect(()=>{const t=setInterval(()=>setTimer(p=>p>0?p-1:0),1000);return()=>clearInterval(t)},[]);
  return(
    <div className="auth">
      <h2>Vérification OTP</h2>
      <div className="sub">Entrez le code envoyé au +242 064 XXX XXX</div>
      <div className="otp-inputs">
        {[1,2,3,4].map(i=><input key={i} className="otp-box" maxLength={1} defaultValue={i<=2?String(i+2):""}/>)}
      </div>
      <div className="otp-timer">{timer>0?<>Renvoyer le code dans <b>00:{String(timer).padStart(2,"0")}</b></>:<b style={{color:"#6366F1",cursor:"pointer"}}>Renvoyer le code</b>}</div>
      <button className="btn-primary" onClick={onDone}>Vérifier</button>
    </div>
  );
}

/* 4b ── PROFILE COMPLETION (after OTP or social) ── */
function ProfileCompletionScr({onDone,provider}){
  const [step,setStep]=useState(0);
  return(
    <div className="auth" style={{justifyContent:"flex-start",paddingTop:40}}>
      {provider&&<div style={{textAlign:"center",marginBottom:16}}>
        <div style={{display:"inline-flex",padding:"6px 16px",borderRadius:10,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)",fontSize:12,color:"#10B981",fontWeight:600}}>✅ Connecté via {provider==="google"?"Google":provider==="apple"?"Apple":"Facebook"}</div>
      </div>}
      <h2>Complétez votre profil</h2>
      <div className="sub" style={{marginBottom:20}}>Pour vous offrir la meilleure expérience</div>

      {step===0&&<>
        <div className="field"><label>Prénom</label><input placeholder="Joeldy"/></div>
        <div className="field"><label>Nom de famille</label><input placeholder="Tsina"/></div>
        {provider&&<div className="field"><label>Numéro de téléphone</label>
          <div style={{display:"flex",gap:8}}><div style={{padding:"10px 12px",borderRadius:12,border:"1px solid #E8E6E1",background:"#F5F4F1",fontSize:13,fontWeight:600,flexShrink:0}}>🇨🇬 +242</div><input placeholder="06X XXX XXX" type="tel" style={{flex:1}}/></div>
        </div>}
        <button className="btn-primary" onClick={()=>setStep(1)}>Continuer</button>
      </>}

      {step===1&&<>
        <div className="field"><label>Ville</label>
          <select defaultValue="brazzaville" style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid #E8E6E1",fontSize:14,fontFamily:"inherit",color:"#191815",background:"#fff"}}>
            <option value="brazzaville">Brazzaville</option>
            <option value="pointe-noire">Pointe-Noire</option>
            <option value="dolisie">Dolisie</option>
            <option value="nkayi">Nkayi</option>
            <option value="oyo">Oyo</option>
            <option value="ouesso">Ouesso</option>
          </select>
        </div>
        <div className="field"><label>Quartier</label><input placeholder="Ex: Bacongo, Poto-Poto..."/></div>
        <div className="field"><label>Adresse (optionnel)</label><input placeholder="Rue, N°..."/></div>
        <button className="btn-primary" onClick={onDone}>🚀 Commencer</button>
        <button className="btn-outline" style={{marginTop:8}} onClick={onDone}>Passer pour l'instant</button>
      </>}

      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:20}}>{[0,1].map(i=><div key={i} style={{width:step===i?24:8,height:8,borderRadius:4,background:step>=i?"#6366F1":"#E8E6E1",transition:"all .3s"}}/>)}</div>
    </div>
  );
}

/* 5 ── HOME ── */
function HomeScr({go,favs,toggleFav,isFav}){
  const [selCat,setSC]=useState(0);
  const [selType,setSelType]=useState("all");
  const [homeQ,setHomeQ]=useState("");
  const [searchFocused,setSearchFocused]=useState(false);
  const [recentSearches,setRecent]=useState(["Poulet DG","Smartphone","Doliprane","Pressing","Robe Wax","Croissants"]);
  const [showFilter,setShowFilter]=useState(false);
  const [filterType,setFilterType]=useState("all");
  const [filterSort,setFilterSort]=useState("popular");
  const trending=["iPhone","Samsung","Wax","Pâtisserie","Braisé","Pharmacie","Livraison","Promo"];
  const types=[{id:"all",icon:"🏠",name:"Tout"},{id:"restaurant",icon:"🍽️",name:"Restos"},{id:"patisserie",icon:"🧁",name:"Pâtisseries"},{id:"supermarche",icon:"🛒",name:"Courses"},{id:"pharmacie",icon:"💊",name:"Pharma"},{id:"boutique",icon:"🏪",name:"Boutiques"},{id:"service",icon:"🔧",name:"Services"}];
  const filteredP=selType==="all"?P:P.filter(p=>p.type===selType);
  const filteredV=selType==="all"?VENDORS:VENDORS.filter(v=>v.type===selType);
  const nearbyRestos=VENDORS.filter(v=>v.type==="restaurant");

  const doSearch=(term)=>{setHomeQ(term);if(!recentSearches.includes(term))setRecent(r=>[term,...r].slice(0,6))};
  const exitSearch=()=>{setHomeQ("");setSearchFocused(false)};

  const searchResults=homeQ.length>0?P.filter(p=>{
    const q=homeQ.toLowerCase();
    const matchQ=p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)||p.vendor.toLowerCase().includes(q)||(p.type&&p.type.toLowerCase().includes(q));
    const matchType=filterType==="all"||p.type===filterType;
    return matchQ&&matchType;
  }).sort((a,b)=>filterSort==="price"?a.price-b.price:filterSort==="rating"?b.rating-a.rating:b.reviews-a.reviews):null;

  // Search mode: focused or has query
  const inSearchMode=searchFocused||homeQ.length>0;

  return(
    <div className="scr">
      {/* Header - only show when not in search */}
      {!inSearchMode&&<div className="hdr"><div><div className="hdr-t">Bonjour 👋</div><div className="hdr-h">Lamuka Market</div></div>
        <div className="hdr-r"><div className="hdr-btn" onClick={()=>go("notif")}>🔔<div className="notif-badge"/></div><div className="hdr-btn" onClick={()=>go("cart")}>🛍️</div></div></div>}

      {/* Search bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"14px 16px 10px":"0 16px 12px",marginTop:inSearchMode?0:10}}>
        {inSearchMode&&<button onClick={exitSearch} style={{width:38,height:38,borderRadius:12,border:"none",background:"#F0EFEC",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#191815",fontFamily:"inherit"}}>←</button>}
        <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:inSearchMode?"10px 16px":"9px 14px",background:"#fff",borderRadius:24,border:"1px solid #E8E6E1",boxShadow:"0 2px 8px rgba(0,0,0,.04)"}}>
          <span style={{color:"#C4C1BA",fontSize:13,flexShrink:0}}>🔍</span>
          <input value={homeQ} onChange={e=>setHomeQ(e.target.value)} onFocus={()=>setSearchFocused(true)} placeholder="Rechercher produits, restos..." style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"#191815"}}/>
          {homeQ&&<span style={{cursor:"pointer",color:"#908C82",fontSize:12,flexShrink:0}} onClick={()=>setHomeQ("")}>✕</span>}
        </div>
        <button onClick={()=>setShowFilter(!showFilter)} style={{width:38,height:38,borderRadius:12,border:"none",background:showFilter?"#6366F1":"#F0EFEC",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
          <span style={{filter:showFilter?"brightness(10)":"none"}}>⚙️</span>
        </button>
      </div>

      {/* Filter panel */}
      {showFilter&&<div style={{margin:"0 16px 12px",padding:16,background:"#fff",borderRadius:18,border:"1px solid #E8E6E1",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h4 style={{fontSize:14,fontWeight:700}}>Filtres</h4>
          <span style={{fontSize:12,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>{setFilterType("all");setFilterSort("popular")}}>Réinitialiser</span>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Type de commerce</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {types.map(t=><div key={t.id} onClick={()=>setFilterType(t.id)} style={{padding:"6px 12px",borderRadius:20,border:filterType===t.id?"2px solid #6366F1":"1px solid #E8E6E1",background:filterType===t.id?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:filterType===t.id?"#6366F1":"#5E5B53"}}>{t.icon} {t.name}</div>)}
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Trier par</div>
        <div style={{display:"flex",gap:6}}>
          {[["popular","🔥 Populaires"],["rating","⭐ Mieux notés"],["price","💰 Prix ↑"]].map(([k,l])=><div key={k} onClick={()=>setFilterSort(k)} style={{padding:"6px 12px",borderRadius:20,border:filterSort===k?"2px solid #6366F1":"1px solid #E8E6E1",background:filterSort===k?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:filterSort===k?"#6366F1":"#5E5B53"}}>{l}</div>)}
        </div>
      </div>}

      {/* ── SEARCH RESULTS MODE ── */}
      {searchResults?<div style={{padding:"0 16px 100px"}}>
        <div style={{fontSize:12,color:"#908C82",padding:"4px 0 12px",fontWeight:500}}>{searchResults.length} résultat{searchResults.length!==1?"s":""} pour « {homeQ} »</div>
        {searchResults.length>0?<div className="pgrid" style={{padding:0}}>{searchResults.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
        :<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:40,marginBottom:10}}>🔍</div><div style={{fontSize:14,fontWeight:600}}>Aucun résultat</div><div style={{fontSize:12,color:"#908C82",marginTop:4}}>Essayez un autre terme</div></div>}
      </div>

      /* ── DISCOVERY MODE (focused, no query) ── */
      :searchFocused&&!homeQ?<div style={{padding:"0 16px 100px"}}>

        {/* Recent Searches */}
        {recentSearches.length>0&&<div style={{marginBottom:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0 12px"}}>
            <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"#191815"}}>Recherches récentes</h3>
            <span style={{fontSize:13,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>setRecent([])}>Effacer</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {recentSearches.map(s=><div key={s} onClick={()=>doSearch(s)} style={{display:"inline-flex",alignItems:"center",gap:7,padding:"8px 16px",background:"#F0EFEC",borderRadius:24,cursor:"pointer",fontSize:13,fontWeight:500,color:"#5E5B53",transition:"all .15s"}}>
              <span style={{fontSize:11,color:"#C4C1BA"}}>🕐</span>{s}
            </div>)}
          </div>
        </div>}

        {/* Popular Categories */}
        <div style={{marginBottom:24}}>
          <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"#191815",paddingBottom:12}}>Catégories populaires</h3>
          <div style={{background:"#fff",borderRadius:18,overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
            {CATS.map((c,i)=><div key={c.id} onClick={()=>doSearch(c.name)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",cursor:"pointer",borderBottom:i<CATS.length-1?"1px solid #F5F4F1":"none",transition:"background .12s"}}>
              <div style={{width:42,height:42,borderRadius:12,background:"#F5F4F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{c.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:600,color:"#191815"}}>{c.name}</div>
                <div style={{fontSize:12,color:"#908C82",marginTop:2}}>{c.count} articles</div>
              </div>
              <span style={{color:"#C4C1BA",fontSize:18,flexShrink:0,fontWeight:300}}>›</span>
            </div>)}
          </div>
        </div>

        {/* Trending Searches */}
        <div>
          <h3 style={{fontSize:17,fontWeight:700,letterSpacing:-.3,color:"#191815",paddingBottom:12}}>Tendances</h3>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {trending.map(t=><div key={t} onClick={()=>doSearch(t)} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 18px",background:"#fff",borderRadius:24,border:"1px solid #E8E6E1",cursor:"pointer",fontSize:13,fontWeight:500,color:"#5E5B53",boxShadow:"0 1px 3px rgba(0,0,0,.03)",transition:"all .15s"}}>
              <span style={{fontSize:11,color:"#6366F1"}}>🔥</span>{t}
            </div>)}
          </div>
        </div>
      </div>

      /* ── NORMAL HOME CONTENT ── */
      :<>

      {/* Commerce types */}
      <div style={{display:"flex",gap:6,padding:"0 20px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
        {types.map(t=><div key={t.id} onClick={()=>setSelType(t.id)} style={{padding:"8px 10px",borderRadius:12,border:selType===t.id?"2px solid #6366F1":"1px solid #E8E6E1",background:selType===t.id?"rgba(99,102,241,0.04)":"#fff",cursor:"pointer",flexShrink:0,textAlign:"center",minWidth:54,transition:"all .2s"}}>
          <div style={{fontSize:18}}>{t.icon}</div>
          <div style={{fontSize:9,fontWeight:600,color:selType===t.id?"#6366F1":"#908C82",marginTop:2}}>{t.name}</div>
        </div>)}
      </div>

      <div className="banner"><div className="banner-l"><h3>Soldes de Février</h3><p>Jusqu'à -40% sur tout le marketplace</p><span className="banner-btn" onClick={()=>go("flash")}>Voir les offres</span></div><span style={{fontSize:56}}>🛍️</span></div>

      {/* Restos à la une */}
      {(selType==="all"||selType==="restaurant")&&nearbyRestos.length>0&&<>
        <div className="sec"><h3>🍽️ Commander à manger</h3><span onClick={()=>go("restoList")}>Voir tout</span></div>
        <div className="marquee-wrap"><div className="marquee-track-resto">
          {[...nearbyRestos,...nearbyRestos].map((v,i)=><div key={v.id+"-"+i} style={{minWidth:170,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,cursor:"pointer",flexShrink:0}} onClick={()=>go("vendor",v)}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{v.avatar}</div>
              <div><div style={{fontSize:12,fontWeight:700}}>{v.name}{v.verified&&<span style={{color:"#6366F1"}}> ✓</span>}</div><div style={{fontSize:10,color:"#908C82"}}>📍 {v.loc}</div></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}><span>⭐ <b>{v.rating}</b></span><span style={{color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span></div>
          </div>)}
        </div></div>
      </>}

      <div className="sec"><h3>Catégories</h3><span onClick={()=>go("cats")}>Voir tout</span></div>
      <div className="marquee-wrap"><div className="marquee-track">{[...CATS.filter(c=>selType==="all"||c.type===selType).slice(0,8),...CATS.filter(c=>selType==="all"||c.type===selType).slice(0,8)].map((c,i)=><div key={c.id+"-"+i} className={`cat ${i%CATS.length===selCat?"on":""}`} onClick={()=>setSC(i%CATS.length)}><span className="ci">{c.icon}</span><span className="cn">{c.name}</span></div>)}</div></div>

      <div className="sec"><h3>{selType==="all"?"Établissements proches":types.find(t=>t.id===selType)?.name+" proches"}</h3><span onClick={()=>go("nearby")}>Voir la carte</span></div>
      <div className="vlist">{filteredV.slice(0,4).map(v=><div key={v.id} className="vcard" onClick={()=>go("vendor",v)}><div className="vav">{v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf">✓</span>}</h4><div className="vloc">📍 {v.loc}{v.eta&&<span style={{marginLeft:8,color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span>}</div><div className="vst">⭐ <b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div><span style={{color:"#908C82"}}>›</span></div>)}</div>

      <div className="sec"><h3>{selType==="all"?"Populaires":"Populaires en "+types.find(t=>t.id===selType)?.name}</h3><span onClick={()=>go("allProducts")}>Voir tout</span></div>
      <div className="pgrid">{filteredP.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit",fontSize:isFav(p.id)?16:14}}>{isFav(p.id)?"❤️":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}{p.eta&&<span style={{marginLeft:4,color:"#10B981",fontSize:10}}>🕐 {p.eta}</span>}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>
      </>}
    </div>
  );
}

/* 5b ── RESTAURANT LIST ── */
function RestoListScr({go,onBack,favs,toggleFav,isFav}){
  const restos=VENDORS.filter(v=>v.type==="restaurant");
  const restoProducts=P.filter(p=>p.type==="restaurant");
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>🍽️ Restaurants</h2><div style={{width:38}}/></div>
    <div className="info-box blue" style={{margin:"0 20px 14px"}}><span>🍽️</span><span style={{fontSize:11}}>Commandez à manger et faites-vous livrer rapidement</span></div>
    <div style={{padding:"0 20px"}}>
      {restos.map(v=><div key={v.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10,cursor:"pointer"}} onClick={()=>go("vendor",v)}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{v.avatar}</div>
          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{v.name}</h4>{v.verified&&<span style={{color:"#6366F1",fontSize:10}}>✓</span>}</div>
            <p style={{fontSize:11,color:"#908C82"}}>📍 {v.loc} · ⭐ {v.rating} · {v.products} plats</p></div>
          <div style={{textAlign:"right"}}><div style={{color:"#10B981",fontWeight:700,fontSize:12}}>🕐 {v.eta}</div></div>
        </div>
      </div>)}
    </div>
    <div style={{padding:"0 20px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Plats populaires</div></div>
    <div className="pgrid">{restoProducts.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit",fontSize:isFav(p.id)?16:14}}>{isFav(p.id)?"❤️":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>
  </div>);
}

/* 5c ── ALL PRODUCTS ── */
function AllProductsScr({go,onBack,favs,toggleFav,isFav}){
  const [sort,setSort]=useState("popular");
  const sorted=[...P].sort((a,b)=>sort==="price"?a.price-b.price:sort==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Tous les articles</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",gap:6,padding:"0 20px 10px"}}>{[["popular","🔥 Populaires"],["rating","⭐ Mieux notés"],["price","💰 Prix ↑"]].map(([k,l])=><button key={k} onClick={()=>setSort(k)} style={{padding:"6px 12px",borderRadius:8,border:sort===k?"2px solid #6366F1":"1px solid #E8E6E1",background:sort===k?"rgba(99,102,241,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:sort===k?"#6366F1":"#908C82"}}>{l}</button>)}</div>
    <div className="pgrid">{sorted.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit",fontSize:isFav(p.id)?16:14}}>{isFav(p.id)?"❤️":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}{p.eta&&<span style={{marginLeft:4,color:"#10B981",fontSize:10}}>🕐 {p.eta}</span>}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>
  </div>);
}

/* 6 ── CATEGORIES FULL ── */
function CategoriesScr({go,onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Catégories</h2><div style={{width:38}}/></div>
    <div className="cat-full" style={{paddingBottom:100}}>{CATS.map(c=><div key={c.id} className="cat-card" onClick={()=>{go("search")}}><span className="cci">{c.icon}</span><div style={{minWidth:0,flex:1}}><h4>{c.name}</h4><p>{c.count} produits</p></div></div>)}</div>
  </div>);
}

/* 7 ── SEARCH ── */
function SearchScr({go,onBack,fromTab,favs,toggleFav,isFav}){
  const [q,setQ]=useState("");const [sc,setSC]=useState("Tous");
  const [showFilter,setShowFilter]=useState(false);
  const [sortBy,setSortBy]=useState("popular");
  const sortOpts=[{k:"popular",l:"🔥 Populaires"},{k:"rating",l:"⭐ Mieux notés"},{k:"priceAsc",l:"💰 Prix ↑"},{k:"priceDesc",l:"💰 Prix ↓"}];
  const cats=["Tous",...CATS.map(c=>c.name)];
  const f=P.filter(p=>{
    if(q){const ql=q.toLowerCase();if(!p.name.toLowerCase().includes(ql)&&!p.cat.toLowerCase().includes(ql)&&!p.vendor.toLowerCase().includes(ql))return false}
    if(sc!=="Tous"&&p.cat!==sc)return false;return true;
  }).sort((a,b)=>sortBy==="priceAsc"?a.price-b.price:sortBy==="priceDesc"?b.price-a.price:sortBy==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  return(<div className="scr">
    {!fromTab&&<div className="appbar"><button onClick={onBack}>←</button><h2>Rechercher</h2><div style={{width:38}}/></div>}
    {fromTab&&<div className="appbar"><h2>Rechercher</h2></div>}
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"0 16px 10px"}}>
      <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:"#F5F4F1",borderRadius:14,border:"1px solid #E8E6E1"}}>
        <span style={{fontSize:13}}>🔍</span>
        <input placeholder="Restos, produits, pharmacies..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,border:"none",background:"transparent",outline:"none",fontSize:13,fontFamily:"inherit",color:"#191815"}}/>
        {q&&<span style={{cursor:"pointer",color:"#908C82",fontSize:12}} onClick={()=>setQ("")}>✕</span>}
      </div>
      <button onClick={()=>setShowFilter(!showFilter)} style={{width:36,height:36,borderRadius:12,border:"none",background:showFilter?"#6366F1":"#F0EFEC",cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .2s"}}>
        <span style={{filter:showFilter?"brightness(10)":"none"}}>⚙️</span>
      </button>
    </div>

    {/* Filter panel */}
    {showFilter&&<div style={{margin:"0 16px 10px",padding:14,background:"#fff",borderRadius:16,border:"1px solid #E8E6E1",boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <h4 style={{fontSize:13,fontWeight:700}}>Filtres & Tri</h4>
        <span style={{fontSize:11,color:"#6366F1",fontWeight:600,cursor:"pointer"}} onClick={()=>{setSC("Tous");setSortBy("popular")}}>Réinitialiser</span>
      </div>
      <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>Catégorie</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {cats.map(c=><div key={c} onClick={()=>setSC(c)} style={{padding:"5px 12px",borderRadius:20,border:sc===c?"2px solid #6366F1":"1px solid #E8E6E1",background:sc===c?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:sc===c?"#6366F1":"#5E5B53"}}>{c}</div>)}
      </div>
      <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>Trier par</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {sortOpts.map(s=><div key={s.k} onClick={()=>setSortBy(s.k)} style={{padding:"5px 12px",borderRadius:20,border:sortBy===s.k?"2px solid #6366F1":"1px solid #E8E6E1",background:sortBy===s.k?"rgba(99,102,241,0.06)":"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:sortBy===s.k?"#6366F1":"#5E5B53"}}>{s.l}</div>)}
      </div>
    </div>}

    <div className="sfilters">{cats.map(c=><button key={c} className={`sf ${sc===c?"on":""}`} onClick={()=>setSC(c)}>{c}</button>)}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 20px 8px"}}>
      <span style={{fontSize:12,color:"#908C82"}}>{f.length} résultat{f.length>1?"s":""}</span>
      <button onClick={()=>{const order=["popular","rating","priceAsc","priceDesc"];const i=order.indexOf(sortBy);setSortBy(order[(i+1)%order.length])}} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:11,fontWeight:600,color:"#6366F1",fontFamily:"inherit"}}>
        ↕️ {sortOpts.find(s=>s.k===sortBy)?.l}
      </button>
    </div>
    <div className="pgrid">{f.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}{p.old&&<span className="po">{fmt(p.old)}</span>}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
  </div>);
}

/* 8 ── FLASH SALES ── */
function FlashScr({go,onBack,favs,toggleFav,isFav}){
  const [t,setT]=useState({h:2,m:14,s:37});
  useEffect(()=>{const i=setInterval(()=>setT(p=>{let s=p.s-1,m=p.m,h=p.h;if(s<0){s=59;m--}if(m<0){m=59;h--}if(h<0){h=0;m=0;s=0}return{h,m,s}}),1000);return()=>clearInterval(i)},[]);
  const promos=P.filter(p=>p.old);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Offres Flash ⚡</h2><div style={{width:38}}/></div>
    <div className="flash-banner"><div><h3>⚡ Vente Flash</h3><p>Se termine dans</p></div><div className="flash-timer"><div className="ft">{String(t.h).padStart(2,"0")}</div><div className="ft">{String(t.m).padStart(2,"0")}</div><div className="ft">{String(t.s).padStart(2,"0")}</div></div></div>
    <div className="pgrid">{promos.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span><span className="badge">-{disc(p)}%</span></div><div className="pbody"><h4>{p.name}</h4><div className="pp">{fmt(p.price)}<span className="po">{fmt(p.old)}</span></div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
  </div>);
}

/* 9 ── NEARBY VENDORS MAP ── */
function NearbyScr({go,onBack}){
  const [sel,setSel]=useState(VENDORS[0]);
  const pins=[{v:VENDORS[0],top:"30%",left:"25%"},{v:VENDORS[1],top:"55%",left:"60%"},{v:VENDORS[2],top:"25%",left:"65%"},{v:VENDORS[3],top:"60%",left:"30%"}];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Commerces proches</h2><div style={{width:38}}/></div>
    <div className="nv-map">
      <div className="map-grid"/>
      <div className="nv-me" style={{top:"45%",left:"48%"}}/>
      {pins.map((p,i)=><div key={i} className="nv-pin" style={{top:p.top,left:p.left}} onClick={()=>setSel(p.v)}>{p.v.avatar}</div>)}
      <div className="nv-popup">
        <div className="npav">{sel.avatar}</div>
        <div className="npi"><h4>{sel.name}{sel.verified&&<span style={{color:"#6366F1",fontSize:12}}> ✓</span>}</h4><p>📍 {sel.loc} · ⭐ {sel.rating} · {sel.products} {sel.type==="restaurant"?"plats":sel.type==="service"?"services":"articles"}</p></div>
        <button onClick={()=>go("vendor",sel)}>Voir</button>
      </div>
    </div>
    <div className="scr" style={{padding:16}}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>{VENDORS.length} commerces à proximité</div>
      {VENDORS.map(v=><div key={v.id} className="vcard" style={{marginBottom:8}} onClick={()=>go("vendor",v)}><div className="vav">{v.avatar}</div><div className="vi"><h4>{v.name}{v.verified&&<span className="vf">✓</span>}</h4><div className="vloc">📍 {v.loc}{v.eta&&<span style={{marginLeft:6,color:"#10B981",fontWeight:600}}>🕐 {v.eta}</span>}</div><div className="vst">⭐ <b>{v.rating}</b> · {v.products} {v.type==="restaurant"?"plats":v.type==="service"?"services":"produits"}</div></div></div>)}
    </div>
  </div>);
}

/* 10 ── PRODUCT DETAIL ── */
function DetailScr({product:p,onBack,onAddCart,go,favs,toggleFav,isFav}){
  const [qty,setQty]=useState(1);
  return(<>
    <div className="scr">
      <div className="det-img" onClick={()=>go("gallery",p)}><span className="pe">{p.img}</span><div className="det-top"><button onClick={e=>{e.stopPropagation();onBack()}}>←</button><button onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit"}}>{isFav(p.id)?"❤️":"♡"}</button></div>{disc(p)>0&&<span className="badge" style={{position:"absolute",bottom:14,left:14}}>-{disc(p)}%</span>}<div style={{position:"absolute",bottom:14,right:14,background:"rgba(0,0,0,.4)",color:"#fff",padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:600}}>{p.imgs?.length||1} photos</div></div>
      <div className="det-body">
        <div className="det-vendor"><span>{p.va}</span>{p.vendor} ✓</div>
        <h2>{p.name}</h2>
        <div className="det-stars" style={{cursor:"pointer"}} onClick={()=>go("reviews",p)}>{"★".repeat(Math.floor(p.rating))}{"☆".repeat(5-Math.floor(p.rating))}<span className="rc">({p.reviews} avis) →</span></div>
        <div className="det-price"><span className="dp">{fmt(p.price)}</span>{p.old&&<span className="dpo">{fmt(p.old)}</span>}</div>
        {p.tags.length>0&&<div className="det-tags">{p.tags.map(t=><span key={t} style={{cursor:"pointer"}} onClick={()=>go("reviews",p)}>{t}</span>)}</div>}
        <div style={{fontSize:16,fontWeight:700,marginBottom:6}}>Description</div>
        <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.6,marginBottom:16}}>{p.desc}</p>
        <div className="det-info"><span className="dii">🚚</span><div className="dit"><h4>Livraison à Brazzaville</h4><p>1-3 jours · 2 500 FCFA</p></div></div>
        <div className="det-info"><span className="dii">📱</span><div className="dit"><h4>Paiement Mobile Money</h4><p>Airtel, MTN</p></div></div>
        <div className="det-info" onClick={()=>go("compare",p)}><span className="dii">⚖️</span><div className="dit"><h4>Comparer ce produit</h4><p>Voir côte à côte avec un autre</p></div><span style={{color:"#6366F1",fontSize:14}}>→</span></div>
      </div>
    </div>
    <div className="det-bar"><div className="qty"><button onClick={()=>qty>1&&setQty(qty-1)}>−</button><span>{qty}</span><button onClick={()=>setQty(qty+1)}>+</button></div><button className="add-btn" onClick={()=>onAddCart(p,qty)}>🛍️ Ajouter · {fmt(p.price*qty)}</button></div>
  </>);
}

/* 11 ── GALLERY ── */
function GalleryScr({product:p,onClose}){
  const imgs=p.imgs||[p.img];const [idx,setIdx]=useState(0);
  return(<div className="gallery">
    <div className="gallery-count">{idx+1}/{imgs.length}</div>
    <button className="gallery-close" onClick={onClose}>✕</button>
    {imgs.length>1&&<><button className="gallery-nav l" onClick={()=>setIdx(i=>i>0?i-1:imgs.length-1)}>‹</button><button className="gallery-nav r" onClick={()=>setIdx(i=>i<imgs.length-1?i+1:0)}>›</button></>}
    <div className="gallery-img">{imgs[idx]}</div>
    <div className="gallery-dots">{imgs.map((_,i)=><span key={i} className={i===idx?"on":""}/>)}</div>
  </div>);
}

/* 12 ── COMPARE ── */
function CompareScr({product:p,onBack}){
  const [other,setOther]=useState(null);
  const [picking,setPicking]=useState(!p);
  const [slot,setSlot]=useState(p?2:1);
  const [prod1,setProd1]=useState(p||null);
  const [prod2,setProd2]=useState(null);

  const pickProduct=(pr)=>{
    if(slot===1){setProd1(pr);setSlot(2);setPicking(true)}
    else{setProd2(pr);setPicking(false)}
  };
  const canCompare=prod1&&prod2;
  const rows=canCompare?[["Prix",fmt(prod1.price),fmt(prod2.price)],["Note",`⭐ ${prod1.rating}`,`⭐ ${prod2.rating}`],["Avis",`${prod1.reviews}`,`${prod2.reviews}`],["Commerce",prod1.vendor,prod2.vendor],["Catégorie",prod1.cat,prod2.cat],["Livraison",prod1.eta||"1-3 jours",prod2.eta||"1-3 jours"]]:[];

  if(picking)return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={()=>{if(canCompare||prod1)setPicking(false);else onBack()}}>←</button><h2>Choisir {slot===1?"1er":"2ème"} article</h2><div style={{width:38}}/></div>
    <div style={{fontSize:12,color:"#908C82",marginBottom:14}}>Sélectionnez un article à comparer :</div>
    {P.filter(x=>slot===2?x.id!==(prod1?.id):true).map(x=><div key={x.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8,cursor:"pointer"}} onClick={()=>pickProduct(x)}>
      <div style={{width:44,height:44,borderRadius:12,background:"#F5F4F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{x.img}</div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{x.name}</div><div style={{fontSize:11,color:"#908C82"}}>{x.vendor} · ⭐ {x.rating}</div></div>
      <div style={{fontSize:13,fontWeight:700,color:"#6366F1",flexShrink:0}}>{fmt(x.price)}</div>
    </div>)}
  </div>);

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Comparer</h2><div style={{width:38}}/></div>
    <div className="compare">
      <div className="compare-col" style={{cursor:"pointer"}} onClick={()=>{setSlot(1);setPicking(true)}}>{prod1?<><div className="ci">{prod1.img}</div><h4>{prod1.name}</h4><div className="cp">{fmt(prod1.price)}</div></>:<><div style={{fontSize:28,marginBottom:6}}>➕</div><h4 style={{color:"#908C82"}}>Choisir</h4></>}</div>
      <div className="compare-col" style={{cursor:"pointer"}} onClick={()=>{setSlot(2);setPicking(true)}}>{prod2?<><div className="ci">{prod2.img}</div><h4>{prod2.name}</h4><div className="cp">{fmt(prod2.price)}</div></>:<><div style={{fontSize:28,marginBottom:6}}>➕</div><h4 style={{color:"#908C82"}}>Choisir</h4></>}</div>
    </div>
    {canCompare?rows.map(([l,v1,v2])=><div key={l} className="compare-row"><div className="cr-label">{l}</div><div className="cr-val">{v1}</div><div className="cr-val">{v2}</div></div>)
    :<div style={{textAlign:"center",padding:"30px 0",color:"#908C82",fontSize:13}}>Sélectionnez 2 articles pour les comparer</div>}
    {canCompare&&<div style={{display:"flex",gap:8,marginTop:14}}>
      <button className="btn-outline" style={{flex:1}} onClick={()=>{setProd2(null);setSlot(2);setPicking(true)}}>🔄 Changer article 2</button>
    </div>}
  </div>);
}

/* 13 ── REVIEWS ── */
function ReviewsScr({product:p,onBack}){
  const avg=p.rating;const dist=[60,25,10,3,2];
  const [writing,setWriting]=useState(false);
  const [userRating,setUserRating]=useState(0);
  const [userText,setUserText]=useState("");
  const [userReviews,setUserReviews]=useState([]);
  const [submitted,setSubmitted]=useState(false);

  const submitReview=()=>{
    if(userRating===0)return;
    setUserReviews(r=>[{name:"Moi",rating:userRating,text:userText,date:"Aujourd'hui",avatar:"😊"},...r]);
    setWriting(false);setUserRating(0);setUserText("");setSubmitted(true);
    setTimeout(()=>setSubmitted(false),3000);
  };

  const allReviews=[...userReviews,...REVIEWS];

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Avis ({p.reviews+userReviews.length})</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}>
      <div style={{fontSize:40,fontWeight:700,color:"#191815"}}>{avg}</div>
      <div style={{fontSize:16,color:"#F59E0B",marginBottom:4}}>{"★".repeat(Math.floor(avg))}{"☆".repeat(5-Math.floor(avg))}</div>
      <div style={{fontSize:12,color:"#908C82"}}>{p.reviews+userReviews.length} avis vérifiés</div>
    </div>
    <div style={{marginBottom:20}}>{dist.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:12,width:12}}>{5-i}</span><span style={{fontSize:12}}>⭐</span><div style={{flex:1,height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${d}%`,height:"100%",background:i===0?"#F59E0B":"#E8E6E1",borderRadius:3}}/></div><span style={{fontSize:11,color:"#908C82",width:30,textAlign:"right"}}>{d}%</span></div>)}</div>

    {/* Write review button / form */}
    {!writing?<button onClick={()=>setWriting(true)} style={{width:"100%",padding:"14px 0",borderRadius:14,border:"2px solid #6366F1",background:"rgba(99,102,241,0.04)",cursor:"pointer",fontSize:14,fontWeight:700,color:"#6366F1",fontFamily:"inherit",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>✏️ Écrire un avis</button>

    :<div style={{padding:16,background:"#fff",borderRadius:18,border:"1px solid #E8E6E1",marginBottom:20,boxShadow:"0 2px 10px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h4 style={{fontSize:15,fontWeight:700}}>Votre avis</h4>
        <span style={{fontSize:12,color:"#908C82",cursor:"pointer"}} onClick={()=>{setWriting(false);setUserRating(0);setUserText("")}}>✕ Annuler</span>
      </div>

      {/* Star selection */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Note</div>
        <div style={{display:"flex",gap:6}}>
          {[1,2,3,4,5].map(s=><button key={s} onClick={()=>setUserRating(s)} style={{width:44,height:44,borderRadius:12,border:userRating>=s?"2px solid #F59E0B":"1px solid #E8E6E1",background:userRating>=s?"rgba(245,158,11,0.08)":"#fff",cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .15s"}}>{userRating>=s?"★":"☆"}</button>)}
        </div>
        {userRating>0&&<div style={{fontSize:12,color:"#F59E0B",fontWeight:600,marginTop:6}}>{["","Mauvais","Passable","Bien","Très bien","Excellent"][userRating]}</div>}
      </div>

      {/* Comment */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:"#908C82",marginBottom:8}}>Commentaire (optionnel)</div>
        <textarea value={userText} onChange={e=>setUserText(e.target.value)} placeholder="Partagez votre expérience..." rows={3} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid #E8E6E1",fontSize:13,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
      </div>

      {/* Submit */}
      <button onClick={submitReview} disabled={userRating===0} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"none",background:userRating>0?"#6366F1":"#E8E6E1",color:userRating>0?"#fff":"#908C82",fontSize:14,fontWeight:700,cursor:userRating>0?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .2s"}}>
        {userRating===0?"Sélectionnez une note":"Publier mon avis ⭐"}
      </button>
    </div>}

    {/* Success toast */}
    {submitted&&<div style={{padding:12,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:12,marginBottom:14,display:"flex",alignItems:"center",gap:8,fontSize:13,fontWeight:600,color:"#10B981"}}>✅ Avis publié avec succès !</div>}

    {/* All reviews */}
    {allReviews.map((r,i)=><div key={i} className="review-card" style={r.name==="Moi"?{border:"2px solid rgba(99,102,241,0.2)",background:"rgba(99,102,241,0.02)"}:{}}><div className="review-top"><div className="rav">{r.avatar}</div><div style={{flex:1}}><h4 style={{fontSize:14,fontWeight:600}}>{r.name}{r.name==="Moi"&&<span style={{fontSize:10,color:"#6366F1",marginLeft:6,fontWeight:700}}>VOUS</span>}</h4></div><span className="rd">{r.date}</span></div><div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>{r.text&&<div className="review-text">{r.text}</div>}</div>)}
  </div>);
}

/* 14 ── COUPONS ── */
function CouponsScr({onBack}){
  const [copied,setCopied]=useState(null);
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Coupons & Codes</h2><div style={{width:38}}/></div>
    {COUPONS.map(c=><div key={c.id} className="coupon"><div className="coupon-left">{c.free?"🚚":`${c.discount}%`}</div><div className="coupon-right"><h4>{c.desc}</h4><p>Expire le {c.expires}{c.min>0&&` · Min. ${fmt(c.min)}`}</p><span className="cc" onClick={()=>setCopied(c.code)}>{copied===c.code?"✓ Copié !":c.code}</span></div></div>)}
  </div>);
}

/* 15 ── CART ── */
function CartScr({cart,setCart,go}){
  const sub=cart.reduce((s,c)=>s+c.product.price*c.qty,0);const del=2500;
  const updQty=(i,d)=>{const n=[...cart];n[i].qty+=d;if(n[i].qty<1)n.splice(i,1);setCart(n)};
  return(<><div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><h2>Panier ({cart.length})</h2></div>
    {cart.length===0?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:56}}>🛒</div><h3 style={{marginTop:14,fontSize:18,fontWeight:700}}>Votre panier est vide</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Découvrez nos produits</p></div>
    :cart.map((c,i)=><div key={i} className="cart-item"><div className="cart-img">{c.product.img}</div><div className="cart-info"><h4>{c.product.name}</h4><div className="cv">{c.product.vendor}</div><div className="cart-bot"><span className="cp">{fmt(c.product.price*c.qty)}</span><div className="qty"><button onClick={()=>updQty(i,-1)}>−</button><span>{c.qty}</span><button onClick={()=>updQty(i,1)}>+</button></div></div></div></div>)}
    {cart.length>0&&<div style={{marginTop:10}}><div className="coupon" style={{cursor:"pointer"}} onClick={()=>go("coupons")}><div className="coupon-left" style={{width:50,fontSize:16}}>🏷️</div><div className="coupon-right"><h4 style={{fontSize:13}}>Ajouter un code promo</h4><p>3 coupons disponibles</p></div></div></div>}
  </div>
  {cart.length>0&&<div className="cart-summary"><div className="cs-row"><span>Sous-total</span><b>{fmt(sub)}</b></div><div className="cs-row"><span>Livraison</span><b>{fmt(del)}</b></div><div className="cs-row tot"><span>Total</span><span className="ctp">{fmt(sub+del)}</span></div><button className="btn-primary" style={{marginTop:14}} onClick={()=>go("checkout")}>Passer la commande</button></div>}
  </>);
}

/* 16 ── CHECKOUT ── */
function CheckoutScr({onDone}){
  const [step,setStep]=useState(0);const [momo,setMomo]=useState("airtel");const [ok,setOk]=useState(false);
  const momos=[{k:"airtel",n:"Airtel Money",e:"🔴"},{k:"mtn",n:"MTN MoMo",e:"🟡"},{k:"kolo",n:"Kolo Pay",e:"🟣"}];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):null}>←</button><h2>Paiement</h2><div style={{width:38}}/></div>
    <div className="steps">{["Adresse","Paiement","Confirmer"].map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`sline ${step>=i?"on":""}`}/>}<div className="step-col"><div className={`sdot ${step>i?"on":step>=i?"on":""}`}>{step>i?"✓":i+1}</div><div className={`slbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:20}}>
      {step===0&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:18}}>Adresse de livraison</h3>
        <div className="field"><label>Nom complet</label><input defaultValue="Joeldy Tsina"/></div>
        <div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div>
        <div className="field"><label>Adresse</label><input placeholder="Quartier, Rue, N°"/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays</label><input defaultValue="Congo 🇨🇬"/></div></div></>}
      {step===1&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:6}}>Mode de paiement</h3><p style={{fontSize:13,color:"#908C82",marginBottom:18}}>Mobile Money</p>
        {momos.map(m=><div key={m.k} className={`momo ${momo===m.k?"on":""}`} onClick={()=>setMomo(m.k)}><span className="me">{m.e}</span><span className="mn">{m.n}</span>{momo===m.k&&<span className="mc">✓</span>}</div>)}
        <div className="field" style={{marginTop:18}}><label>Numéro</label><input placeholder="+242 06X XXX XXX"/></div></>}
      {step===2&&<><h3 style={{fontSize:18,fontWeight:700,marginBottom:18}}>Résumé</h3>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(0)}><span className="cci">📍</span><div className="ccb"><small>Livraison</small><p>Brazzaville, Congo 🇨🇬</p></div><span className="cce" style={{color:"#6366F1",fontWeight:600}}>✏️ Modifier</span></div>
        <div className="confirm-card" style={{cursor:"pointer"}} onClick={()=>setStep(1)}><span className="cci">📱</span><div className="ccb"><small>Paiement</small><p>{momos.find(m=>m.k===momo)?.n}</p></div><span className="cce" style={{color:"#6366F1",fontWeight:600}}>✏️ Modifier</span></div>
        <div style={{marginTop:16}}><div className="cs-row"><span>Sous-total</span><b>228 500 FCFA</b></div><div className="cs-row"><span>Livraison</span><b>2 500 FCFA</b></div><div className="cs-row tot"><span>Total</span><span className="ctp">231 500 FCFA</span></div></div></>}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" onClick={()=>step<2?setStep(step+1):setOk(true)}>{step===2?"Confirmer le paiement":"Continuer"}</button></div>
    {ok&&<div className="success-modal"><div className="success-box"><div className="si">✅</div><h2>Commande confirmée !</h2><p>Vérifiez votre téléphone pour le paiement.</p><div className="ref">#LMK-2026-0214</div><button className="btn-primary" onClick={onDone}>Retour à l'accueil</button></div></div>}
  </div>);
}

/* 17 ── ORDERS ── */
function OrdersScr({go}){
  const orders=[{ref:"#LMK-2026-0214",date:"14 Fév 2026",status:"En livraison",sc:"ship",total:"231 500",items:["📱 Galaxy A54","🥬 Panier Bio x3"],prog:[1,1,1,0]},{ref:"#LMK-2026-0210",date:"10 Fév 2026",status:"Livré",sc:"done",total:"42 000",items:["👜 Sac Cuir"],prog:[1,1,1,1]},{ref:"#LMK-2026-0205",date:"5 Fév 2026",status:"Livré",sc:"done",total:"18 000",items:["👔 Chemise Bogolan"],prog:[1,1,1,1]}];
  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><h2>Mes commandes</h2></div>
    {orders.map(o=><div key={o.ref} className="ocard" onClick={()=>go("orderDetail",o)}>
      <div className="ocard-h"><h4>{o.ref}</h4><span className={`ost ${o.sc}`}>{o.status}</span></div>
      <div className="odate">{o.date}</div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:10}}>{o.items.join(" · ")}</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:16,fontWeight:700,color:"#6366F1"}}>{o.total} FCFA</span>
        {o.sc==="ship"&&<button style={{padding:"6px 14px",borderRadius:8,background:"rgba(99,102,241,0.08)",fontSize:11,fontWeight:600,color:"#6366F1",cursor:"pointer",border:"none",fontFamily:"inherit"}} onClick={e=>{e.stopPropagation();go("tracking")}}>📍 Suivre</button>}
      </div>
    </div>)}
  </div>);
}

/* 18 ── ORDER DETAIL ── */
function OrderDetailScr({order:o,onBack,go}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span className={`ost ${o.sc}`} style={{fontSize:13}}>{o.status}</span><span style={{fontSize:12,color:"#908C82"}}>{o.date}</span></div>
    <div style={{marginBottom:16}}>{o.items.map((item,i)=><div key={i} style={{padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8,fontSize:14,fontWeight:500}}>{item}</div>)}</div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:16}}>
      <div className="cs-row"><span>Sous-total</span><b>{o.total} FCFA</b></div>
      <div className="cs-row"><span>Livraison</span><b>2 500 FCFA</b></div>
      <div className="cs-row tot"><span>Total</span><span className="ctp">{parseInt(o.total.replace(/\s/g,""))+2500} FCFA</span></div>
    </div>
    {o.sc==="ship"&&<button className="btn-primary" onClick={()=>go("tracking")}>📍 Suivre ma livraison</button>}
  </div>);
}

/* 19 ── TRACKING ── */
function TrackingScr({onBack,go}){
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="track-map"><div className="map-grid"/><div className="map-road"/><div className="map-route"/><div className="map-pin" style={{top:"calc(45% - 16px)",left:"13%"}}>📍</div><div className="map-driver">🛵</div><div className="map-pin" style={{top:"calc(45% - 16px)",left:"48%"}}>🏠</div><div className="map-label">🟢 En route · 12 min</div><div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div></div>
    <div className="scr" style={{padding:20}}>
      <div className="track-driver"><div className="td-av">🧑</div><div className="td-info"><h4>Patrick Moukala</h4><p>🛵 Honda PCX · BZ-4521</p><div className="td-r">⭐ 4.8 · 342 livraisons</div></div></div>
      <div className="track-actions"><button className="ta-call" onClick={()=>alert("📞 Appel...")}>📞 Appeler</button><button className="ta-chat" onClick={()=>go("chatDriver")}>💬 Discuter</button></div>
      <div className="eta-box"><h4>Livraison en cours</h4><div className="eta-bar"><div className="eta-fill" style={{width:"65%"}}/></div><div className="eta-info"><span>Départ: <b>Marché Total</b></span><span>Arrivée: <b>~12 min</b></span></div></div>
      <div className="track-detail"><span className="tdi">📦</span><div className="tdt"><h5>#LMK-2026-0214</h5><p>3 articles · 231 500 FCFA</p></div></div>
      <div className="track-detail"><span className="tdi">📍</span><div className="tdt"><h5>Retrait</h5><p>Marché Total, Brazzaville</p></div></div>
      <div className="track-detail"><span className="tdi">🏠</span><div className="tdt"><h5>Livraison</h5><p>Quartier Bacongo, Rue 14</p></div></div>
    </div>
  </div>);
}

/* 20 ── CHAT WITH DRIVER ── */
function ChatScr({onBack}){
  const [msgs,setMsgs]=useState([{from:"bot",text:"Bonjour ! Je suis Patrick, votre livreur. J'ai récupéré votre commande 🛵",time:"14:35"},{from:"user",text:"Super ! Vous arrivez dans combien de temps ?",time:"14:36"},{from:"bot",text:"Environ 12 minutes, je suis en route !",time:"14:36"}]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs([...msgs,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>{const r=["D'accord, noté ! 👍","Je suis presque arrivé !","Pas de souci !","Je vous appelle à l'arrivée.","OK, 5 minutes encore."];setMsgs(p=>[...p,{from:"bot",text:r[Math.floor(Math.random()*r.length)],time}])},1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av">🧑</div><div className="ch-info"><h4>Patrick Moukala</h4><p>🟢 En ligne</p></div><button className="ch-call">📞</button></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Écrire..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

/* 21 ── CHAT LIST ── */
function ChatListScr({go,onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Messages</h2><div style={{width:38}}/></div>
    {CHATS.map(c=><div key={c.id} className="chat-list-item" onClick={()=>go("chatDriver")}>
      <div className="cl-av">{c.avatar}</div>
      <div className="cl-info"><h4>{c.name}</h4><p>{c.lastMsg}</p></div>
      <div className="cl-meta"><span>{c.time}</span>{c.unread>0&&<div className="cl-badge">{c.unread}</div>}</div>
    </div>)}
  </div>);
}

/* 22 ── WISHLIST ── */
function WishlistScr({go,onBack,favs,toggleFav}){
  const items=P.filter(p=>favs.includes(p.id));
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mes favoris ({items.length})</h2><div style={{width:38}}/></div>
    {items.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:48,marginBottom:10}}>♡</div><h3 style={{fontSize:16,fontWeight:700}}>Aucun favori</h3><p style={{fontSize:13,color:"#908C82",marginTop:4}}>Appuyez sur ♡ pour ajouter des articles ici</p></div>
    :items.map(p=><div key={p.id} className="wish-item">
      <div className="wish-img">{p.img}</div>
      <div className="wish-info"><h4>{p.name}</h4><div className="wv">{p.va} {p.vendor}</div><div className="wp">{fmt(p.price)}</div><div className="wr">⭐ {p.rating}</div></div>
      <div className="wish-actions"><button onClick={()=>go("detail",p)}>🛍️</button><button onClick={()=>toggleFav(p.id)}>🗑️</button></div>
    </div>)}
  </div>);
}

/* 23 ── NOTIFICATIONS ── */
function NotifScr({onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications</h2><div style={{width:38}}/></div>
    {NOTIFS.map(n=><div key={n.id} className={`notif-item ${!n.read?"unread":""}`}><div className="ni-icon">{n.icon}</div><div className="ni-body"><h4>{n.title}</h4><p>{n.desc}</p><div className="ni-t">{n.time}</div></div></div>)}
  </div>);
}

/* 24 ── PROFILE ── */
function ProfileScr({go,userRole,vendorPlan,vendorStatus,driverStatus,onLogout}){
  const hasVendor=(userRole==="vendor"||userRole==="both")&&vendorStatus==="approved";
  const hasDriver=(userRole==="driver"||userRole==="both")&&driverStatus==="approved";
  const pendingVendor=(userRole==="vendor"||userRole==="both")&&vendorStatus==="pending";
  const pendingDriver=(userRole==="driver"||userRole==="both")&&driverStatus==="pending";
  const canRegister=userRole==="client"||(userRole==="vendor"&&!hasDriver)||(userRole==="driver"&&!hasVendor);
  return(<div className="scr">
    <div className="appbar"><h2>Mon Profil</h2><button onClick={()=>go("settings")}>⚙️</button></div>
    <div className="prof-card"><div className="prof-av">J</div><h3 style={{fontSize:18,fontWeight:700}}>Joeldy Tsina</h3><div style={{fontSize:12,color:"#908C82",marginTop:2}}>+242 064 663 469</div><div style={{fontSize:12,color:"#908C82"}}>joeldytsina94@gmail.com</div><div className="prof-stats"><div className="ps"><b>3</b><span>Commandes</span></div><div className="psd"/><div className="ps"><b>5</b><span>Favoris</span></div><div className="psd"/><div className="ps"><b>2</b><span>Avis</span></div></div></div>
    <div className="wallet"><div><p>Kolo Pay Wallet</p><h3>125 000 FCFA</h3></div><button onClick={()=>go("recharge")}>Recharger</button></div>

    {/* Pending status */}
    {pendingVendor&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande commerçant en cours</div><div style={{fontSize:12,color:"#908C82",marginTop:2}}>Vérification sous 24-48h. Vous serez notifié.</div></div></div></div>}
    {pendingDriver&&<div style={{margin:"0 20px 10px",padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.15)",borderRadius:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:24}}>⏳</span><div><div style={{fontSize:14,fontWeight:700,color:"#F59E0B"}}>Demande livreur en cours</div><div style={{fontSize:12,color:"#908C82",marginTop:2}}>Vérification sous 24-48h. Vous serez notifié.</div></div></div></div>}

    {/* Register CTA - only if client or can add another role */}
    {userRole==="client"&&<div className="vendor-cta" onClick={()=>go("roleReg")}><span style={{fontSize:28}}>🚀</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Devenir commerçant ou livreur</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Ouvrez votre restaurant, boutique, pharmacie...</div></div><span style={{fontSize:18}}>→</span></div>}

    {/* Approved vendor */}
    {hasVendor&&<div className="vendor-cta" style={{background:"linear-gradient(135deg,#6366F1,#A855F7)"}} onClick={()=>go("switchVendor")}><span style={{fontSize:28}}>🏪</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Espace Commerçant</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Plan {vendorPlan==="starter"?"Starter":vendorPlan==="pro"?"Pro":"Enterprise"} · Gérer mon commerce</div></div><span style={{fontSize:18}}>→</span></div>}

    {/* Approved driver */}
    {hasDriver&&<div className="vendor-cta" style={{background:"linear-gradient(135deg,#10B981,#059669)"}} onClick={()=>go("switchDriver")}><span style={{fontSize:28}}>🛵</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Espace Livreur</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Gérer mes livraisons et gains</div></div><span style={{fontSize:18}}>→</span></div>}

    {[["🛍️","Mes commandes","3",()=>go("orders")],["♡","Mes favoris","5",()=>go("wishlist")],["💬","Messages","2",()=>go("chatList")],["📍","Mes adresses","2",()=>go("addresses")],["✏️","Modifier profil","",()=>go("editProfile")],["🔔","Notifications","3",()=>go("notif")],["🌐","Langue","Français",()=>go("language")],["💱","Devise","FCFA",()=>go("currency")],["🔒","Mot de passe","",()=>go("password")],["❓","Centre d'aide","",()=>go("help")],["ℹ️","À propos","",()=>go("about")]].map(([i,t,s,fn])=><div key={t} className="menu-item" onClick={fn}><div className="mi-i">{i}</div><span className="mi-t">{t}</span>{s&&<span className="mi-s">{s}</span>}<span className="mi-c">›</span></div>)}
    <button style={{margin:"16px 20px 80px",width:"calc(100% - 40px)",padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>
  </div>);
}

/* 25 ── EDIT PROFILE ── */
function EditProfileScr({onBack}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Modifier profil</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}><div className="prof-av" style={{margin:"0 auto 10px"}}>J</div><span style={{fontSize:13,color:"#6366F1",fontWeight:600,cursor:"pointer"}}>Changer la photo</span></div>
    <div className="field"><label>Nom</label><input defaultValue="Joeldy Tsina"/></div>
    <div className="field"><label>Email</label><input defaultValue="joeldytsina94@gmail.com"/></div>
    <div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div>
    <div className="field-row"><div className="field"><label>Ville</label><input defaultValue="Brazzaville"/></div><div className="field"><label>Pays</label><input defaultValue="Congo 🇨🇬"/></div></div>
    <div className="field"><label>Bio</label><textarea rows={3} defaultValue="Fondateur de Lamuka Tech 🇨🇬"/></div>
    <button className="btn-primary">Enregistrer</button>
  </div>);
}

/* 26 ── ADDRESSES ── */
function AddressesScr({onBack}){
  const [addrs,setAddrs]=useState(ADDRS.map(a=>({...a})));
  const [adding,setAdding]=useState(false);
  const remove=id=>setAddrs(addrs.filter(a=>a.id!==id));
  const setDefault=id=>setAddrs(addrs.map(a=>({...a,def:a.id===id})));
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mes adresses</h2><div style={{width:38}}/></div>
    {addrs.map(a=><div key={a.id} className={`addr-card ${a.def?"def":""}`}>
      <div className="ai">{a.def?"🏠":"🏢"}</div>
      <div className="ab"><h4>{a.label}{a.def&&<span className="def-badge">Par défaut</span>}</h4><p>{a.addr}<br/>{a.city}, Congo</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {!a.def&&<button style={{padding:"4px 8px",borderRadius:6,border:"1px solid #E8E6E1",background:"#fff",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setDefault(a.id)}>Par défaut</button>}
        <button style={{padding:"4px 8px",borderRadius:6,border:"1px solid rgba(239,68,68,.2)",background:"#fff",fontSize:10,color:"#EF4444",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>remove(a.id)}>Supprimer</button>
      </div>
    </div>)}
    {adding&&<div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
      <div className="field"><label>Nom</label><input placeholder="Ex: Bureau"/></div>
      <div className="field"><label>Adresse</label><input placeholder="Rue, numéro..."/></div>
      <div className="field-row"><div className="field"><label>Quartier</label><input placeholder="Bacongo"/></div><div className="field"><label>Ville</label><input placeholder="Brazzaville"/></div></div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAdding(false)}>Annuler</button>
        <button className="btn-primary" style={{flex:1}} onClick={()=>setAdding(false)}>Enregistrer</button>
      </div>
    </div>}
    {!adding&&<button className="btn-outline" style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setAdding(true)}>+ Ajouter une adresse</button>}
  </div>);
}

/* ── LANGUAGE ── */
function LanguageScr({onBack}){
  const [lang,setLang]=useState("fr");
  const langs=[["fr","🇫🇷","Français"],["en","🇬🇧","English"],["ln","🇨🇬","Lingala"],["kg","🇨🇬","Kikongo"]];
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Langue</h2><div style={{width:38}}/></div>
    {langs.map(([k,f,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:lang===k?"2px solid #6366F1":"1px solid #E8E6E1"}} onClick={()=>setLang(k)}><span style={{fontSize:22}}>{f}</span><span className="si-t">{n}</span>{lang===k&&<span style={{color:"#6366F1",fontWeight:700}}>✓</span>}</div>)}
    <button className="btn-primary" style={{marginTop:14}} onClick={onBack}>Enregistrer</button>
  </div>);
}

/* ── CURRENCY ── */
function CurrencyScr({onBack}){
  const [cur,setCur]=useState("XAF");
  const curs=[["XAF","🇨🇬","Franc CFA (FCFA)"],["USD","🇺🇸","Dollar US ($)"],["EUR","🇪🇺","Euro (€)"]];
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Devise</h2><div style={{width:38}}/></div>
    {curs.map(([k,f,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:cur===k?"2px solid #6366F1":"1px solid #E8E6E1"}} onClick={()=>setCur(k)}><span style={{fontSize:22}}>{f}</span><span className="si-t">{n}</span>{cur===k&&<span style={{color:"#6366F1",fontWeight:700}}>✓</span>}</div>)}
    <div className="info-box yellow" style={{marginTop:14}}><span>💡</span><span>Les prix seront convertis automatiquement. Taux de référence : BEAC.</span></div>
    <button className="btn-primary" style={{marginTop:14}} onClick={onBack}>Enregistrer</button>
  </div>);
}

/* ── PASSWORD ── */
function PasswordScr({onBack}){
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mot de passe</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Mot de passe modifié</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Votre mot de passe a été mis à jour avec succès.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>OK</button></div>
  </div>);
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mot de passe</h2><div style={{width:38}}/></div>
    <div className="field"><label>Mot de passe actuel</label><input type="password" placeholder="••••••••"/></div>
    <div className="field"><label>Nouveau mot de passe</label><input type="password" placeholder="Min. 8 caractères"/></div>
    <div className="field"><label>Confirmer</label><input type="password" placeholder="Répéter le mot de passe"/></div>
    <button className="btn-primary" style={{marginTop:10}} onClick={()=>setDone(true)}>Modifier le mot de passe</button>
  </div>);
}

/* ── RECHARGE WALLET ── */
function RechargeScr({onBack}){
  const [method,setMethod]=useState(null);const [amount,setAmount]=useState("");const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Rechargement réussi</h3><p style={{fontSize:14,color:"#10B981",fontWeight:700,marginTop:8}}>{fmt(parseInt(amount)||0)} ajoutés</p><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Votre solde Kolo Pay a été mis à jour.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>OK</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Recharger Kolo Pay</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div className="field"><label>Montant (FCFA)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex: 10000"/></div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{[5000,10000,25000,50000].map(v=><button key={v} style={{flex:1,padding:10,borderRadius:10,border:amount===String(v)?"2px solid #6366F1":"1px solid #E8E6E1",background:amount===String(v)?"rgba(99,102,241,0.04)":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAmount(String(v))}>{fmt(v)}</button>)}</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Moyen de paiement</div>
      {[["airtel","📱","Airtel Money"],["mtn","📱","MTN MoMo"],["kolo","🟣","Kolo Pay"]].map(([k,i,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:method===k?"2px solid #6366F1":"1px solid #E8E6E1",marginBottom:6}} onClick={()=>setMethod(k)}><span style={{fontSize:20}}>{i}</span><span className="si-t">{n}</span>{method===k&&<span style={{color:"#6366F1",fontWeight:700}}>✓</span>}</div>)}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" style={{background:amount&&method?"#6366F1":"#E8E6E1",color:amount&&method?"#fff":"#908C82"}} onClick={()=>amount&&method&&setDone(true)}>Recharger {amount?fmt(parseInt(amount)):""}</button></div>
  </div>);
}

/* ── WITHDRAW (shared vendor/driver) ── */
function WithdrawScr({onBack,mode}){
  const [method,setMethod]=useState(null);const [amount,setAmount]=useState("");const [done,setDone]=useState(false);
  const color=mode==="driver"?"#10B981":"#6366F1";
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Demande envoyée</h3><p style={{fontSize:14,color,fontWeight:700,marginTop:8}}>{fmt(parseInt(amount)||0)}</p><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Versement sous 24-48h sur votre compte.</p><button className="btn-primary" style={{marginTop:20,background:color}} onClick={onBack}>OK</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Retrait</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div className="field"><label>Montant (FCFA)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex: 50000"/></div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{[10000,25000,50000,100000].map(v=><button key={v} style={{flex:1,padding:10,borderRadius:10,border:amount===String(v)?`2px solid ${color}`:"1px solid #E8E6E1",background:amount===String(v)?`${color}08`:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAmount(String(v))}>{fmt(v)}</button>)}</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Retirer vers</div>
      {[["airtel","📱","Airtel Money","06X XXX XXX"],["mtn","📱","MTN MoMo","06X XXX XXX"],["kolo","🟣","Kolo Pay","06X XXX XXX"]].map(([k,i,n,p])=><div key={k} className="setting-item" style={{cursor:"pointer",border:method===k?`2px solid ${color}`:"1px solid #E8E6E1",marginBottom:6}} onClick={()=>setMethod(k)}><span style={{fontSize:20}}>{i}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{n}</div><div style={{fontSize:11,color:"#908C82"}}>{p}</div></div>{method===k&&<span style={{color,fontWeight:700}}>✓</span>}</div>)}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" style={{background:amount&&method?color:"#E8E6E1",color:amount&&method?"#fff":"#908C82"}} onClick={()=>amount&&method&&setDone(true)}>Retirer {amount?fmt(parseInt(amount)):""}</button></div>
  </div>);
}

/* 27 ── SETTINGS ── */
function SettingsScr({onBack,go}){
  const [notif,setNotif]=useState(true);const [dark,setDark]=useState(false);const [bio,setBio]=useState(true);
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div className="setting-group"><h4>Général</h4>
      <div className="setting-item" onClick={()=>go("language")} style={{cursor:"pointer"}}><span className="si-i">🌐</span><span className="si-t">Langue</span><span className="si-v">Français</span><span style={{color:"#908C82"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("currency")} style={{cursor:"pointer"}}><span className="si-i">💰</span><span className="si-t">Devise</span><span className="si-v">FCFA</span><span style={{color:"#908C82"}}>›</span></div>
      <div className="setting-item"><span className="si-i">🌙</span><span className="si-t">Mode sombre</span><div className={`toggle ${dark?"on":""}`} onClick={()=>setDark(!dark)}/></div>
    </div>
    <div className="setting-group"><h4>Notifications</h4>
      <div className="setting-item"><span className="si-i">🔔</span><span className="si-t">Push notifications</span><div className={`toggle ${notif?"on":""}`} onClick={()=>setNotif(!notif)}/></div>
      <div className="setting-item"><span className="si-i">📧</span><span className="si-t">Email notifications</span><div className="toggle on"/></div>
    </div>
    <div className="setting-group"><h4>Sécurité</h4>
      <div className="setting-item"><span className="si-i">🔒</span><span className="si-t">Authentification biométrique</span><div className={`toggle ${bio?"on":""}`} onClick={()=>setBio(!bio)}/></div>
      <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔑</span><span className="si-t">Changer le mot de passe</span><span style={{color:"#908C82"}}>›</span></div>
    </div>
    <div className="setting-group"><h4>Légal</h4>
      <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📄</span><span className="si-t">Conditions générales</span><span style={{color:"#908C82"}}>›</span></div>
      <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span style={{color:"#908C82"}}>›</span></div>
    </div>
  </div>);
}

/* 28 ── HELP / FAQ ── */
function HelpScr({onBack}){
  const [open,setOpen]=useState(null);
  const faqs=[{q:"Comment passer une commande ?",a:"Parcourez les commerces et produits, ajoutez au panier, puis payez via Mobile Money (Airtel, MTN)."},{q:"Quels sont les délais de livraison ?",a:"1-3 jours ouvrés à Brazzaville, 3-5 jours à Pointe-Noire. Restos et pâtisseries : 30-60 min. Suivi en temps réel disponible."},{q:"Comment ouvrir mon commerce ?",a:"Profil → Devenir commerçant. Choisissez votre type (restaurant, boutique, pharmacie...), remplissez le formulaire et soumettez vos documents."},{q:"Comment contacter le support ?",a:"Email : joeldytsina94@gmail.com\nWhatsApp : +242 064 663 469\nOu via le chat Lamu AI sur notre site."},{q:"Puis-je annuler une commande ?",a:"Oui, avant l'expédition. Depuis Commandes → Détail → Annuler. Le remboursement est effectué sous 48h."}];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Centre d'aide</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 14px"}}><div className="sbar">🔍 <input placeholder="Rechercher une question..."/></div></div>
    {faqs.map((f,i)=><div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}>
      <div className="faq-q">{f.q}<span className={open===i?"open":""}>+</span></div>
      {open===i&&<div className="faq-a">{f.a}</div>}
    </div>)}
    <div style={{padding:20}}><div className="info-box blue"><span>💬</span><span>Besoin d'aide ? Contactez-nous sur WhatsApp au +242 064 663 469</span></div></div>
  </div>);
}

/* 29 ── ABOUT ── */
function AboutScr({onBack}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>À propos</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:56,marginBottom:8}}>🛒</div><h2 style={{fontSize:22,fontWeight:700}}>Lamuka Marketplace</h2><p style={{fontSize:13,color:"#908C82"}}>Version 1.0.0</p></div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}><p style={{fontSize:14,color:"#5E5B53",lineHeight:1.7}}>Lamuka est une plateforme multi-commerce congolaise développée par <b>Lamuka Tech</b>. Notre mission : connecter les commerces locaux — restaurants, boutiques, pharmacies, pâtisseries, supermarchés et services — aux consommateurs avec livraison rapide et paiement Mobile Money.</p></div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      {[["👨‍💻","Développeur","Joeldy Tsina"],["📍","Localisation","Brazzaville, Congo 🇨🇬"],["📧","Email","joeldytsina94@gmail.com"],["📱","WhatsApp","+242 064 663 469"],["🌐","GitHub","github.com/J0312Y"]].map(([i,l,v])=><div key={l} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F4F1",fontSize:13}}><span>{i}</span><span style={{color:"#908C82"}}>{l}</span><span style={{marginLeft:"auto",fontWeight:600}}>{v}</span></div>)}
    </div>
    <p style={{textAlign:"center",fontSize:12,color:"#908C82"}}>Fait avec ❤️ au Congo 🇨🇬</p>
  </div>);
}

/* 30 ── VENDOR PROFILE ── */
function VendorScr({vendor:v,go,onBack}){
  const [following,setFollowing]=useState(false);
  const [fCount,setFC]=useState(v.followers);
  const vp=P.filter(p=>p.vendor===v.name);
  const toggleFollow=()=>{setFollowing(f=>!f);setFC(c=>following?c-1:c+1)};
  return(<div className="scr">
    <div className="vp-head"><div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:16,cursor:"pointer"}}>←</button></div>
      <div className="vp-av">{v.avatar}</div><h2 style={{fontSize:20,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>{v.name}{v.verified&&<span style={{fontSize:14}}>✓</span>}</h2><p style={{fontSize:12,opacity:.7,marginTop:3}}>📍 {v.loc}</p></div>
    <div className="vp-stats"><div className="vps r"><div className="vsi">⭐</div><b>{v.rating}</b><span>Note</span></div><div className="vps p"><div className="vsi">🛍️</div><b>{v.products}</b><span>Produits</span></div><div className="vps f"><div className="vsi">👥</div><b>{fCount}</b><span>Abonnés</span></div></div>
    <div style={{padding:"0 20px",fontSize:14,color:"#5E5B53",marginBottom:14,lineHeight:1.6}}>{v.desc}</div>
    <div className="vp-btns"><button className="vb1" style={following?{background:"#fff",color:"#6366F1",border:"1px solid #6366F1"}:{}} onClick={toggleFollow}>{following?"✓ Suivi":"+ Suivre"}</button><button className="vb2" onClick={()=>go("chatVendor",v)}>💬 Contacter</button></div>
    <div style={{padding:"0 20px",marginBottom:14}}><h3 style={{fontSize:16,fontWeight:700}}>Produits ({vp.length})</h3></div>
    <div className="pgrid">{vp.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><span className="pe">{p.img}</span>{disc(p)>0&&<span className="badge">-{disc(p)}%</span>}</div><div className="pbody"><h4>{p.name}</h4><div className="pp">{fmt(p.price)}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating}</div></div></div>)}</div>
  </div>);
}

/* 31 ── VENDOR REGISTRATION ── */
function RoleRegScr({onBack,onDone,forceRole}){
  const [role,setRole]=useState(forceRole||null); // "vendor" | "driver"
  const [step,setStep]=useState(forceRole?0:-1);
  const [plan,setPlan]=useState("starter");
  const [selCats,setSC]=useState(["Mode"]);
  const [docs,setDocs]=useState({});
  const [ok,setOk]=useState(false);
  const toggleCat=c=>setSC(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);

  const vendorSteps=["Infos","Établissement","Documents","Plan","Résumé"];
  const driverSteps=["Infos","Véhicule","Documents","Résumé"];
  const steps=role==="vendor"?vendorSteps:driverSteps;
  const maxStep=steps.length-1;

  // Success screen
  if(ok)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}><div style={{textAlign:"center",padding:"40px 20px"}}>
    <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:40}}>🎉</div>
    <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>{role==="vendor"?"Bienvenue sur Lamuka !":"Bienvenue livreur !"}</h2>
    <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.6}}>Votre demande a été soumise. Vérification sous 24-48h.</p>
    <p style={{fontSize:13,color:"#908C82",marginTop:4}}>Vous recevrez : notification, message in-app, et email de confirmation.</p>
    <div style={{fontSize:13,color:"#6366F1",fontWeight:600,margin:"16px 0"}}>#{role==="vendor"?"VND":"DRV"}-2026-{String(Math.floor(Math.random()*9000+1000))}</div>
    {role==="vendor"&&<div style={{padding:10,background:"rgba(99,102,241,0.04)",borderRadius:12,fontSize:12,color:"#6366F1",fontWeight:600,marginBottom:10}}>Plan {plan==="starter"?"Starter (Gratuit)":plan==="pro"?"Pro (15k/mois)":"Enterprise (45k/mois)"}</div>}
    <button className="btn-primary" style={{maxWidth:300,margin:"0 auto"}} onClick={()=>onDone(role,role==="vendor"?plan:null)}>✅ Compris</button>
  </div></div>);

  // Role selection
  if(step===-1)return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Rejoindre Lamuka</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <p style={{fontSize:14,color:"#5E5B53",marginBottom:20,lineHeight:1.6}}>Choisissez le rôle que vous souhaitez ajouter à votre compte :</p>
      <div onClick={()=>{setRole("vendor");setStep(0);setDocs({id:false,rccm:false,photo:false})}} style={{padding:20,background:"#fff",border:"2px solid #E8E6E1",borderRadius:20,marginBottom:14,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🏪</div><div><h3 style={{fontSize:18,fontWeight:700}}>Commerçant</h3><p style={{fontSize:12,color:"#908C82"}}>Ouvrez votre commerce sur Lamuka</p></div></div>
        <div style={{fontSize:12,color:"#5E5B53",lineHeight:1.6}}>Restaurant, boutique, pâtisserie, supermarché, pharmacie ou service — vendez et recevez des commandes.</div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["🍽️ Resto","🏪 Boutique","🧁 Pâtisserie","🛒 Supermarché","💊 Pharma","🔧 Service"].map(f=><span key={f} style={{padding:"4px 10px",borderRadius:8,background:"rgba(99,102,241,0.06)",color:"#6366F1",fontSize:10,fontWeight:600}}>{f}</span>)}</div>
      </div>
      <div onClick={()=>{setRole("driver");setStep(0);setDocs({id:false,permit:false,vehicle:false})}} style={{padding:20,background:"#fff",border:"2px solid #E8E6E1",borderRadius:20,cursor:"pointer",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}><div style={{width:56,height:56,borderRadius:16,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🛵</div><div><h3 style={{fontSize:18,fontWeight:700}}>Livreur</h3><p style={{fontSize:12,color:"#908C82"}}>Livrez et gagnez de l'argent</p></div></div>
        <div style={{fontSize:12,color:"#5E5B53",lineHeight:1.6}}>Effectuez des livraisons dans votre zone. Choisissez vos horaires, suivez vos gains en temps réel.</div>
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>{["Horaires flexibles","Gains en temps réel","GPS intégré","Pourboires"].map(f=><span key={f} style={{padding:"4px 10px",borderRadius:8,background:"rgba(16,185,129,0.06)",color:"#10B981",fontSize:10,fontWeight:600}}>{f}</span>)}</div>
      </div>
    </div>
  </div>);

  // Multi-step form
  const color=role==="vendor"?"#6366F1":"#10B981";

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):forceRole?onBack():setStep(-1)}>←</button><h2>{role==="vendor"?"Devenir Commerçant":"Devenir Livreur"}</h2><div style={{width:38}}/></div>
    <div className="vr-steps">{steps.map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`vr-line ${step>=i?"on":""}`} style={step>=i?{background:color}:{}}/>}<div className="step-col"><div className={`vr-dot ${step>i?"done":step>=i?"on":""}`} style={step>=i?{background:color,color:"#fff"}:{}}>{step>i?"✓":i+1}</div><div className={`vr-lbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:20}}>

      {/* STEP 0: Infos personnelles (both) */}
      {step===0&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Informations personnelles</h3>
        <div className="field"><label>Nom complet</label><input placeholder="Joeldy Tsina"/></div>
        <div className="field"><label>Email</label><input placeholder="joeldytsina94@gmail.com"/></div>
        <div className="field"><label>Téléphone</label><input placeholder="+242 064 663 469"/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input placeholder="Brazzaville"/></div><div className="field"><label>Quartier</label><input placeholder="Bacongo"/></div></div>
      </>}

      {/* STEP 1 VENDOR: Établissement */}
      {step===1&&role==="vendor"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Votre Établissement</h3>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"#5E5B53",marginBottom:8}}>Type de commerce</label>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
          {[["🏪","Boutique"],["🍽️","Restaurant"],["🧁","Pâtisserie"],["🛒","Supermarché"],["💊","Pharmacie"],["🔧","Service"]].map(([i,t])=><div key={t} onClick={()=>setSelCats(p=>p.includes(t)?p.filter(x=>x!==t):[...p.filter(x=>!["Boutique","Restaurant","Pâtisserie","Supermarché","Pharmacie","Service"].includes(x)),t])} style={{padding:10,borderRadius:12,border:selCats.includes(t)?"2px solid #6366F1":"1px solid #E8E6E1",background:selCats.includes(t)?"rgba(99,102,241,0.04)":"#fff",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
            <div style={{fontSize:20}}>{i}</div>
            <div style={{fontSize:10,fontWeight:600,color:selCats.includes(t)?"#6366F1":"#908C82",marginTop:2}}>{t}</div>
          </div>)}
        </div>
        <div className="vr-upload"><div className="vu-icon">🖼️</div><b>Logo / Photo</b><p>PNG, JPG · Max 2MB</p></div>
        <div className="field"><label>Nom de l'établissement</label><input placeholder="Ex: Chez Mama Ngudi, Congo Tech..."/></div>
        <div className="field"><label>Description</label><input placeholder="Votre activité, spécialités..."/></div>
        <label style={{display:"block",fontSize:12,fontWeight:600,color:"#5E5B53",margin:"14px 0 8px"}}>Sous-catégories</label>
        <div className="vr-cat-grid">{CATS.map(c=><div key={c.id} className={`vr-cat ${selCats.includes(c.name)?"on":""}`} onClick={()=>toggleCat(c.name)}><div className="vci">{c.icon}</div><div className="vcn">{c.name}</div></div>)}</div>
      </>}

      {/* STEP 1 DRIVER: Véhicule */}
      {step===1&&role==="driver"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Votre Véhicule</h3>
        <div className="field"><label>Type de véhicule</label><select><option value="moto">🛵 Moto</option><option value="voiture">🚗 Voiture</option><option value="velo">🚲 Vélo</option></select></div>
        <div className="field-row"><div className="field"><label>Marque</label><input placeholder="Honda PCX"/></div><div className="field"><label>Année</label><input placeholder="2023"/></div></div>
        <div className="field-row"><div className="field"><label>Plaque</label><input placeholder="BZ-4521"/></div><div className="field"><label>Couleur</label><input placeholder="Noir"/></div></div>
        <div style={{fontSize:14,fontWeight:700,margin:"14px 0 10px"}}>Zones de livraison</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Brazzaville Sud","Centre-ville","Brazzaville Nord","Pointe-Noire"].map(z=><span key={z} style={{padding:"8px 14px",borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{z}</span>)}</div>
      </>}

      {/* STEP 2: Documents (different per role) */}
      {step===2&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Documents requis</h3>
        {role==="vendor"?
          [["🪪","Pièce d'identité","Carte nationale ou passeport","id"],["📄","RCCM / Patente","Registre de commerce (optionnel)","rccm"],["📸","Photo de l'établissement","Votre espace de vente","photo"]].map(([i,t,d,k])=>
            <div key={k} className="vr-doc" onClick={()=>setDocs({...docs,[k]:true})}><span className="vdi">{i}</span><div className="vdt"><h5>{t}</h5><p>{d}</p></div><span className={`vds ${docs[k]?"up":"pend"}`}>{docs[k]?"✓ Envoyé":"À envoyer"}</span></div>)
          :[["🪪","Pièce d'identité","Carte nationale ou passeport","id"],["🪪","Permis de conduire","Obligatoire pour moto/voiture","permit"],["📸","Photo du véhicule","Vue claire du véhicule","vehicle"]].map(([i,t,d,k])=>
            <div key={k} className="vr-doc" onClick={()=>setDocs({...docs,[k]:true})}><span className="vdi">{i}</span><div className="vdt"><h5>{t}</h5><p>{d}</p></div><span className={`vds ${docs[k]?"up":"pend"}`}>{docs[k]?"✓ Envoyé":"À envoyer"}</span></div>)
        }
      </>}

      {/* STEP 3 VENDOR: Plan (only vendor) */}
      {step===3&&role==="vendor"&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Choisir un plan</h3>
        {[["starter","Starter","Gratuit","Pour démarrer",["10 articles max","8% commission","Support email","Stats basiques"]],
          ["pro","Pro","15 000 FCFA/mois","Articles illimités",["Articles illimités","4% commission","Analytics avancés","Badge vérifié ✓","Support prioritaire"]],
          ["enterprise","Enterprise","45 000 FCFA/mois","Multi-établissements",["Multi-établissements","2% commission","API complète","Manager dédié","Dashboard personnalisé"]]
        ].map(([k,n,pr,d,f])=><div key={k} className={`vr-plan ${plan===k?"on":""}`} onClick={()=>setPlan(k)} style={plan===k?{borderColor:color}:{}}>
          <h4>{n}<span>{pr}</span></h4><p>{d}</p>
          <div className="vrf">{f.map(x=><span key={x}>✓ {x}</span>)}</div>
          {k==="starter"&&<div className="info-box yellow" style={{margin:"8px 0 0",padding:"6px 10px"}}><span style={{fontSize:12}}>💡</span><span style={{fontSize:11}}>Limitations : 10 articles, pas d'analytics avancés, pas de badge</span></div>}
        </div>)}
      </>}

      {/* LAST STEP: Résumé */}
      {step===maxStep&&<><h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Résumé</h3>
        <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
          {[["Rôle",role==="vendor"?"🏪 Commerçant":"🛵 Livreur"],
            ["Nom","Joeldy Tsina"],
            ...(role==="vendor"?[["Établissement","Mon Commerce"],["Type & Catégories",selCats.join(", ")||"—"]]:[["Véhicule","🛵 Honda PCX"],["Plaque","BZ-4521"]]),
            ["Documents",`${Object.values(docs).filter(Boolean).length}/${Object.keys(docs).length}`],
            ...(role==="vendor"?[["Plan",plan==="starter"?"Starter (Gratuit)":plan==="pro"?"Pro (15k/mois)":"Enterprise (45k/mois)"]]:[])]
          .map(([l,v])=><div key={l} className="vs-row"><span>{l}</span><b>{v}</b></div>)}
        </div>
        <div className="info-box green"><span>✅</span><span>{role==="vendor"?"En soumettant, vous acceptez les CGV de Lamuka Marketplace.":"Votre demande sera vérifiée sous 24-48h. Vous serez notifié par SMS, email et notification."}</span></div>
      </>}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      <button className="btn-primary" style={{background:color}} onClick={()=>step<maxStep?setStep(step+1):setOk(true)}>{step===maxStep?"🚀 Soumettre la demande":"Continuer"}</button>
    </div>
  </div>);
}

/* ═══════════════════════════════
   VENDOR SCREENS (15)
   ═══════════════════════════════ */

/* V1 ── VENDOR DASHBOARD ── */
function VDashboardScr({go}){
  const [period,setPeriod]=useState("week");
  const d=period==="today"?V_STATS.today:period==="week"?V_STATS.week:V_STATS.month;
  const maxBar=Math.max(...V_STATS.chartWeek);
  const days=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const newOrders=V_ORDERS.filter(o=>o.status==="new").length;
  return(<div className="scr">
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 0"}}><div><div style={{fontSize:12,color:"#908C82"}}>Bonjour 👋</div><div style={{fontSize:20,fontWeight:700,letterSpacing:-.5}}>Mon Commerce</div></div><div className="hdr-r"><div className="hdr-btn" onClick={()=>go("vNotif")}>🔔{newOrders>0&&<div className="notif-badge"/>}</div></div></div>
    <div className="vd-period" style={{marginTop:14}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats">
      <div className="vd-stat"><div className="vs-icon">💰</div><div className="vs-val">{fmt(d.revenue)}</div><div className="vs-lbl">Chiffre d'affaires</div><div className="vs-trend up">↑ 23%</div></div>
      <div className="vd-stat"><div className="vs-icon">📦</div><div className="vs-val">{d.orders}</div><div className="vs-lbl">Commandes</div>{newOrders>0&&<div className="vs-trend up">{newOrders} nouvelle{newOrders>1?"s":""}</div>}</div>
      <div className="vd-stat"><div className="vs-icon">👁️</div><div className="vs-val">{d.visitors}</div><div className="vs-lbl">Visiteurs</div><div className="vs-trend up">↑ 12%</div></div>
      <div className="vd-stat"><div className="vs-icon">⭐</div><div className="vs-val">4.6</div><div className="vs-lbl">Note moyenne</div><div className="vs-trend up">↑ 0.2</div></div>
    </div>
    <div className="vd-chart"><h4>Ventes de la semaine <span onClick={()=>go("vStats")}>Voir tout →</span></h4><div className="chart-bars">{V_STATS.chartWeek.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`}}><div className="cb-tip">{fmt(v*1000)}</div></div>)}</div><div className="chart-labels">{days.map(d=><span key={d}>{d}</span>)}</div></div>
    <div className="vd-top"><h4>Top Produits</h4>{V_STATS.topProducts.map((p,i)=><div key={i} className="vd-top-item"><div className={`rank ${i===0?"g":""}`}>{i+1}</div><div className="ti-info"><h5>{p.name}</h5><p>{p.sold} vendus</p></div><div className="ti-rev">{fmt(p.revenue)}</div></div>)}</div>
    <div style={{padding:"16px 20px"}}><div className="info-box yellow"><span>⚠️</span><span><b>Sac à Main Cuir</b> — Stock faible (3 restants). <b style={{color:"#6366F1",cursor:"pointer"}} onClick={()=>go("vProducts")}>Réapprovisionner →</b></span></div></div>
  </div>);
}

/* V2 ── VENDOR ORDERS LIST ── */
function VOrdersScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const statusMap={new:"Nouvelle",preparing:"En préparation",shipped:"Expédiée",delivered:"Livrée"};
  const counts={all:V_ORDERS.length,new:V_ORDERS.filter(o=>o.status==="new").length,preparing:V_ORDERS.filter(o=>o.status==="preparing").length,shipped:V_ORDERS.filter(o=>o.status==="shipped").length,delivered:V_ORDERS.filter(o=>o.status==="delivered").length};
  const filtered=filter==="all"?V_ORDERS:V_ORDERS.filter(o=>o.status===filter);
  return(<div className="scr">
    <div className="appbar">{onBack&&<button onClick={onBack}>←</button>}<h2>Commandes</h2><button onClick={()=>go("vNotif")}>🔔</button></div>
    <div className="vo-filter">{[["all","Toutes"],["new","🆕 Nouvelles"],["preparing","⏳ En prép."],["shipped","🚚 Expédiées"],["delivered","✅ Livrées"]].map(([k,l])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l} ({counts[k]})</button>)}</div>
    <div style={{padding:"0 20px 100px"}}>{filtered.map(o=><div key={o.id} className="vo-card" onClick={()=>go("vOrderDetail",o)}>
      <div className="vo-head"><h4>{o.ref}</h4><span className={`vo-status ${o.status}`}>{statusMap[o.status]}</span></div>
      <div className="vo-client">👤 {o.client}</div><div className="vo-date">{o.date} · {o.payment}</div>
      <div className="vo-items">{o.items.map((it,i)=><span key={i} className="vo-item">{it.img} {it.name} x{it.qty}</span>)}</div>
      <div className="vo-foot"><span className="vo-total">{fmt(o.total)}</span><span className="vo-pay">{o.payment}</span></div>
    </div>)}</div>
  </div>);
}

/* V3 ── VENDOR ORDER DETAIL ── */
function VOrderDetailScr({order:o,onBack,go}){
  const [status,setStatus]=useState(o.status);
  const [showRefuse,setShowRefuse]=useState(false);
  const statusMap={new:"Nouvelle",preparing:"En préparation",shipped:"Expédiée",delivered:"Livrée",refused:"Refusée"};
  const next={new:"preparing",preparing:"shipped",shipped:"delivered"};
  const nextLabel={new:"✅ Accepter",preparing:"📦 Marquer prête",shipped:"🚚 Confirmer livraison"};

  if(status==="refused")return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"40px 0"}}><div style={{width:70,height:70,borderRadius:"50%",background:"rgba(239,68,68,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32}}>✕</div>
      <h3 style={{fontSize:18,fontWeight:700,color:"#EF4444"}}>Commande refusée</h3>
      <p style={{fontSize:13,color:"#908C82",marginTop:6}}>{o.ref} · {o.client}</p>
      <p style={{fontSize:12,color:"#908C82",marginTop:4}}>Le client sera notifié et remboursé.</p>
      <button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour aux commandes</button>
    </div>
  </div>);

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span className={`vo-status ${status}`} style={{fontSize:13}}>{statusMap[status]}</span><span style={{fontSize:12,color:"#908C82"}}>{o.date}</span></div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>👤 Client</div>
      {[["Nom",o.client],["Téléphone",o.phone],["Adresse",o.addr],["Paiement",o.payment]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F5F4F1",fontSize:13}}><span style={{color:"#908C82"}}>{l}</span><b>{v}</b></div>)}
    </div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📦 Articles</div>
      {o.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #F5F4F1"}}><span style={{fontSize:24}}>{it.img}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{it.name}</div><div style={{fontSize:11,color:"#908C82"}}>x{it.qty}</div></div><div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>{fmt(it.price*it.qty)}</div></div>)}
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,fontSize:16,fontWeight:700}}><span>Total</span><span style={{color:"#6366F1"}}>{fmt(o.total)}</span></div>
    </div>

    {/* Refuse confirmation */}
    {showRefuse&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:8}}>⚠️ Confirmer le refus ?</div>
      <p style={{fontSize:12,color:"#5E5B53",marginBottom:12}}>Le client sera notifié et remboursé automatiquement. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRefuse(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setStatus("refused")}>✕ Confirmer le refus</button>
      </div>
    </div>}

    {status!=="delivered"&&!showRefuse&&<div className="vo-actions">
      <button className={status==="new"?"vo-accept":status==="preparing"?"vo-prepare":"vo-ship"} onClick={()=>setStatus(next[status])}>{nextLabel[status]}</button>
      {status==="new"&&<button className="vo-reject" onClick={()=>setShowRefuse(true)}>✕ Refuser</button>}
    </div>}
    {(status==="preparing"||status==="shipped")&&<button style={{marginTop:10,width:"100%",padding:12,borderRadius:14,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vAssignDriver",{...o,currentStatus:status})}>🚚 Assigner un livreur</button>}
  </div>);
}

/* V4 ── VENDOR PRODUCTS ── */
function VProductsScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const [products,setProducts]=useState(V_PRODUCTS.map(p=>({...p})));
  const toggleActive=(id,e)=>{e.stopPropagation();setProducts(ps=>ps.map(p=>p.id===id?{...p,active:!p.active}:p))};
  const filtered=filter==="all"?products:filter==="active"?products.filter(p=>p.active&&p.stock>0):filter==="low"?products.filter(p=>p.stock>0&&p.stock<=5):products.filter(p=>p.stock===0);
  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Mes Articles ({products.length})</h2><button onClick={()=>go("vAddProduct")}>+</button></div>
    <div className="vo-filter">{[["all","Tous"],["active","Actifs"],["low","Stock faible"],["out","Rupture"]].map(([k,l])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l}</button>)}</div>
    <div style={{padding:"0 20px 100px"}}>{filtered.map(p=><div key={p.id} className="vp-card" onClick={()=>go("vEditProduct",p)}>
      <div className="vp-img">{p.img}</div>
      <div className="vp-info"><h4>{p.name}</h4><div className="vp-meta"><span>{p.cat}</span><span>{p.sold} vendus</span></div><div className="vp-price">{fmt(p.price)}</div><div className={`vp-stock ${p.stock===0?"out":p.stock<=5?"low":"ok"}`}>{p.stock===0?"⛔ Rupture":p.stock<=5?`⚠️ ${p.stock} restants`:`✅ ${p.stock} en stock`}</div></div>
      <div className="vp-toggle" onClick={e=>toggleActive(p.id,e)}><div className={`toggle ${p.active?"on":""}`}/></div>
    </div>)}</div>
  </div>);
}

/* V5 ── ADD/EDIT PRODUCT ── */
function VProductFormScr({product:p,onBack}){
  const isEdit=!!p;
  const [active,setActive]=useState(isEdit?p.active:true);
  const [showDelete,setShowDelete]=useState(false);
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{isEdit?"Modifier":"Ajouter"} un article</h2><div style={{width:38}}/></div>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Photos</div>
    <div className="pf-photos">{isEdit&&<div className="pf-photo">{p.img}<div className="pf-del">✕</div></div>}<div className="pf-photo add">+</div></div>
    <div className="field"><label>Nom de l'article</label><input defaultValue={isEdit?p.name:""} placeholder="Ex: Poulet DG, Robe Wax, Doliprane..."/></div>
    <div className="field"><label>Description</label><textarea rows={3} defaultValue={isEdit?"Robe en wax africain, coupe moderne, tailles S-XL":""} placeholder="Décrivez votre article..."/></div>
    <div className="field-row"><div className="field"><label>Prix (FCFA)</label><input type="number" defaultValue={isEdit?p.price:""} placeholder="25000"/></div><div className="field"><label>Prix barré</label><input type="number" placeholder="Optionnel"/></div></div>
    <div className="field-row"><div className="field"><label>Catégorie</label><select defaultValue={isEdit?p.cat:""}><option value="">Choisir...</option>{CATS.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}</select></div><div className="field"><label>Stock</label><input type="number" defaultValue={isEdit?p.stock:""} placeholder="0"/></div></div>
    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Variantes</div>
    <div className="pf-variants">{["S","M","L","XL"].map(s=><div key={s} className="pf-variant"><input defaultValue={s} style={{flex:"0 0 60px"}}/><input placeholder="Stock" style={{flex:"0 0 60px"}}/><span style={{fontSize:12,color:"#908C82"}}>unités</span></div>)}</div>
    <div className="field"><label>Tags</label><input defaultValue={isEdit?"Mode, Wax, Africain":""} placeholder="Séparer par des virgules"/></div>
    <div className="field"><label>Poids (g)</label><input type="number" defaultValue="250" placeholder="Pour calcul livraison"/></div>
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div className={`toggle ${active?"on":""}`} onClick={()=>setActive(!active)}/><span style={{fontSize:14,fontWeight:500}}>Article actif</span></div>
    <button className="btn-primary" style={{marginBottom:14}}>{isEdit?"💾 Enregistrer":"➕ Ajouter l'article"}</button>
    {isEdit&&!showDelete&&<button className="btn-outline" style={{color:"#EF4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setShowDelete(true)}>🗑️ Supprimer cet article</button>}
    {isEdit&&showDelete&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:6}}>⚠️ Supprimer "{p.name}" ?</div>
      <p style={{fontSize:12,color:"#5E5B53",marginBottom:12}}>Ce produit sera retiré de votre boutique. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowDelete(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onBack}>🗑️ Confirmer</button>
      </div>
    </div>}
  </div>);
}

/* V6 ── VENDOR WALLET ── */
function VWalletScr({go,onBack}){
  const balance=V_WALLET.filter(t=>t.type==="+").reduce((s,t)=>s+t.amount,0)-V_WALLET.filter(t=>t.type==="-").reduce((s,t)=>s+t.amount,0);
  const pending=V_WALLET.filter(t=>t.status==="En attente").reduce((s,t)=>s+t.amount,0);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Portefeuille</h2><div style={{width:38}}/></div>
    <div className="vw-card"><div className="vw-lbl">Solde disponible</div><div className="vw-bal">{fmt(balance)}</div><div className="vw-pend">En attente: {fmt(pending)}</div></div>
    <div className="vw-btns"><button className="vw-withdraw" onClick={()=>go("vWithdraw")}>💸 Retirer</button><button className="vw-history" onClick={()=>go("vReports")}>📊 Rapports</button></div>
    <div style={{padding:"0 20px",marginBottom:8}}><div style={{fontSize:14,fontWeight:700}}>Transactions récentes</div></div>
    {V_WALLET.map(t=><div key={t.id} className="vw-tx"><div className={`tx-icon ${t.type==="+"?"plus":"minus"}`}>{t.type==="+"?"↓":"↑"}</div><div className="tx-info"><h5>{t.label}</h5><p>{t.date} · {t.status}</p></div><div className={`tx-amt ${t.type==="+"?"plus":"minus"}`}>{t.type}{fmt(t.amount)}</div></div>)}
  </div>);
}

/* V7 ── VENDOR STATS ── */
function VStatsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const maxBar=Math.max(...V_STATS.chartWeek);
  const days=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div>
    <div className="vd-period">{[["today","Jour"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats">
      <div className="vd-stat"><div className="vs-icon">💰</div><div className="vs-val">{fmt(V_STATS[period].revenue)}</div><div className="vs-lbl">Revenus</div><div className="vs-trend up">↑ 23%</div></div>
      <div className="vd-stat"><div className="vs-icon">📦</div><div className="vs-val">{V_STATS[period].orders}</div><div className="vs-lbl">Commandes</div><div className="vs-trend up">↑ 8%</div></div>
      <div className="vd-stat"><div className="vs-icon">👁️</div><div className="vs-val">{V_STATS[period].visitors}</div><div className="vs-lbl">Visiteurs</div><div className="vs-trend up">↑ 12%</div></div>
      <div className="vd-stat"><div className="vs-icon">📈</div><div className="vs-val">3.2%</div><div className="vs-lbl">Taux conversion</div><div className="vs-trend down">↓ 0.4%</div></div>
    </div>
    <div className="vd-chart"><h4>Ventes par jour</h4><div className="chart-bars">{V_STATS.chartWeek.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`}}><div className="cb-tip">{fmt(v*1000)}</div></div>)}</div><div className="chart-labels">{days.map(d=><span key={d}>{d}</span>)}</div></div>
    <div style={{padding:"0 20px"}}><div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Revenus par catégorie</div>
      {[{cat:"Mode",pct:65,color:"#6366F1"},{cat:"Beauté",pct:20,color:"#A855F7"},{cat:"Accessoires",pct:15,color:"#F59E0B"}].map(c=><div key={c.cat} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{c.cat}</span><span style={{color:"#908C82"}}>{c.pct}%</span></div><div style={{height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${c.pct}%`,height:"100%",background:c.color,borderRadius:3}}/></div></div>)}
    </div></div>
    <div className="vd-top" style={{margin:"16px 20px"}}><h4>Top Produits</h4>{V_STATS.topProducts.map((p,i)=><div key={i} className="vd-top-item"><div className={`rank ${i===0?"g":""}`}>{i+1}</div><div className="ti-info"><h5>{p.name}</h5><p>{p.sold} vendus</p></div><div className="ti-rev">{fmt(p.revenue)}</div></div>)}</div>
  </div>);
}

/* V8 ── VENDOR MESSAGES ── */
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
function VChatScr({chat:c,onBack}){
  const [msgs,setMsgs]=useState([{from:"bot",text:`Bonjour, ${c?.name?.split(" ")[0]||"client"} ! Comment puis-je vous aider ?`,time:"14:40"},{from:"user",text:"La robe est disponible en taille L ?",time:"14:42"}.from==="user"?{from:"bot",text:"Oui, nous avons la taille L en stock ! Voulez-vous commander ?",time:"14:42"}:{from:"bot",text:"Bienvenue !",time:"14:40"}].filter(Boolean));
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight);},[msgs]);
  const initMsgs=[{from:"bot",text:`Bonjour ! Je suis intéressé(e) par vos articles.`,time:"14:40"},{from:"user",text:"Bonjour ! Bienvenue sur notre commerce. Comment puis-je vous aider ?",time:"14:41"},{from:"bot",text:c?.lastMsg||"C'est disponible en L ?",time:"14:42"}];
  useEffect(()=>{setMsgs(initMsgs)},[]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>setMsgs(p=>[...p,{from:"bot",text:["Merci !","D'accord, je vais voir.","Super, je commande !","C'est noté."][Math.floor(Math.random()*4)],time}]),1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av">{c?.avatar||"👤"}</div><div className="ch-info"><h4>{c?.name||"Client"}</h4><p>🟢 En ligne</p></div></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Répondre..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

/* V10 ── VENDOR REVIEWS ── */
function VReviewsScr({onBack}){
  const [replyTo,setReplyTo]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [reviews,setReviews]=useState(V_REVIEWS.map(r=>({...r})));
  const submitReply=(i)=>{if(!replyText.trim())return;const r=[...reviews];r[i]={...r[i],replied:true,reply:replyText};setReviews(r);setReplyTo(null);setReplyText("")};
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Avis clients</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:40,fontWeight:700}}>4.6</div><div style={{fontSize:16,color:"#F59E0B"}}>★★★★★</div><div style={{fontSize:12,color:"#908C82"}}>{reviews.length} avis</div></div>
    {reviews.map((r,i)=><div key={i} className="review-card">
      <div className="review-top"><div className="rav">{r.client[0]}</div><div style={{flex:1}}><h4 style={{fontSize:14,fontWeight:600}}>{r.client}</h4><p style={{fontSize:11,color:"#908C82",margin:0}}>{r.product}</p></div><span style={{fontSize:11,color:"#908C82"}}>{r.date}</span></div>
      <div className="review-stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
      <div className="review-text">{r.text}</div>
      {r.replied&&<div style={{marginTop:10,padding:10,background:"#F5F4F1",borderRadius:10,fontSize:12}}><b>Votre réponse :</b> {r.reply}</div>}
      {!r.replied&&replyTo!==i&&<button style={{marginTop:8,padding:"6px 14px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,color:"#6366F1",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setReplyTo(i);setReplyText("")}}>💬 Répondre</button>}
      {replyTo===i&&<div style={{marginTop:10,padding:12,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.15)",borderRadius:12}}>
        <textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={`Répondre à ${r.client}...`} rows={3} style={{width:"100%",padding:10,borderRadius:10,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",resize:"none",background:"#fff"}}/>
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setReplyTo(null);setReplyText("")}}>Annuler</button>
          <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:replyText.trim()?"#6366F1":"#E8E6E1",color:replyText.trim()?"#fff":"#908C82",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>submitReply(i)}>Envoyer</button>
        </div>
      </div>}
    </div>)}
  </div>);
}

/* V11 ── VENDOR PROMOTIONS ── */
function VPromosScr({go,onBack}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Promotions</h2><button style={{width:38,height:38,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("vCreatePromo")}>+</button></div>
    {V_PROMOS.map(p=><div key={p.id} className="promo-card">
      <div className="promo-head"><h4><span className="active-dot"/> {p.name}</h4><span style={{fontSize:20,fontWeight:700,color:"#6366F1"}}>{p.discount}%</span></div>
      <div className="promo-meta"><span>📅 {p.start} → {p.end}</span><span>🛍️ {p.products}</span>{p.code&&<span>🏷️ {p.code}</span>}</div>
      <div className="promo-bar"><div className="pbar-fill" style={{width:`${Math.min(p.used/50*100,100)}%`}}/></div>
      <div className="promo-usage"><span>{p.used} utilisations</span><span>Objectif: 50</span></div>
    </div>)}
    <button className="btn-primary" style={{marginTop:10}} onClick={()=>go("vCreatePromo")}>+ Créer une promotion</button>
  </div>);
}

/* ── CREATE PROMO ── */
function VCreatePromoScr({onBack}){
  const [type,setType]=useState("percent");const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>🎉</div><h3 style={{fontSize:18,fontWeight:700}}>Promotion créée !</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Votre promotion est maintenant active.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour aux promotions</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Nouvelle promotion</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div className="field"><label>Nom de la promotion</label><input placeholder="Ex: Soldes Février"/></div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Type de réduction</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>{[["percent","Pourcentage (%)"],["amount","Montant fixe (FCFA)"]].map(([k,l])=><button key={k} style={{flex:1,padding:12,borderRadius:12,border:type===k?"2px solid #6366F1":"1px solid #E8E6E1",background:type===k?"rgba(99,102,241,0.04)":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setType(k)}>{l}</button>)}</div>
      <div className="field-row"><div className="field"><label>{type==="percent"?"Réduction (%)":"Montant (FCFA)"}</label><input type="number" placeholder={type==="percent"?"Ex: 20":"Ex: 5000"}/></div><div className="field"><label>Code promo</label><input placeholder="Ex: LAMUKA20"/></div></div>
      <div className="field-row"><div className="field"><label>Date début</label><input type="date"/></div><div className="field"><label>Date fin</label><input type="date"/></div></div>
      <div className="field"><label>Produits concernés</label><select><option>Tous les produits</option>{V_PRODUCTS.map(p=><option key={p.id}>{p.name}</option>)}</select></div>
      <div className="field-row"><div className="field"><label>Utilisation max</label><input type="number" placeholder="50"/></div><div className="field"><label>Min. commande (FCFA)</label><input type="number" placeholder="Optionnel"/></div></div>
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" onClick={()=>setDone(true)}>🎉 Créer la promotion</button></div>
  </div>);
}

/* V12 ── VENDOR DELIVERY ── */
/* V12a ── ASSIGN DRIVER TO ORDER ── */
function VAssignDriverScr({order:o,onBack,go}){
  const drivers=[
    {id:"d1",name:"Patrick Moukala",vehicle:"🛵 Honda PCX",plate:"BZ-4521",rating:4.8,deliveries:342,eta:"12 min",zone:"Bacongo, Makélékélé",avatar:"🧑",status:"available"},
    {id:"d3",name:"Grace Okemba",vehicle:"🛵 Yamaha NMAX",plate:"BZ-2190",rating:4.9,deliveries:267,eta:"18 min",zone:"Poto-Poto, Moungali",avatar:"👩",status:"available"},
    {id:"d2",name:"Jean Mbemba",vehicle:"🚗 Toyota Vitz",plate:"BZ-7803",rating:4.5,deliveries:128,eta:"25 min",zone:"Talangaï, Mfilou",avatar:"👨",status:"busy"},
  ];
  const [selected,setSelected]=useState(null);
  const [step,setStep]=useState(0); // 0=choose, 1=confirm, 2=success
  const chosen=drivers.find(d=>d.id===selected);

  if(step===2)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:"40px 24px"}}>
      <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:40,animation:"splash-pop .5s ease"}}>✅</div>
      <h2 style={{fontSize:22,fontWeight:700,marginBottom:6}}>Livreur assigné !</h2>
      <p style={{fontSize:14,color:"#5E5B53",lineHeight:1.6,marginBottom:8}}><b>{chosen?.name}</b> a été notifié et prendra en charge la commande <b>{o.ref}</b></p>
      <div style={{padding:16,background:"#F5F4F1",borderRadius:16,margin:"16px 0",textAlign:"left"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{chosen?.avatar}</div>
          <div><div style={{fontSize:15,fontWeight:700}}>{chosen?.name}</div><div style={{fontSize:12,color:"#908C82"}}>{chosen?.vehicle} · {chosen?.plate}</div></div>
        </div>
        {[["📦 Commande",o.ref],["👤 Client",o.client],["📍 Adresse",o.addr],["⏱️ Temps estimé",chosen?.eta]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:"1px solid #E8E6E1",fontSize:12}}><span style={{color:"#908C82"}}>{l}</span><b>{v}</b></div>)}
      </div>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:14,borderRadius:14,border:"none",background:"#6366F1",color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("vDriverChat",{ref:o.ref,driver:chosen.name,driverAv:chosen.avatar})}>💬 Contacter le livreur</button>
      </div>
      <button style={{marginTop:10,width:"100%",padding:14,borderRadius:14,border:"1px solid #E8E6E1",background:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#191815"}} onClick={onBack}>← Retour à la commande</button>
    </div>
  </div>);

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Assigner un livreur</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>

      {/* Order summary */}
      <div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:44,height:44,borderRadius:12,background:"rgba(99,102,241,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📦</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:700}}>{o.ref}</div><div style={{fontSize:12,color:"#908C82"}}>{o.client} · {o.addr}</div><div style={{fontSize:12,color:"#908C82"}}>{o.items?.map(it=>it.name).join(", ")}</div></div>
        <div style={{fontSize:14,fontWeight:700,color:"#6366F1",flexShrink:0}}>{fmt(o.total)}</div>
      </div>

      {step===0&&<>
        <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Choisir un livreur</div>
        <p style={{fontSize:12,color:"#908C82",marginBottom:14}}>Sélectionnez un livreur disponible pour cette commande</p>

        {drivers.map(d=><div key={d.id} onClick={()=>d.status==="available"&&setSelected(d.id)} style={{padding:16,background:selected===d.id?"rgba(99,102,241,0.04)":"#fff",border:selected===d.id?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,marginBottom:10,cursor:d.status==="available"?"pointer":"default",opacity:d.status==="available"?1:0.5,transition:"all .2s"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:48,height:48,borderRadius:14,background:selected===d.id?"linear-gradient(135deg,#6366F1,#A855F7)":"#F5F4F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,transition:"all .2s"}}>{d.avatar}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,fontWeight:700}}>{d.name}</span><span className={`del-status ${d.status}`} style={d.status==="busy"?{}:{}}>{d.status==="available"?"🟢 Dispo":"🟡 Occupé"}</span></div>
              <div style={{fontSize:12,color:"#908C82",marginTop:2}}>{d.vehicle} · {d.plate}</div>
              <div style={{display:"flex",gap:10,marginTop:4,fontSize:11,color:"#908C82"}}><span>⭐ {d.rating}</span><span>📦 {d.deliveries} livrais.</span><span>📍 {d.zone}</span></div>
            </div>
            {d.status==="available"&&<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{d.eta}</div><div style={{fontSize:10,color:"#908C82"}}>estimé</div></div>}
          </div>
          {selected===d.id&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(99,102,241,0.15)",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>✓</span><span style={{fontSize:12,color:"#6366F1",fontWeight:600}}>Livreur sélectionné · Temps estimé : {d.eta}</span>
          </div>}
        </div>)}

        {drivers.filter(d=>d.status==="busy").length>0&&<div className="info-box yellow" style={{marginTop:6}}><span>💡</span><span>Les livreurs occupés seront disponibles une fois leur livraison en cours terminée.</span></div>}
      </>}

      {step===1&&<>
        <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>Confirmer l'assignation</div>
        <p style={{fontSize:12,color:"#908C82",marginBottom:16}}>Vérifiez les détails avant de confirmer</p>

        <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
            <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>{chosen?.avatar}</div>
            <div><div style={{fontSize:16,fontWeight:700}}>{chosen?.name}</div><div style={{fontSize:13,color:"#908C82"}}>{chosen?.vehicle} · {chosen?.plate}</div><div style={{fontSize:12,color:"#F59E0B",marginTop:2}}>⭐ {chosen?.rating} · {chosen?.deliveries} livraisons</div></div>
          </div>
          {[["Commande",o.ref],["Client",o.client],["Adresse livraison",o.addr],["Montant",fmt(o.total)],["Temps estimé",chosen?.eta],["Frais livraison","2 500 FCFA"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid #F5F4F1",fontSize:13}}><span style={{color:"#908C82"}}>{l}</span><b>{v}</b></div>)}
        </div>

        <div className="info-box green"><span>📱</span><span>Le livreur recevra une notification avec les détails de la commande et l'adresse du client.</span></div>
      </>}

    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      {step===0&&<button className="btn-primary" style={{opacity:selected?1:0.5}} onClick={()=>selected&&setStep(1)} disabled={!selected}>Continuer{chosen?` avec ${chosen.name}`:""}</button>}
      {step===1&&<div style={{display:"flex",gap:10}}><button className="btn-outline" style={{flex:1}} onClick={()=>setStep(0)}>← Changer</button><button className="btn-primary" style={{flex:2}} onClick={()=>setStep(2)}>✅ Confirmer l'assignation</button></div>}
    </div>
  </div>);
}

function VDeliveryScr({go,onBack}){
  const [tab,setTab]=useState(0);
  // Platform drivers (auto-listed from Lamuka accounts)
  const platformDrivers=[
    {id:"d1",name:"Patrick Moukala",vehicle:"🛵 Honda PCX",plate:"BZ-4521",phone:"+242 06X XXX",status:"available",rating:4.8,deliveries:342,zone:"Brazzaville Sud",avatar:"🧑",source:"platform"},
    {id:"d3",name:"Grace Okemba",vehicle:"🛵 Yamaha NMAX",plate:"BZ-2190",phone:"+242 06X XXX",status:"available",rating:4.9,deliveries:267,zone:"Brazzaville Centre",avatar:"👩",source:"platform"},
    {id:"d5",name:"Alain Mboumba",vehicle:"🚲 Vélo",plate:"—",phone:"+242 06X XXX",status:"available",rating:4.3,deliveries:52,zone:"Brazzaville Sud",avatar:"🧑",source:"platform"},
  ];
  // Manually added by vendor
  const [manualDrivers,setManualDrivers]=useState([
    {id:"d2",name:"Jean Mbemba",vehicle:"🚗 Toyota Vitz",plate:"BZ-7803",phone:"+242 06X XXX",status:"busy",rating:4.5,deliveries:128,zone:"Brazzaville Nord",avatar:"👨",source:"manual"},
    {id:"d4",name:"Michel Ngoma",vehicle:"🚗 Suzuki Alto",plate:"BZ-5541",phone:"+242 06X XXX",status:"offline",rating:4.2,deliveries:89,zone:"Pointe-Noire",avatar:"🧔",source:"manual"},
  ]);
  const allDrivers=[...platformDrivers,...manualDrivers];
  const [showAdd,setShowAdd]=useState(false);
  const [addName,setAddName]=useState("");const [addPhone,setAddPhone]=useState("");const [addVehicle,setAddVehicle]=useState("moto");
  const doAddManual=()=>{
    if(!addName||!addPhone)return;
    setManualDrivers([...manualDrivers,{id:"dm"+Date.now(),name:addName,vehicle:addVehicle==="moto"?"🛵 Moto":addVehicle==="voiture"?"🚗 Voiture":"🚲 Vélo",plate:"—",phone:addPhone,status:"offline",rating:0,deliveries:0,zone:"Brazzaville",avatar:addName[0].toUpperCase(),source:"manual"}]);
    setAddName("");setAddPhone("");setShowAdd(false);
  };
  const removeManual=id=>setManualDrivers(manualDrivers.filter(d=>d.id!==id));

  const activeDeliveries=[
    {ref:"#CMD-0889",client:"Celine Nzaba",addr:"Moungali, Rue 8",driver:"Patrick Moukala",driverAv:"🧑",status:"En route",eta:"8 min",progress:65},
    {ref:"#CMD-0888",client:"Alain Mboumba",addr:"Poto-Poto, Av. Paix",driver:"Jean Mbemba",driverAv:"👨",status:"Récupération",eta:"22 min",progress:25},
  ];
  const pastDeliveries=[
    {ref:"#CMD-0885",client:"David Tsaty",driver:"Patrick Moukala",date:"12 Fév",status:"Livrée",duration:"32 min",rating:5},
    {ref:"#CMD-0880",client:"Grace Mouanda",driver:"Grace Okemba",date:"10 Fév",status:"Livrée",duration:"28 min",rating:4},
    {ref:"#CMD-0875",client:"Paul Nkaya",driver:"Patrick Moukala",date:"8 Fév",status:"Livrée",duration:"45 min",rating:5},
  ];
  const [zones,setZones]=useState([
    {id:"vz1",name:"Brazzaville Sud",areas:"Bacongo, Makélékélé",price:2500,active:true},
    {id:"vz2",name:"Brazzaville Centre",areas:"Poto-Poto, Moungali, Ouenzé",price:2500,active:true},
    {id:"vz3",name:"Brazzaville Nord",areas:"Talangaï, Mfilou, Djiri",price:3500,active:true},
    {id:"vz4",name:"Pointe-Noire",areas:"Centre-ville, Loandjili, Tié-Tié",price:5000,active:false},
  ]);
  const toggleZone=id=>{setZones(zones.map(z=>z.id===id?{...z,active:!z.active}:z))};
  const [editZone,setEditZone]=useState(null);
  const [editPrice,setEditPrice]=useState("");
  const [editAreas,setEditAreas]=useState("");
  const [showAddZone,setShowAddZone]=useState(false);
  const [azName,setAzName]=useState("");const [azAreas,setAzAreas]=useState("");const [azPrice,setAzPrice]=useState("2500");
  const saveEdit=(id)=>{setZones(zones.map(z=>z.id===id?{...z,price:parseInt(editPrice)||z.price,areas:editAreas||z.areas}:z));setEditZone(null)};
  const removeZone=id=>setZones(zones.filter(z=>z.id!==id));
  const addZone=()=>{if(!azName)return;setZones([...zones,{id:"vz"+Date.now(),name:azName,areas:azAreas||"Zone personnalisée",price:parseInt(azPrice)||2500,active:true}]);setAzName("");setAzAreas("");setAzPrice("2500");setShowAddZone(false)};
  const zoneSuggestions=["Dolisie","Nkayi","Oyo","Owando","Sibiti"].filter(n=>!zones.find(z=>z.name===n));

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Gestion livraison</h2><button onClick={()=>go("vNotif")}>🔔</button></div>

    {/* Tabs */}
    <div style={{display:"flex",gap:0,margin:"0 20px 14px",background:"#F5F4F1",borderRadius:14,padding:4,border:"1px solid #E8E6E1"}}>
      {["Livreurs","En cours","Historique","Zones"].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",borderRadius:11,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:tab===i?"#6366F1":"transparent",color:tab===i?"#fff":"#908C82",transition:"all .2s"}}>{t}</button>)}
    </div>

    {/* Tab 0: Livreurs - split platform/manual */}
    {tab===0&&<div style={{padding:"0 20px 80px"}}>

      {/* Section 1: Platform drivers (auto-listed) */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><span style={{fontSize:14,fontWeight:700}}>Livreurs Lamuka</span><span style={{fontSize:11,color:"#908C82",marginLeft:6}}>({platformDrivers.length} inscrits)</span></div>
        <span style={{padding:"4px 10px",borderRadius:8,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:700}}>🔄 Auto</span>
      </div>
      <div className="info-box blue" style={{marginBottom:10,padding:"8px 12px"}}><span>ℹ️</span><span style={{fontSize:11}}>Ces livreurs ont un compte Lamuka actif et sont automatiquement disponibles dans votre zone.</span></div>
      {platformDrivers.map(d=><div key={d.id} className="del-card" onClick={()=>go("vDriverProfile",d)}>
        <div className="del-av">{d.avatar}</div>
        <div className="del-info">
          <h4>{d.name} <span style={{padding:"2px 6px",borderRadius:4,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:9,fontWeight:700,marginLeft:4}}>Lamuka ✓</span></h4>
          <p>{d.vehicle} · {d.plate}</p>
          <p style={{marginTop:2}}>⭐ {d.rating} · {d.deliveries} livraisons · 📍 {d.zone}</p>
        </div>
        <span className={`del-status ${d.status==="available"?"available":d.status==="busy"?"busy":""}`}>{d.status==="available"?"Dispo":d.status==="busy"?"Occupé":"Hors ligne"}</span>
      </div>)}

      {/* Section 2: Manual drivers */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"20px 0 10px"}}>
        <div><span style={{fontSize:14,fontWeight:700}}>Livreurs ajoutés</span><span style={{fontSize:11,color:"#908C82",marginLeft:6}}>({manualDrivers.length})</span></div>
        <button style={{padding:"6px 12px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#6366F1"}} onClick={()=>setShowAdd(true)}>+ Ajouter</button>
      </div>
      {manualDrivers.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#908C82",fontSize:12}}>Aucun livreur ajouté manuellement</div>}
      {manualDrivers.map(d=><div key={d.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}} onClick={()=>go("vDriverProfile",d)}>
          <div className="del-av" style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{d.avatar}</div>
          <div style={{flex:1}}>
            <h4 style={{fontSize:14,fontWeight:600}}>{d.name} <span style={{padding:"2px 6px",borderRadius:4,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:9,fontWeight:700,marginLeft:4}}>Manuel</span></h4>
            <p style={{fontSize:11,color:"#908C82"}}>{d.vehicle} · 📍 {d.zone}</p>
          </div>
          <span className={`del-status ${d.status==="available"?"available":d.status==="busy"?"busy":""}`} style={d.status==="offline"?{background:"rgba(0,0,0,0.05)",color:"#908C82"}:{}}>{d.status==="available"?"Dispo":d.status==="busy"?"Occupé":"Hors ligne"}</span>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
          <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("vAddDriver")}>✏️ Modifier</button>
          <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>removeManual(d.id)}>🗑️ Retirer</button>
        </div>
      </div>)}

      {/* Inline add form */}
      {showAdd&&<div style={{padding:16,background:"#fff",border:"2px solid #6366F1",borderRadius:16,marginTop:10}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>➕ Ajouter un livreur manuellement</h4>
        <div className="field"><label>Nom complet</label><input value={addName} onChange={e=>setAddName(e.target.value)} placeholder="Ex: Patrick Moukala"/></div>
        <div className="field"><label>Téléphone</label><input value={addPhone} onChange={e=>setAddPhone(e.target.value)} placeholder="+242 06X XXX XXX" type="tel"/></div>
        <div className="field"><label>Véhicule</label>
          <div style={{display:"flex",gap:6}}>{[["moto","🛵 Moto"],["voiture","🚗 Voiture"],["velo","🚲 Vélo"]].map(([k,l])=><button key={k} onClick={()=>setAddVehicle(k)} style={{flex:1,padding:8,borderRadius:8,border:addVehicle===k?"2px solid #6366F1":"1px solid #E8E6E1",background:addVehicle===k?"rgba(99,102,241,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}</div>
        </div>
        <div className="info-box yellow" style={{marginBottom:10,padding:"6px 10px"}}><span>📱</span><span style={{fontSize:11}}>Un SMS sera envoyé pour l'inviter à créer un compte Lamuka</span></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowAdd(false);setAddName("");setAddPhone("")}}>Annuler</button>
          <button className="btn-primary" style={{flex:2,background:addName&&addPhone?"#6366F1":"#E8E6E1",color:addName&&addPhone?"#fff":"#908C82"}} onClick={doAddManual}>Ajouter</button>
        </div>
      </div>}
    </div>}

    {/* Tab 1: En cours */}
    {tab===1&&<div style={{padding:"0 20px 80px"}}>
      {activeDeliveries.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:48}}>📭</div><h3 style={{marginTop:10,fontSize:16,fontWeight:700}}>Aucune livraison en cours</h3><p style={{fontSize:13,color:"#908C82",marginTop:4}}>Les livraisons actives apparaîtront ici</p></div>
      :activeDeliveries.map((d,i)=><div key={i} style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:18,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:14,fontWeight:700}}>{d.ref}</span><span className="vo-status shipped">{d.status}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{d.driverAv}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{d.driver}</div><div style={{fontSize:11,color:"#908C82"}}>→ {d.client} · {d.addr}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{d.eta}</div><div style={{fontSize:10,color:"#908C82"}}>restantes</div></div>
        </div>
        <div className="eta-bar" style={{marginBottom:6}}><div className="eta-fill" style={{width:`${d.progress}%`}}/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}} onClick={()=>go("vTrackDelivery",d)}>📍 Suivre</button>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:4}} onClick={()=>go("vDriverChat",d)}>💬 Contacter</button>
          <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 Appel vers "+d.driver)}>📞</button>
        </div>
      </div>)}
    </div>}

    {/* Tab 2: Historique */}
    {tab===2&&<div style={{padding:"0 20px 80px"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>{pastDeliveries.length} livraisons terminées</div>
      {pastDeliveries.map((d,i)=><div key={i} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>✅</div>
        <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600}}>{d.ref} → {d.client}</div><div style={{fontSize:11,color:"#908C82"}}>{d.driver} · {d.date} · {d.duration}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:14,color:"#F59E0B"}}>{"★".repeat(d.rating)}</div></div>
      </div>)}
    </div>}

    {/* Tab 3: Zones */}
    {tab===3&&<div style={{padding:"0 20px 80px"}}>
      <div className="info-box blue" style={{marginBottom:14}}><span>ℹ️</span><span style={{fontSize:11}}>Définissez vos zones de livraison et tarifs. Les livreurs disponibles dans ces zones seront proposés pour vos commandes.</span></div>
      <div style={{fontSize:12,color:"#908C82",marginBottom:10}}>{zones.filter(z=>z.active).length} zone{zones.filter(z=>z.active).length>1?"s":""} active{zones.filter(z=>z.active).length>1?"s":""} sur {zones.length}</div>

      {zones.map(z=><div key={z.id} style={{padding:14,background:"#fff",border:editZone===z.id?"2px solid #6366F1":z.active?"1px solid rgba(16,185,129,0.3)":"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{z.name}</h4>{z.active&&<span style={{width:8,height:8,borderRadius:4,background:"#10B981"}}/>}</div>
          <div className={`toggle ${z.active?"on":""}`} onClick={()=>toggleZone(z.id)}/>
        </div>
        <div style={{fontSize:12,color:"#908C82",marginBottom:8}}>📍 {z.areas}</div>

        {editZone===z.id
          ?<div style={{paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
            <div className="field"><label>Quartiers couverts</label><input value={editAreas} onChange={e=>setEditAreas(e.target.value)}/></div>
            <div className="field"><label>Frais de livraison (FCFA)</label><input type="number" value={editPrice} onChange={e=>setEditPrice(e.target.value)}/></div>
            <div style={{display:"flex",gap:8}}>
              <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setEditZone(null)}>Annuler</button>
              <button style={{flex:1,padding:8,borderRadius:8,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>saveEdit(z.id)}>💾 Sauver</button>
              <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{removeZone(z.id);setEditZone(null)}}>🗑️</button>
            </div>
          </div>
          :<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{fmt(z.price)}</span>
            <button style={{padding:"6px 14px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53"}} onClick={()=>{setEditZone(z.id);setEditPrice(String(z.price));setEditAreas(z.areas)}}>✏️ Modifier</button>
          </div>
        }
      </div>)}

      {/* Add zone */}
      {showAddZone?<div style={{padding:16,background:"#fff",border:"2px solid #6366F1",borderRadius:16,marginBottom:14}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>➕ Ajouter une zone</h4>
        {zoneSuggestions.length>0&&<>
          <div style={{fontSize:11,fontWeight:600,color:"#908C82",marginBottom:6}}>Suggestions</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{zoneSuggestions.map(n=><span key={n} onClick={()=>setAzName(n)} style={{padding:"6px 12px",borderRadius:8,border:azName===n?"2px solid #6366F1":"1px solid #E8E6E1",background:azName===n?"rgba(99,102,241,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:azName===n?"#6366F1":"#5E5B53"}}>{azName===n?"✓ ":""}{n}</span>)}</div>
        </>}
        <div className="field"><label>Nom de la zone</label><input value={azName} onChange={e=>setAzName(e.target.value)} placeholder="Ex: Dolisie Centre"/></div>
        <div className="field"><label>Quartiers</label><input value={azAreas} onChange={e=>setAzAreas(e.target.value)} placeholder="Ex: Centre-ville, Loubomo"/></div>
        <div className="field"><label>Frais de livraison (FCFA)</label><input type="number" value={azPrice} onChange={e=>setAzPrice(e.target.value)}/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowAddZone(false);setAzName("");setAzAreas("")}}>Annuler</button>
          <button className="btn-primary" style={{flex:2,background:azName?"#6366F1":"#E8E6E1",color:azName?"#fff":"#908C82"}} onClick={addZone}>Ajouter la zone</button>
        </div>
      </div>
      :<button style={{width:"100%",padding:14,borderRadius:14,border:"2px dashed #6366F1",background:"rgba(99,102,241,0.02)",color:"#6366F1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowAddZone(true)}>+ Ajouter une zone</button>}
    </div>}
  </div>);
}

/* V12b ── DRIVER PROFILE ── */
/* V12c ── ADD DRIVER ── */
function VAddDriverScr({onBack}){
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Invitation envoyée !</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Le livreur recevra un SMS et une notification pour rejoindre votre réseau.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Ajouter un livreur</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}><div style={{width:64,height:64,borderRadius:18,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:32}}>🛵</div><p style={{fontSize:13,color:"#908C82"}}>Invitez un livreur à rejoindre votre réseau de livraison</p></div>
      <div className="field"><label>Nom complet</label><input placeholder="Ex: Patrick Moukala"/></div>
      <div className="field"><label>Téléphone</label><input placeholder="+242 06X XXX XXX" type="tel"/></div>
      <div className="field"><label>Email (optionnel)</label><input placeholder="livreur@email.com" type="email"/></div>
      <div className="field"><label>Type de véhicule</label><select><option value="moto">🛵 Moto / Scooter</option><option value="voiture">🚗 Voiture</option><option value="velo">🚲 Vélo</option></select></div>
      <div className="field"><label>Zone de livraison</label><select><option>Brazzaville Sud</option><option>Brazzaville Centre</option><option>Brazzaville Nord</option><option>Pointe-Noire</option></select></div>
      <div className="info-box blue" style={{marginTop:10}}><span>📱</span><span>Le livreur recevra un SMS d'invitation avec un lien pour créer son compte Lamuka.</span></div>
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" onClick={()=>setDone(true)}>📤 Envoyer l'invitation</button></div>
  </div>);
}

function VDriverProfileScr({driver:d,go,onBack}){
  const history=[
    {ref:"#CMD-0889",client:"Celine Nzaba",date:"14 Fév",duration:"28 min",rating:5},
    {ref:"#CMD-0885",client:"David Tsaty",date:"12 Fév",duration:"32 min",rating:5},
    {ref:"#CMD-0878",client:"Paul Nkaya",date:"8 Fév",duration:"45 min",rating:4},
    {ref:"#CMD-0870",client:"Marie Koumba",date:"5 Fév",duration:"22 min",rating:5},
  ];
  return(<div className="scr" style={{paddingBottom:80}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Profil livreur</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:"10px 20px 20px"}}>
      <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:32}}>{d.avatar}</div>
      <h2 style={{fontSize:20,fontWeight:700}}>{d.name}</h2>
      <p style={{fontSize:13,color:"#908C82",marginTop:2}}>{d.vehicle} · {d.plate}</p>
      <p style={{fontSize:12,color:"#908C82"}}>📍 {d.zone} · 📱 {d.phone}</p>
      <span className={`del-status ${d.status==="available"?"available":d.status==="busy"?"busy":""}`} style={d.status==="offline"?{background:"rgba(0,0,0,0.05)",color:"#908C82",display:"inline-block",marginTop:8}:{display:"inline-block",marginTop:8}}>{d.status==="available"?"🟢 Disponible":d.status==="busy"?"🟡 Occupé":"⚫ Hors ligne"}</span>
    </div>
    <div className="vp-stats" style={{padding:"0 20px",marginBottom:16}}>
      <div className="vps r"><div className="vsi">⭐</div><b>{d.rating}</b><span>Note</span></div>
      <div className="vps p"><div className="vsi">📦</div><b>{d.deliveries}</b><span>Livraisons</span></div>
      <div className="vps f"><div className="vsi">⏱️</div><b>31 min</b><span>Temps moy.</span></div>
    </div>
    <div style={{display:"flex",gap:10,padding:"0 20px",marginBottom:16}}>
      <button style={{flex:1,padding:12,borderRadius:14,border:"none",background:"#10B981",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>alert("📞 Appel vers "+d.name)}>📞 Appeler</button>
      <button style={{flex:1,padding:12,borderRadius:14,border:"none",background:"#6366F1",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vDriverChat",{driver:d.name,driverAv:d.avatar})}>💬 Message</button>
    </div>
    {d.status==="available"&&<div style={{padding:"0 20px",marginBottom:16}}>
      <div className="info-box green"><span>✅</span><span>{d.name} est disponible pour une livraison. Assignez-le depuis le détail d'une commande.</span></div>
    </div>}
    <div style={{padding:"0 20px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Historique récent</div>
      {history.map((h,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:"1px solid #F5F4F1"}}>
        <div style={{width:32,height:32,borderRadius:8,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>✅</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{h.ref} → {h.client}</div><div style={{fontSize:11,color:"#908C82"}}>{h.date} · {h.duration}</div></div>
        <span style={{fontSize:12,color:"#F59E0B"}}>{"★".repeat(h.rating)}</span>
      </div>)}
    </div>
  </div>);
}

/* V12c ── VENDOR TRACK DELIVERY ── */
function VTrackDeliveryScr({delivery:d,go,onBack}){
  const steps=[
    {label:"Commande prête",time:"14:05",done:true},
    {label:"Livreur assigné",time:"14:08",done:true},
    {label:"Colis récupéré",time:"14:15",done:d.progress>30},
    {label:"En route",time:d.progress>40?"14:20":"—",done:d.progress>50},
    {label:"Livré au client",time:"—",done:false},
  ];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="track-map" style={{height:200}}>
      <div className="map-grid"/><div className="map-road"/><div className="map-route"/>
      <div className="map-pin" style={{top:"calc(45% - 16px)",left:"13%"}}>📍</div>
      <div className="map-driver">🛵</div>
      <div className="map-pin" style={{top:"calc(45% - 16px)",left:"48%"}}>🏠</div>
      <div className="map-label">🟢 {d.status} · {d.eta} restantes</div>
      <div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div>
    </div>
    <div className="scr" style={{padding:20}}>
      {/* Driver info */}
      <div className="track-driver"><div className="td-av">{d.driverAv}</div><div className="td-info"><h4>{d.driver}</h4><p>→ {d.client}</p><div className="td-r">{d.addr}</div></div></div>

      {/* Actions */}
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>alert("📞 Appel vers "+d.driver)}>📞 Appeler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:6}} onClick={()=>go("vDriverChat",d)}>💬 Message</button>
      </div>

      {/* Progress */}
      <div className="eta-box"><h4>Progression</h4><div className="eta-bar"><div className="eta-fill" style={{width:`${d.progress}%`}}/></div><div className="eta-info"><span>Départ</span><span><b>~{d.eta}</b></span></div></div>

      {/* Timeline */}
      <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Suivi étapes</div>
        {steps.map((s,i)=><div key={i} style={{display:"flex",gap:12,marginBottom:i<steps.length-1?0:0}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:s.done?"#10B981":"#E8E6E1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:700,flexShrink:0}}>{s.done?"✓":i+1}</div>
            {i<steps.length-1&&<div style={{width:2,height:28,background:s.done?"#10B981":"#E8E6E1",margin:"4px 0"}}/>}
          </div>
          <div style={{paddingBottom:i<steps.length-1?16:0}}>
            <div style={{fontSize:13,fontWeight:600,color:s.done?"#191815":"#908C82"}}>{s.label}</div>
            <div style={{fontSize:11,color:"#908C82"}}>{s.time}</div>
          </div>
        </div>)}
      </div>
    </div>
  </div>);
}

/* V12d ── VENDOR ↔ DRIVER CHAT ── */
function VDriverChatScr({delivery:d,onBack}){
  const driverName=d.driver||d.name||"Livreur";
  const driverAv=d.driverAv||d.avatar||"🧑";
  const [msgs,setMsgs]=useState([
    {from:"user",text:`Salut ${driverName.split(" ")[0]}, la commande ${d.ref||""} est prête au magasin.`,time:"14:08"},
    {from:"bot",text:"OK je suis en route, j'arrive dans 10 minutes ! 🛵",time:"14:09"},
    {from:"user",text:"Parfait. Le client est au Quartier Bacongo, Rue 14.",time:"14:10"},
    {from:"bot",text:"Noté. Je récupère le colis et je file direct. Tu peux me suivre sur la carte.",time:"14:10"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");
    setTimeout(()=>{const r=["Bien reçu chef ! 👍","OK, je gère ça.","Le client a été prévenu.","J'arrive dans 5 minutes.","C'est noté, pas de souci.","Je suis devant la boutique."];setMsgs(p=>[...p,{from:"bot",text:r[Math.floor(Math.random()*r.length)],time}])},1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head">
      <button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div className="ch-av" style={{background:"linear-gradient(135deg,#10B981,#059669)"}}>{driverAv}</div>
      <div className="ch-info"><h4>{driverName}</h4><p>🟢 En livraison{d.ref?` · ${d.ref}`:""}</p></div>
      <button className="ch-call" onClick={()=>alert("📞 Appel vers "+driverName)}>📞</button>
    </div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:8,flexShrink:0}}>
      {["📍 Position","📸 Photo colis","✅ Livré"].map(q=><button key={q} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap"}}>{q}</button>)}
    </div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Message à ${driverName.split(" ")[0]}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

/* V13 ── VENDOR NOTIFICATIONS ── */
function VNotifScr({onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications</h2><div style={{width:38}}/></div>
    {V_NOTIFS.map((n,i)=><div key={i} className={`notif-item ${!n.read?"unread":""}`}><div className="ni-icon">{n.icon}</div><div className="ni-body"><h4>{n.title}</h4><p>{n.desc}</p><div className="ni-t">{n.time}</div></div></div>)}
  </div>);
}

/* V14 ── VENDOR SHOP SETTINGS ── */
function VSettingsScr({onBack,go}){
  const [pushOrder,setPushOrder]=useState(true);
  const [pushReview,setPushReview]=useState(true);
  const [pushStock,setPushStock]=useState(true);
  const [pushPromo,setPushPromo]=useState(false);
  const [emailReport,setEmailReport]=useState(true);
  const [sound,setSound]=useState(true);
  const [lang,setLang]=useState("fr");
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres boutique</h2><div style={{width:38}}/></div>
    <div className="vs-header"><div className="vs-logo">👔</div><h3 style={{fontSize:18,fontWeight:700}}>Mon Commerce</h3><p style={{fontSize:12,color:"#908C82"}}>Mode & Accessoires africains</p><div className="edit-logo">📸 Changer le logo</div></div>
    <div style={{padding:"0 20px"}}>
      <div className="field"><label>Nom de l'établissement</label><input defaultValue="Mon Commerce"/></div>
      <div className="field"><label>Description</label><textarea rows={3} defaultValue="Vêtements et accessoires africains modernes. Wax, Bogolan, Cuir artisanal."/></div>
      <div className="field-row"><div className="field"><label>Téléphone</label><input defaultValue="+242 064 663 469"/></div><div className="field"><label>Email</label><input defaultValue="joeldytsina94@gmail.com"/></div></div>
      <div className="field"><label>Adresse physique</label><input defaultValue="Marché Total, Stand 42, Brazzaville"/></div>
      <div className="field-row"><div className="field"><label>Horaires</label><input defaultValue="8h - 18h"/></div><div className="field"><label>Jours</label><input defaultValue="Lun - Sam"/></div></div>
      <div className="field"><label>Zones de livraison</label><input defaultValue="Brazzaville, Pointe-Noire"/></div>
      <div className="field"><label>Politique de retour</label><textarea rows={2} defaultValue="Retour accepté sous 7 jours. Produit en état d'origine."/></div>
      <div style={{fontSize:14,fontWeight:700,margin:"10px 0"}}>Réseaux sociaux</div>
      <div className="field"><label>Instagram</label><input defaultValue="@joeldyofficiel"/></div>
      <div className="field"><label>Facebook</label><input placeholder="URL de votre page"/></div>
    </div>
    <div>
      <div className="setting-group"><div className="setting-label">Général</div>
        <div className="setting-item"><span className="si-i">🌐</span><span className="si-t">Langue</span><select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",background:"#fff"}}><option value="fr">Français</option><option value="en">English</option><option value="ln">Lingala</option></select></div>
      </div>
      <div className="setting-group"><div className="setting-label">Notifications push</div>
        <div className="setting-item"><span className="si-i">📦</span><span className="si-t">Nouvelles commandes</span><div className={`toggle ${pushOrder?"on":""}`} onClick={()=>setPushOrder(!pushOrder)}/></div>
        <div className="setting-item"><span className="si-i">⭐</span><span className="si-t">Avis clients</span><div className={`toggle ${pushReview?"on":""}`} onClick={()=>setPushReview(!pushReview)}/></div>
        <div className="setting-item"><span className="si-i">⚠️</span><span className="si-t">Alertes stock faible</span><div className={`toggle ${pushStock?"on":""}`} onClick={()=>setPushStock(!pushStock)}/></div>
        <div className="setting-item"><span className="si-i">🏷️</span><span className="si-t">Fin de promotions</span><div className={`toggle ${pushPromo?"on":""}`} onClick={()=>setPushPromo(!pushPromo)}/></div>
        <div className="setting-item"><span className="si-i">🔊</span><span className="si-t">Son de notification</span><div className={`toggle ${sound?"on":""}`} onClick={()=>setSound(!sound)}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Email</div>
        <div className="setting-item"><span className="si-i">📧</span><span className="si-t">Rapport hebdomadaire</span><div className={`toggle ${emailReport?"on":""}`} onClick={()=>setEmailReport(!emailReport)}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Sécurité</div>
        <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔒</span><span className="si-t">Changer mot de passe</span><span className="mi-c">›</span></div>
      </div>
      <div className="setting-group"><div className="setting-label">Légal</div>
        <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📄</span><span className="si-t">Conditions générales</span><span className="mi-c">›</span></div>
        <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span className="mi-c">›</span></div>
      </div>
    </div>
    <div style={{padding:"0 20px 20px"}}><button className="btn-primary">💾 Enregistrer</button></div>
  </div>);
}

/* V15 ── VENDOR REPORTS ── */
function VReportsScr({onBack}){
  const [month,setMonth]=useState("Février");
  const [exported,setExported]=useState({});
  const monthData={
    "Janvier":{brut:"1 820 000",comm:"72 800",net:"1 747 200",orders:41,avg:"44 390"},
    "Février":{brut:"2 150 000",comm:"86 000",net:"2 064 000",orders:52,avg:"41 346"},
    "Mars":{brut:"890 000",comm:"35 600",net:"854 400",orders:22,avg:"40 454"},
  };
  const d=monthData[month];
  const reports=[
    {id:"sales",icon:"📊",title:"Rapport des ventes",desc:"Détail des ventes par article et période",format:"PDF / Excel"},
    {id:"tax",icon:"💰",title:"Rapport fiscal",desc:"Revenus, commissions, TVA mensuelle",format:"PDF"},
    {id:"stock",icon:"📦",title:"Rapport de stock",desc:"Inventaire, mouvements, alertes",format:"Excel"},
    {id:"invoice",icon:"🧾",title:"Factures Lamuka",desc:"Commissions et frais de plateforme",format:"PDF"},
    {id:"perf",icon:"📈",title:"Performance boutique",desc:"Taux de conversion, visites, panier moyen",format:"PDF"},
  ];
  const doExport=(id)=>{setExported(e=>({...e,[id]:"loading"}));setTimeout(()=>setExported(e=>({...e,[id]:"done"})),1500);setTimeout(()=>setExported(e=>{const n={...e};delete n[id];return n}),4000)};
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Rapports & Exports</h2><div style={{width:38}}/></div>
    <div className="vd-period">{["Janvier","Février","Mars"].map(m=><button key={m} className={month===m?"on":""} onClick={()=>setMonth(m)}>{m}</button>)}</div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📋 Résumé {month}</div>
      {[["Revenus bruts",d.brut+" FCFA"],["Commissions (4%)",d.comm+" FCFA"],["Revenus nets",d.net+" FCFA"],["Nombre de commandes",d.orders],["Panier moyen",d.avg+" FCFA"]].map(([l,v],i)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<4?"1px solid #F5F4F1":"none",fontSize:13,...(i===2?{fontWeight:700,color:"#10B981"}:{})}}><span style={{color:i===2?"#10B981":"#908C82"}}>{l}</span><b>{v}</b></div>)}
    </div>
    {reports.map(r=><div key={r.id} className="rpt-card">
      <div className="rpt-icon">{r.icon}</div>
      <div className="rpt-info"><h4>{r.title}</h4><p>{r.desc} · {r.format}</p></div>
      {exported[r.id]==="loading"?<button className="rpt-dl" style={{background:"#F5F4F1",color:"#908C82",minWidth:80}}>⏳ Export...</button>
      :exported[r.id]==="done"?<button className="rpt-dl" style={{background:"rgba(16,185,129,0.1)",color:"#10B981",borderColor:"rgba(16,185,129,0.2)",minWidth:80}}>✅ Prêt</button>
      :<button className="rpt-dl" onClick={()=>doExport(r.id)}>Exporter</button>}
    </div>)}
  </div>);
}

/* V16 ── VENDOR SUPPORT ── */
function VSupportScr({go,onBack,vendorPlan}){
  const [open,setOpen]=useState(null);
  const [tab,setTab]=useState(0);
  const [search,setSearch]=useState("");
  const [contactDone,setContactDone]=useState(false);
  const [ticketMsg,setTicketMsg]=useState("");
  const isEnt=vendorPlan==="enterprise";
  const isPro=vendorPlan==="pro"||isEnt;

  const faqCats=[
    {cat:"Commandes",icon:"📦",items:[
      {q:"Comment traiter une nouvelle commande ?",a:"Commandes → Nouvelle commande → Accepter → Préparer → Expédier. Vous pouvez assigner un livreur depuis le détail de la commande."},
      {q:"Comment refuser ou annuler une commande ?",a:"Détail commande → Bouton « Refuser » → Sélectionner un motif. Le client est automatiquement notifié et remboursé sous 48h."},
      {q:"Comment assigner un livreur à une commande ?",a:"Détail commande → « Assigner un livreur » → Choisir parmi les livreurs Lamuka disponibles ou vos livreurs ajoutés manuellement."},
      {q:"Comment suivre une livraison en cours ?",a:"Gestion livraison → Onglet « En cours » pour voir la progression en temps réel avec position du livreur et temps estimé."},
    ]},
    {cat:"Articles",icon:"🛍️",items:[
      {q:"Comment ajouter un article ?",a:"Tableau de bord → Onglet Articles → « + Ajouter ». Renseignez le nom, prix, description, photos et stock disponible."},
      {q:"Comment gérer mon stock ?",a:"Articles → Cliquez sur un article → Modifiez le stock. Les alertes stock faible se déclenchent automatiquement quand le stock passe sous 5 unités."},
      {q:"Combien de produits puis-je ajouter ?",a:"Starter : 10 produits max. Pro : illimité. Enterprise : illimité avec variantes avancées et import en masse."},
      {q:"Comment importer des articles en masse ?",a:isEnt?"Enterprise → API & Intégrations → Utilisez l'endpoint POST /v2/products/bulk ou importez via fichier CSV depuis Articles → Import.":"Cette fonctionnalité est réservée au plan Enterprise. Passez à Enterprise pour importer via API ou CSV."},
    ]},
    {cat:"Paiements",icon:"💳",items:[
      {q:"Quand reçois-je mes paiements ?",a:"Les paiements sont versés chaque lundi pour les commandes livrées la semaine précédente. Retrait disponible via Airtel Money ou MTN MoMo."},
      {q:"Quel est le montant minimum de retrait ?",a:"Le montant minimum est de 5 000 FCFA. Les frais de retrait sont offerts sur le plan Enterprise."},
      {q:"Quel est le taux de commission ?",a:"Starter : 8%, Pro : 4%, Enterprise : 2%. La commission est déduite automatiquement sur chaque vente avant versement."},
      {q:"Comment voir l'historique de mes transactions ?",a:"Portefeuille → Historique des transactions. Filtrez par type (ventes, retraits, commissions) et par période."},
    ]},
    {cat:"Livraison",icon:"🚚",items:[
      {q:"Comment ajouter des livreurs ?",a:"Gestion livraison → Onglet Livreurs. Les livreurs Lamuka inscrits apparaissent automatiquement. Vous pouvez aussi ajouter des livreurs manuellement via le bouton « + Ajouter »."},
      {q:"Comment définir mes zones de livraison ?",a:"Gestion livraison → Onglet Zones → Activez/désactivez les zones et définissez les tarifs par zone."},
      {q:"Comment contacter un livreur en cours de livraison ?",a:"Suivi livraison → Bouton « 💬 Contacter » pour le chat ou « 📞 » pour appeler directement."},
    ]},
    ...(isPro?[{cat:"Promotions",icon:"🏷️",items:[
      {q:"Comment créer une promotion ?",a:"Promotions → « + Créer » → Choisissez le type (pourcentage ou montant fixe), la durée, les produits concernés et un code promo optionnel."},
      {q:"Puis-je limiter une promotion ?",a:"Oui, vous pouvez définir un nombre maximum d'utilisations, un montant minimum de commande, et une période de validité."},
    ]}]:[]),
    ...(isEnt?[{cat:"Multi-boutiques",icon:"🏬",items:[
      {q:"Comment créer un nouvel établissement ?",a:"Mes établissements → « + Créer un nouvel établissement » → Choisissez le type (resto, boutique, pharmacie...), renseignez les infos, soumettez les documents. Validation sous 24-48h."},
      {q:"Comment gérer les équipes par établissement ?",a:"Détail établissement → Onglet « Équipe » → Invitez des collaborateurs avec le rôle Manager ou Employé. Chaque établissement a sa propre équipe."},
      {q:"Les statistiques sont-elles séparées par boutique ?",a:"Oui, chaque boutique a son propre dashboard avec CA, commandes, visiteurs et note. Le dashboard global agrège toutes les boutiques."},
      {q:"Puis-je mettre un établissement en pause ?",a:"Oui, Détail → Modifier → Visibilité → « En pause ». L'établissement sera masqué du marketplace mais vos données sont conservées."},
      {q:"Quel est le nombre maximum de boutiques ?",a:"Le plan Enterprise n'a pas de limite de boutiques. Chaque nouvelle boutique nécessite une vérification de documents séparée."},
    ]},{cat:"API",icon:"🔌",items:[
      {q:"Comment obtenir ma clé API ?",a:"API & Intégrations → Clé API → Afficher. Copiez la clé et utilisez-la dans vos requêtes avec le header Authorization."},
      {q:"Comment configurer les webhooks ?",a:"API & Intégrations → Webhooks → Cliquez sur un événement → Entrez l'URL de votre serveur → Sauver. Testez avec le bouton « 🧪 Tester »."},
      {q:"Que faire si ma clé API est compromise ?",a:"API & Intégrations → « 🔄 Régénérer la clé » immédiatement. L'ancienne clé sera invalidée et une nouvelle sera générée."},
      {q:"Existe-t-il un environnement de test ?",a:"Oui, utilisez l'environnement sandbox : sandbox.api.lamuka.cg/v2 avec des clés de test commençant par lmk_test_ent_."},
    ]}]:[]),
  ];

  const allFaqs=faqCats.flatMap(c=>c.items.map(i=>({...i,cat:c.cat,icon:c.icon})));
  const filtered=search?allFaqs.filter(f=>f.q.toLowerCase().includes(search.toLowerCase())||f.a.toLowerCase().includes(search.toLowerCase())):[];

  const guides=[
    {id:"onboarding",icon:"🚀",title:"Guide de démarrage",desc:"Premiers pas, configuration commerce, premier article",sections:[
      {title:"Bienvenue sur Lamuka !",content:"Ce guide vous accompagne dans la configuration de votre commerce. En suivant ces étapes, vous serez prêt à recevoir des commandes en moins de 30 minutes."},
      {title:"Étape 1 : Compléter votre profil",content:"Rendez-vous dans Paramètres pour ajouter votre logo, description, horaires d'ouverture et coordonnées. Un profil complet inspire confiance aux acheteurs."},
      {title:"Étape 2 : Ajouter vos articles",content:"Allez dans l'onglet Articles → « + Ajouter ». Ajoutez des photos de qualité, une description détaillée et un prix compétitif. Astuce : les articles avec 3+ photos se vendent 2x mieux."},
      {title:"Étape 3 : Configurer la livraison",content:"Gestion livraison → Zones → Activez vos zones de livraison. Les livreurs Lamuka inscrits dans ces zones seront automatiquement disponibles pour vos commandes."},
      {title:"Étape 4 : Recevoir votre premier paiement",content:"Portefeuille → Ajoutez votre numéro Mobile Money (Airtel ou MTN). Les versements sont effectués chaque lundi."},
      {title:"Étape 5 : Publier votre boutique",content:"Votre boutique est automatiquement visible sur le marketplace dès l'approbation de vos documents. Partagez le lien de votre boutique sur vos réseaux sociaux !"},
    ]},
    {id:"orders",icon:"📦",title:"Gestion des commandes",desc:"Cycle de vie, traitement, assignation livreur",sections:[
      {title:"Cycle de vie d'une commande",content:"Chaque commande passe par 4 statuts : Nouvelle → En préparation → Expédiée → Livrée. Vous pouvez aussi refuser une commande avec un motif."},
      {title:"Recevoir les notifications",content:"Activez les notifications push et SMS pour être alerté immédiatement des nouvelles commandes. Le temps de réponse est un critère important pour les acheteurs."},
      {title:"Préparer une commande",content:"Commande → Détail → « Commencer la préparation ». Vérifiez les articles, emballez soigneusement et passez au statut « Prêt à expédier »."},
      {title:"Assigner un livreur",content:"Vous pouvez choisir un livreur Lamuka disponible (badge vert « Lamuka ✓ ») ou un livreur que vous avez ajouté manuellement. Le livreur reçoit une notification avec l'adresse de livraison."},
      {title:"Gestion des retours",content:"Si un client demande un retour, vous serez notifié. Examinez la demande et acceptez ou refusez avec un motif. Les remboursements sont traités sous 48h."},
    ]},
    {id:"payments",icon:"💰",title:"Paiements & Facturation",desc:"Commissions, retraits, comptabilité",sections:[
      {title:"Comment fonctionne la facturation",content:"Lamuka prélève automatiquement une commission sur chaque vente. Le taux dépend de votre plan : Starter 8%, Pro 4%, Enterprise 2%."},
      {title:"Cycle de paiement",content:"Les paiements sont calculés chaque dimanche soir et versés le lundi matin. Le montant inclut toutes les commandes livrées dans la semaine."},
      {title:"Demander un retrait anticipé",content:"Vous pouvez demander un retrait à tout moment depuis Portefeuille → Retirer. Le versement est traité sous 24-48h par Mobile Money."},
      {title:"Comprendre les rapports financiers",content:isPro?"Rapports → Sélectionnez la période → Consultez le détail des ventes, commissions, et bénéfices nets par article, par jour et par établissement.":"Les rapports détaillés sont disponibles à partir du plan Pro."},
      {title:"Factures et fiscalité",content:"Chaque mois, une facture récapitulative est générée automatiquement. Téléchargez-la depuis Rapports → Factures pour votre comptabilité."},
    ]},
    ...(isEnt?[
      {id:"multishop",icon:"🏬",title:"Gestion multi-boutiques",desc:"Créer, gérer et optimiser plusieurs boutiques",sections:[
        {title:"Pourquoi plusieurs boutiques ?",content:"Le plan Enterprise vous permet de créer plusieurs boutiques distinctes, chacune avec sa propre identité, ses produits, son équipe et ses statistiques. Idéal pour séparer vos activités par catégorie ou par ville."},
        {title:"Créer un établissement",content:"Mes établissements → « + Créer » → Choisissez le type (resto, boutique, pharmacie...), renseignez le nom, la ville, les catégories et soumettez les documents requis. Chaque établissement est vérifié indépendamment sous 24-48h."},
        {title:"Gérer les équipes",content:"Chaque établissement peut avoir sa propre équipe avec 3 niveaux de rôles :\n\n• Propriétaire : accès total, gestion du plan et des paiements\n• Manager : gestion articles, commandes, livraisons, analytics\n• Employé : gestion commandes et articles uniquement\n\nInvitez des collaborateurs depuis l'onglet « Équipe » du détail établissement."},
        {title:"Dashboard global vs individuel",content:"Le dashboard Mes établissements affiche les statistiques agrégées de tous vos commerces. Cliquez sur un établissement pour voir ses statistiques individuelles : CA, commandes, visiteurs, note moyenne et top articles."},
        {title:"Visibilité et statuts",content:"Chaque établissement peut être :\n• 🟢 Actif : visible sur le marketplace\n• ⏸️ En pause : masqué temporairement (données conservées)\n• 🔴 Fermé : plus de commandes acceptées\n\nChangez la visibilité depuis Détail → Modifier → Visibilité."},
        {title:"Transfert de produits",content:"Vous pouvez dupliquer un produit d'une boutique à l'autre via l'API : GET le produit de la boutique source, puis POST vers la boutique cible avec le champ shop_id modifié."},
      ]},
      {id:"api",icon:"🔌",title:"Guide API complet",desc:"Intégration, webhooks, SDKs, best practices",sections:[
        {title:"Vue d'ensemble",content:"L'API Lamuka v2.0 permet d'intégrer votre boutique avec vos systèmes : ERP, CRM, site web, application mobile. Base URL : api.lamuka.cg/v2"},
        {title:"Authentification",content:"Utilisez votre clé API dans le header Authorization de chaque requête. Les clés Enterprise commencent par lmk_live_ent_. Gardez-la secrète et régénérez-la si compromise."},
        {title:"Rate limits",content:"Plan Enterprise : 10 000 requêtes/jour, 100 req/min. Les headers X-RateLimit-* indiquent votre consommation. En cas de dépassement, attendez le reset indiqué dans X-RateLimit-Reset."},
        {title:"Webhooks",content:"Recevez des notifications en temps réel sur votre serveur. Événements : order.created, payment.received, stock.low, review.created, driver.assigned. Vérifiez la signature HMAC SHA-256 pour la sécurité."},
        {title:"Environnement sandbox",content:"Testez vos intégrations en sandbox avant production. URL : sandbox.api.lamuka.cg/v2. Les clés sandbox commencent par lmk_test_ent_."},
        {title:"SDKs disponibles",content:"SDKs officiels : Node.js (@lamuka/sdk), Python (lamuka-sdk). Collection Postman importable depuis api.lamuka.cg/v2/postman."},
        {title:"Accéder à la documentation technique",content:"Pour les endpoints détaillés avec exemples de code, allez dans API & Intégrations → Documentation API depuis votre espace."},
      ]},
      {id:"sla",icon:"📋",title:"SLA & Engagement de service",desc:"Garanties, temps de réponse, disponibilité",sections:[
        {title:"Disponibilité plateforme",content:"Lamuka s'engage sur une disponibilité de 99.5% de la plateforme et de l'API pour les clients Enterprise. Les maintenances planifiées sont communiquées 48h à l'avance."},
        {title:"Temps de réponse support",content:"Plan Enterprise :\n• Manager dédié : réponse sous 2h (jours ouvrés)\n• Email support : réponse sous 4h\n• Urgences : hotline 24/7 au +242 06X XXX XXX\n\nPlan Pro :\n• Email support : réponse sous 12h\n• Chat : réponse sous 24h"},
        {title:"Traitement des paiements",content:"Versements hebdomadaires : chaque lundi. Retraits anticipés : traités sous 24h (Enterprise) ou 48h (autres plans). Les frais de retrait sont offerts pour le plan Enterprise."},
        {title:"Vérification des boutiques",content:"Nouvelles boutiques Enterprise : vérification prioritaire sous 12h (vs 24-48h pour les autres plans)."},
        {title:"Migration et onboarding",content:"Les nouveaux clients Enterprise bénéficient d'un accompagnement personnalisé :\n• Session onboarding 1h avec votre manager dédié\n• Migration de données depuis votre ancien système\n• Configuration API et webhooks assistée\n• Formation équipe (jusqu'à 5 personnes)"},
        {title:"Escalade",content:"En cas de problème non résolu :\n1. Manager dédié (première ligne)\n2. Responsable support technique\n3. Direction Lamuka\n\nChaque niveau a un délai de réponse garanti."},
      ]},
    ]:[]),
  ];

  const [guideOpen,setGuideOpen]=useState(null);

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>{isEnt?"Centre Enterprise":"Centre d'aide"}</h2><div style={{width:38}}/></div>

    {/* Enterprise badge */}
    {isEnt&&<div style={{margin:"0 20px 14px",padding:14,background:"linear-gradient(135deg,#F59E0B,#D97706)",borderRadius:14,color:"#fff"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:24}}>⭐</span>
        <div>
          <div style={{fontSize:14,fontWeight:700}}>Support Enterprise Premium</div>
          <div style={{fontSize:11,opacity:.8}}>Manager dédié · Réponse sous 2h · Hotline 24/7</div>
        </div>
      </div>
    </div>}

    {/* Search */}
    <div style={{padding:"0 20px 14px"}}><div className="sbar">🔍 <input placeholder="Rechercher dans la documentation..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>

    {/* Search results */}
    {search&&<div style={{padding:"0 20px 14px"}}>
      <div style={{fontSize:12,color:"#908C82",marginBottom:8}}>{filtered.length} résultat{filtered.length!==1?"s":""}</div>
      {filtered.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:"#908C82",fontSize:13}}>Aucun résultat pour « {search} »</div>}
      {filtered.map((f,i)=><div key={i} style={{padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:12,marginBottom:8,cursor:"pointer"}} onClick={()=>{setOpen(open===`s${i}`?null:`s${i}`)}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:12}}>{f.icon}</span><span style={{fontSize:10,color:"#908C82"}}>{f.cat}</span></div>
        <div style={{fontSize:13,fontWeight:600}}>{f.q}</div>
        {open===`s${i}`&&<div style={{fontSize:12,color:"#5E5B53",marginTop:8,lineHeight:1.6,paddingTop:8,borderTop:"1px solid #F5F4F1",whiteSpace:"pre-line"}}>{f.a}</div>}
      </div>)}
    </div>}

    {/* Tabs */}
    {!search&&<>
      <div style={{display:"flex",gap:0,margin:"0 20px 14px",background:"#F5F4F1",borderRadius:14,padding:4}}>
        {["📚 Guides","❓ FAQ","📞 Contact"].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",borderRadius:11,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:tab===i?"#6366F1":"transparent",color:tab===i?"#fff":"#908C82"}}>{t}</button>)}
      </div>

      {/* Tab 0: Guides */}
      {tab===0&&<div style={{padding:"0 20px 80px"}}>
        {guides.map(g=><div key={g.id}>
          <div style={{padding:14,background:"#fff",border:guideOpen===g.id?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:14,marginBottom:10,cursor:"pointer"}} onClick={()=>setGuideOpen(guideOpen===g.id?null:g.id)}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>{g.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700}}>{g.title}</div>
                <div style={{fontSize:11,color:"#908C82"}}>{g.desc}</div>
              </div>
              <span style={{fontSize:14,color:"#908C82",transform:guideOpen===g.id?"rotate(90deg)":"",transition:"transform .2s"}}>›</span>
            </div>
          </div>
          {guideOpen===g.id&&<div style={{padding:"0 0 10px 0",marginTop:-6}}>
            {g.sections.map((s,i)=><div key={i} style={{padding:14,marginLeft:20,borderLeft:"2px solid #6366F1",marginBottom:0,background:i%2===0?"#FAFAF8":"#fff"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                <span style={{width:20,height:20,borderRadius:6,background:"#6366F1",color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <h4 style={{fontSize:13,fontWeight:700}}>{s.title}</h4>
              </div>
              <p style={{fontSize:12,color:"#5E5B53",lineHeight:1.7,whiteSpace:"pre-line"}}>{s.content}</p>
            </div>)}
          </div>}
        </div>)}

        {isEnt&&<div style={{marginTop:10}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Documentation technique</div>
          <div className="menu-item" onClick={()=>go("vApi")}><div className="mi-i">🔌</div><span className="mi-t">API & Intégrations</span><span className="mi-s">Endpoints, clé API, webhooks</span><span className="mi-c">›</span></div>
        </div>}
      </div>}

      {/* Tab 1: FAQ */}
      {tab===1&&<div style={{padding:"0 20px 80px"}}>
        {faqCats.map((cat,ci)=><div key={cat.cat} style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><span style={{fontSize:16}}>{cat.icon}</span><h4 style={{fontSize:14,fontWeight:700}}>{cat.cat}</h4><span style={{fontSize:11,color:"#908C82"}}>({cat.items.length})</span></div>
          {cat.items.map((f,fi)=>{const k=`${ci}-${fi}`;return(<div key={k} style={{padding:12,background:"#fff",border:open===k?"1px solid #6366F1":"1px solid #E8E6E1",borderRadius:12,marginBottom:6,cursor:"pointer"}} onClick={()=>setOpen(open===k?null:k)}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600,flex:1}}>{f.q}</span>
              <span style={{fontSize:14,color:"#6366F1",transform:open===k?"rotate(45deg)":"",transition:"transform .2s",flexShrink:0,marginLeft:8}}>+</span>
            </div>
            {open===k&&<div style={{fontSize:12,color:"#5E5B53",marginTop:8,lineHeight:1.7,paddingTop:8,borderTop:"1px solid #F5F4F1",whiteSpace:"pre-line"}}>{f.a}</div>}
          </div>)})}
        </div>)}
      </div>}

      {/* Tab 2: Contact */}
      {tab===2&&<div style={{padding:"0 20px 80px"}}>
        {isEnt&&<div style={{padding:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",borderRadius:16,marginBottom:14,color:"#fff"}}>
          <h4 style={{fontSize:15,fontWeight:700,marginBottom:6}}>👤 Votre manager dédié</h4>
          <div style={{fontSize:13,marginBottom:4}}>Sophie Mabika</div>
          <div style={{fontSize:11,opacity:.8,lineHeight:1.6}}>📧 sophie.mabika@lamuka.cg{"\n"}📞 +242 06X XXX XXX{"\n"}💬 WhatsApp disponible{"\n"}⏱️ Lun-Ven 8h-18h · Réponse sous 2h</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📞 Appeler</button>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💬 WhatsApp</button>
          </div>
        </div>}

        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Canaux de support</div>
        {[
          ["💬","WhatsApp","+242 064 663 469","Réponse rapide",true],
          ["📧","Email","support@lamuka.cg",isEnt?"Sous 4h":"Sous 24h",true],
          ...(isEnt?[["📞","Hotline Enterprise","24/7","Urgences uniquement",true]]:[]),
          ["🐦","Twitter / X","@LamukaSupport","Lun-Ven",true],
        ].map(([i,t,d,time,active])=><div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:10}}>
          <span style={{fontSize:22}}>{i}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600}}>{t}</div>
            <div style={{fontSize:11,color:"#908C82"}}>{d}</div>
          </div>
          <span style={{padding:"4px 10px",borderRadius:8,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:600}}>{time}</span>
        </div>)}

        <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Envoyer un ticket</div>
        <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
          {contactDone
            ?<div style={{textAlign:"center",padding:"20px 0"}}><div style={{fontSize:36,marginBottom:8}}>✅</div><div style={{fontSize:14,fontWeight:700}}>Ticket envoyé !</div><div style={{fontSize:12,color:"#908C82",marginTop:4}}>Réponse {isEnt?"sous 2h":"sous 24h"} · Réf: #TK-{Math.floor(Math.random()*9000)+1000}</div><button style={{marginTop:12,padding:"8px 20px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setContactDone(false);setTicketMsg("")}}>Nouveau ticket</button></div>
            :<>
              <div className="field"><label>Catégorie</label><select><option>Problème technique</option><option>Paiement / Facturation</option><option>Commande spécifique</option><option>Livreur / Livraison</option><option>Suggestion / Feedback</option>{isEnt&&<option>API / Intégration</option>}{isEnt&&<option>Multi-boutiques</option>}</select></div>
              <div className="field"><label>Sujet</label><input placeholder="Décrivez brièvement le problème"/></div>
              <div className="field"><label>Message</label><textarea rows={3} value={ticketMsg} onChange={e=>setTicketMsg(e.target.value)} placeholder="Donnez-nous tous les détails pour vous aider au mieux..."/></div>
              <div className="field"><label>Pièce jointe (optionnel)</label><div style={{padding:20,border:"1px dashed #E8E6E1",borderRadius:12,textAlign:"center",color:"#908C82",fontSize:12,cursor:"pointer"}}>📎 Cliquez pour joindre un fichier (capture d'écran, document...)</div></div>
              <button className="btn-primary" style={{background:ticketMsg?"#6366F1":"#E8E6E1",color:ticketMsg?"#fff":"#908C82"}} onClick={()=>{if(ticketMsg)setContactDone(true)}}>📤 Envoyer le ticket{isEnt?" (prioritaire)":""}</button>
            </>
          }
        </div>
      </div>}
    </>}
  </div>);
}

/* V17 ── VENDOR PROFILE (Hub) ── */

/* ── BUYER → VENDOR CHAT ── */
function ChatVendorScr({vendor:v,onBack}){
  const [msgs,setMsgs]=useState([
    {from:"bot",text:`Bienvenue chez ${v.name} ! 👋 Comment pouvons-nous vous aider ?`,time:"14:30"},
    {from:"user",text:"Bonjour ! Est-ce que la Robe Wax est disponible en taille M ?",time:"14:31"},
    {from:"bot",text:"Oui, nous avons la taille M en stock ! Voulez-vous la commander directement ?",time:"14:31"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");
    setTimeout(()=>{const r=["Bien sûr, je vérifie pour vous ! 👍","Oui c'est disponible ! Voulez-vous commander ?","Merci pour votre intérêt ! Nous avons plusieurs modèles.","Je vous envoie les détails tout de suite.","N'hésitez pas si vous avez d'autres questions !","La livraison est possible demain à Brazzaville."];setMsgs(p=>[...p,{from:"bot",text:r[Math.floor(Math.random()*r.length)],time}])},1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:v.verified?"linear-gradient(135deg,#6366F1,#A855F7)":"#F5F4F1"}}>{v.avatar}</div><div className="ch-info"><h4>{v.name}{v.verified?" ✓":""}</h4><p>🟢 En ligne · {v.loc}</p></div></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={`Message à ${v.name}...`} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send}>➤</button></div>
  </div>);
}

function VProfileScr({go,onSwitch,vendorPlan,onLogout}){
  const planInfo=vendorPlan==="starter"?{name:"Starter",color:"#908C82",badge:"Gratuit"}:vendorPlan==="pro"?{name:"Pro",color:"#6366F1",badge:"Pro ✓"}:{name:"Enterprise",color:"#F59E0B",badge:"Enterprise ★"};
  return(<div className="scr">
    <div className="appbar"><h2>Mon Espace</h2><button onClick={()=>go("vSettings")}>⚙️</button></div>
    <div className="vs-header"><div className="vs-logo">👔</div><h3 style={{fontSize:18,fontWeight:700}}>Mon Commerce</h3><p style={{fontSize:12,color:"#908C82"}}>Plan <span style={{color:planInfo.color,fontWeight:700}}>{planInfo.badge}</span></p></div>
    <div className="wallet" style={{margin:"0 20px 16px"}}><div><p style={{fontSize:11,opacity:.7}}>Solde disponible</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2}}>457 800 FCFA</h3></div><button onClick={()=>go("vWallet")}>Retirer</button></div>
    {[["📊","Statistiques","Voir analytics",vendorPlan!=="starter"?()=>go("vStats"):null],["⭐","Avis clients","4.6 / 5",()=>go("vReviews")],["🏬","Mes établissements",vendorPlan==="enterprise"?"3 établissements":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vShops"):null],["🏷️","Promotions",vendorPlan==="starter"?"Plan Pro requis":"2 actives",vendorPlan!=="starter"?()=>go("vPromos"):null],["🚚","Livraison","3 livreurs",()=>go("vDelivery")],["📄","Rapports",vendorPlan==="starter"?"Plan Pro requis":"Février 2026",vendorPlan!=="starter"?()=>go("vReports"):null],["🔌","API & Intégrations",vendorPlan==="enterprise"?"Clé active":"Plan Enterprise requis",vendorPlan==="enterprise"?()=>go("vApi"):null],["🆘","Support",vendorPlan==="enterprise"?"Manager dédié":"Centre d'aide",()=>go("vSupport")]].map(([i,t,s,fn])=><div key={t} className="menu-item" onClick={fn||undefined} style={!fn?{opacity:.5}:{}}><div className="mi-i">{i}</div><span className="mi-t">{t}</span><span className="mi-s">{s}</span>{fn?<span className="mi-c">›</span>:!fn&&<span style={{padding:"2px 8px",borderRadius:6,background:"rgba(239,68,68,0.08)",color:"#EF4444",fontSize:9,fontWeight:700}}>🔒</span>}</div>)}
    {vendorPlan==="starter"&&<div style={{margin:"0 20px 14px",padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,cursor:"pointer"}} onClick={()=>go("vUpgradePlan")}>
      <div style={{fontSize:13,fontWeight:700,color:"#6366F1"}}>⬆️ Passer au plan Pro</div>
      <div style={{fontSize:11,color:"#5E5B53",marginTop:4}}>Débloquez les analytics, promotions, rapports et le badge vérifié.</div>
    </div>}
    <div className="vendor-cta" style={{background:"linear-gradient(135deg,#3B82F6,#1D4ED8)"}} onClick={onSwitch}><span style={{fontSize:28}}>🛍️</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Passer en mode Acheteur</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Retourner au marketplace</div></div><span style={{fontSize:18}}>→</span></div>
    <button style={{margin:"0 20px 80px",width:"calc(100% - 40px)",padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>
  </div>);
}

/* V18 ── MULTI-SHOP MANAGEMENT (Enterprise) ── */
function VShopsScr({go,onBack}){
  const [shops,setShops]=useState([
    {id:"s1",name:"Ma Boutique Congo",type:"boutique",typeIcon:"🏪",location:"Brazzaville, Bacongo",logo:"👔",status:"active",revenue:457800,orders:48,products:32,rating:4.6,views:1240,clients:186,returns:2,created:"Jan 2026"},
    {id:"s2",name:"Chez Mama Ngudi",type:"restaurant",typeIcon:"🍽️",location:"Pointe-Noire, Centre",logo:"🍽️",status:"active",revenue:285000,orders:31,products:18,rating:4.4,views:890,clients:124,returns:1,created:"Fév 2026"},
    {id:"s3",name:"Congo Tech Store",type:"boutique",typeIcon:"🏪",location:"Brazzaville, Centre",logo:"💻",status:"pending",revenue:0,orders:0,products:5,rating:0,views:0,clients:0,returns:0,created:"Fév 2026"},
  ]);
  const active=shops.filter(s=>s.status==="active");
  const totalRev=active.reduce((s,sh)=>s+sh.revenue,0);
  const totalOrders=active.reduce((s,sh)=>s+sh.orders,0);
  const totalProducts=active.reduce((s,sh)=>s+sh.products,0);
  const totalViews=active.reduce((s,sh)=>s+sh.views,0);
  const totalClients=active.reduce((s,sh)=>s+sh.clients,0);
  const avgRating=active.length?(active.reduce((s,sh)=>s+sh.rating,0)/active.length).toFixed(1):0;
  const totalReturns=active.reduce((s,sh)=>s+sh.returns,0);
  const commission=Math.round(totalRev*0.02);
  const [showStats,setShowStats]=useState(false);

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Mes établissements</h2><button style={{width:38,height:38,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("vAddShop")}>+</button></div>

    {/* Enterprise overall banner */}
    <div style={{margin:"0 20px 14px",padding:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",borderRadius:16,color:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div><div style={{fontSize:11,opacity:.7}}>Plan Enterprise · Vue globale</div><div style={{fontSize:22,fontWeight:700,marginTop:2}}>{fmt(totalRev)}</div><div style={{fontSize:11,opacity:.7}}>Chiffre d'affaires total</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:18,fontWeight:700}}>{shops.length}</div><div style={{fontSize:11,opacity:.7}}>boutiques</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
        {[["📦",totalOrders,"Cmd"],["🛍️",totalProducts,"Prod."],["👁️",totalViews,"Vues"],["⭐",avgRating,"Note"]].map(([i,v,l])=><div key={l} style={{padding:8,background:"rgba(255,255,255,0.15)",borderRadius:10,textAlign:"center"}}>
          <div style={{fontSize:14,fontWeight:700}}>{v}</div>
          <div style={{fontSize:9,opacity:.7}}>{l}</div>
        </div>)}
      </div>
      <button style={{width:"100%",marginTop:10,padding:8,borderRadius:8,border:"none",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowStats(!showStats)}>{showStats?"▲ Masquer les détails":"▼ Voir les statistiques détaillées"}</button>
    </div>

    {/* Expanded stats */}
    {showStats&&<div style={{margin:"0 20px 14px"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[["💰","CA net (après commission)",fmt(totalRev-commission),"↑ 18% vs mois dernier","#10B981"],
          ["💳","Commission Lamuka (2%)",fmt(commission),"Déduite automatiquement","#F59E0B"],
          ["👥","Clients uniques",totalClients,"↑ 24%","#6366F1"],
          ["🔄","Retours",totalReturns,totalReturns<5?"Excellent":"À surveiller",totalReturns<5?"#10B981":"#EF4444"],
        ].map(([i,l,v,t,c])=><div key={l} style={{padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14}}>
          <div style={{fontSize:16,marginBottom:4}}>{i}</div>
          <div style={{fontSize:16,fontWeight:700}}>{v}</div>
          <div style={{fontSize:10,color:"#908C82"}}>{l}</div>
          <div style={{fontSize:10,color:c,fontWeight:600,marginTop:4}}>{t}</div>
        </div>)}
      </div>

      <div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Performance par boutique</div>
        {active.map(sh=><div key={sh.id} style={{display:"flex",alignItems:"center",gap:10,padding:8,borderBottom:"1px solid #F5F4F1"}}>
          <span style={{fontSize:16}}>{sh.typeIcon}</span>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{sh.name}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:700,color:"#6366F1"}}>{fmt(sh.revenue)}</div><div style={{fontSize:9,color:"#908C82"}}>{sh.orders} cmd · ⭐ {sh.rating}</div></div>
        </div>)}
      </div>

      <div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>Répartition du CA</div>
        {active.map(sh=>{const pct=totalRev>0?Math.round(sh.revenue/totalRev*100):0;return(
          <div key={sh.id} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}><span style={{fontWeight:600}}>{sh.typeIcon} {sh.name}</span><span style={{color:"#908C82"}}>{pct}%</span></div>
            <div style={{height:8,background:"#F5F4F1",borderRadius:4,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#6366F1,#A855F7)",borderRadius:4}}/></div>
          </div>
        )})}
      </div>
    </div>}

    {/* Shop list */}
    <div style={{padding:"0 20px"}}>
      {shops.map(sh=><div key={sh.id} style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:12,cursor:"pointer"}} onClick={()=>go("vShopDetail",sh)}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:48,height:48,borderRadius:14,background:sh.status==="active"?"linear-gradient(135deg,#6366F1,#A855F7)":"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{sh.logo}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:15,fontWeight:700}}>{sh.name}</h4>
              <span style={{padding:"2px 8px",borderRadius:6,background:sh.status==="active"?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",color:sh.status==="active"?"#10B981":"#F59E0B",fontSize:10,fontWeight:700}}>{sh.status==="active"?"Active":"En attente"}</span>
            </div>
            <p style={{fontSize:12,color:"#908C82",marginTop:2}}>{sh.typeIcon} {sh.type==="restaurant"?"Restaurant":"Boutique"} · 📍 {sh.location}</p>
          </div>
          <span style={{fontSize:16,color:"#908C82"}}>›</span>
        </div>
        {sh.status==="active"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
          {[["💰",fmt(sh.revenue),"CA"],["📦",sh.orders,"Cmd"],["🛍️",sh.products,"Prod."],["⭐",sh.rating||"—","Note"]].map(([i,v,l])=><div key={l} style={{textAlign:"center",padding:8,background:"#F5F4F1",borderRadius:10}}>
            <div style={{fontSize:12,fontWeight:700}}>{v}</div>
            <div style={{fontSize:9,color:"#908C82"}}>{l}</div>
          </div>)}
        </div>}
        {sh.status==="pending"&&<div className="info-box yellow" style={{margin:0,padding:"8px 12px"}}><span>⏳</span><span style={{fontSize:11}}>En cours de vérification · Documents soumis le {sh.created}</span></div>}
      </div>)}
    </div>

    <div style={{padding:"0 20px 80px"}}><button className="btn-primary" onClick={()=>go("vAddShop")}>+ Créer un nouvel établissement</button></div>
  </div>);
}

/* V18b ── SHOP TEAM TAB (sub-component) ── */
function ShopTeamTab(){
  const initMembers=[
    {id:"m1",name:"Joeldy Tsina",role:"Propriétaire",email:"joeldytsina94@gmail.com",avatar:"J",color:"#6366F1"},
    {id:"m2",name:"Marie Loubaki",role:"Manager",email:"marie.l@email.com",avatar:"M",color:"#10B981"},
    {id:"m3",name:"Paul Nkaya",role:"Employé",email:"paul.n@email.com",avatar:"P",color:"#F59E0B"}
  ];
  const [members,setMembers]=useState(initMembers);
  const [showInvite,setShowInvite]=useState(false);
  const [invName,setInvName]=useState("");
  const [invEmail,setInvEmail]=useState("");
  const [invRole,setInvRole]=useState("Employé");
  const [showRemove,setShowRemove]=useState(null);
  const [invited,setInvited]=useState(false);

  const removeMember=id=>{ setMembers(members.filter(m=>m.id!==id)); setShowRemove(null); };
  const doInvite=()=>{
    if(!invName||!invEmail)return;
    setMembers([...members,{id:"m"+Date.now(),name:invName,role:invRole,email:invEmail,avatar:invName[0].toUpperCase(),color:invRole==="Manager"?"#10B981":"#F59E0B"}]);
    setInvName("");setInvEmail("");setInvRole("Employé");setInvited(true);
    setTimeout(()=>{setInvited(false);setShowInvite(false)},2000);
  };
  const roleColor=r=>r==="Propriétaire"?"#6366F1":r==="Manager"?"#10B981":"#F59E0B";

  return(<div style={{padding:"0 20px 80px"}}>
    <div className="info-box blue" style={{marginBottom:14}}><span>👥</span><span style={{fontSize:11}}>Gérez les collaborateurs de cette boutique</span></div>

    {members.map(m=><div key={m.id} style={{padding:14,background:showRemove===m.id?"rgba(239,68,68,0.02)":"#fff",border:showRemove===m.id?"1px solid rgba(239,68,68,0.3)":"1px solid #E8E6E1",borderRadius:14,marginBottom:10,transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:42,height:42,borderRadius:12,background:m.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,flexShrink:0}}>{m.avatar}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:600}}>{m.name}</div>
          <div style={{fontSize:11,color:"#908C82"}}>{m.email}</div>
        </div>
        <span style={{padding:"4px 10px",borderRadius:8,background:`${roleColor(m.role)}12`,color:roleColor(m.role),fontSize:10,fontWeight:700}}>{m.role}</span>
      </div>
      {m.role!=="Propriétaire"&&<div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
        <select defaultValue={m.role} style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",fontSize:11,fontFamily:"inherit",background:"#fff"}}>
          <option>Manager</option><option>Employé</option>
        </select>
        {showRemove===m.id
          ?<div style={{display:"flex",gap:6}}>
            <button style={{padding:"8px 12px",borderRadius:8,border:"none",background:"#EF4444",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>removeMember(m.id)}>Confirmer</button>
            <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRemove(null)}>Annuler</button>
          </div>
          :<button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowRemove(m.id)}>Retirer</button>
        }
      </div>}
    </div>)}

    {/* Invite form */}
    {showInvite?<div style={{padding:16,background:"#fff",border:"2px solid #6366F1",borderRadius:16,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>📩 Inviter un collaborateur</h4>
      <div className="field"><label>Nom complet</label><input value={invName} onChange={e=>setInvName(e.target.value)} placeholder="Ex: Sarah Mouanda"/></div>
      <div className="field"><label>Email</label><input value={invEmail} onChange={e=>setInvEmail(e.target.value)} placeholder="sarah@email.com" type="email"/></div>
      <div className="field"><label>Rôle</label>
        <div style={{display:"flex",gap:8}}>
          {["Manager","Employé"].map(r=><button key={r} onClick={()=>setInvRole(r)} style={{flex:1,padding:10,borderRadius:10,border:invRole===r?"2px solid #6366F1":"1px solid #E8E6E1",background:invRole===r?"rgba(99,102,241,0.04)":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:invRole===r?"#6366F1":"#908C82"}}>{r}</button>)}
        </div>
      </div>
      <div className="info-box blue" style={{marginBottom:10,padding:"6px 10px"}}><span>📧</span><span style={{fontSize:11}}>Un email d'invitation sera envoyé à cette adresse</span></div>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowInvite(false);setInvName("");setInvEmail("")}}>Annuler</button>
        <button className="btn-primary" style={{flex:2,background:invited?"#10B981":(invName&&invEmail)?"#6366F1":"#E8E6E1",color:(invName&&invEmail)||invited?"#fff":"#908C82"}} onClick={doInvite}>{invited?"✅ Invitation envoyée !":"📤 Envoyer l'invitation"}</button>
      </div>
    </div>
    :<button className="btn-primary" onClick={()=>setShowInvite(true)}>+ Inviter un collaborateur</button>}

    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Rôles et permissions</div>
    <div style={{padding:14,background:"#F5F4F1",borderRadius:14}}>
      {[["Propriétaire","Accès total, facturation, suppression établissement"],["Manager","Articles, commandes, livraisons, analytics, promotions"],["Employé","Commandes et gestion des articles uniquement"]].map(([r,d],i)=><div key={r} style={{display:"flex",gap:8,padding:"8px 0",...(i<2?{borderBottom:"1px solid #E8E6E1"}:{}),fontSize:12}}>
        <b style={{minWidth:85,color:roleColor(r)}}>{r}</b><span style={{color:"#908C82"}}>{d}</span>
      </div>)}
    </div>
  </div>);
}

/* V18c ── SHOP DETAIL ── */
function VShopDetailScr({shop:sh,go,onBack}){
  const [tab,setTab]=useState(0);
  const isActive=sh.status==="active";
  const allCats=["Mode","Accessoires","Beauté","Artisanat","Électronique","Alimentation","Maison","Sport"];
  const [selCats,setSelCats]=useState(["Mode","Accessoires"]);
  const [visibility,setVisibility]=useState("active");
  const [saved,setSaved]=useState(false);
  const toggleCat=c=>setSelCats(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);
  const doSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)}

  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>{sh.name}</h2><div style={{width:38}}/></div>

    {/* Shop header */}
    <div style={{textAlign:"center",padding:"0 20px 16px"}}>
      <div style={{width:72,height:72,borderRadius:20,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:34}}>{sh.logo}</div>
      <h3 style={{fontSize:18,fontWeight:700}}>{sh.name}</h3>
      <p style={{fontSize:12,color:"#908C82"}}>📍 {sh.location} · Créée en {sh.created}</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
        <span style={{padding:"4px 12px",borderRadius:8,background:isActive?"rgba(16,185,129,0.1)":"rgba(245,158,11,0.1)",color:isActive?"#10B981":"#F59E0B",fontSize:12,fontWeight:600}}>{isActive?"✅ Active":"⏳ En attente"}</span>
        <span style={{padding:"4px 12px",borderRadius:8,background:"rgba(245,158,11,0.1)",color:"#F59E0B",fontSize:12,fontWeight:600}}>Enterprise ★</span>
      </div>
    </div>

    {/* Tabs */}
    {isActive&&<>
      <div style={{display:"flex",gap:0,margin:"0 20px 14px",background:"#F5F4F1",borderRadius:14,padding:4}}>
        {["Dashboard","Modifier","Équipe"].map((t,i)=><button key={t} onClick={()=>setTab(i)} style={{flex:1,padding:"10px 4px",borderRadius:11,border:"none",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",background:tab===i?"#6366F1":"transparent",color:tab===i?"#fff":"#908C82"}}>{t}</button>)}
      </div>

      {/* Tab 0: Dashboard */}
      {tab===0&&<div style={{padding:"0 20px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[["💰","Chiffre d'affaires",fmt(sh.revenue),"↑ 18%","#10B981"],["📦","Commandes",sh.orders,"↑ 12%","#6366F1"],["👁️","Visiteurs",sh.views,"↑ 24%","#F59E0B"],["⭐","Note moyenne",sh.rating,"↑ 0.3","#10B981"]].map(([i,l,v,t,c])=><div key={l} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14}}>
            <div style={{fontSize:18,marginBottom:6}}>{i}</div>
            <div style={{fontSize:18,fontWeight:700}}>{v}</div>
            <div style={{fontSize:11,color:"#908C82"}}>{l}</div>
            <div style={{fontSize:11,color:c,fontWeight:600,marginTop:4}}>{t}</div>
          </div>)}
        </div>

        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Top produits</div>
        {[{name:"Robe Wax Ankara",sold:24,rev:360000},{name:"Sac Cuir Artisanal",sold:18,rev:270000},{name:"Bracelet Perles Congo",sold:15,rev:75000}].map((p,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:12,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:10,background:["#6366F1","#F59E0B","#10B981"][i],color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{i+1}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:"#908C82"}}>{p.sold} vendus</div></div>
          <b style={{fontSize:13,color:"#6366F1"}}>{fmt(p.rev)}</b>
        </div>)}

        <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Actions rapides</div>
        {[["📦","Voir les commandes",()=>go("vOrdersList")],["🛍️","Gérer les produits",()=>go("vProducts")],["📊","Voir les statistiques",()=>go("vStats")]].map(([i,t,fn])=><div key={t} className="menu-item" onClick={fn}><div className="mi-i">{i}</div><span className="mi-t">{t}</span><span className="mi-c">›</span></div>)}
      </div>}

      {/* Tab 1: Modifier */}
      {tab===1&&<div style={{padding:"0 20px 80px"}}>
        <div className="field"><label>Nom de l'établissement</label><input defaultValue={sh.name}/></div>
        <div className="field"><label>Description</label><textarea rows={3} defaultValue="Commerce de mode et accessoires africains authentiques."/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input defaultValue={sh.location.split(",")[0]}/></div><div className="field"><label>Quartier</label><input defaultValue={sh.location.split(",")[1]?.trim()}/></div></div>
        <div className="field"><label>Téléphone</label><input defaultValue="+242 06X XXX XXX"/></div>
        <div className="field"><label>Horaires d'ouverture</label><input defaultValue="Lun-Sam 8h-18h"/></div>

        <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Catégories</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
          {allCats.map(c=><span key={c} onClick={()=>toggleCat(c)} style={{padding:"8px 14px",borderRadius:10,background:selCats.includes(c)?"rgba(99,102,241,0.08)":"#fff",border:selCats.includes(c)?"2px solid #6366F1":"1px solid #E8E6E1",color:selCats.includes(c)?"#6366F1":"#908C82",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{selCats.includes(c)?"✓ ":""}{c}</span>)}
        </div>

        <div style={{fontSize:14,fontWeight:700,margin:"10px 0 10px"}}>Visibilité</div>
        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["active","🟢 Active","Visible sur le marketplace"],["pause","⏸️ En pause","Masquée temporairement"],["close","🔴 Fermée","Plus de commandes"]].map(([k,l,d])=><div key={k} onClick={()=>setVisibility(k)} style={{flex:1,padding:12,background:visibility===k?(k==="active"?"rgba(16,185,129,0.04)":k==="pause"?"rgba(245,158,11,0.04)":"rgba(239,68,68,0.04)"):"#fff",border:visibility===k?(k==="active"?"2px solid #10B981":k==="pause"?"2px solid #F59E0B":"2px solid #EF4444"):"1px solid #E8E6E1",borderRadius:12,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
            <div style={{fontSize:12,fontWeight:700}}>{l}</div>
            <div style={{fontSize:9,color:"#908C82",marginTop:4}}>{d}</div>
          </div>)}
        </div>

        <div className="info-box yellow" style={{marginBottom:10}}><span>⚠️</span><span style={{fontSize:11}}>Les modifications sont appliquées immédiatement sur le marketplace.</span></div>
        <button className="btn-primary" style={{background:saved?"#10B981":"#6366F1"}} onClick={doSave}>{saved?"✅ Modifications enregistrées":"💾 Enregistrer les modifications"}</button>
      </div>}

      {/* Tab 2: Équipe */}
      {tab===2&&<ShopTeamTab/>}
    </>}

    {/* Pending shop */}
    {!isActive&&<div style={{padding:"0 20px"}}>
      <div style={{textAlign:"center",padding:"30px 20px",background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
        <div style={{fontSize:48,marginBottom:10}}>⏳</div>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>Vérification en cours</h3>
        <p style={{fontSize:13,color:"#908C82",lineHeight:1.6}}>Vos documents sont en cours d'examen. Vous serez notifié dès l'approbation (24-48h).</p>
        <div style={{marginTop:16}}>
          {[["Documents soumis","✅"],["Vérification identité","⏳"],["Validation finale","⬜"]].map(([l,s])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:"1px solid #F5F4F1",fontSize:13}}><span>{l}</span><span>{s}</span></div>)}
        </div>
      </div>
    </div>}
  </div>);
}

/* V18c ── ADD SHOP ── */
function VAddShopScr({onBack}){
  const [step,setStep]=useState(0);const [docs,setDocs]=useState({id:false,rccm:false,photo:false});const [done,setDone]=useState(false);
  const [shopType,setShopType]=useState(null);
  const [selCats,setSelCats]=useState([]);
  const [shopName,setShopName]=useState("");const [shopCity,setShopCity]=useState("");const [shopArea,setShopArea]=useState("");
  const steps=["Type","Infos","Documents","Confirmation"];
  const toggleCat=c=>setSelCats(p=>p.includes(c)?p.filter(x=>x!==c):[...p,c]);

  const shopTypes=[
    {id:"boutique",icon:"🏪",name:"Boutique",desc:"Mode, électronique, artisanat, accessoires..."},
    {id:"restaurant",icon:"🍽️",name:"Restaurant",desc:"Plats cuisinés, snacks, boissons, traiteur"},
    {id:"patisserie",icon:"🧁",name:"Pâtisserie / Boulangerie",desc:"Gâteaux, pains, viennoiseries, confiseries"},
    {id:"supermarche",icon:"🛒",name:"Supermarché / Épicerie",desc:"Produits alimentaires, ménagers, du quotidien"},
    {id:"pharmacie",icon:"💊",name:"Pharmacie / Parapharmacie",desc:"Médicaments, cosmétiques, produits de santé"},
    {id:"service",icon:"🔧",name:"Service",desc:"Réparation, beauté, impression, pressing..."},
  ];

  const catsByType={
    boutique:["Mode","Accessoires","Électronique","Beauté","Maison","Artisanat","Sport","Bijoux","Chaussures"],
    restaurant:["Africain","Braisé","Fast-food","Pizzeria","Asiatique","Libanais","Traiteur","Boissons","Végétarien"],
    patisserie:["Gâteaux","Pâtisseries","Boulangerie","Viennoiseries","Confiseries","Glaces","Chocolat","Gâteaux sur commande"],
    supermarche:["Alimentation","Fruits & Légumes","Boissons","Ménager","Bébé","Hygiène","Conserves","Surgelés"],
    pharmacie:["Médicaments","Cosmétiques","Hygiène","Compléments","Matériel médical","Parapharmacie"],
    service:["Coiffure","Couture","Réparation","Impression","Pressing","Beauté","Photo","Événementiel"],
  };

  if(done)return(<div className="scr" style={{textAlign:"center",padding:20}}><div style={{padding:"40px 0"}}>
    <div style={{fontSize:48,marginBottom:10}}>🎉</div>
    <h3 style={{fontSize:18,fontWeight:700}}>Boutique créée !</h3>
    <p style={{fontSize:14,fontWeight:600,color:"#6366F1",marginTop:4}}>{shopTypes.find(t=>t.id===shopType)?.icon} {shopName||"Nouvelle boutique"}</p>
    <p style={{fontSize:13,color:"#908C82",marginTop:6,lineHeight:1.6}}>En cours de vérification · Validation sous 24-48h.</p>
    <button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour aux boutiques</button>
  </div></div>);

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={()=>step>0?setStep(step-1):onBack()}>←</button><h2>Nouvelle boutique</h2><div style={{width:38}}/></div>
    <div className="vr-steps">{steps.map((s,i)=><div key={s} style={{display:"contents"}}>{i>0&&<div className={`vr-line ${step>=i?"on":""}`}/>}<div className="step-col"><div className={`vr-dot ${step>i?"done":step>=i?"on":""}`}>{step>i?"✓":i+1}</div><div className={`vr-lbl ${step>=i?"on":""}`}>{s}</div></div></div>)}</div>
    <div className="scr" style={{padding:20}}>

      {/* Step 0: Shop type */}
      {step===0&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:6}}>Type d'établissement</h3>
        <p style={{fontSize:12,color:"#908C82",marginBottom:14}}>Choisissez le type qui correspond le mieux à votre activité</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {shopTypes.map(t=><div key={t.id} onClick={()=>setShopType(t.id)} style={{padding:16,background:shopType===t.id?"rgba(99,102,241,0.04)":"#fff",border:shopType===t.id?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
            <div style={{fontSize:32,marginBottom:6}}>{t.icon}</div>
            <div style={{fontSize:13,fontWeight:700}}>{t.name}</div>
            <div style={{fontSize:10,color:"#908C82",marginTop:4,lineHeight:1.4}}>{t.desc}</div>
          </div>)}
        </div>
      </>}

      {/* Step 1: Info */}
      {step===1&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:4}}>Informations</h3>
        <p style={{fontSize:11,color:"#908C82",marginBottom:14}}>{shopTypes.find(t=>t.id===shopType)?.icon} {shopTypes.find(t=>t.id===shopType)?.name}</p>
        <div className="vr-upload"><div className="vu-icon">🖼️</div><b>{shopType==="restaurant"?"Photo du restaurant":shopType==="patisserie"?"Photo de la pâtisserie":"Logo de la boutique"}</b><p>PNG, JPG · Max 2MB</p></div>
        <div className="field"><label>Nom {shopType==="restaurant"?"du restaurant":shopType==="patisserie"?"de la pâtisserie":"de la boutique"}</label><input value={shopName} onChange={e=>setShopName(e.target.value)} placeholder={shopType==="restaurant"?"Ex: Chez Mama Ngudi":shopType==="patisserie"?"Ex: Pâtisserie La Congolaise":"Ex: Congo Tech Store"}/></div>
        <div className="field"><label>Description</label><textarea rows={2} placeholder={shopType==="restaurant"?"Type de cuisine, spécialités, ambiance...":shopType==="patisserie"?"Vos spécialités, horaires de cuisson...":"Décrivez votre activité..."}/></div>
        <div className="field-row"><div className="field"><label>Ville</label><input value={shopCity} onChange={e=>setShopCity(e.target.value)} placeholder="Brazzaville"/></div><div className="field"><label>Quartier</label><input value={shopArea} onChange={e=>setShopArea(e.target.value)} placeholder="Centre-ville"/></div></div>
        <div className="field"><label>Adresse complète</label><input placeholder="N° rue, avenue..."/></div>
        <div className="field"><label>Téléphone</label><input placeholder="+242 06X XXX XXX"/></div>
        {(shopType==="restaurant"||shopType==="patisserie")&&<div className="field"><label>Horaires d'ouverture</label><input placeholder="Ex: Lun-Sam 7h-22h"/></div>}
        {shopType==="restaurant"&&<div className="field"><label>Temps de préparation moyen</label><input placeholder="Ex: 30-45 min"/></div>}

        <label style={{display:"block",fontSize:12,fontWeight:600,color:"#5E5B53",margin:"14px 0 8px"}}>Catégories <span style={{color:"#908C82",fontWeight:400}}>({selCats.length} sélectionnée{selCats.length>1?"s":""})</span></label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {(catsByType[shopType]||catsByType.boutique).map(c=><span key={c} onClick={()=>toggleCat(c)} style={{padding:"8px 14px",borderRadius:10,background:selCats.includes(c)?"rgba(99,102,241,0.08)":"#fff",border:selCats.includes(c)?"2px solid #6366F1":"1px solid #E8E6E1",color:selCats.includes(c)?"#6366F1":"#908C82",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .2s"}}>{selCats.includes(c)?"✓ ":""}{c}</span>)}
        </div>
      </>}

      {/* Step 2: Documents */}
      {step===2&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Documents requis</h3>
        <div className="info-box blue" style={{marginBottom:14}}><span>ℹ️</span><span style={{fontSize:11}}>Les documents sont vérifiés séparément pour chaque {shopType==="restaurant"?"restaurant":shopType==="patisserie"?"pâtisserie":"boutique"}.</span></div>
        {[["🪪","Pièce d'identité du responsable","Carte ou passeport","id"],
          ["📄","RCCM / Patente","Registre de commerce","rccm"],
          ["📸",shopType==="restaurant"?"Photo du restaurant":shopType==="patisserie"?"Photo de la pâtisserie":"Photo de l'établissement","Façade et intérieur","photo"],
          ...(shopType==="restaurant"?[["🍽️","Certificat d'hygiène","Délivré par la mairie (si disponible)","hygiene"]]:[]),
        ].map(([i,t,d,k])=><div key={k} className="vr-doc" onClick={()=>setDocs({...docs,[k]:true})}><span className="vdi">{i}</span><div className="vdt"><h5>{t}</h5><p>{d}</p></div><span className={`vds ${docs[k]?"up":"pend"}`}>{docs[k]?"✓ Envoyé":"À envoyer"}</span></div>)}
      </>}

      {/* Step 3: Summary */}
      {step===3&&<>
        <h3 style={{fontSize:16,fontWeight:700,marginBottom:14}}>Résumé</h3>
        <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <span style={{fontSize:36}}>{shopTypes.find(t=>t.id===shopType)?.icon}</span>
            <div style={{fontSize:15,fontWeight:700,marginTop:4}}>{shopName||"Nouvelle boutique"}</div>
          </div>
          {[["Type",shopTypes.find(t=>t.id===shopType)?.name],["Ville",(shopCity||"—")+", "+(shopArea||"—")],["Catégories",selCats.join(", ")||"—"],["Documents",`${Object.values(docs).filter(Boolean).length}/${shopType==="restaurant"?4:3}`],["Plan","Enterprise ★ (partagé)"],["Commission","2%"]].map(([l,v])=><div key={l} className="vs-row"><span>{l}</span><b>{v}</b></div>)}
        </div>
        <div className="info-box green"><span>✅</span><span style={{fontSize:11}}>Ce{shopType==="restaurant"?" restaurant":shopType==="patisserie"?"tte pâtisserie":"tte boutique"} bénéficiera de votre plan Enterprise : 2% commission, dashboard personnalisé, manager dédié.</span></div>
      </>}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      <button className="btn-primary" style={{background:step===0&&!shopType?"#E8E6E1":"#6366F1",color:step===0&&!shopType?"#908C82":"#fff"}} onClick={()=>{if(step===0&&!shopType)return;step<3?setStep(step+1):setDone(true)}}>{step===3?"🚀 Créer l'établissement":"Continuer"}</button>
    </div>
  </div>);
}

/* V18d ── API & INTEGRATIONS (Enterprise) ── */
function VApiScr({go,onBack}){
  const [showKey,setShowKey]=useState(false);
  const [copied,setCopied]=useState(false);
  const [whTab,setWhTab]=useState(null);
  const [whUrl,setWhUrl]=useState({orders:"https://mon-site.com/api/orders",payments:"https://mon-site.com/api/payments",stock:""});
  const [whSaved,setWhSaved]=useState(false);
  const apiKey="lmk_live_ent_7f3a9b2c1d4e5f6g8h9i0j";
  const [regen,setRegen]=useState(false);

  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>API & Intégrations</h2><div style={{width:38}}/></div>

    <div style={{padding:16,background:"linear-gradient(135deg,#6366F1,#A855F7)",borderRadius:16,marginBottom:16,color:"#fff"}}>
      <div style={{fontSize:11,opacity:.7}}>Plan Enterprise</div>
      <div style={{fontSize:18,fontWeight:700,margin:"4px 0"}}>API Lamuka v2.0</div>
      <div style={{display:"flex",gap:12,marginTop:6}}>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>REST</span>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>JSON</span>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>10k req/jour</span>
        <span style={{padding:"3px 8px",borderRadius:6,background:"rgba(255,255,255,0.2)",fontSize:10}}>OAuth 2.0</span>
      </div>
    </div>

    {/* API Key */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Clé API</div>
    <div style={{padding:14,background:"#F5F4F1",borderRadius:14,marginBottom:6}}>
      <div style={{fontFamily:"monospace",fontSize:12,wordBreak:"break-all",color:showKey?"#191815":"#908C82",marginBottom:8}}>{showKey?apiKey:"lmk_live_ent_••••••••••••••••"}</div>
      <div style={{display:"flex",gap:8}}>
        <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowKey(!showKey)}>{showKey?"🙈 Masquer":"👁️ Afficher"}</button>
        <button style={{flex:1,padding:8,borderRadius:8,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000)}}>{copied?"✅ Copié !":"📋 Copier"}</button>
      </div>
    </div>
    <button style={{width:"100%",padding:8,borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:16}} onClick={()=>{setRegen(true);setTimeout(()=>setRegen(false),2500)}}>{regen?"✅ Nouvelle clé générée":"🔄 Régénérer la clé"}</button>

    {/* Webhooks */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Webhooks</div>
    {[["orders","Nouvelle commande"],["payments","Paiement reçu"],["stock","Stock bas"]].map(([k,label])=><div key={k} style={{padding:12,background:whTab===k?"#fff":"#fff",border:whTab===k?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:12,marginBottom:8,cursor:"pointer"}} onClick={()=>setWhTab(whTab===k?null:k)}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{label}</div><div style={{fontSize:10,color:"#908C82",fontFamily:"monospace"}}>{whUrl[k]||"Non configuré"}</div></div>
        <span style={{fontSize:11,fontWeight:600,color:whUrl[k]?"#10B981":"#908C82"}}>{whUrl[k]?"✅ Actif":"⬜"}</span>
      </div>
      {whTab===k&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}} onClick={e=>e.stopPropagation()}>
        <div className="field" style={{marginBottom:8}}><label style={{fontSize:11}}>URL du webhook</label><input value={whUrl[k]} onChange={e=>setWhUrl({...whUrl,[k]:e.target.value})} placeholder="https://votre-site.com/api/webhook" style={{fontFamily:"monospace",fontSize:11}}/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:8,borderRadius:8,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setWhSaved(true);setTimeout(()=>{setWhSaved(false);setWhTab(null)},1500)}}>{whSaved?"✅":"💾"} Sauver</button>
          <button style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(99,102,241,0.2)",background:"#fff",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🧪 Tester</button>
        </div>
      </div>}
    </div>)}

    {/* Documentation */}
    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Documentation API</div>
    {[["guide","📘","Guide de démarrage","Auth, setup, premiers appels"],
      ["products","📦","Endpoints Produits","CRUD, stock, images, variantes"],
      ["orders","🛒","Endpoints Commandes","Liste, détails, statuts, assignation"],
      ["payments","💳","Endpoints Paiements","Transactions, retraits, commissions"],
      ["webhooks","🔔","Guide Webhooks","Config, events, sécurité, retry"],
      ["errors","⚠️","Codes d'erreur","Liste complète des codes & solutions"],
      ["sdks","🧩","SDKs & Exemples","Node.js, Python, cURL, Postman"]
    ].map(([k,i,t,d])=><div key={k} style={{display:"flex",alignItems:"center",gap:10,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:12,marginBottom:8,cursor:"pointer"}} onClick={()=>go("vDoc",k)}>
      <span style={{fontSize:18}}>{i}</span>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:10,color:"#908C82"}}>{d}</div></div>
      <span style={{color:"#908C82"}}>›</span>
    </div>)}

    <div className="info-box blue" style={{marginTop:10}}><span>📞</span><span style={{fontSize:11}}>Manager dédié : <b>support-enterprise@lamuka.cg</b> · +242 06X XXX XXX</span></div>
  </div>);
}

/* V18e ── API DOCUMENTATION VIEWER ── */
function VDocScr({docKey,onBack}){
  const docs={
    guide:{
      title:"Guide de démarrage",icon:"📘",color:"#6366F1",
      sections:[
        {title:"Introduction",content:"L'API Lamuka permet aux commerçants Enterprise d'intégrer leur établissement avec des systèmes externes : ERP, sites web, applications mobiles, CRM et outils d'inventaire."},
        {title:"Base URL",code:"https://api.lamuka.cg/v2"},
        {title:"Authentification",content:"L'API utilise OAuth 2.0 Bearer tokens. Incluez votre clé API dans chaque requête.",code:"Authorization: Bearer lmk_live_ent_XXXX"},
        {title:"Première requête",content:"Vérifiez votre connexion en appelant l'endpoint de statut :",code:"GET /v2/me\n\nRéponse:\n{\n  \"id\": \"vendor_7f3a9b\",\n  \"name\": \"Mon Commerce\",\n  \"plan\": \"enterprise\",\n  \"shops\": 3,\n  \"status\": \"active\"\n}"},
        {title:"Rate Limiting",content:"Plan Enterprise : 10 000 requêtes/jour, 100 req/min. Les headers de réponse indiquent votre consommation :",code:"X-RateLimit-Limit: 10000\nX-RateLimit-Remaining: 9842\nX-RateLimit-Reset: 1708300800"},
        {title:"Format des réponses",content:"Toutes les réponses sont en JSON. Les dates sont au format ISO 8601. Les montants sont en FCFA (entiers).",code:"{\n  \"success\": true,\n  \"data\": { ... },\n  \"meta\": {\n    \"page\": 1,\n    \"total\": 42\n  }\n}"},
        {title:"Pagination",content:"Les listes paginées acceptent les paramètres page et limit :",code:"GET /v2/products?page=2&limit=20"},
        {title:"Environnements",content:"Deux environnements disponibles :",code:"Production: https://api.lamuka.cg/v2\nSandbox:    https://sandbox.api.lamuka.cg/v2\n\nLes clés sandbox commencent par:\nlmk_test_ent_XXXX"}
      ]
    },
    products:{
      title:"Endpoints Produits",icon:"📦",color:"#10B981",
      sections:[
        {title:"Lister les produits",content:"Récupérer tous les produits de votre boutique avec filtres optionnels.",code:"GET /v2/products\nGET /v2/products?shop_id=s1&category=Mode\nGET /v2/products?status=active&sort=created_at\n\nParamètres:\n  shop_id    (string)  Filtrer par boutique\n  category   (string)  Filtrer par catégorie\n  status     (string)  active | inactive | draft\n  sort       (string)  created_at | price | name\n  page       (int)     Page (défaut: 1)\n  limit      (int)     Résultats/page (défaut: 20)"},
        {title:"Créer un produit",code:"POST /v2/products\n\nBody:\n{\n  \"name\": \"Robe Wax Ankara\",\n  \"price\": 15000,\n  \"shop_id\": \"s1\",\n  \"category\": \"Mode\",\n  \"description\": \"Robe 100% coton...\",\n  \"stock\": 50,\n  \"images\": [\"base64...\"],\n  \"variants\": [\n    {\"size\": \"M\", \"stock\": 20},\n    {\"size\": \"L\", \"stock\": 30}\n  ],\n  \"active\": true\n}"},
        {title:"Détail d'un produit",code:"GET /v2/products/:id\n\nRéponse:\n{\n  \"id\": \"prod_abc123\",\n  \"name\": \"Robe Wax Ankara\",\n  \"price\": 15000,\n  \"stock\": 50,\n  \"sold\": 24,\n  \"rating\": 4.8,\n  \"shop\": { \"id\": \"s1\", \"name\": \"...\" },\n  \"created_at\": \"2026-01-15T10:00:00Z\"\n}"},
        {title:"Mettre à jour",code:"PATCH /v2/products/:id\n\nBody (champs partiels acceptés):\n{\n  \"price\": 12000,\n  \"stock\": 45,\n  \"active\": false\n}"},
        {title:"Supprimer",code:"DELETE /v2/products/:id\n\nRéponse: 204 No Content"},
        {title:"Mise à jour de stock en masse",content:"Mettez à jour le stock de plusieurs produits en une seule requête :",code:"POST /v2/products/bulk-stock\n\nBody:\n{\n  \"updates\": [\n    {\"id\": \"prod_abc\", \"stock\": 100},\n    {\"id\": \"prod_def\", \"stock\": 0},\n    {\"id\": \"prod_ghi\", \"stock\": 55}\n  ]\n}"},
        {title:"Images produit",code:"POST /v2/products/:id/images\nContent-Type: multipart/form-data\n\nChamps:\n  file      (binary)  Image JPG/PNG, max 5MB\n  position  (int)     Ordre d'affichage"}
      ]
    },
    orders:{
      title:"Endpoints Commandes",icon:"🛒",color:"#F59E0B",
      sections:[
        {title:"Lister les commandes",code:"GET /v2/orders\nGET /v2/orders?status=new&shop_id=s1\n\nParamètres:\n  status    new | preparing | shipped | delivered\n  shop_id   Filtrer par boutique\n  from      Date début (ISO 8601)\n  to        Date fin (ISO 8601)\n  sort      created_at | total | status"},
        {title:"Détail commande",code:"GET /v2/orders/:id\n\nRéponse:\n{\n  \"id\": \"ord_0889\",\n  \"ref\": \"#CMD-0889\",\n  \"status\": \"new\",\n  \"client\": {\n    \"name\": \"Celine Nzaba\",\n    \"phone\": \"+242 06X XXX\",\n    \"address\": \"Moungali, Rue 8\"\n  },\n  \"items\": [\n    {\n      \"product_id\": \"prod_abc\",\n      \"name\": \"Robe Wax\",\n      \"qty\": 2,\n      \"price\": 15000\n    }\n  ],\n  \"total\": 42500,\n  \"payment\": \"MTN MoMo\",\n  \"created_at\": \"2026-02-14T09:30:00Z\"\n}"},
        {title:"Mettre à jour le statut",content:"Faire progresser une commande dans le workflow :",code:"PATCH /v2/orders/:id/status\n\nBody:\n{\n  \"status\": \"preparing\"\n}\n\nStatuts possibles:\n  new → preparing → shipped → delivered\n\nNote: Impossible de revenir en arrière"},
        {title:"Assigner un livreur",code:"POST /v2/orders/:id/assign-driver\n\nBody:\n{\n  \"driver_id\": \"drv_patrick\"\n}\n\nRéponse:\n{\n  \"assigned\": true,\n  \"driver\": {\n    \"name\": \"Patrick Moukala\",\n    \"eta\": \"12 min\",\n    \"phone\": \"+242 06X XXX\"\n  }\n}"},
        {title:"Refuser une commande",code:"POST /v2/orders/:id/refuse\n\nBody:\n{\n  \"reason\": \"Stock insuffisant\"\n}\n\nNote: Le client est automatiquement\nnotifié et remboursé."},
        {title:"Stats commandes",code:"GET /v2/orders/stats\nGET /v2/orders/stats?period=week&shop_id=s1\n\nRéponse:\n{\n  \"total_orders\": 48,\n  \"revenue\": 457800,\n  \"avg_order\": 9537,\n  \"by_status\": {\n    \"new\": 5,\n    \"preparing\": 3,\n    \"shipped\": 8,\n    \"delivered\": 32\n  }\n}"}
      ]
    },
    payments:{
      title:"Endpoints Paiements",icon:"💳",color:"#EF4444",
      sections:[
        {title:"Solde & résumé",code:"GET /v2/wallet\n\nRéponse:\n{\n  \"balance\": 457800,\n  \"pending\": 35000,\n  \"currency\": \"XAF\",\n  \"commission_rate\": 0.02,\n  \"this_month\": {\n    \"revenue\": 580000,\n    \"commission\": 11600,\n    \"net\": 568400,\n    \"withdrawals\": 200000\n  }\n}"},
        {title:"Historique transactions",code:"GET /v2/wallet/transactions\nGET /v2/wallet/transactions?type=credit&from=2026-02-01\n\nParamètres:\n  type    credit | debit | commission | withdrawal\n  from    Date début\n  to      Date fin\n\nRéponse:\n{\n  \"transactions\": [\n    {\n      \"id\": \"tx_abc\",\n      \"type\": \"credit\",\n      \"amount\": 42500,\n      \"label\": \"Commande #CMD-0889\",\n      \"date\": \"2026-02-14T09:30:00Z\",\n      \"status\": \"completed\"\n    }\n  ]\n}"},
        {title:"Demande de retrait",content:"Initier un retrait vers Mobile Money :",code:"POST /v2/wallet/withdraw\n\nBody:\n{\n  \"amount\": 100000,\n  \"method\": \"mtn_momo\",\n  \"phone\": \"+242064663469\"\n}\n\nMéthodes:\n  mtn_momo     MTN Mobile Money\n  airtel_money Airtel Money\n  kolo_pay     Kolo Pay\n\nRéponse:\n{\n  \"id\": \"wd_xyz\",\n  \"status\": \"processing\",\n  \"eta\": \"24-48h\"\n}"},
        {title:"Statut retrait",code:"GET /v2/wallet/withdrawals/:id\n\nStatuts: processing → completed | failed"},
        {title:"Commissions par boutique",code:"GET /v2/wallet/commissions?shop_id=s1\n\nRéponse:\n{\n  \"shop\": \"Ma Boutique Congo\",\n  \"rate\": 0.02,\n  \"total_sales\": 580000,\n  \"total_commission\": 11600,\n  \"period\": \"2026-02\"\n}"}
      ]
    },
    webhooks:{
      title:"Guide Webhooks",icon:"🔔",color:"#8B5CF6",
      sections:[
        {title:"Principe",content:"Les webhooks envoient des notifications HTTP POST en temps réel lorsqu'un événement se produit sur votre boutique. Vous recevez les données directement sur votre serveur."},
        {title:"Événements disponibles",code:"order.created      Nouvelle commande reçue\norder.updated      Statut commande modifié\norder.delivered    Commande livrée\npayment.received   Paiement confirmé\npayment.failed     Paiement échoué\nstock.low          Stock < seuil (5 par défaut)\nreview.created     Nouvel avis client\ndriver.assigned    Livreur assigné"},
        {title:"Configuration",code:"POST /v2/webhooks\n\nBody:\n{\n  \"url\": \"https://votre-site.com/webhook\",\n  \"events\": [\n    \"order.created\",\n    \"payment.received\"\n  ],\n  \"secret\": \"votre_secret_32chars\"\n}"},
        {title:"Format de payload",code:"POST votre-url\nContent-Type: application/json\nX-Lamuka-Signature: sha256=abc123...\n\n{\n  \"event\": \"order.created\",\n  \"timestamp\": \"2026-02-14T09:30:00Z\",\n  \"data\": {\n    \"order_id\": \"ord_0889\",\n    \"ref\": \"#CMD-0889\",\n    \"total\": 42500,\n    \"client\": \"Celine Nzaba\"\n  }\n}"},
        {title:"Vérification de signature",content:"Vérifiez l'authenticité des webhooks avec HMAC SHA-256 :",code:"const crypto = require('crypto');\n\nconst signature = req.headers\n  ['x-lamuka-signature'];\nconst expected = 'sha256=' +\n  crypto.createHmac('sha256', secret)\n  .update(JSON.stringify(req.body))\n  .digest('hex');\n\nif (signature !== expected) {\n  return res.status(401).end();\n}"},
        {title:"Retry automatique",content:"En cas d'échec (non-200), Lamuka retente automatiquement :",code:"Tentative 1 : immédiat\nTentative 2 : après 1 min\nTentative 3 : après 5 min\nTentative 4 : après 30 min\nTentative 5 : après 2h (dernier essai)\n\nAprès 5 échecs, le webhook est\nautomatiquement désactivé."}
      ]
    },
    errors:{
      title:"Codes d'erreur",icon:"⚠️",color:"#EF4444",
      sections:[
        {title:"Format erreur standard",code:"{\n  \"success\": false,\n  \"error\": {\n    \"code\": \"INVALID_PARAM\",\n    \"message\": \"Le champ 'price' est requis\",\n    \"field\": \"price\"\n  }\n}"},
        {title:"Erreurs HTTP",content:"Codes HTTP retournés par l'API :",code:"200 OK           Succès\n201 Created      Ressource créée\n204 No Content   Suppression réussie\n400 Bad Request  Paramètres invalides\n401 Unauthorized Clé API manquante/invalide\n403 Forbidden    Accès refusé (plan/rôle)\n404 Not Found    Ressource introuvable\n409 Conflict     Conflit (doublon, état)\n429 Too Many     Rate limit dépassé\n500 Server Error Erreur interne"},
        {title:"Codes d'erreur métier",code:"INVALID_PARAM      Paramètre manquant/invalide\nPRODUCT_NOT_FOUND  Produit introuvable\nORDER_NOT_FOUND    Commande introuvable\nINSUFF_STOCK       Stock insuffisant\nINVALID_STATUS     Transition statut invalide\nDRIVER_UNAVAIL     Livreur indisponible\nWITHDRAW_MIN       Montant min non atteint\nWITHDRAW_MAX       Solde insuffisant\nSHOP_INACTIVE      Boutique non active\nRATE_LIMITED       Trop de requêtes\nDUPLICATE          Ressource déjà existante"},
        {title:"Gestion recommandée",code:"try {\n  const res = await fetch(url, opts);\n  const data = await res.json();\n  if (!data.success) {\n    switch(data.error.code) {\n      case 'RATE_LIMITED':\n        // Attendre et réessayer\n        break;\n      case 'INVALID_PARAM':\n        // Corriger le paramètre\n        break;\n      default:\n        console.error(data.error);\n    }\n  }\n} catch(e) {\n  // Erreur réseau\n}"}
      ]
    },
    sdks:{
      title:"SDKs & Exemples",icon:"🧩",color:"#6366F1",
      sections:[
        {title:"Node.js",code:"npm install @lamuka/sdk\n\nconst Lamuka = require('@lamuka/sdk');\nconst api = new Lamuka({\n  apiKey: 'lmk_live_ent_XXXX'\n});\n\n// Lister les produits\nconst products = await api.products.list({\n  shop: 's1', status: 'active'\n});\n\n// Créer un produit\nconst newProduct = await api.products.create({\n  name: 'Robe Wax',\n  price: 15000,\n  stock: 50\n});\n\n// Mettre à jour une commande\nawait api.orders.updateStatus(\n  'ord_0889', 'preparing'\n);"},
        {title:"Python",code:"pip install lamuka-sdk\n\nfrom lamuka import LamukaClient\n\nclient = LamukaClient(\n  api_key='lmk_live_ent_XXXX'\n)\n\n# Lister les commandes\norders = client.orders.list(\n  status='new',\n  shop_id='s1'\n)\n\n# Solde wallet\nwallet = client.wallet.balance()\nprint(f\"Solde: {wallet.balance} FCFA\")\n\n# Retrait\nclient.wallet.withdraw(\n  amount=100000,\n  method='mtn_momo',\n  phone='+242064663469'\n)"},
        {title:"cURL",code:"# Lister les produits\ncurl -X GET \\\n  https://api.lamuka.cg/v2/products \\\n  -H 'Authorization: Bearer lmk_live_ent_XXXX'\n\n# Créer un produit\ncurl -X POST \\\n  https://api.lamuka.cg/v2/products \\\n  -H 'Authorization: Bearer lmk_live_ent_XXXX' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"Robe Wax\",\n    \"price\": 15000,\n    \"stock\": 50\n  }'"},
        {title:"Collection Postman",content:"Importez notre collection Postman pour tester rapidement tous les endpoints :",code:"1. Ouvrir Postman\n2. Import → Link\n3. Coller :\n   https://api.lamuka.cg/v2/postman\n\nEnvironnements inclus :\n  - Production\n  - Sandbox\n\nVariables pré-configurées :\n  {{base_url}}\n  {{api_key}}\n  {{shop_id}}"},
        {title:"Exemple complet : Sync ERP",content:"Exemple d'intégration avec un ERP pour synchroniser les commandes :",code:"const Lamuka = require('@lamuka/sdk');\nconst api = new Lamuka({ apiKey: KEY });\n\n// Écouter les nouvelles commandes\napp.post('/webhook', (req, res) => {\n  const { event, data } = req.body;\n  \n  if (event === 'order.created') {\n    // Créer dans l'ERP\n    erp.createOrder({\n      ref: data.ref,\n      client: data.client,\n      total: data.total\n    });\n    \n    // Confirmer la commande\n    api.orders.updateStatus(\n      data.order_id, 'preparing'\n    );\n  }\n  \n  res.status(200).end();\n});"}
      ]
    }
  };

  const doc=docs[docKey];
  if(!doc)return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0}}><button onClick={onBack}>←</button><h2>Documentation</h2><div style={{width:38}}/></div><p>Document introuvable.</p></div>);

  return(<div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2 style={{fontSize:15}}>{doc.icon} {doc.title}</h2><div style={{width:38}}/></div>

    <div style={{padding:12,background:`${doc.color}08`,border:`1px solid ${doc.color}20`,borderRadius:14,marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:doc.color}}>API Lamuka v2.0 — {doc.title}</div>
      <div style={{fontSize:11,color:"#908C82",marginTop:4}}>Base URL : https://api.lamuka.cg/v2</div>
    </div>

    {doc.sections.map((s,i)=><div key={i} style={{marginBottom:16}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        <span style={{width:22,height:22,borderRadius:7,background:doc.color,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
        {s.title}
      </h4>
      {s.content&&<p style={{fontSize:12,color:"#5E5B53",lineHeight:1.6,marginBottom:s.code?8:0}}>{s.content}</p>}
      {s.code&&<div style={{padding:12,background:"#1a1a2e",borderRadius:12,overflowX:"auto"}}>
        <pre style={{margin:0,fontSize:10,lineHeight:1.5,color:"#e2e8f0",fontFamily:"'SF Mono',Menlo,monospace",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{s.code}</pre>
      </div>}
    </div>)}

    <div className="info-box blue" style={{marginTop:6}}><span>💡</span><span style={{fontSize:11}}>Testez en sandbox avant d'utiliser en production. <b>support-enterprise@lamuka.cg</b></span></div>
  </div>);
}

/* V19 ── UPGRADE PLAN ── */
function VUpgradePlanScr({onBack,onUpgrade}){
  const [plan,setPlan]=useState("pro");
  const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>🎉</div><h3 style={{fontSize:18,fontWeight:700}}>Plan mis à jour !</h3><p style={{fontSize:14,color:"#6366F1",fontWeight:700,marginTop:8}}>Plan {plan==="pro"?"Pro":"Enterprise"} activé</p><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Toutes les fonctionnalités sont maintenant débloquées.</p><button className="btn-primary" style={{marginTop:20}} onClick={()=>{onUpgrade(plan);onBack()}}>✅ Retour à la boutique</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Changer de plan</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:48,marginBottom:8}}>⬆️</div><h3 style={{fontSize:18,fontWeight:700}}>Boostez votre boutique</h3><p style={{fontSize:13,color:"#908C82"}}>Choisissez le plan qui correspond à vos ambitions</p></div>
      <div style={{padding:16,background:"#F5F4F1",borderRadius:16,marginBottom:14,opacity:.5}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700}}>Starter</h4><span style={{fontSize:13,color:"#908C82"}}>Plan actuel</span></div>
        <p style={{fontSize:12,color:"#908C82",marginTop:4}}>10 produits · 8% commission · Stats basiques</p>
      </div>
      {[["pro","Pro","15 000 FCFA/mois","Le plus populaire",["Produits illimités","4% commission","Analytics avancés","Badge vérifié ✓","Support prioritaire","Promotions"]],
        ["enterprise","Enterprise","45 000 FCFA/mois","Pour les grandes boutiques",["Multi-boutiques","2% commission","API complète","Manager dédié","Dashboard personnalisé","Rapports avancés"]]
      ].map(([k,n,pr,tag,f])=><div key={k} onClick={()=>setPlan(k)} style={{padding:16,background:"#fff",border:plan===k?"2px solid #6366F1":"1px solid #E8E6E1",borderRadius:16,marginBottom:14,cursor:"pointer",position:"relative"}}>
        {k==="pro"&&<span style={{position:"absolute",top:-10,right:16,padding:"3px 10px",borderRadius:8,background:"#6366F1",color:"#fff",fontSize:10,fontWeight:700}}>⭐ Recommandé</span>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h4 style={{fontSize:16,fontWeight:700}}>{n}</h4><span style={{fontSize:14,fontWeight:700,color:"#6366F1"}}>{pr}</span></div>
        <p style={{fontSize:12,color:"#908C82",marginTop:4}}>{tag}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{f.map(x=><span key={x} style={{padding:"4px 10px",borderRadius:8,background:"rgba(99,102,241,0.06)",color:"#6366F1",fontSize:10,fontWeight:600}}>✓ {x}</span>)}</div>
      </div>)}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" onClick={()=>setDone(true)}>⬆️ Passer au plan {plan==="pro"?"Pro":"Enterprise"}</button></div>
  </div>);
}

/* ═══════════════════════════════
   DRIVER SCREENS (10)
   ═══════════════════════════════ */

/* D1 ── DRIVER DASHBOARD ── */
function DrDashboardScr({go}){
  const [online,setOnline]=useState(true);
  const [period,setPeriod]=useState("today");
  const [dismissed,setDismissed]=useState(false);
  const d=D_STATS[period];
  const pending=dismissed?null:D_DELIVERIES.find(x=>x.status==="pending");
  const active=D_DELIVERIES.find(x=>x.status==="active");
  return(<div className="scr">
    <div className="dr-hero">
      <div className="dr-top"><div style={{display:"flex",alignItems:"center",gap:12}}><div className="dr-av">🧑</div><div><div className="dr-name">Patrick Moukala</div><div className="dr-sub">🛵 Honda PCX · BZ-4521</div></div></div><div className="hdr-btn" style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff"}} onClick={()=>go("drNotif")}>🔔</div></div>
      <div className="dr-toggle-bar" onClick={()=>setOnline(!online)}><div className={`dt-dot ${online?"on":"off"}`}/><span>{online?"En ligne — Prêt à livrer":"Hors ligne"}</span><div className={`toggle ${online?"on":""}`}/></div>
      <div className="dr-stats"><div className="dr-stat"><b>{d.deliveries}</b><span>Livraisons</span></div><div className="dr-stat"><b>{fmt(d.earned)}</b><span>Gagné</span></div><div className="dr-stat"><b>{d.distance} km</b><span>Distance</span></div></div>
    </div>
    <div className="vd-period" style={{marginTop:0}}>{[["today","Aujourd'hui"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>

    {/* Pending request */}
    {pending&&<><div className="sec" style={{marginTop:10}}><h3>🆕 Nouvelle demande</h3></div>
    <div className="dr-request">
      <div className="dr-req-head"><h4>Livraison <span className="dr-new">NOUVEAU</span></h4><div className="dr-req-fee">{fmt(pending.fee+pending.tip)}</div></div>
      <div className="dr-req-route">
        <div className="dr-req-point"><div className="drp-icon drp-pickup">📍</div><div style={{flex:1}}><div style={{fontWeight:600}}>{pending.pickup}</div><div style={{fontSize:11,color:"#908C82"}}>{pending.vendor.name}</div></div></div>
        <div className="dr-req-line"/>
        <div className="dr-req-point"><div className="drp-icon drp-drop">🏠</div><div style={{flex:1}}><div style={{fontWeight:600}}>{pending.client.addr.split(",")[0]}</div><div style={{fontSize:11,color:"#908C82"}}>{pending.client.name}</div></div></div>
      </div>
      <div className="dr-req-meta"><span>📏 {pending.distance}</span><span>⏱️ ~{pending.eta}</span><span>📦 {pending.items.length} article{pending.items.length>1?"s":""}</span><span>💰 {fmt(pending.total)}</span></div>
      <div className="dr-req-actions"><button className="dr-decline" onClick={()=>setDismissed(true)}>Refuser</button><button className="dr-accept" onClick={()=>go("drDelivery",{...pending,status:"pickup"})}>✅ Accepter</button></div>
    </div></>}

    {/* Active delivery */}
    {active&&<><div className="sec" style={{marginTop:6}}><h3>📦 En cours</h3></div>
    <div className="dr-active" onClick={()=>go("drDelivery",active)}>
      <div className="dr-active-head"><h4>{active.ref}</h4><div className="dr-st">En livraison</div></div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:8}}>{active.vendor.name} → {active.client.name}</div>
      <div className="dr-step-bar">
        <div className="dr-step-dot done">✓</div><div className="dr-step-line done"/>
        <div className="dr-step-dot done">✓</div><div className="dr-step-line done"/>
        <div className="dr-step-dot cur">3</div><div className="dr-step-line"/>
        <div className="dr-step-dot">4</div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#908C82"}}><span>Accepté</span><span>Récupéré</span><span style={{color:"#6366F1",fontWeight:600}}>En route</span><span>Livré</span></div>
    </div></>}

    {/* Quick stats */}
    <div className="sec" style={{marginTop:6}}><h3>Dernières livraisons</h3><span onClick={()=>go("drHistory")}>Voir tout</span></div>
    <div style={{padding:"0 20px 100px"}}>{D_HISTORY.slice(0,3).map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F5F4F1"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✅</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{h.vendor} → {h.client}</div><div style={{fontSize:11,color:"#908C82"}}>{h.date} · {h.duration} · {h.distance}</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:"#10B981"}}>+{fmt(h.fee+h.tip)}</div><div style={{fontSize:11,color:"#F59E0B"}}>{"★".repeat(h.rating)}</div></div>
    </div>)}</div>
  </div>);
}

/* D2 ── ACTIVE DELIVERY (multi-step) ── */
function DrDeliveryScr({delivery:dl,go,onBack}){
  const [step,setStep]=useState(dl.status==="active"?2:0); // 0=accepted,1=atPickup,2=inTransit,3=arriving
  const stepLabels=["Accepté","Au retrait","En route","Arrivé"];
  const stepActions=["🚀 En route vers le vendeur","📦 Colis récupéré","🏠 Arrivé chez le client","✅ Confirmer livraison"];
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    {/* Map */}
    <div className="dr-nav-map">
      <div className="map-grid"/><div className="dr-nav-road"/><div className="dr-nav-road2"/><div className="dr-nav-route"/>
      <div className="dr-nav-me">🛵</div>
      <div className="dr-nav-dest" style={{top:"28%",left:step<2?"65%":"75%"}}>{step<2?"🏪":"🏠"}</div>
      <div className="dr-nav-dir">{step<2?"↗ Tourner à droite · 200m":"↗ Tout droit · 450m"}</div>
      <div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div>
    </div>

    <div className="scr" style={{padding:20}}>
      {/* Step bar */}
      <div className="dr-step-bar" style={{marginBottom:4}}>
        {stepLabels.map((_,i)=><div key={i} style={{display:"contents"}}>{i>0&&<div className={`dr-step-line ${step>=i?"done":""}`}/>}<div className={`dr-step-dot ${step>i?"done":step===i?"cur":""}`}>{step>i?"✓":i+1}</div></div>)}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#908C82",marginBottom:16}}>{stepLabels.map((l,i)=><span key={l} style={step===i?{color:"#10B981",fontWeight:700}:{}}>{l}</span>)}</div>

      {/* Current destination */}
      <div style={{padding:16,background:step<2?"rgba(99,102,241,0.04)":"rgba(16,185,129,0.04)",border:"1px solid "+(step<2?"rgba(99,102,241,0.15)":"rgba(16,185,129,0.15)"),borderRadius:16,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:600,color:step<2?"#6366F1":"#10B981",marginBottom:8}}>{step<2?"📍 RETRAIT":"🏠 LIVRAISON"}</div>
        {step<2?<>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.pickup}</div>
          <div style={{fontSize:13,color:"#908C82"}}>{dl.vendor.name} · {dl.ref}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatVendor",dl)}>💬 Commerce</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 "+dl.vendor.name)}>📞</button>
          </div>
        </>:<>
          <div style={{fontSize:15,fontWeight:700,marginBottom:2}}>{dl.client.name}</div>
          <div style={{fontSize:13,color:"#908C82"}}>{dl.client.addr}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <button style={{flex:1,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatClient",dl)}>💬 Client</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#3B82F6",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("drNavigation",dl)}>🗺️</button>
            <button style={{width:42,padding:10,borderRadius:10,border:"none",background:"#10B981",color:"#fff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 "+dl.client.name)}>📞</button>
          </div>
        </>}
      </div>

      {/* Vendor contact - always visible */}
      {step>=2&&<div style={{padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,marginBottom:14,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{dl.vendor.avatar}</div>
        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{dl.vendor.name}</div><div style={{fontSize:11,color:"#908C82"}}>Commerce · {dl.pickup}</div></div>
        <button style={{padding:"8px 14px",borderRadius:10,border:"none",background:"#6366F1",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drChatVendor",dl)}>💬</button>
        <button style={{padding:"8px 10px",borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:14,cursor:"pointer"}} onClick={()=>alert("📞 "+dl.vendor.name)}>📞</button>
      </div>}

      {/* Order info */}
      <div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>📦 Commande {dl.ref}</div>
        {dl.items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"4px 0",fontSize:12}}><span>{it.img}</span><span style={{flex:1}}>{it.name} x{it.qty}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #F5F4F1",marginTop:6,fontSize:13}}><span style={{color:"#908C82"}}>Total commande</span><b style={{color:"#6366F1"}}>{fmt(dl.total)}</b></div>
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:4,fontSize:12}}><span style={{color:"#908C82"}}>Votre gain</span><b style={{color:"#10B981"}}>{fmt(dl.fee+dl.tip)}{dl.tip>0?` (dont ${fmt(dl.tip)} pourboire)`:""}</b></div>
      </div>

      {/* Estimated info */}
      <div style={{display:"flex",gap:10,marginBottom:14}}>
        {[["📏",dl.distance],["⏱️",dl.eta],["💰",fmt(dl.fee)]].map(([i,v])=><div key={i} style={{flex:1,padding:12,background:"#F5F4F1",borderRadius:12,textAlign:"center"}}><div style={{fontSize:16}}>{i}</div><div style={{fontSize:12,fontWeight:700,marginTop:2}}>{v}</div></div>)}
      </div>
    </div>

    {/* Bottom action */}
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      {step<3?<button style={{width:"100%",padding:14,borderRadius:14,border:"none",background:step<2?"#6366F1":"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setStep(step+1)}>{stepActions[step]}</button>
      :<button style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("drConfirm",dl)}>✅ Confirmer la livraison</button>}
    </div>
  </div>);
}

/* D3 ── DELIVERY CONFIRMATION ── */
function DrConfirmScr({delivery:dl,go,onBack}){
  const [method,setMethod]=useState(null);
  const [code,setCode]=useState("");
  const [photoTaken,setPhotoTaken]=useState(false);
  const [signed,setSigned]=useState(false);
  const [done,setDone]=useState(false);

  if(done)return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:"40px 24px"}}>
      <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:48,animation:"splash-pop .5s ease"}}>🎉</div>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:6}}>Livraison terminée !</h2>
      <p style={{fontSize:14,color:"#5E5B53",marginBottom:4}}>{dl.ref} livré à <b>{dl.client.name}</b></p>
      <div style={{display:"flex",justifyContent:"center",gap:20,margin:"20px 0",padding:16,background:"#F5F4F1",borderRadius:16}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#10B981"}}>{fmt(dl.fee)}</div><div style={{fontSize:11,color:"#908C82"}}>Course</div></div>
        {dl.tip>0&&<div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{fmt(dl.tip)}</div><div style={{fontSize:11,color:"#908C82"}}>Pourboire</div></div>}
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#6366F1"}}>{fmt(dl.fee+dl.tip)}</div><div style={{fontSize:11,color:"#908C82"}}>Total gagné</div></div>
      </div>
      <button className="btn-primary" style={{background:"#10B981"}} onClick={onBack}>🏠 Retour au dashboard</button>
    </div>
  </div>);

  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Confirmer livraison</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:48,marginBottom:8}}>📦</div>
        <h3 style={{fontSize:18,fontWeight:700}}>Livraison à {dl.client.name}</h3>
        <p style={{fontSize:13,color:"#908C82"}}>{dl.client.addr}</p>
      </div>

      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Méthode de confirmation</div>
      <div className="dr-confirm-options">
        {[["code","🔢","Code PIN"],["photo","📸","Photo"],["signature","✍️","Signature"]].map(([k,i,l])=>
          <div key={k} className={`dr-confirm-opt ${method===k?"on":""}`} onClick={()=>setMethod(k)}>
            <div className="dco-icon">{i}</div><div className="dco-label">{l}</div>
          </div>)}
      </div>

      {method==="code"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"#908C82",marginBottom:10}}>Demandez le code à 4 chiffres au client</p>
        <div className="otp-inputs">{[0,1,2,3].map(i=><input key={i} className="otp-box" maxLength={1} onChange={e=>{const v=code.split("");v[i]=e.target.value;setCode(v.join(""))}} style={{width:52,height:58,borderColor:code.length>=4?"#10B981":"#E8E6E1"}}/>)}</div>
      </div>}

      {method==="photo"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"#908C82",marginBottom:10}}>Prenez une photo du colis remis au client</p>
        {!photoTaken?<div onClick={()=>setPhotoTaken(true)} style={{height:160,background:"#F5F4F1",border:"2px dashed #E8E6E1",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:40,marginBottom:6}}>📷</div>
          <div style={{fontSize:13,fontWeight:600,color:"#908C82"}}>Appuyer pour prendre la photo</div>
        </div>
        :<div style={{height:160,background:"rgba(16,185,129,0.04)",border:"2px solid #10B981",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{fontSize:40,marginBottom:6}}>✅</div>
          <div style={{fontSize:13,fontWeight:600,color:"#10B981"}}>Photo prise avec succès</div>
          <div onClick={()=>setPhotoTaken(false)} style={{position:"absolute",bottom:8,right:8,fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:600}}>🗑️ Reprendre</div>
        </div>}
      </div>}

      {method==="signature"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"#908C82",marginBottom:10}}>Le client signe sur l'écran</p>
        {!signed?<div onClick={()=>setSigned(true)} style={{height:140,background:"#fff",border:"2px dashed #E8E6E1",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:13,color:"#908C82"}}>✍️ Appuyer ici pour signer</div>
        </div>
        :<div style={{height:140,background:"rgba(16,185,129,0.04)",border:"2px solid #10B981",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{fontFamily:"cursive",fontSize:24,color:"#191815",opacity:.6}}>Marie Koumba</div>
          <div onClick={()=>setSigned(false)} style={{position:"absolute",bottom:8,right:8,fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:600}}>🗑️ Effacer</div>
          <div style={{position:"absolute",top:8,right:8}}><span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.1)",color:"#10B981",fontSize:10,fontWeight:600}}>✓ Signé</span></div>
        </div>}
      </div>}

      {!method&&<div className="info-box yellow" style={{marginTop:14}}><span>💡</span><span>Choisissez une méthode de confirmation pour valider la livraison</span></div>}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}>
      <button className="btn-primary" style={{background:method?"#10B981":"#E8E6E1",color:method?"#fff":"#908C82"}} onClick={()=>method&&setDone(true)} disabled={!method}>✅ Valider la livraison</button>
    </div>
  </div>);
}

/* D4 ── GPS NAVIGATION ── */
function DrNavigationScr({delivery:dl,go,onBack}){
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="dr-nav-map" style={{flex:1}}>
      <div className="map-grid"/>
      {/* Roads */}
      <div style={{position:"absolute",top:"35%",left:0,right:0,height:8,background:"rgba(255,255,255,.6)",borderRadius:4}}/>
      <div style={{position:"absolute",top:"55%",left:"5%",right:"20%",height:8,background:"rgba(255,255,255,.6)",borderRadius:4,transform:"rotate(3deg)"}}/>
      <div style={{position:"absolute",top:"20%",left:"30%",width:8,height:"60%",background:"rgba(255,255,255,.6)",borderRadius:4}}/>
      {/* Route */}
      <div style={{position:"absolute",top:"35%",left:"20%",width:"30%",height:4,background:"repeating-linear-gradient(90deg,#10B981 0,#10B981 8px,transparent 8px,transparent 14px)",borderRadius:2,animation:"rpulse 2s infinite"}}/>
      <div style={{position:"absolute",top:"35%",left:"50%",width:4,height:"20%",background:"repeating-linear-gradient(180deg,#10B981 0,#10B981 8px,transparent 8px,transparent 14px)",borderRadius:2}}/>
      {/* Me */}
      <div className="dr-nav-me" style={{top:"calc(35% - 22px)",left:"18%"}}>🛵</div>
      {/* Destination */}
      <div style={{position:"absolute",top:"48%",left:"48%",fontSize:32,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.2))"}}>🏠</div>
      {/* Turn direction */}
      <div className="dr-nav-dir">↗ Tourner à droite · 200m</div>
      {/* Top bar */}
      <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between"}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{padding:"8px 14px",borderRadius:12,background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.1)",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>⏱️ {dl.eta} · {dl.distance}</div>
      </div>
      {/* Bottom info */}
      <div className="dr-nav-info">
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏠</div>
          <div style={{flex:1}}><h3>{dl.client.name}</h3><p>{dl.client.addr}</p></div>
          <div style={{display:"flex",gap:6}}>
            <button style={{width:38,height:38,borderRadius:10,border:"none",background:"#10B981",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 Appel")}>📞</button>
            <button style={{width:38,height:38,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("drChatClient",dl)}>💬</button>
          </div>
        </div>
      </div>
    </div>
  </div>);
}

/* D5 ── DRIVER → VENDOR CHAT ── */
function DrChatVendorScr({delivery:dl,onBack}){
  const [msgs,setMsgs]=useState([
    {from:"user",text:"Bonjour, je suis en route pour récupérer la commande "+dl.ref,time:"14:08"},
    {from:"bot",text:"Parfait ! Le colis est prêt au Stand 42. Demandez Patrick.",time:"14:09"},
    {from:"user",text:"J'arrive dans 5 minutes 🛵",time:"14:10"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>setMsgs(p=>[...p,{from:"bot",text:["D'accord, merci !","Le colis est bien emballé.","À tout de suite !","Pas de souci."][Math.floor(Math.random()*4)],time}]),1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:"linear-gradient(135deg,#6366F1,#A855F7)"}}>{dl.vendor.avatar}</div><div className="ch-info"><h4>{dl.vendor.name}</h4><p>🏪 Commerce · {dl.ref}</p></div><button className="ch-call" style={{background:"#6366F1"}} onClick={()=>alert("📞 Appel")}>📞</button></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`} style={m.from==="user"?{background:"#10B981"}:{}}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:8,flexShrink:0}}>{["📍 Ma position","📦 Colis récupéré","⏱️ J'arrive"].map(q=><button key={q} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap"}}>{q}</button>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder="Message au vendeur..." value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send} style={{background:"#10B981"}}>➤</button></div>
  </div>);
}

/* D6 ── DRIVER → CLIENT CHAT ── */
function DrChatClientScr({delivery:dl,onBack}){
  const [msgs,setMsgs]=useState([
    {from:"user",text:"Bonjour "+dl.client.name.split(" ")[0]+" ! J'ai votre commande, je suis en route 🛵",time:"14:20"},
    {from:"bot",text:"Super merci ! Je suis à la maison.",time:"14:21"},
    {from:"user",text:"J'arrive dans environ "+dl.eta+". L'adresse est bien "+dl.client.addr.split(",")[0]+" ?",time:"14:22"},
    {from:"bot",text:"Oui c'est ça ! Portail bleu, je vous attends dehors.",time:"14:22"},
  ]);
  const [inp,setInp]=useState("");const ref=useRef(null);
  useEffect(()=>{ref.current&&(ref.current.scrollTop=ref.current.scrollHeight)},[msgs]);
  const send=()=>{if(!inp.trim())return;const t=new Date();const time=`${t.getHours()}:${String(t.getMinutes()).padStart(2,"0")}`;setMsgs(p=>[...p,{from:"user",text:inp,time}]);setInp("");setTimeout(()=>setMsgs(p=>[...p,{from:"bot",text:["D'accord !","Merci !","Super, j'attends.","OK pas de souci.","Je suis devant."][Math.floor(Math.random()*5)],time}]),1200)};
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="chat-head"><button onClick={onBack} style={{width:36,height:36,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>←</button><div className="ch-av" style={{background:"linear-gradient(135deg,#10B981,#059669)"}}>👤</div><div className="ch-info"><h4>{dl.client.name}</h4><p>🟢 Client · {dl.ref}</p></div><button className="ch-call" onClick={()=>alert("📞 Appel vers "+dl.client.name)}>📞</button></div>
    <div className="chat-body" ref={ref}>{msgs.map((m,i)=><div key={i} className={`msg ${m.from==="user"?"user":"bot"}`} style={m.from==="user"?{background:"#10B981"}:{}}>{m.text}<div className="msg-time">{m.time}</div></div>)}</div>
    <div style={{padding:"8px 16px",background:"#F5F4F1",borderTop:"1px solid #E8E6E1",display:"flex",gap:8,flexShrink:0}}>{["📍 Ma position","⏱️ 5 min","🔔 Je suis là","📸 Photo colis"].map(q=><button key={q} style={{padding:"6px 12px",borderRadius:20,border:"1px solid #E8E6E1",background:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"#5E5B53",whiteSpace:"nowrap"}}>{q}</button>)}</div>
    <div className="chat-input"><button className="chat-attach">📎</button><input placeholder={"Message à "+dl.client.name.split(" ")[0]+"..."} value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/><button onClick={send} style={{background:"#10B981"}}>➤</button></div>
  </div>);
}

/* D7 ── DRIVER HISTORY ── */
function DrHistoryScr({onBack}){
  const totalEarned=D_HISTORY.reduce((s,h)=>s+h.fee+h.tip,0);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Historique</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 10px",display:"flex",gap:10}}>
      <div style={{flex:1,padding:14,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#10B981"}}>{D_HISTORY.length}</div><div style={{fontSize:11,color:"#908C82"}}>Livraisons</div></div>
      <div style={{flex:1,padding:14,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#6366F1"}}>{fmt(totalEarned)}</div><div style={{fontSize:11,color:"#908C82"}}>Total gagné</div></div>
      <div style={{flex:1,padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.12)",borderRadius:14,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700,color:"#F59E0B"}}>4.8</div><div style={{fontSize:11,color:"#908C82"}}>Note moy.</div></div>
    </div>
    <div style={{padding:"0 20px 80px"}}>{D_HISTORY.map(h=><div key={h.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontSize:14,fontWeight:700}}>{h.ref}</span><span style={{fontSize:14,fontWeight:700,color:"#10B981"}}>+{fmt(h.fee+h.tip)}</span></div>
      <div style={{fontSize:13,color:"#5E5B53",marginBottom:4}}>{h.vendor} → {h.client}</div>
      <div style={{display:"flex",gap:10,fontSize:11,color:"#908C82",flexWrap:"wrap"}}><span>📅 {h.date}</span><span>⏱️ {h.duration}</span><span>📏 {h.distance}</span><span style={{color:"#F59E0B"}}>{"★".repeat(h.rating)}</span>{h.tip>0&&<span style={{color:"#F59E0B"}}>🎁 {fmt(h.tip)} pourboire</span>}</div>
    </div>)}</div>
  </div>);
}

/* D8 ── DRIVER WALLET ── */
function DrWalletScr({go,onBack}){
  const balance=D_HISTORY.reduce((s,h)=>s+h.fee+h.tip,0);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Mes gains</h2><div style={{width:38}}/></div>
    <div className="vw-card" style={{background:"linear-gradient(135deg,#10B981,#059669)"}}><div className="vw-lbl">Solde disponible</div><div className="vw-bal">{fmt(balance)}</div><div className="vw-pend">Cette semaine: {fmt(D_STATS.week.earned)}</div></div>
    <div className="vw-btns"><button className="vw-withdraw" style={{background:"#10B981"}} onClick={()=>go("drWithdraw")}>💸 Retirer vers MoMo</button><button className="vw-history" onClick={()=>go("drHistory")}>📊 Détails</button></div>
    <div style={{padding:"0 20px"}}><div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Résumé Février</div>
      {[["Courses","64 × 2 500 FCFA",fmt(160000)],["Pourboires","23 reçus",fmt(12000)],["Bonus","10+ livrais./sem.",fmt(5000)],["Commissions Lamuka","-5%","-"+fmt(8850)],["Net versé","",""]].map(([l,d,v],i)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:i?"1px solid #F5F4F1":"none",fontSize:13,...(i===4?{fontWeight:700,fontSize:15}:{})}}><div><span>{l}</span>{d&&<span style={{display:"block",fontSize:11,color:"#908C82"}}>{d}</span>}</div><b style={{color:i===3?"#EF4444":i===4?"#10B981":"#191815"}}>{i===4?fmt(balance):v}</b></div>)}
    </div></div>
    <div style={{padding:"0 20px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Derniers paiements</div>
      {D_HISTORY.slice(0,4).map(h=><div key={h.id} className="vw-tx"><div className="tx-icon plus">↓</div><div className="tx-info"><h5>{h.ref} · {h.client}</h5><p>{h.date}</p></div><div className="tx-amt plus">+{fmt(h.fee+h.tip)}</div></div>)}
    </div>
  </div>);
}

/* D9 ── DRIVER NOTIFICATIONS ── */
function DrNotifScr({onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Notifications</h2><div style={{width:38}}/></div>
    {D_NOTIFS.map((n,i)=><div key={i} className={`notif-item ${!n.read?"unread":""}`}><div className="ni-icon">{n.icon}</div><div className="ni-body"><h4>{n.title}</h4><p>{n.desc}</p><div className="ni-t">{n.time}</div></div></div>)}
  </div>);
}

/* D10 ── DRIVER PROFILE ── */
function DrProfileScr({go,onSwitch,onLogout}){
  return(<div className="scr">
    <div className="appbar"><h2>Mon Profil</h2><button onClick={()=>go("drNotif")}>🔔</button></div>
    <div style={{textAlign:"center",padding:"10px 20px 20px"}}>
      <div style={{width:80,height:80,borderRadius:22,background:"linear-gradient(135deg,#10B981,#059669)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:36}}>🧑</div>
      <h2 style={{fontSize:20,fontWeight:700}}>Patrick Moukala</h2>
      <p style={{fontSize:13,color:"#908C82"}}>🛵 Honda PCX · BZ-4521</p>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}><span style={{padding:"4px 12px",borderRadius:8,background:"rgba(16,185,129,0.1)",color:"#10B981",fontSize:12,fontWeight:600}}>⭐ 4.8</span><span style={{padding:"4px 12px",borderRadius:8,background:"rgba(99,102,241,0.1)",color:"#6366F1",fontSize:12,fontWeight:600}}>342 livraisons</span></div>
    </div>
    <div className="wallet" style={{margin:"0 20px 16px",background:"linear-gradient(135deg,#10B981,#059669)"}}><div><p style={{fontSize:11,opacity:.7}}>Gains disponibles</p><h3 style={{fontSize:20,fontWeight:700,marginTop:2}}>{fmt(D_STATS.month.earned)}</h3></div><button onClick={()=>go("drWallet")}>Retirer</button></div>
    {[["📦","Historique",D_HISTORY.length+" livraisons",()=>go("drHistory")],["💰","Mes gains","Février 2026",()=>go("drWallet")],["🔔","Notifications","3 nouvelles",()=>go("drNotif")],["🛵","Mon véhicule","Honda PCX · BZ-4521",()=>go("drVehicle")],["📍","Zones actives","Brazzaville Sud, Centre",()=>go("drZones")],["📊","Statistiques","Cette semaine",()=>go("drStats")],["⚙️","Paramètres","Langue, notifications",()=>go("drSettings")],["❓","Aide & Support","FAQ, contact",()=>go("drHelp")]].map(([i,t,s,fn])=><div key={t} className="menu-item" onClick={fn}><div className="mi-i">{i}</div><span className="mi-t">{t}</span><span className="mi-s">{s}</span><span className="mi-c">›</span></div>)}
    <div className="vendor-cta" style={{background:"linear-gradient(135deg,#3B82F6,#1D4ED8)"}} onClick={onSwitch}><span style={{fontSize:28}}>🛍️</span><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>Mode Acheteur</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Retourner au marketplace</div></div><span style={{fontSize:18}}>→</span></div>
    <button style={{margin:"0 20px 80px",width:"calc(100% - 40px)",padding:14,borderRadius:14,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onLogout}>🚪 Déconnexion</button>
  </div>);
}

/* D11 ── DRIVER VEHICLE ── */
function DrVehicleScr({onBack}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mon véhicule</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:64,marginBottom:8}}>🛵</div><h3 style={{fontSize:20,fontWeight:700}}>Honda PCX</h3><p style={{fontSize:13,color:"#908C82"}}>Plaque : BZ-4521</p></div>
    <div className="field"><label>Type de véhicule</label><select defaultValue="moto"><option value="moto">🛵 Moto / Scooter</option><option value="voiture">🚗 Voiture</option><option value="velo">🚲 Vélo</option></select></div>
    <div className="field-row"><div className="field"><label>Marque</label><input defaultValue="Honda PCX"/></div><div className="field"><label>Année</label><input defaultValue="2022"/></div></div>
    <div className="field-row"><div className="field"><label>Plaque</label><input defaultValue="BZ-4521"/></div><div className="field"><label>Couleur</label><input defaultValue="Noir"/></div></div>
    <div style={{fontSize:14,fontWeight:700,margin:"14px 0 10px"}}>Documents</div>
    {[["🪪","Permis de conduire","Valide jusqu'au 12/2027","✅"],["📄","Carte grise","BZ-4521","✅"],["🛡️","Assurance","AXA Congo · Exp. 06/2026","✅"]].map(([i,t,d,s])=><div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8}}>
      <span style={{fontSize:22}}>{i}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:"#908C82"}}>{d}</div></div><span style={{fontSize:14}}>{s}</span>
    </div>)}
    <button className="btn-primary" style={{marginTop:10}}>💾 Enregistrer</button>
  </div>);
}

/* D12 ── DRIVER ZONES ── */
function DrZonesScr({onBack}){
  const [zones,setZones]=useState([{id:"z1",name:"Brazzaville Sud",areas:"Bacongo, Makélékélé",active:true},{id:"z2",name:"Brazzaville Centre",areas:"Poto-Poto, Moungali, Ouenzé",active:true},{id:"z3",name:"Brazzaville Nord",areas:"Talangaï, Mfilou, Djiri",active:false},{id:"z4",name:"Pointe-Noire",areas:"Centre-ville, Loandjili",active:false}]);
  const toggle=i=>{const z=[...zones];z[i].active=!z[i].active;setZones(z)};
  const remove=id=>setZones(zones.filter(z=>z.id!==id));
  const [showAdd,setShowAdd]=useState(false);
  const [addName,setAddName]=useState("");const [addAreas,setAddAreas]=useState("");
  const [saved,setSaved]=useState(false);
  const allSuggested=[
    {name:"Brazzaville Sud",areas:"Bacongo, Makélékélé"},
    {name:"Brazzaville Centre",areas:"Poto-Poto, Moungali, Ouenzé"},
    {name:"Brazzaville Nord",areas:"Talangaï, Mfilou, Djiri"},
    {name:"Pointe-Noire Centre",areas:"Centre-ville, Loandjili"},
    {name:"Pointe-Noire Nord",areas:"Tié-Tié, Ngoyo"},
    {name:"Dolisie",areas:"Centre, Loubomo"},
    {name:"Nkayi",areas:"Centre-ville"},
    {name:"Oyo",areas:"Centre"}
  ];
  const existingNames=zones.map(z=>z.name);
  const suggestions=allSuggested.filter(s=>!existingNames.includes(s.name));
  const doAdd=()=>{
    if(!addName)return;
    setZones([...zones,{id:"z"+Date.now(),name:addName,areas:addAreas||"Zone personnalisée",active:true}]);
    setAddName("");setAddAreas("");setShowAdd(false);
  };
  const doSave=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)};

  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Mes zones de livraison</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 80px"}}>
      <div className="info-box blue" style={{marginBottom:14}}><span>📍</span><span style={{fontSize:11}}>Activez/désactivez les zones où vous acceptez des livraisons. Ajoutez de nouvelles zones selon votre couverture.</span></div>

      <div style={{fontSize:12,color:"#908C82",marginBottom:8}}>{zones.filter(z=>z.active).length} zone{zones.filter(z=>z.active).length>1?"s":""} active{zones.filter(z=>z.active).length>1?"s":""} sur {zones.length}</div>

      {zones.map((z,i)=><div key={z.id} style={{padding:14,background:"#fff",border:z.active?"1px solid rgba(16,185,129,0.3)":"1px solid #E8E6E1",borderRadius:14,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{z.name}</h4>{z.active&&<span style={{width:8,height:8,borderRadius:4,background:"#10B981"}}/>}</div>
            <div style={{fontSize:11,color:"#908C82",marginTop:2}}>📍 {z.areas}</div>
          </div>
          <div className={`toggle ${z.active?"on":""}`} onClick={()=>toggle(i)}/>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10,paddingTop:10,borderTop:"1px solid #F5F4F1"}}>
          <span style={{flex:1,fontSize:11,color:z.active?"#10B981":"#908C82",fontWeight:600}}>{z.active?"✅ Active":"⏸️ Inactive"}</span>
          <button style={{padding:"4px 12px",borderRadius:6,border:"1px solid rgba(239,68,68,0.2)",background:"#fff",color:"#EF4444",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>remove(z.id)}>Retirer</button>
        </div>
      </div>)}

      {/* Add zone */}
      {showAdd?<div style={{padding:16,background:"#fff",border:"2px solid #10B981",borderRadius:16,marginBottom:14}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:12}}>➕ Ajouter une zone</h4>

        {suggestions.length>0&&<>
          <div style={{fontSize:12,fontWeight:600,color:"#5E5B53",marginBottom:8}}>Zones suggérées</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {suggestions.map(s=><span key={s.name} onClick={()=>{setAddName(s.name);setAddAreas(s.areas)}} style={{padding:"6px 12px",borderRadius:8,border:addName===s.name?"2px solid #10B981":"1px solid #E8E6E1",background:addName===s.name?"rgba(16,185,129,0.04)":"#fff",fontSize:11,fontWeight:600,cursor:"pointer",color:addName===s.name?"#10B981":"#5E5B53"}}>{addName===s.name?"✓ ":""}{s.name}</span>)}
          </div>
        </>}

        <div style={{fontSize:12,fontWeight:600,color:"#5E5B53",marginBottom:8}}>Ou zone personnalisée</div>
        <div className="field"><label>Nom de la zone</label><input value={addName} onChange={e=>setAddName(e.target.value)} placeholder="Ex: Ouenzé Nord"/></div>
        <div className="field"><label>Quartiers couverts</label><input value={addAreas} onChange={e=>setAddAreas(e.target.value)} placeholder="Ex: Moukondo, Ngamakosso"/></div>
        <div style={{display:"flex",gap:8}}>
          <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>{setShowAdd(false);setAddName("");setAddAreas("")}}>Annuler</button>
          <button className="btn-primary" style={{flex:2,background:addName?"#10B981":"#E8E6E1",color:addName?"#fff":"#908C82"}} onClick={doAdd}>Ajouter</button>
        </div>
      </div>
      :<button style={{width:"100%",padding:14,borderRadius:14,border:"2px dashed #10B981",background:"rgba(16,185,129,0.02)",color:"#10B981",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:14}} onClick={()=>setShowAdd(true)}>+ Ajouter une zone de livraison</button>}

      <button className="btn-primary" style={{background:saved?"#10B981":"#6366F1"}} onClick={doSave}>{saved?"✅ Zones sauvegardées":"💾 Enregistrer mes zones"}</button>
    </div>
  </div>);
}

/* D13 ── DRIVER STATS ── */
function DrStatsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const d=D_STATS[period];
  const chartData=[85,120,95,160,140,110,180];
  const maxBar=Math.max(...chartData);
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Statistiques</h2><div style={{width:38}}/></div>
    <div className="vd-period">{[["today","Jour"],["week","Semaine"],["month","Mois"]].map(([k,l])=><button key={k} className={period===k?"on":""} onClick={()=>setPeriod(k)}>{l}</button>)}</div>
    <div className="vd-stats">
      <div className="vd-stat"><div className="vs-icon">📦</div><div className="vs-val">{d.deliveries}</div><div className="vs-lbl">Livraisons</div><div className="vs-trend up">↑ 15%</div></div>
      <div className="vd-stat"><div className="vs-icon">💰</div><div className="vs-val">{fmt(d.earned)}</div><div className="vs-lbl">Gagné</div><div className="vs-trend up">↑ 23%</div></div>
      <div className="vd-stat"><div className="vs-icon">📏</div><div className="vs-val">{d.distance} km</div><div className="vs-lbl">Distance</div></div>
      <div className="vd-stat"><div className="vs-icon">⏱️</div><div className="vs-val">{d.hours}h</div><div className="vs-lbl">En ligne</div></div>
    </div>
    <div className="vd-chart"><h4>Livraisons par jour</h4><div className="chart-bars">{chartData.map((v,i)=><div key={i} className="chart-bar" style={{height:`${(v/maxBar)*100}%`,background:"linear-gradient(180deg,#10B981,#059669)"}}><div className="cb-tip">{v} FCFA</div></div>)}</div><div className="chart-labels">{["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(d=><span key={d}>{d}</span>)}</div></div>
    <div style={{padding:"0 20px"}}><div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Performance</div>
      {[{label:"Taux d'acceptation",val:"92%",pct:92,color:"#10B981"},{label:"Livraisons à temps",val:"88%",pct:88,color:"#6366F1"},{label:"Satisfaction client",val:"4.8/5",pct:96,color:"#F59E0B"}].map(s=><div key={s.label} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{fontWeight:600}}>{s.label}</span><span style={{color:"#908C82"}}>{s.val}</span></div>
        <div style={{height:6,background:"#E8E6E1",borderRadius:3,overflow:"hidden"}}><div style={{width:`${s.pct}%`,height:"100%",background:s.color,borderRadius:3}}/></div>
      </div>)}
    </div></div>
  </div>);
}

/* D14 ── DRIVER SETTINGS ── */
function DrSettingsScr({onBack,go}){
  const [pushN,setPushN]=useState(true);const [sound,setSound]=useState(true);const [autoAccept,setAutoAccept]=useState(false);const [lang,setLang]=useState("fr");
  return(<div className="scr" style={{paddingBottom:80}}><div className="appbar"><button onClick={onBack}>←</button><h2>Paramètres</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px"}}>
      <div className="setting-group"><div className="setting-label">Général</div>
        <div className="setting-item"><span className="si-i">🌐</span><span className="si-t">Langue</span><select value={lang} onChange={e=>setLang(e.target.value)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid #E8E6E1",fontSize:12,fontFamily:"inherit",background:"#fff"}}><option value="fr">Français</option><option value="en">English</option><option value="ln">Lingala</option></select></div>
      </div>
      <div className="setting-group"><div className="setting-label">Notifications</div>
        <div className="setting-item"><span className="si-i">🔔</span><span className="si-t">Notifications push</span><div className={`toggle ${pushN?"on":""}`} onClick={()=>setPushN(!pushN)}/></div>
        <div className="setting-item"><span className="si-i">🔊</span><span className="si-t">Son nouvelles commandes</span><div className={`toggle ${sound?"on":""}`} onClick={()=>setSound(!sound)}/></div>
      </div>
      <div className="setting-group"><div className="setting-label">Livraison</div>
        <div className="setting-item"><span className="si-i">⚡</span><span className="si-t">Acceptation automatique</span><div className={`toggle ${autoAccept?"on":""}`} onClick={()=>setAutoAccept(!autoAccept)}/></div>
        <div className="info-box yellow" style={{margin:"8px 0"}}><span>💡</span><span>Si activé, les livraisons proches seront acceptées automatiquement.</span></div>
      </div>
      <div className="setting-group"><div className="setting-label">Sécurité</div>
        <div className="setting-item" onClick={()=>go("password")} style={{cursor:"pointer"}}><span className="si-i">🔒</span><span className="si-t">Changer mot de passe</span><span className="mi-c">›</span></div>
        <div className="setting-item"><span className="si-i">🆔</span><span className="si-t">Vérification d'identité</span><span style={{padding:"3px 8px",borderRadius:6,background:"rgba(16,185,129,0.1)",color:"#10B981",fontSize:11,fontWeight:600}}>Vérifié</span></div>
      </div>
      <div className="setting-group"><div className="setting-label">Légal</div>
        <div className="setting-item" onClick={()=>go("terms")} style={{cursor:"pointer"}}><span className="si-i">📋</span><span className="si-t">Conditions d'utilisation</span><span className="mi-c">›</span></div>
        <div className="setting-item" onClick={()=>go("privacy")} style={{cursor:"pointer"}}><span className="si-i">🔐</span><span className="si-t">Politique de confidentialité</span><span className="mi-c">›</span></div>
      </div>
    </div>
  </div>);
}

/* D15 ── DRIVER HELP ── */
function DrHelpScr({onBack}){
  const [open,setOpen]=useState(null);
  const faqs=[
    {q:"Comment accepter une livraison ?",a:"Quand une nouvelle demande apparaît sur le dashboard, appuyez sur 'Accepter'. Vous avez 60 secondes pour répondre."},
    {q:"Comment confirmer la livraison ?",a:"Une fois arrivé, appuyez sur 'Confirmer livraison'. Choisissez la méthode : Code PIN du client, Photo du colis, ou Signature."},
    {q:"Quand suis-je payé ?",a:"Les gains sont versés chaque lundi sur votre Mobile Money (Airtel ou MTN). Les pourboires sont ajoutés automatiquement."},
    {q:"Comment contacter le commerce ou le client ?",a:"Depuis la livraison active, utilisez les boutons 💬 Message ou 📞 Appeler pour joindre le commerce ou le client."},
    {q:"Comment changer de zone ?",a:"Profil → Zones actives → Activez/désactivez les zones où vous souhaitez recevoir des livraisons."},
    {q:"Comment signaler un problème ?",a:"Contactez le support via WhatsApp au +242 064 663 469 ou envoyez un email à joeldytsina94@gmail.com."},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Aide & Support</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 14px"}}><div className="sbar">🔍 <input placeholder="Rechercher..."/></div></div>
    {faqs.map((f,i)=><div key={i} className="faq-item" onClick={()=>setOpen(open===i?null:i)}><div className="faq-q">{f.q}<span className={open===i?"open":""}>+</span></div>{open===i&&<div className="faq-a">{f.a}</div>}</div>)}
    <div style={{padding:20}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Contacter le support</div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1,padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,textAlign:"center",cursor:"pointer"}}><div style={{fontSize:24,marginBottom:4}}>💬</div><div style={{fontSize:12,fontWeight:600}}>WhatsApp</div><div style={{fontSize:11,color:"#908C82"}}>+242 064 663 469</div></div>
        <div style={{flex:1,padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,textAlign:"center",cursor:"pointer"}}><div style={{fontSize:24,marginBottom:4}}>📧</div><div style={{fontSize:12,fontWeight:600}}>Email</div><div style={{fontSize:11,color:"#908C82"}}>joeldytsina94@gmail.com</div></div>
      </div>
    </div>
  </div>);
}

/* ═══ LEGAL SCREENS ═══ */
function TermsScr({onBack}){
  const sections=[
    {title:"1. Objet",text:"Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de la plateforme Lamuka Marketplace, éditée par Lamuka Tech, Brazzaville, République du Congo."},
    {title:"2. Inscription",text:"L'accès à certains services nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à jour. Le compte est personnel et non transférable."},
    {title:"3. Services proposés",text:"Lamuka met en relation des acheteurs, des commerçants (restaurants, boutiques, pharmacies, pâtisseries, supermarchés, services) et des livreurs. La plateforme facilite les transactions mais n'est pas partie prenante aux contrats de vente entre commerçants et acheteurs."},
    {title:"4. Commandes et paiements",text:"Les prix sont affichés en Francs CFA (FCFA). Les paiements sont effectués via Mobile Money (Airtel Money, MTN MoMo) ou Kolo Pay. Toute commande validée engage l'acheteur."},
    {title:"5. Livraison",text:"Les délais de livraison sont indicatifs : 1-3 jours ouvrés à Brazzaville, 3-5 jours à Pointe-Noire. Le livreur doit confirmer la remise du colis via code PIN, photo ou signature."},
    {title:"6. Retours et remboursements",text:"Le retour est accepté sous 7 jours après réception si le produit est en état d'origine. Le remboursement est effectué sous 48h via le même moyen de paiement. Les frais de retour sont à la charge de l'acheteur sauf produit défectueux."},
    {title:"7. Responsabilités du commerçant",text:"Le commerçant s'engage à fournir des produits/services conformes à leur description, à respecter les délais de préparation et à maintenir un taux de satisfaction acceptable. Lamuka se réserve le droit de suspendre un compte en cas de manquements répétés."},
    {title:"8. Commissions",text:"Lamuka prélève une commission sur chaque vente : Plan Starter 8%, Plan Pro 4%, Plan Enterprise 2%. Les commissions sont déduites automatiquement avant versement au vendeur."},
    {title:"9. Propriété intellectuelle",text:"L'ensemble des éléments de la plateforme (logo, design, code, contenus) sont la propriété de Lamuka Tech. Toute reproduction est interdite sans autorisation préalable."},
    {title:"10. Modification des CGU",text:"Lamuka Tech se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés de tout changement majeur. La poursuite de l'utilisation vaut acceptation."},
    {title:"11. Contact",text:"Pour toute question : joeldytsina94@gmail.com · WhatsApp : +242 064 663 469"},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Conditions générales</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 80px"}}>
      <div style={{padding:14,background:"rgba(99,102,241,0.04)",border:"1px solid rgba(99,102,241,0.1)",borderRadius:14,marginBottom:16}}><div style={{fontSize:12,color:"#6366F1",fontWeight:600}}>📋 Conditions Générales d'Utilisation</div><div style={{fontSize:11,color:"#908C82",marginTop:4}}>Dernière mise à jour : 1er Février 2026</div></div>
      {sections.map((s,i)=><div key={i} style={{marginBottom:16}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{s.title}</h4>
        <p style={{fontSize:13,color:"#5E5B53",lineHeight:1.7}}>{s.text}</p>
      </div>)}
    </div>
  </div>);
}

function PrivacyScr({onBack}){
  const sections=[
    {title:"1. Données collectées",text:"Nous collectons les données nécessaires au fonctionnement du service : nom, numéro de téléphone, adresse email, adresse de livraison, historique de commandes et données de paiement Mobile Money."},
    {title:"2. Utilisation des données",text:"Vos données sont utilisées pour : traiter vos commandes, assurer la livraison, améliorer nos services, vous envoyer des notifications pertinentes et prévenir la fraude. Nous n'utilisons jamais vos données à des fins publicitaires tierces."},
    {title:"3. Partage des données",text:"Vos informations sont partagées uniquement avec : le commerçant (nom et adresse pour la livraison), le livreur (adresse et téléphone pour la livraison), nos prestataires de paiement Mobile Money. Nous ne vendons jamais vos données personnelles."},
    {title:"4. Sécurité",text:"Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles : chiffrement des données de paiement, authentification à deux facteurs, accès restreint aux données personnelles, audit régulier de sécurité."},
    {title:"5. Conservation des données",text:"Vos données sont conservées pendant la durée de votre utilisation du service et pendant 2 ans après la suppression de votre compte, conformément aux obligations légales en vigueur au Congo."},
    {title:"6. Vos droits",text:"Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à joeldytsina94@gmail.com."},
    {title:"7. Cookies et trackers",text:"L'application utilise des cookies techniques nécessaires au fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est utilisé."},
    {title:"8. Géolocalisation",text:"La géolocalisation est utilisée pour : afficher les commerces proches, permettre le suivi de livraison en temps réel, calculer les frais de livraison. Vous pouvez désactiver la géolocalisation dans les paramètres de votre appareil."},
    {title:"9. Modifications",text:"Cette politique peut être mise à jour. Toute modification significative sera notifiée via l'application. Dernière mise à jour : 1er Février 2026."},
    {title:"10. Contact DPO",text:"Pour toute question relative à la protection de vos données : joeldytsina94@gmail.com · WhatsApp : +242 064 663 469"},
  ];
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Politique de confidentialité</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 20px 80px"}}>
      <div style={{padding:14,background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.1)",borderRadius:14,marginBottom:16}}><div style={{fontSize:12,color:"#10B981",fontWeight:600}}>🔐 Politique de confidentialité</div><div style={{fontSize:11,color:"#908C82",marginTop:4}}>Dernière mise à jour : 1er Février 2026</div></div>
      {sections.map((s,i)=><div key={i} style={{marginBottom:16}}>
        <h4 style={{fontSize:14,fontWeight:700,marginBottom:6}}>{s.title}</h4>
        <p style={{fontSize:13,color:"#5E5B53",lineHeight:1.7}}>{s.text}</p>
      </div>)}
    </div>
  </div>);
}

/* ═══════════════════════════
   APP SHELL + ROUTER
   ═══════════════════════════ */
export default function App(){
  const [auth,setAuth]=useState(0);
  const [socialProvider,setSocialProvider]=useState(null);
  const [mode,setMode]=useState("buyer"); // buyer, vendor, driver
  const [tab,setTab]=useState(0);
  const [vTab,setVTab]=useState(0);
  const [dTab,setDTab]=useState(0);
  const [screen,setScreen]=useState(null);
  const [cart,setCart]=useState([{product:P[0],qty:1},{product:P[2],qty:3}]);
  const [favs,setFavs]=useState([]);
  const [history,setHistory]=useState([]);

  const toggleFav=(pid)=>setFavs(f=>f.includes(pid)?f.filter(x=>x!==pid):[...f,pid]);
  const isFav=(pid)=>favs.includes(pid);

  // Role system: client | vendor | driver | both
  const [userRole,setUserRole]=useState("client");
  const [vendorPlan,setVendorPlan]=useState("enterprise"); // starter | pro | enterprise
  const [vendorStatus,setVendorStatus]=useState("none"); // none | pending | approved | rejected
  const [driverStatus,setDriverStatus]=useState("none"); // none | pending | approved | rejected

  const push=(type,data)=>{setHistory(h=>[...h,screen]);setScreen({type,data})};
  const pop=()=>{const h=[...history];const prev=h.pop();setHistory(h);setScreen(prev)};
  const go=(type,data)=>push(type,data);
  const goHome=()=>{setScreen(null);setTab(0);setVTab(0);setDTab(0);setHistory([])};
  const addCart=(p,qty)=>{const ex=cart.findIndex(c=>c.product.id===p.id);if(ex>=0){const n=[...cart];n[ex].qty+=qty;setCart(n)}else setCart([...cart,{product:p,qty}]);setScreen(null);setHistory([]);setTab(2)};
  const switchTo=(m)=>{setMode(m);setScreen(null);setHistory([]);setTab(0);setVTab(0);setDTab(0)};
  const onLogout=()=>{setAuth(2);setSocialProvider(null);setMode("buyer");setTab(0);setScreen(null);setHistory([]);setVTab(0);setDTab(0);setUserRole("client");setVendorStatus("none");setDriverStatus("none");setVendorPlan("starter")};
  const onRoleApproved=(role,plan)=>{
    if(role==="vendor"){setUserRole(r=>r==="driver"?"both":"vendor");setVendorPlan(plan||"starter");setVendorStatus("approved")}
    if(role==="driver"){setUserRole(r=>r==="vendor"?"both":"driver");setDriverStatus("approved")}
  };
  const hasVendor=(userRole==="vendor"||userRole==="both")&&vendorStatus==="approved";
  const hasDriver=(userRole==="driver"||userRole==="both")&&driverStatus==="approved";

  const showNav=!screen&&auth===5;
  const buyerTabs=[{icon:"🏠",label:"Accueil"},{icon:"🔍",label:"Recherche"},{icon:"🛍️",label:"Panier"},{icon:"📦",label:"Commandes"},{icon:"👤",label:"Profil"}];
  const vendorTabs=[{icon:"📊",label:"Dashboard"},{icon:"📦",label:"Commandes"},{icon:"➕",label:"Ajouter"},{icon:"💬",label:"Messages"},{icon:"🏪",label:"Commerce"}];
  const driverTabs=[{icon:"🏠",label:"Accueil"},{icon:"📦",label:"Livraisons"},{icon:"💰",label:"Gains"},{icon:"🔔",label:"Notifs"},{icon:"👤",label:"Profil"}];
  const tabs=mode==="buyer"?buyerTabs:mode==="vendor"?vendorTabs:driverTabs;
  const activeTab=mode==="buyer"?tab:mode==="vendor"?vTab:dTab;

  const renderScreen=()=>{
    if(!screen){
      if(mode==="driver"){
        if(dTab===0)return <DrDashboardScr go={go}/>;
        if(dTab===1)return <DrHistoryScr onBack={()=>setDTab(0)}/>;
        if(dTab===2)return <DrWalletScr go={go} onBack={()=>setDTab(0)}/>;
        if(dTab===3)return <DrNotifScr onBack={()=>setDTab(0)}/>;
        return <DrProfileScr go={go} onSwitch={()=>switchTo("buyer")} onLogout={onLogout}/>;
      }
      if(mode==="vendor"){
        if(vTab===0)return <VDashboardScr go={go}/>;
        if(vTab===1)return <VOrdersScr go={go}/>;
        if(vTab===2)return <VProductFormScr onBack={()=>setVTab(0)}/>;
        if(vTab===3)return <VMessagesScr go={go}/>;
        return <VProfileScr go={go} onSwitch={()=>switchTo("buyer")} vendorPlan={vendorPlan} onLogout={onLogout}/>;
      }
      if(tab===0)return <HomeScr go={go} favs={favs} toggleFav={toggleFav} isFav={isFav}/>;
      if(tab===1)return <SearchScr go={go} fromTab favs={favs} toggleFav={toggleFav} isFav={isFav}/>;
      if(tab===2)return <CartScr cart={cart} setCart={setCart} go={go}/>;
      if(tab===3)return <OrdersScr go={go}/>;
      return <ProfileScr go={go} userRole={userRole} vendorPlan={vendorPlan} vendorStatus={vendorStatus} driverStatus={driverStatus} onLogout={onLogout}/>;
    }
    const {type,data}=screen;const back=pop;
    switch(type){
      // Buyer screens
      case"detail":return <DetailScr product={data} onBack={back} onAddCart={addCart} go={go} favs={favs} toggleFav={toggleFav} isFav={isFav}/>;
      case"gallery":return <GalleryScr product={data} onClose={back}/>;
      case"compare":return <CompareScr product={data} onBack={back}/>;
      case"reviews":return <ReviewsScr product={data} onBack={back}/>;
      case"vendor":return <VendorScr vendor={data} go={go} onBack={back}/>;
      case"cats":return <CategoriesScr go={go} onBack={back}/>;
      case"restoList":return <RestoListScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav}/>;
      case"allProducts":return <AllProductsScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav}/>;
      case"flash":return <FlashScr go={go} onBack={back} favs={favs} toggleFav={toggleFav} isFav={isFav}/>;
      case"nearby":return <NearbyScr go={go} onBack={back}/>;
      case"coupons":return <CouponsScr onBack={back}/>;
      case"checkout":return <CheckoutScr onDone={goHome}/>;
      case"cart":setTab(2);setScreen(null);return null;
      case"orders":setTab(3);setScreen(null);return null;
      case"search":setTab(1);setScreen(null);return null;
      case"orderDetail":return <OrderDetailScr order={data} onBack={back} go={go}/>;
      case"tracking":return <TrackingScr onBack={back} go={go}/>;
      case"chatDriver":return <ChatScr onBack={back}/>;
      case"chatVendor":return <ChatVendorScr vendor={data} onBack={back}/>;
      case"chatList":return <ChatListScr go={go} onBack={back}/>;
      case"wishlist":return <WishlistScr go={go} onBack={back} favs={favs} toggleFav={toggleFav}/>;
      case"notif":return <NotifScr onBack={back}/>;
      case"editProfile":return <EditProfileScr onBack={back}/>;
      case"addresses":return <AddressesScr onBack={back}/>;
      case"settings":return <SettingsScr onBack={back} go={go}/>;
      case"help":return <HelpScr onBack={back}/>;
      case"about":return <AboutScr onBack={back}/>;
      case"terms":return <TermsScr onBack={back}/>;
      case"privacy":return <PrivacyScr onBack={back}/>;
      case"language":return <LanguageScr onBack={back}/>;
      case"currency":return <CurrencyScr onBack={back}/>;
      case"password":return <PasswordScr onBack={back}/>;
      case"recharge":return <RechargeScr onBack={back}/>;
      case"roleReg":return <RoleRegScr onBack={back} onDone={(role,plan)=>{onRoleApproved(role,plan);goHome()}}/>;
      case"vendorReg":return <RoleRegScr onBack={back} onDone={(role,plan)=>{onRoleApproved(role,plan);goHome()}} forceRole="vendor"/>;
      case"switchVendor":if(hasVendor){switchTo("vendor")}else{go("roleReg")};return null;
      case"switchDriver":if(hasDriver){switchTo("driver")}else{go("roleReg")};return null;
      // Vendor screens
      case"vOrderDetail":return <VOrderDetailScr order={data} onBack={back} go={go}/>;
      case"vOrdersList":return <VOrdersScr go={go} onBack={back}/>;
      case"vProducts":return <VProductsScr go={go} onBack={back}/>;
      case"vAddProduct":return <VProductFormScr onBack={back}/>;
      case"vEditProduct":return <VProductFormScr product={data} onBack={back}/>;
      case"vWallet":return <VWalletScr go={go} onBack={back}/>;
      case"vWithdraw":return <WithdrawScr onBack={back} mode="vendor"/>;
      case"vStats":return <VStatsScr onBack={back}/>;
      case"vChat":return <VChatScr chat={data} onBack={back}/>;
      case"vReviews":return <VReviewsScr onBack={back}/>;
      case"vPromos":return <VPromosScr go={go} onBack={back}/>;
      case"vCreatePromo":return <VCreatePromoScr onBack={back}/>;
      case"vDelivery":return <VDeliveryScr go={go} onBack={back}/>;
      case"vAssignDriver":return <VAssignDriverScr order={data} onBack={back} go={go}/>;
      case"vAddDriver":return <VAddDriverScr onBack={back}/>;
      case"vUpgradePlan":return <VUpgradePlanScr onBack={back} onUpgrade={(p)=>{setVendorPlan(p)}}/>;
      case"vDriverProfile":return <VDriverProfileScr driver={data} go={go} onBack={back}/>;
      case"vTrackDelivery":return <VTrackDeliveryScr delivery={data} go={go} onBack={back}/>;
      case"vDriverChat":return <VDriverChatScr delivery={data} onBack={back}/>;
      case"vNotif":return <VNotifScr onBack={back}/>;
      case"vSettings":return <VSettingsScr onBack={back} go={go}/>;
      case"vReports":return <VReportsScr onBack={back}/>;
      case"vSupport":return <VSupportScr go={go} onBack={back} vendorPlan={vendorPlan}/>;
      case"vShops":return <VShopsScr go={go} onBack={back}/>;
      case"vShopDetail":return <VShopDetailScr shop={data} go={go} onBack={back}/>;
      case"vAddShop":return <VAddShopScr onBack={back}/>;
      case"vApi":return <VApiScr go={go} onBack={back}/>;
      case"vDoc":return <VDocScr docKey={data} onBack={back}/>;
      // Driver screens
      case"drDelivery":return <DrDeliveryScr delivery={data} go={go} onBack={back}/>;
      case"drConfirm":return <DrConfirmScr delivery={data} go={go} onBack={()=>{setScreen(null);setDTab(0);setHistory([])}}/>;
      case"drNavigation":return <DrNavigationScr delivery={data} go={go} onBack={back}/>;
      case"drChatVendor":return <DrChatVendorScr delivery={data} onBack={back}/>;
      case"drChatClient":return <DrChatClientScr delivery={data} onBack={back}/>;
      case"drHistory":return <DrHistoryScr onBack={back}/>;
      case"drWallet":return <DrWalletScr go={go} onBack={back}/>;
      case"drWithdraw":return <WithdrawScr onBack={back} mode="driver"/>;
      case"drNotif":return <DrNotifScr onBack={back}/>;
      case"drVehicle":return <DrVehicleScr onBack={back}/>;
      case"drZones":return <DrZonesScr onBack={back}/>;
      case"drStats":return <DrStatsScr onBack={back}/>;
      case"drSettings":return <DrSettingsScr onBack={back} go={go}/>;
      case"drHelp":return <DrHelpScr onBack={back}/>;
      default:return null;
    }
  };

  const modeBadge=mode==="vendor"?{bg:"#6366F1",label:"MODE VENDEUR"}:mode==="driver"?{bg:"#10B981",label:"MODE LIVREUR"}:null;

  return(
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",background:"linear-gradient(160deg,#e0ddd8 0%,#c9c5bf 100%)",padding:24}}>
      <style>{CSS}</style>
      {/* iPhone 16 Pro outer wrapper */}
      <div style={{position:"relative",borderRadius:61,padding:0}}>
        {/* Titanium outer frame */}
        <div style={{position:"absolute",inset:-2,borderRadius:61,background:"linear-gradient(180deg,#8a8985 0%,#6b6966 20%,#4a4845 50%,#6b6966 80%,#8a8985 100%)",boxShadow:"0 50px 100px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.08) inset",zIndex:-1}}/>

        {/* Side buttons */}
        {/* Action Button - left */}
        <div style={{position:"absolute",left:-3,top:130,width:4,height:28,background:"linear-gradient(180deg,#7a7874,#5a5855,#7a7874)",borderRadius:"3px 0 0 3px",boxShadow:"-1px 0 2px rgba(0,0,0,.3)"}}/>
        {/* Volume Up - left */}
        <div style={{position:"absolute",left:-3,top:178,width:4,height:38,background:"linear-gradient(180deg,#7a7874,#5a5855,#7a7874)",borderRadius:"3px 0 0 3px",boxShadow:"-1px 0 2px rgba(0,0,0,.3)"}}/>
        {/* Volume Down - left */}
        <div style={{position:"absolute",left:-3,top:226,width:4,height:38,background:"linear-gradient(180deg,#7a7874,#5a5855,#7a7874)",borderRadius:"3px 0 0 3px",boxShadow:"-1px 0 2px rgba(0,0,0,.3)"}}/>
        {/* Power - right */}
        <div style={{position:"absolute",right:-3,top:195,width:4,height:72,background:"linear-gradient(180deg,#7a7874,#5a5855,#7a7874)",borderRadius:"0 3px 3px 0",boxShadow:"1px 0 2px rgba(0,0,0,.3)"}}/>

      <div className="phone">
        {/* ── iPhone 16 Pro Status Bar + Dynamic Island ── */}
        <div style={{position:"relative",padding:"14px 28px 8px",flexShrink:0,background:"transparent",zIndex:20}}>
          {/* Dynamic Island */}
          <div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",width:124,height:36,background:"#000",borderRadius:20,zIndex:30,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 1px 3px rgba(0,0,0,.15) inset"}}>
            <div style={{width:12,height:12,borderRadius:"50%",background:"radial-gradient(circle at 40% 35%,#1c1c3a,#0a0a14)",border:"1.5px solid #1a1a2e",marginLeft:36}}/>
          </div>
          {/* Status bar */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:16,fontWeight:600,letterSpacing:-.3,width:54,fontVariantNumeric:"tabular-nums"}}>9:41</span>
            <div style={{width:124}}/>
            <div style={{display:"flex",alignItems:"center",gap:6,width:72,justifyContent:"flex-end"}}>
              {/* Signal bars */}
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="#191815"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="#191815"/><rect x="9" y="3" width="3" height="9" rx="1" fill="#191815"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#191815"/></svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5c-2.7 0-5.15 1.1-6.93 2.87l1.42 1.42A7.65 7.65 0 018 4.5c2.12 0 4.05.86 5.51 2.29l1.42-1.42A9.69 9.69 0 008 2.5z" fill="#191815" opacity=".95"/><path d="M8 6c-1.66 0-3.17.67-4.24 1.76l1.41 1.41A3.98 3.98 0 018 8c1.1 0 2.1.45 2.83 1.17l1.41-1.41A5.97 5.97 0 008 6z" fill="#191815" opacity=".95"/><circle cx="8" cy="11" r="1.2" fill="#191815"/></svg>
              {/* Battery */}
              <svg width="28" height="13" viewBox="0 0 28 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#191815" strokeWidth="1" opacity=".35"/><rect x="2" y="2" width="19.5" height="9" rx="2.5" fill="#191815"/><path d="M25 4.5c.8.4 1.3 1.1 1.3 2s-.5 1.6-1.3 2V4.5z" fill="#191815" opacity=".4"/></svg>
            </div>
          </div>
          {auth===5&&modeBadge&&<div style={{textAlign:"center",marginTop:4}}><span style={{padding:"2px 10px",borderRadius:8,background:modeBadge.bg,color:"#fff",fontSize:9,fontWeight:700,letterSpacing:.5}}>{modeBadge.label}</span></div>}
        </div>

        {auth===0?<SplashScr onDone={()=>setAuth(1)}/>
        :auth===1?<OnboardingScr onDone={()=>setAuth(2)}/>
        :auth===2?<LoginScr onDone={()=>setAuth(3)} onSocial={(p)=>{setSocialProvider(p);setAuth(4)}}/>
        :auth===3?<OTPScr onDone={()=>setAuth(4)}/>
        :auth===4?<ProfileCompletionScr provider={socialProvider} onDone={()=>setAuth(5)}/>
        :<>{renderScreen()}
          {showNav&&<div className="bnav">{tabs.map((t,i)=>{
            const isCart=mode==="buyer"&&i===2;
            const isActive=activeTab===i;
            if(isCart)return(<button key={i} onClick={()=>{setTab(i);setScreen(null);setHistory([])}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",marginTop:-28,position:"relative",zIndex:10}}>
              <div style={{width:56,height:56,borderRadius:28,background:isActive?"linear-gradient(135deg,#6366F1,#4F46E5)":"linear-gradient(135deg,#6366F1,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:isActive?"0 6px 20px rgba(99,102,241,.45)":"0 4px 14px rgba(99,102,241,.3)",border:"4px solid #fff",transition:"all .2s"}}>🛍️</div>
              <span style={{fontSize:9,fontWeight:600,color:isActive?"#6366F1":"#908C82",marginTop:1}}>{isActive&&t.label}</span>
            </button>);
            return(<button key={i} className={`bni ${isActive?"on":""}`} onClick={()=>{mode==="buyer"?setTab(i):mode==="vendor"?setVTab(i):setDTab(i);setScreen(null);setHistory([])}}><span className="bico">{t.icon}</span>{isActive&&t.label}</button>);
          })}</div>}
        </>}

        {/* Home Indicator */}
        <div style={{flexShrink:0,display:"flex",justifyContent:"center",paddingBottom:8,paddingTop:4,background:"transparent"}}>
          <div style={{width:134,height:5,borderRadius:100,background:"#191815",opacity:.2}}/>
        </div>
      </div>
      </div>
    </div>
  );
}
