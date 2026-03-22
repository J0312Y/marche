

function VDocScr({docKey,onBack}){
  const docs={
    guide:{
      title:"Guide de démarrage",icon:"📘",color:"#F97316",
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
      title:"Guide Webhooks",icon:"🔔",color:"#FB923C",
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
      title:"SDKs & Exemples",icon:"🧩",color:"#F97316",
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
  if(!doc)return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0}}><button onClick={onBack}>←</button><h2>Documentation</h2><div style={{width:38}}/></div><p>Document introuvable.</p></div>);

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2 style={{fontSize:15}}>{doc.icon} {doc.title}</h2><div style={{width:38}}/></div>

    <div style={{padding:12,background:`${doc.color}08`,border:`1px solid ${doc.color}20`,borderRadius:14,marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:700,color:doc.color}}>API Lamuka v2.0 — {doc.title}</div>
      <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Base URL : https://api.lamuka.cg/v2</div>
    </div>

    {doc.sections.map((s,i)=><div key={i} style={{marginBottom:12}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
        <span style={{width:22,height:22,borderRadius:7,background:doc.color,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
        {s.title}
      </h4>
      {s.content&&<p style={{fontSize:12,color:"var(--sub)",lineHeight:1.6,marginBottom:s.code?8:0}}>{s.content}</p>}
      {s.code&&<div style={{padding:12,background:"#1a1a2e",borderRadius:12,overflowX:"auto"}}>
        <pre style={{margin:0,fontSize:10,lineHeight:1.5,color:"#e2e8f0",fontFamily:"'SF Mono',Menlo,monospace",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{s.code}</pre>
      </div>}
    </div>)}

    <div className="info-box blue" style={{marginTop:6}}><span>💡</span><span style={{fontSize:11}}>Testez en sandbox avant d'utiliser en production. <b>support-enterprise@lamuka.cg</b></span></div>
  </div>);
}

/* V19 ── UPGRADE PLAN ── */

export default VDocScr;
