const CATS = [
  // Fashion
  { id:"1", name:"Mode Femme", icon:"package", count:124, type:"boutique", photo:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop",
    subs:[
      { name:"Robes", photo:"https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?w=200&h=200&fit=crop" },
      { name:"Hauts & T-shirts", photo:"https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&h=200&fit=crop" },
      { name:"Pantalons", photo:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
      { name:"Wax & Pagne", photo:"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=200&fit=crop" },
      { name:"Lingerie", photo:"https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=200&h=200&fit=crop" },
      { name:"Tenues de fête", photo:"https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=200&fit=crop" },
    ]
  },
  { id:"2", name:"Mode Homme", icon:"package", count:78, type:"boutique", photo:"https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop",
    subs:[
      { name:"Chemises", photo:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop" },
      { name:"T-shirts", photo:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
      { name:"Pantalons", photo:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop" },
      { name:"Costumes", photo:"https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=200&h=200&fit=crop" },
      { name:"Bermudas", photo:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop" },
      { name:"Boubous", photo:"https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=200&h=200&fit=crop" },
    ]
  },
  { id:"3", name:"Chaussures Femme", icon:"package", count:45, type:"boutique", photo:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop",
    subs:[
      { name:"Talons", photo:"https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=200&h=200&fit=crop" },
      { name:"Sandales", photo:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop" },
      { name:"Baskets", photo:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
      { name:"Bottines", photo:"https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=200&h=200&fit=crop" },
    ]
  },
  { id:"4", name:"Chaussures Homme", icon:"package", count:38, type:"boutique", photo:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=200&h=200&fit=crop",
    subs:[
      { name:"Sneakers", photo:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
      { name:"Chaussures de ville", photo:"https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=200&h=200&fit=crop" },
      { name:"Mocassins", photo:"https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop" },
      { name:"Sandales", photo:"https://images.unsplash.com/photo-1603487742131-4160ec999306?w=200&h=200&fit=crop" },
    ]
  },
  { id:"5", name:"Sacs & Bagages", icon:"package", count:62, type:"boutique", photo:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop",
    subs:[
      { name:"Sacs à main", photo:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
      { name:"Sacs à dos", photo:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name:"Valises", photo:"https://images.unsplash.com/photo-1565009957-da7e93a7c95b?w=200&h=200&fit=crop" },
      { name:"Pochettes", photo:"https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&h=200&fit=crop" },
    ]
  },
  { id:"6", name:"Accessoires", icon:"", count:54, type:"boutique", photo:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop",
    subs:[
      { name:"Lunettes", photo:"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop" },
      { name:"Montres", photo:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
      { name:"Bijoux", photo:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop" },
      { name:"Ceintures", photo:"https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&h=200&fit=crop" },
      { name:"Foulards", photo:"https://images.unsplash.com/photo-1601924357840-1f64b04ef5bd?w=200&h=200&fit=crop" },
    ]
  },
  // Beauty
  { id:"7", name:"Beauté", icon:"package", count:89, type:"boutique", photo:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    subs:[
      { name:"Maquillage", photo:"https://images.unsplash.com/photo-1522335789203-aaa2c1c0fde7?w=200&h=200&fit=crop" },
      { name:"Soins visage", photo:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
      { name:"Soins corps", photo:"https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=200&h=200&fit=crop" },
      { name:"Cheveux", photo:"https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=200&fit=crop" },
      { name:"Parfums", photo:"https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop" },
      { name:"Manucure", photo:"https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
    ]
  },
  // Restaurants
  { id:"8", name:"Restaurants", icon:"utensils", count:96, type:"restaurant", photo:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
    subs:[
      { name:"Cuisine congolaise", photo:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop" },
      { name:"Pizza", photo:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop" },
      { name:"Burgers", photo:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop" },
      { name:"Asiatique", photo:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop" },
      { name:"Grillades", photo:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop" },
      { name:"Libanais", photo:"https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200&h=200&fit=crop" },
    ]
  },
  // Patisseries
  { id:"9", name:"Pâtisseries", icon:"cupcake", count:48, type:"patisserie", photo:"https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=200&h=200&fit=crop",
    subs:[
      { name:"Gâteaux", photo:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop" },
      { name:"Viennoiseries", photo:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&h=200&fit=crop" },
      { name:"Pains", photo:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop" },
      { name:"Anniversaire", photo:"https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=200&fit=crop" },
      { name:"Cupcakes", photo:"https://images.unsplash.com/photo-1607478900766-efe13248b125?w=200&h=200&fit=crop" },
    ]
  },
  // Supermarché
  { id:"10", name:"Supermarché", icon:"cart", count:184, type:"supermarche", photo:"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop",
    subs:[
      { name:"Fruits & Légumes", photo:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" },
      { name:"Viandes & Poissons", photo:"https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop" },
      { name:"Épicerie", photo:"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop" },
      { name:"Boissons", photo:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop" },
      { name:"Surgelés", photo:"https://images.unsplash.com/photo-1551038247-3d9af20df552?w=200&h=200&fit=crop" },
      { name:"Bébé", photo:"https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" },
    ]
  },
  // Pharmacie
  { id:"11", name:"Pharmacie", icon:"pill", count:67, type:"pharmacie", photo:"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
    subs:[
      { name:"Médicaments", photo:"https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop" },
      { name:"Soins du corps", photo:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
      { name:"Vitamines", photo:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop" },
      { name:"Bébé & Maman", photo:"https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" },
      { name:"Hygiène", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
    ]
  },
  // Electronique
  { id:"12", name:"Électronique", icon:"phone", count:142, type:"boutique", photo:"https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
    subs:[
      { name:"Téléphones", photo:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" },
      { name:"Ordinateurs", photo:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" },
      { name:"Audio / Écouteurs", photo:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
      { name:"TV & Vidéo", photo:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop" },
      { name:"Accessoires", photo:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop" },
      { name:"Gaming", photo:"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop" },
    ]
  },
  // Maison
  { id:"13", name:"Maison & Déco", icon:"", count:108, type:"boutique", photo:"https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop",
    subs:[
      { name:"Décoration", photo:"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop" },
      { name:"Cuisine", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
      { name:"Literie", photo:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=200&fit=crop" },
      { name:"Salle de bain", photo:"https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=200&fit=crop" },
      { name:"Rangement", photo:"https://images.unsplash.com/photo-1558997519-952c5d3e2c2c?w=200&h=200&fit=crop" },
    ]
  },
  // Meubles
  { id:"14", name:"Meubles", icon:"️", count:54, type:"boutique", photo:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop",
    subs:[
      { name:"Canapés", photo:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop" },
      { name:"Lits", photo:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=200&fit=crop" },
      { name:"Tables", photo:"https://images.unsplash.com/photo-1517705008128-361805f42e86?w=200&h=200&fit=crop" },
      { name:"Chaises", photo:"https://images.unsplash.com/photo-1503602642458-232111445657?w=200&h=200&fit=crop" },
      { name:"Armoires", photo:"https://images.unsplash.com/photo-1558997519-952c5d3e2c2c?w=200&h=200&fit=crop" },
    ]
  },
  // Electromenager
  { id:"15", name:"Électroménager", icon:"", count:76, type:"boutique", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    subs:[
      { name:"Cuisson", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
      { name:"Réfrigération", photo:"https://images.unsplash.com/photo-1581622558663-b2e33377dfb2?w=200&h=200&fit=crop" },
      { name:"Lavage", photo:"https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&h=200&fit=crop" },
      { name:"Petit électroménager", photo:"https://images.unsplash.com/photo-1574269909862-7e1d70bb892a?w=200&h=200&fit=crop" },
    ]
  },
  // Bébé & Enfant
  { id:"16", name:"Bébé & Enfant", icon:"package", count:92, type:"boutique", photo:"https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop",
    subs:[
      { name:"Couches & Hygiène", photo:"https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" },
      { name:"Alimentation bébé", photo:"https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=200&h=200&fit=crop" },
      { name:"Vêtements bébé", photo:"https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop" },
      { name:"Jouets", photo:"https://images.unsplash.com/photo-1558877385-8c1ee01f99cf?w=200&h=200&fit=crop" },
      { name:"Poussettes", photo:"https://images.unsplash.com/photo-1554062614-6da4fa67725a?w=200&h=200&fit=crop" },
    ]
  },
  // Vetements Enfant
  { id:"17", name:"Mode Enfant", icon:"user", count:64, type:"boutique", photo:"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=200&h=200&fit=crop",
    subs:[
      { name:"Fille", photo:"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=200&h=200&fit=crop" },
      { name:"Garçon", photo:"https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=200&h=200&fit=crop" },
      { name:"Bébé", photo:"https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop" },
      { name:"Chaussures enfant", photo:"https://images.unsplash.com/photo-1604066867775-43f48e3957d8?w=200&h=200&fit=crop" },
    ]
  },
  // Sport
  { id:"18", name:"Sport & Loisirs", icon:"package", count:58, type:"boutique", photo:"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop",
    subs:[
      { name:"Football", photo:"https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop" },
      { name:"Fitness", photo:"https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop" },
      { name:"Tenues sport", photo:"https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&h=200&fit=crop" },
      { name:"Plein air", photo:"https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=200&fit=crop" },
    ]
  },
  // Hygiene
  { id:"19", name:"Hygiène & Entretien", icon:"package", count:48, type:"boutique", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
    subs:[
      { name:"Détergents", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
      { name:"Hygiène corporelle", photo:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
      { name:"Papier toilette", photo:"https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=200&h=200&fit=crop" },
      { name:"Insecticides", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
    ]
  },
  // Services
  { id:"20", name:"Services", icon:"tool", count:32, type:"service", photo:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop",
    subs:[
      { name:"Plomberie", photo:"https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop" },
      { name:"Électricité", photo:"https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=200&h=200&fit=crop" },
      { name:"Ménage", photo:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop" },
      { name:"Réparation", photo:"https://images.unsplash.com/photo-1572312079989-2bd72b21e9c1?w=200&h=200&fit=crop" },
    ]
  },
];
export default CATS;
