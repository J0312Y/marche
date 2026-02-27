const PHOTOS={
  "Robe Wax Moderne":"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=200&fit=crop",
  "Sac à Main Cuir":"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
  "Chemise Bogolan":"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
  "Bracelet Perles":"https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=200&h=200&fit=crop",
  "Sandales Cuir":"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop",
  "Écharpe Kente":"https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=200&h=200&fit=crop",
};
const V_ORDERS=[
  {id:"vo1",ref:"#CMD-0891",client:"Marie Koumba",phone:"+242 06X XXX",addr:"Bacongo, Rue 14",items:[{name:"Robe Wax Moderne",qty:2,price:25000,img:"👗",photo:PHOTOS["Robe Wax Moderne"]},{name:"Sac à Main Cuir",qty:1,price:42000,img:"👜",photo:PHOTOS["Sac à Main Cuir"]}],total:92000,status:"new",date:"14 Fév 14:42",payment:"Airtel Money"},
  {id:"vo2",ref:"#CMD-0890",client:"Patrick Mbemba",phone:"+242 06X XXX",addr:"Poto-Poto, Av. de la Paix",items:[{name:"Chemise Bogolan",qty:1,price:18000,img:"👔",photo:PHOTOS["Chemise Bogolan"]}],total:18000,status:"preparing",date:"14 Fév 11:20",payment:"MTN MoMo"},
  {id:"vo3",ref:"#CMD-0889",client:"Celine Nzaba",phone:"+242 06X XXX",addr:"Moungali, Rue 8",items:[{name:"Robe Wax Moderne",qty:1,price:25000,img:"👗",photo:PHOTOS["Robe Wax Moderne"]}],total:25000,status:"shipped",date:"13 Fév 16:05",payment:"MTN MoMo"},
  {id:"vo4",ref:"#CMD-0885",client:"David Tsaty",phone:"+242 06X XXX",addr:"Talangaï",items:[{name:"Sac à Main Cuir",qty:1,price:42000,img:"👜",photo:PHOTOS["Sac à Main Cuir"]},{name:"Chemise Bogolan",qty:2,price:18000,img:"👔",photo:PHOTOS["Chemise Bogolan"]}],total:78000,status:"delivered",date:"12 Fév 09:30",payment:"Airtel Money"},
  {id:"vo5",ref:"#CMD-0880",client:"Grace Mouanda",phone:"+242 06X XXX",addr:"Bacongo",items:[{name:"Robe Wax Moderne",qty:3,price:25000,img:"👗",photo:PHOTOS["Robe Wax Moderne"]}],total:75000,status:"delivered",date:"10 Fév 15:12",payment:"MTN MoMo"},
];
const V_PRODUCTS=[
  {id:"vp1",name:"Robe Wax Moderne",price:25000,stock:23,sold:45,img:"👗",photo:PHOTOS["Robe Wax Moderne"],active:true,cat:"Mode"},
  {id:"vp2",name:"Chemise Bogolan",price:18000,stock:8,sold:33,img:"👔",photo:PHOTOS["Chemise Bogolan"],active:true,cat:"Mode"},
  {id:"vp3",name:"Sac à Main Cuir",price:42000,stock:3,sold:51,img:"👜",photo:PHOTOS["Sac à Main Cuir"],active:true,cat:"Mode"},
  {id:"vp4",name:"Bracelet Perles",price:8500,stock:0,sold:12,img:"📿",photo:PHOTOS["Bracelet Perles"],active:false,cat:"Beauté"},
  {id:"vp5",name:"Sandales Cuir",price:15000,stock:15,sold:28,img:"👡",photo:PHOTOS["Sandales Cuir"],active:true,cat:"Mode"},
  {id:"vp6",name:"Écharpe Kente",price:12000,stock:20,sold:19,img:"🧣",photo:PHOTOS["Écharpe Kente"],active:true,cat:"Mode"},
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

export { V_ORDERS, V_PRODUCTS, V_WALLET, V_REVIEWS, V_PROMOS, V_STATS, V_NOTIFS };
