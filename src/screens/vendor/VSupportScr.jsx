import { useState } from "react";

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

export default VSupportScr;
