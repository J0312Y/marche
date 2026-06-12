const CATS = [
  { id:"1", name:"Électronique", icon:"📱", count:124, type:"boutique", photo:"https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop",
    subs:[
      { name:"Téléphones", photo:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop" },
      { name:"Ordinateurs", photo:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" },
      { name:"Audio/Écouteurs", photo:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
      { name:"TV & Vidéo", photo:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=200&fit=crop" },
      { name:"Accessoires", photo:"https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200&h=200&fit=crop" },
      { name:"Gaming", photo:"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop" },
    ]
  },
  { id:"2", name:"Mode", icon:"👗", count:89, type:"boutique", photo:"https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop",
    subs:[
      { name:"Femme", photo:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop" },
      { name:"Homme", photo:"https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=200&h=200&fit=crop" },
      { name:"Enfant", photo:"https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=200&h=200&fit=crop" },
      { name:"Wax & Pagne", photo:"https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=200&fit=crop" },
      { name:"Chaussures", photo:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
      { name:"Sacs & Bagages", photo:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
    ]
  },
  { id:"3", name:"Restaurants", icon:"🍽️", count:56, type:"restaurant", photo:"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop",
    subs:[
      { name:"Cuisine congolaise", photo:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop" },
      { name:"Pizza", photo:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop" },
      { name:"Burgers", photo:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop" },
      { name:"Asiatique", photo:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=200&h=200&fit=crop" },
      { name:"Grillades", photo:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop" },
      { name:"Boissons", photo:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop" },
    ]
  },
  { id:"4", name:"Pâtisseries", icon:"🧁", count:28, type:"patisserie", photo:"https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=200&h=200&fit=crop",
    subs:[
      { name:"Gâteaux", photo:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop" },
      { name:"Viennoiseries", photo:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=200&h=200&fit=crop" },
      { name:"Pains", photo:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop" },
      { name:"Anniversaire", photo:"https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=200&h=200&fit=crop" },
    ]
  },
  { id:"5", name:"Supermarché", icon:"🛒", count:34, type:"supermarche", photo:"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop",
    subs:[
      { name:"Fruits & Légumes", photo:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" },
      { name:"Viandes & Poissons", photo:"https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&h=200&fit=crop" },
      { name:"Épicerie", photo:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" },
      { name:"Boissons", photo:"https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=200&fit=crop" },
      { name:"Hygiène", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
      { name:"Surgelés", photo:"https://images.unsplash.com/photo-1551038247-3d9af20df552?w=200&h=200&fit=crop" },
    ]
  },
  { id:"6", name:"Pharmacie", icon:"💊", count:19, type:"pharmacie", photo:"https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
    subs:[
      { name:"Médicaments", photo:"https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop" },
      { name:"Soins du corps", photo:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
      { name:"Vitamines", photo:"https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop" },
      { name:"Bébé", photo:"https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200&h=200&fit=crop" },
    ]
  },
  { id:"7", name:"Beauté", icon:"💄", count:45, type:"boutique", photo:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
    subs:[
      { name:"Maquillage", photo:"https://images.unsplash.com/photo-1522335789203-aaa2c1c0fde7?w=200&h=200&fit=crop" },
      { name:"Soins visage", photo:"https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
      { name:"Cheveux", photo:"https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200&h=200&fit=crop" },
      { name:"Parfums", photo:"https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop" },
    ]
  },
  { id:"8", name:"Alimentation", icon:"🍎", count:92, type:"supermarche", photo:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
    subs:[
      { name:"Bio", photo:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" },
      { name:"Local", photo:"https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200&h=200&fit=crop" },
      { name:"Importé", photo:"https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop" },
    ]
  },
  { id:"9", name:"Services", icon:"🔧", count:23, type:"service", photo:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop",
    subs:[
      { name:"Plomberie", photo:"https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop" },
      { name:"Électricité", photo:"https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=200&h=200&fit=crop" },
      { name:"Ménage", photo:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop" },
      { name:"Réparation", photo:"https://images.unsplash.com/photo-1572312079989-2bd72b21e9c1?w=200&h=200&fit=crop" },
    ]
  },
  { id:"10", name:"Maison", icon:"🏠", count:67, type:"boutique", photo:"https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop",
    subs:[
      { name:"Décoration", photo:"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop" },
      { name:"Cuisine", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
      { name:"Literie", photo:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&h=200&fit=crop" },
      { name:"Meubles", photo:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop" },
      { name:"Électroménager", photo:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop" },
    ]
  },
];
export default CATS;
