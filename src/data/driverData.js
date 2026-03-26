const PHOTOS={
  "Robe Wax Moderne":"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=200&fit=crop",
  "Sac à Main Cuir":"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
  "Chemise Bogolan":"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
};
const LOGOS={
  "Mode Afrique":"https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop",
  "Tech Congo":"https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop",
};
const D_DELIVERIES=[
  {id:"dl1",ref:"#CMD-0891",vendor:{name:"Mode Afrique",avatar:"👔",phone:"+242 06X XXX",logo:LOGOS["Mode Afrique"]},client:{name:"Marie Koumba",phone:"+242 06X XXX",addr:"Quartier Bacongo, Rue 14, N°42",lat:-4.277,lng:15.283},items:[{name:"Robe Wax Moderne",qty:2,img:"👗",photo:PHOTOS["Robe Wax Moderne"]},{name:"Sac à Main Cuir",qty:1,img:"👜",photo:PHOTOS["Sac à Main Cuir"]}],total:92000,pickup:"Marché Total, Stand 42",status:"active",distance:"3.2 km",eta:"12 min",fee:2500,tip:500},
  {id:"dl3",ref:"#CMD-0887",vendor:{name:"Chez Mama Ngudi",avatar:"🍽️",phone:"+242 064 663 469"},client:{name:"Bruno Tsaty",phone:"+242 064 663 469",addr:"Talangaï, Av. Marien Ngouabi",lat:-4.260,lng:15.295},items:[{name:"Poulet DG",qty:2,img:"🍗"}],total:11000,pickup:"Marché Ouenzé",status:"pending",distance:"2.1 km",eta:"8 min",fee:2000,tip:0,payment:"cash"},
  {id:"dl2",ref:"#CMD-0890",vendor:{name:"Tech Congo",avatar:"🏪",phone:"+242 06X XXX",logo:LOGOS["Tech Congo"]},client:{name:"Patrick Mbemba",phone:"+242 06X XXX",addr:"Poto-Poto, Avenue de la Paix, N°8",lat:-4.269,lng:15.289},items:[{name:"Chemise Bogolan",qty:1,img:"👔",photo:PHOTOS["Chemise Bogolan"]}],total:18000,pickup:"Marché Total, Stand 15",status:"pending",distance:"4.8 km",eta:"20 min",fee:2500,tip:0},
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

export { D_DELIVERIES, D_HISTORY, D_STATS, D_NOTIFS };
