/**
 * Design « Toters » appliqué à Lamuka — valeurs relevées sur l'app Toters (écran 360 dp, 1 px CSS = 1 dp) :
 * vert #00B492, texte #000, gris #8E93A1, boutons gris #F3F3F6, fond #FAFAFB, police Noto Sans.
 * Préfixe .t- pour ne pas toucher aux écrans vendeur / livreur.
 */
const T_CSS = `
:root{--acc:#00B492;--acc-d:#008B71;--acc-l:#E8F8F5;--acc-m:#D6F3ED;--t-text:#000000;--t-sub:#8E93A1;--t-mut:#8E93A1;--t-line:#ECECEF;--t-bg2:#F3F3F6;--t-page:#FAFAFB;--t-font:'Noto Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
.dark{--acc-l:#0F2E28;--acc-m:#124038;--t-text:#F5F5F7;--t-sub:#9A9FAD;--t-mut:#9A9FAD;--t-line:#2C2C2E;--t-bg2:#232326;--t-page:#141416}

.t-scr,.t-head,.t-nav,.t-sheet,.t-pd,.t-bottom,.t-cartbar{font-family:var(--t-font)}
.t-scr{flex:1;overflow-y:auto;overflow-x:hidden;background:var(--card);color:var(--t-text);-webkit-overflow-scrolling:touch;position:relative}
.t-scr::-webkit-scrollbar{display:none}
.t-scr.gray{background:var(--t-page)}
.t-pad{padding:0 16px}
.t-h1{font-size:18px;font-weight:700;color:var(--t-text)}
.t-h2{font-size:20px;font-weight:700;letter-spacing:-.2px;color:var(--t-text)}
.t-sub{font-size:13px;color:var(--t-sub)}
.t-mut{font-size:12px;color:var(--t-mut)}
.t-sec-head{display:flex;align-items:center;justify-content:space-between;padding:20px 16px 12px}
.t-round-btn{width:40px;height:40px;border-radius:50%;border:none;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t-text);flex-shrink:0}
.t-hcart{display:flex;align-items:center;gap:6px;height:36px;padding:0 10px;margin-left:8px;border:none;border-radius:10px;background:var(--acc);color:#fff;font-family:inherit;cursor:pointer;box-shadow:0 4px 14px rgba(0,174,135,.35)}
.t-hcart b{font-size:17px;font-weight:600}
.t-hcart svg{width:24px;height:24px}
.t-round-btn.white{background:var(--card)}
.t-round-btn.glass{background:rgba(255,255,255,.92);color:#000}

/* En-tête accueil */
.t-addr{display:flex;align-items:center;gap:4px;background:none;border:none;font-family:inherit;cursor:pointer;color:var(--t-text);padding:0}
.t-addr b{font-size:16px;font-weight:600;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-search{display:flex;align-items:center;gap:12px;height:48px;padding:0 12px;border-radius:12px;background:var(--card);box-shadow:0 1px 8px rgba(0,0,0,.08);cursor:text;color:var(--t-sub);font-size:15px}
.t-search input{flex:1;border:none;outline:none;background:transparent;font-family:inherit;font-size:15px;color:var(--t-text);min-width:0}
.t-search input::placeholder{color:var(--t-sub)}
.t-sticky{position:sticky;top:0;z-index:30;background:var(--card)}
.t-sticky.shadow{box-shadow:0 2px 6px rgba(0,0,0,.06)}

/* Univers (tuiles 70 × 66, image 52) */
.t-verts{display:flex;gap:12px;overflow-x:auto;padding:4px 16px 0;scrollbar-width:none}
.t-verts::-webkit-scrollbar{display:none}
.t-vert{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-family:inherit;flex-shrink:0;width:70px;padding:0 0 10px;position:relative}
.t-vert .tile{width:70px;height:66px;border-radius:16px;background:var(--card);display:flex;align-items:center;justify-content:center;border:1px solid var(--t-line);overflow:hidden}
.t-vert .tile>*{width:52px!important;height:52px!important;border-radius:10px;overflow:hidden}
.t-vert .tile>img{width:62px!important;height:62px!important;object-fit:contain;border-radius:0;filter:drop-shadow(0 3px 4px rgba(0,0,0,.14))}
.t-vert span{font-size:14px;font-weight:400;color:var(--t-text)}
.t-vert.on .tile{border:2px solid var(--acc)}
.t-vert.on span{color:var(--acc);font-weight:500}
.t-vert.on::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;border-radius:3px 3px 0 0;background:var(--acc)}

/* Puces de filtre (36 de haut) */
.t-chips{display:flex;gap:8px;overflow-x:auto;padding:12px 16px;scrollbar-width:none}
.t-chips::-webkit-scrollbar{display:none}
.t-chip{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-radius:10px;border:1px solid var(--t-line);background:var(--card);font-family:inherit;font-size:14px;font-weight:400;color:var(--t-text);white-space:nowrap;cursor:pointer;flex-shrink:0}
.t-chip.on{border-color:var(--acc);background:var(--acc-l);color:var(--acc-d);font-weight:500}

/* Bandeau pointillé (52 de haut) */
.t-dash{display:flex;align-items:center;gap:8px;margin:16px 16px 0;height:52px;padding:0 8px 0 12px;border:1px dashed #D8D8D8;border-radius:12px}
.t-dash .txt{flex:1;font-size:14px;font-weight:500;color:var(--t-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-pill-btn{height:28px;padding:0 10px;border-radius:8px;border:none;background:var(--t-bg2);font-family:inherit;font-size:14px;font-weight:500;color:var(--t-text);cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}

/* Tuiles promo (106 × 134) + carrousel (312 × 131) */
.t-hscroll{display:flex;gap:10px;overflow-x:auto;padding:0 16px;scroll-padding:0 16px;scroll-snap-type:x mandatory;scrollbar-width:none}
.t-hscroll::-webkit-scrollbar{display:none}
.t-hscroll>*{scroll-snap-align:start;flex-shrink:0}
.t-promo{width:106px;height:134px;border-radius:14px;border:1px solid var(--t-line);overflow:hidden;position:relative;cursor:pointer;background:var(--acc-l);padding:8px;display:flex;flex-direction:column;justify-content:space-between}
.t-promo b{font-size:15px;font-weight:800;line-height:1.1;color:var(--t-text)}
.t-banner{width:312px;height:131px;border-radius:16px;overflow:hidden;position:relative;cursor:pointer;background:var(--t-bg2)}
.t-banner .txt{position:absolute;left:16px;top:18px;right:42%;z-index:2}
.t-banner .txt b{display:block;font-size:16px;font-weight:700;line-height:1.25;color:#000}
.t-banner .txt span{font-size:13px;color:#4B4F5C}
.t-dots-nav{display:flex;justify-content:center;gap:5px;margin-top:8px}
.t-dots-nav i{width:6px;height:6px;border-radius:3px;background:#D5D7DD}
.t-dots-nav i.on{width:16px;background:var(--acc)}

/* Catégories rondes (52) */
.t-cats{display:flex;gap:8px;overflow-x:auto;padding:0 16px;scrollbar-width:none}
.t-cats::-webkit-scrollbar{display:none}
.t-cat{display:flex;flex-direction:column;align-items:center;gap:6px;width:66px;flex-shrink:0;background:none;border:none;cursor:pointer;font-family:inherit;padding:0}
.t-cat .ring{width:62px;height:62px;border-radius:50%;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.14)}
.t-cat .ring>img,.t-subcats .ring>img{width:90%;height:90%;object-fit:contain}
.t-cat span{font-size:12px;font-weight:400;color:var(--t-text);text-align:center;line-height:1.2;max-width:66px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Grande carte boutique (328 ; photo 184) */
.t-store{margin:0 16px 16px;border-radius:16px;overflow:hidden;border:none;box-shadow:0 1px 6px rgba(0,0,0,.08);background:var(--card);cursor:pointer;position:relative}
.t-badges{position:absolute;top:10px;left:10px;z-index:3;display:flex;flex-direction:column;align-items:flex-start;gap:6px}
.t-badges>span{height:28px;padding:0 9px;border-radius:14px;color:#fff;font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:5px;white-space:nowrap}
.t-badges .off{background:#E5484D}
.t-badges .punch{background:rgba(40,40,40,.72);font-weight:600}
.t-badges .dots{display:flex;font-style:normal}
.t-badges .dots i{width:13px;height:13px;border-radius:50%;border:1.5px solid #fff;margin-left:-4px;background:rgba(255,255,255,.15)}
.t-badges .dots i:first-child{margin-left:0}
.ta-addr{margin:6px 16px 16px;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.08);overflow:hidden}
.ta-addr .row{display:flex;align-items:center;gap:14px;width:100%;min-height:72px;padding:0 16px;border:none;border-bottom:1px solid var(--t-line);background:var(--card);font-family:var(--t-font);text-align:left;cursor:pointer;color:var(--t-text)}
.ta-addr .row:last-child{border-bottom:none}
.ta-addr .tx{flex:1;min-width:0;display:flex;flex-direction:column}
.ta-addr .tx b{font-size:16px;font-weight:600}
.ta-addr .tx span{font-size:13px;color:var(--t-sub)}
.t-results{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 12px;font-size:14px;color:var(--t-sub)}
.t-results button{height:36px;padding:0 14px;border-radius:10px;border:none;background:var(--t-bg2);font-family:var(--t-font);font-size:14px;font-weight:500;color:var(--t-text);cursor:pointer}
.t-nomatch{display:flex;flex-direction:column;align-items:center;text-align:center;padding:28px 24px 40px}
.t-nomatch b{font-size:15px;font-weight:600;margin-top:14px;color:var(--t-text)}
.t-nomatch p{font-size:14px;color:var(--t-sub);margin-top:4px}
.t-nomatch button{margin-top:18px;height:44px;padding:0 18px;border-radius:10px;border:1.5px solid var(--acc);background:none;color:var(--acc);font-family:var(--t-font);font-size:16px;font-weight:600;cursor:pointer}
.t-subcats{display:flex;gap:14px;overflow-x:auto;padding:14px 16px 2px;scrollbar-width:none}
.t-subcats::-webkit-scrollbar{display:none}
.t-subcats button{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;padding:0;cursor:pointer;font-family:var(--t-font);flex-shrink:0;width:72px}
.t-subcats .ring{width:64px;height:64px;border-radius:50%;overflow:hidden;background:var(--t-bg2);box-shadow:0 2px 6px rgba(0,0,0,.12)}
.t-subcats span{font-size:13px;color:var(--t-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:72px}
.t-subcats button.on span{color:var(--acc);font-weight:600}
.t-store .cover{height:184px;position:relative;background:var(--t-bg2)}
.t-store .body{padding:10px 12px 12px}
.t-store .name{font-size:17px;font-weight:700;color:var(--t-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-meta{display:flex;align-items:center;gap:12px;margin-top:4px;font-size:13px;color:var(--t-text);font-weight:400}
.t-meta span{display:inline-flex;align-items:center;gap:4px}
.t-meta .free{color:#E5484D;font-weight:700;font-size:12px}
.t-fav{position:absolute;top:8px;right:8px;width:40px;height:40px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4))}
.t-badge-dark{position:absolute;top:10px;left:10px;z-index:3;height:28px;padding:0 10px;border-radius:14px;background:rgba(0,0,0,.6);color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;gap:5px}
.t-closed{position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#fff;z-index:2}
.t-closed b{font-size:14px;font-weight:600;display:flex;align-items:center;gap:5px}
.t-closed span{padding:5px 10px;border-radius:8px;background:rgba(255,255,255,.22);font-size:13px;font-weight:600}

/* Carte boutique compacte (281 × 83 ; photo 94) */
.t-store-sm{width:281px;height:83px;display:flex;border-radius:12px;overflow:hidden;border:1px solid var(--t-line);background:var(--card);cursor:pointer;position:relative}
.t-store-sm .ph{width:94px;height:100%;position:relative;flex-shrink:0;background:var(--t-bg2)}
.t-store-sm .in{flex:1;padding:12px 10px;min-width:0}
.t-store-sm .in b{display:block;font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Carte produit (124) */
.t-prod{width:124px;cursor:pointer;flex-shrink:0}
.t-prod .ph{width:124px;height:124px;border-radius:16px;border:1px solid var(--t-line);overflow:hidden;position:relative;background:var(--card)}
.t-prod .shop{font-size:11px;color:var(--t-sub);margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-prod .nm{font-size:14px;font-weight:400;color:var(--t-text);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:38px}
.t-prod .pr{font-size:15px;font-weight:700;color:var(--t-text);margin-top:4px;white-space:nowrap}
.t-prod .old{font-size:12px;color:var(--t-sub);text-decoration:line-through;margin-left:4px;font-weight:400}
.t-prod .pr.promo{color:#E5484D}
.t-prod .save{font-size:11.5px;font-weight:800;letter-spacing:.2px;color:#E5484D;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-prod .oos-t{font-size:12px;font-weight:600;color:#E5484D;margin-top:3px}
.t-prod.grid .ph{border:none;box-shadow:0 1px 6px rgba(0,0,0,.08)}
.t-prod.grid .nm{min-height:0;font-size:13.5px}
.t-prod.oos .ph img{opacity:.45}
.t-hot{display:flex;align-items:center;gap:3px;font-size:12.5px;font-weight:600;color:#F59E0B;margin-top:6px}
.t-oos-b{display:inline-block;margin-bottom:10px;padding:5px 10px;border-radius:8px;background:#FDECEC;color:#E5484D;font-size:13px;font-weight:500}
.t-item .cal{font-size:13px;color:var(--t-sub);margin-top:2px}
.t-item .sz{font-size:13px;color:var(--t-sub);font-weight:400;margin-left:8px}
.t-item .ph.na img{opacity:.45}
.t-item .na-pill,.t-prod .na-pill{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:4px 10px;border-radius:12px;background:#fff;color:#E5484D;font-size:12px;font-weight:500;white-space:nowrap;z-index:2}
/* Rangées horizontales : marge de fin (le padding droit est ignoré dans un défilement flex) */
.t-subcats::after,.t-tabs::after,.t-cats::after,.t-chips::after,.t-verts::after,.ts-kinds::after,.t-hscroll::after,.tr-rail::after,.t-loyal::after{content:"";flex:0 0 10px}
/* Sélecteur de lieu (Toters « Confirm delivery location ») */
.tl-pick{position:absolute;inset:0;z-index:980;background:var(--card);display:flex;flex-direction:column;font-family:var(--t-font)}
.tl-head{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 16px 10px;background:var(--card);flex-shrink:0}
.tl-head b{font-size:20px;font-weight:600;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tl-map{position:relative;flex:1;min-height:0;background:#EEF0F2;overflow:hidden}
.tl-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.tl-search{position:absolute;top:12px;left:16px;right:16px;z-index:500;display:flex;align-items:center;gap:12px;height:52px;padding:0 14px;border:none;border-radius:14px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.12);font-family:var(--t-font);font-size:16px;color:var(--t-sub);cursor:pointer;text-align:left}
.tl-bubble{position:absolute;left:50%;top:calc(50% - 96px);transform:translateX(-50%);z-index:500;background:#111;color:#fff;font-size:14px;font-weight:600;padding:10px 16px;border-radius:22px;white-space:nowrap;pointer-events:none;transition:transform .15s}
.tl-bubble.up{transform:translate(-50%,-10px)}
.tl-pin{position:absolute;left:50%;top:50%;z-index:500;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center;pointer-events:none;transition:transform .15s}
.tl-pin.up{transform:translate(-50%,calc(-100% - 10px))}
.tl-pin .head{width:44px;height:44px;border-radius:50%;background:var(--acc);border:4px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,.25)}
.tl-pin .stick{width:3px;height:18px;background:var(--acc);border-radius:2px}
.tl-dot{position:absolute;left:50%;top:50%;z-index:499;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:rgba(0,0,0,.25);pointer-events:none}
.tl-gps{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);z-index:500;display:flex;align-items:center;gap:8px;height:44px;padding:0 18px;border-radius:12px;border:1px solid var(--t-line);background:#fff;font-family:var(--t-font);font-size:15px;color:var(--t-sub);cursor:pointer;white-space:nowrap;box-shadow:0 1px 6px rgba(0,0,0,.08)}
.tl-card{flex-shrink:0;padding:16px 16px calc(14px + env(safe-area-inset-bottom,0px));background:var(--card);border-radius:18px 18px 0 0;margin-top:-16px;position:relative;z-index:600;box-shadow:0 -4px 16px rgba(0,0,0,.06)}
.tl-row{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px}
.tl-row b{display:block;font-size:20px;font-weight:600;color:var(--t-text)}
.tl-row p{font-size:15px;color:var(--t-text);line-height:1.4;margin-top:2px}
.tl-card .t-cta{width:100%;height:52px;justify-content:center;font-size:17px}
.tl-sres{position:absolute;inset:0;z-index:700;background:var(--card);display:flex;flex-direction:column}
.tl-sres .sb{display:flex;align-items:center;gap:12px;height:48px;margin:4px 16px 8px;padding:0 14px;border-radius:12px;background:var(--t-bg2)}
.tl-sres .sb input{flex:1;min-width:0;border:none;background:none;outline:none;font-family:var(--t-font);font-size:16px;color:var(--t-text)}
.tl-res{display:flex;align-items:center;gap:14px;width:100%;min-height:62px;padding:0 16px;border:none;border-bottom:1px solid var(--t-line);background:none;font-family:var(--t-font);text-align:left;cursor:pointer;color:var(--t-text)}
.tl-res span{display:flex;flex-direction:column}
.tl-res b{font-size:16px;font-weight:500}
.tl-res small{font-size:13px;color:var(--t-sub)}
.ta-spot{display:flex;align-items:center;gap:12px;width:100%;padding:14px;margin-bottom:14px;border:1px solid var(--t-line);border-radius:14px;background:var(--card);font-family:var(--t-font);text-align:left;cursor:pointer;color:var(--t-text)}
.ta-spot>span:nth-child(2){flex:1;display:flex;flex-direction:column}
.ta-spot b{font-size:16px;font-weight:600}
.ta-spot small{font-size:13px;color:var(--t-sub)}
.ta-lab{display:flex;gap:10px;margin-bottom:14px}
.ta-lab button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;height:44px;border-radius:12px;border:1.5px solid var(--t-line);background:var(--card);font-family:var(--t-font);font-size:15px;color:var(--t-text);cursor:pointer}
.ta-lab button.on{border-color:var(--acc);color:var(--acc);font-weight:600}
/* Premier lancement (Toters) */
.fr-intro{position:absolute;inset:0;z-index:960;background:var(--card);display:flex;flex-direction:column;padding:calc(10px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px));font-family:var(--t-font);color:var(--t-text)}
.fr-intro .bars{display:flex;gap:8px}
.fr-intro .bars span{flex:1;height:3px;border-radius:2px;background:#E3E4E8;overflow:hidden}
.fr-intro .bars i{display:block;height:100%;background:var(--acc)}
.fr-intro .lang{display:flex;justify-content:flex-end;margin-top:14px}
.fr-intro .lang button{display:flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-radius:12px;border:1.5px solid var(--acc);background:none;color:var(--acc);font-family:var(--t-font);font-size:16px}
.fr-intro h1{font-size:30px;font-weight:600;line-height:1.25;margin-top:18px;letter-spacing:-.3px}
.fr-intro p{font-size:18px;color:var(--t-sub);line-height:1.45;margin-top:10px}
.fr-intro .art{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:10px 0}
.t-cta.fr-cta{width:100%;height:52px;min-height:52px;justify-content:center;font-size:17px;flex:0 0 auto}
.fr-page{position:absolute;inset:0;z-index:960;background:var(--card);display:flex;flex-direction:column;padding:calc(10px + env(safe-area-inset-top,0px)) 16px calc(16px + env(safe-area-inset-bottom,0px));font-family:var(--t-font);color:var(--t-text);overflow-y:auto}
.fr-page>.t-back{align-self:flex-start}
.fr-page h2{font-size:24px;font-weight:600;margin:30px 0 22px}
.fr-row{display:flex;align-items:center;gap:16px;padding:18px 16px;margin-bottom:14px;border-radius:14px;background:var(--t-bg2)}
.fr-row .ic{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.fr-row b{font-size:17px;font-weight:600;line-height:1.3}
.fr-note{text-align:center;font-size:14px;color:var(--t-text);margin-top:18px}
.fr-page.center .fr-locart{margin:auto auto 22px;width:150px;height:150px;border-radius:50%;background:var(--acc-l);display:flex;align-items:center;justify-content:center}
.fr-sub{text-align:center;font-size:17px;line-height:1.45;color:var(--t-text);margin:10px 0 auto}
.fr-page.center .fr-cta{margin-top:30px}
.fr-search{display:flex;align-items:center;gap:12px;height:52px;padding:0 14px;border-radius:12px;border:1px solid var(--t-line);background:var(--card);margin-bottom:12px}
.fr-search input{flex:1;min-width:0;border:none;outline:none;background:none;font-family:var(--t-font);font-size:16px;color:var(--t-text)}
.fr-mine{display:flex;align-items:center;gap:14px;width:100%;min-height:72px;padding:0 16px;border:none;border-radius:14px;background:var(--card);box-shadow:0 1px 6px rgba(0,0,0,.06);font-family:var(--t-font);text-align:left;cursor:pointer;color:var(--t-text)}
.fr-mine span{flex:1;display:flex;flex-direction:column}
.fr-mine b{font-size:17px;font-weight:600}
.fr-mine small{font-size:14px;color:var(--t-sub)}
.t-closed-band svg{flex-shrink:0}
.t-closed-band{position:relative;z-index:4;display:flex;align-items:center;justify-content:center;gap:6px;margin:-74px 16px 0;height:46px;padding:0 12px 12px;border-radius:16px 16px 0 0;background:rgba(40,40,40,.62);color:#fff;font-size:13.5px;font-weight:500;white-space:nowrap;overflow:hidden}
.t-store-card.closed{margin-top:-12px}
.tc-card.closed{overflow:visible;margin-top:17px}
.tc-band{display:flex;align-items:center;justify-content:center;gap:5px;height:40px;margin:-1px -1px 0;padding:0 10px 6px;border-radius:12px 12px 0 0;background:#EEEFF2;font-size:13.5px;color:#111;white-space:nowrap;overflow:hidden}
.tc-band b{font-weight:600}
.tc-closed{display:flex;align-items:center;gap:10px;margin:0 12px 10px;padding:10px 12px;border-radius:12px;background:#FEF3C7;color:#92400E;font-size:13.5px;line-height:1.35;cursor:pointer}
.t-subcats .ring{background:#fff !important;display:flex;align-items:center;justify-content:center}
.t-promo3{width:106px;height:134px;flex-shrink:0;border-radius:14px;position:relative;overflow:hidden;cursor:pointer;padding:9px 8px;box-sizing:border-box;border:1.5px solid #fff;box-shadow:0 0 0 1px var(--t-line)}
.t-promo3 b{display:block;font-size:15px;font-weight:800;line-height:1.15;color:#1B1B1B;position:relative;z-index:2}
.t-promo3.long b{font-size:13.5px}
.t-promo3.caps b{text-transform:uppercase;font-size:13.5px;color:#0B6B57;letter-spacing:.2px}
.t-promo3 .art{position:absolute;right:-14px;bottom:-12px;width:100px;height:100px;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.15))}
.t-promo3 .pct{position:absolute;left:8px;bottom:8px;min-width:30px;padding:0 7px;box-sizing:border-box;white-space:nowrap;height:30px;border-radius:15px;background:#E5484D;color:#fff;font-weight:800;font-size:15px;display:flex;align-items:center;justify-content:center;z-index:2}
.t-banner3{width:312px;height:131px;flex-shrink:0;border-radius:18px;position:relative;overflow:hidden;cursor:pointer;color:#fff;padding:14px 16px;box-sizing:border-box}
.t-banner3 .brand i{font-style:italic;font-weight:800;font-size:15px;opacity:.95}
.t-banner3 b{display:block;font-size:17px;font-weight:700;line-height:1.2;margin-top:4px;max-width:190px}
.t-banner3 span{display:block;font-size:12px;line-height:1.3;opacity:.92;margin-top:3px;max-width:180px}
.t-banner3 em{display:inline-block;margin-top:7px;padding:3px 8px;border-radius:5px;background:#fff;color:#E5484D;font-style:normal;font-size:11px;font-weight:800;letter-spacing:.3px}
.t-banner3 img{position:absolute;right:-6px;bottom:-8px;width:120px;height:120px;object-fit:contain;filter:drop-shadow(0 6px 10px rgba(0,0,0,.25))}
.t-banner3.photo{padding:0;background:var(--t-bg2)}
.t-banner3.photo img.full{position:static;width:100%;height:100%;object-fit:cover;filter:none}
.t-vlabels{display:flex;gap:4px;overflow-x:auto;padding:0 10px;border-bottom:1px solid var(--t-line);scrollbar-width:none}
.t-vlabels::-webkit-scrollbar{display:none}
.t-vlabels button{flex-shrink:0;height:36px;padding:0 12px;border:none;border-bottom:3px solid transparent;background:none;font-family:var(--t-font);font-size:14px;color:var(--t-text);cursor:pointer}
.t-vlabels button.on{color:var(--acc);border-bottom-color:var(--acc);font-weight:600}
.t-totop{position:absolute;left:50%;transform:translateX(-50%);z-index:45;display:flex;align-items:center;gap:6px;height:36px;padding:0 14px;border:none;border-radius:18px;background:rgba(30,30,30,.88);color:#fff;font-family:var(--t-font);font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.2);animation:tFade .2s ease}
/* En-tête accueil « collapsing » (Toters) : couches qui glissent (transform), relais sans fondu */
.hd2{position:absolute;top:0;left:0;right:0;z-index:40}
.hd2-loc{position:relative;background:var(--card);z-index:1}
.hd2-mv{position:relative;z-index:3;will-change:transform}
.hd2-srch{position:relative;background:var(--card);z-index:3}
.hd-root.hd-stuck .hd2-loc{visibility:hidden}
.hd2-srch{display:flex;align-items:center;padding-bottom:8px;transition:box-shadow .2s}
.hd2-srch .cartslot{display:flex;max-width:0;opacity:0;overflow:hidden;transition:max-width .25s ease,opacity .2s ease}
.hd-root.hd-stuck .hd2-srch .cartslot{max-width:90px;opacity:1}
.hd2-lay{position:absolute;left:0;right:0;top:100%;z-index:1;visibility:hidden;background:var(--card);will-change:transform}
.hd-root.hd-sh .hd2-lay{box-shadow:0 2px 6px rgba(0,0,0,.06)}
.hd2-labels .t-vert{padding-bottom:10px}
.hd2-labels{pointer-events:auto;border-bottom:1px solid var(--t-line)}
.t-search .ph{flex:1;min-width:0;position:relative;height:20px;overflow:hidden}
.t-search .ph i{position:absolute;left:0;right:0;font-style:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .3s ease,transform .3s cubic-bezier(.2,.8,.2,1)}
.t-search .ph .b{opacity:0;transform:translateY(16px)}
.hd-root.hd-far .t-search .ph .a{opacity:0;transform:translateY(-16px)}
.hd-root.hd-far .t-search .ph .b{opacity:1;transform:none}
.t-totop{opacity:0;pointer-events:none;transition:opacity .25s ease;top:0}
.t-totop.on{opacity:1;pointer-events:auto}
.t-off{position:absolute;top:8px;left:8px;background:#E5484D;color:#fff;font-size:12px;font-weight:700;padding:4px 8px;border-radius:8px;z-index:2}
/* Commerce de détail (Toters : Fresh, Beauty, Market…) */
.tr-search{display:flex;align-items:center;gap:12px;height:48px;margin:18px 16px 0;padding:0 14px;border-radius:12px;border:1px solid var(--t-line);background:var(--card);color:var(--t-sub);font-size:15px;cursor:text}
.tr-head{display:flex;align-items:center;justify-content:space-between;padding:22px 16px 12px}
.tr-head b{font-size:20px;font-weight:600;color:var(--t-text)}
.tr-head button{width:40px;height:40px;border-radius:50%;border:none;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t-text)}
.tr-tiles{display:grid;grid-auto-flow:column;grid-auto-columns:96px;gap:14px 10px;overflow-x:auto;padding:0 16px 4px;scrollbar-width:none}
.tr-tiles::-webkit-scrollbar{display:none}
.tr-tiles.two{grid-template-rows:auto auto}
.tr-tile{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;padding:0;cursor:pointer;font-family:var(--t-font)}
.tr-tile .im{width:88px;height:88px;border-radius:16px;overflow:hidden;background:var(--t-bg2);display:flex;align-items:center;justify-content:center}
.tr-tile span{font-size:13px;color:var(--t-text);text-align:center;line-height:1.25;max-width:96px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.tr-sec{font-size:22px;font-weight:600;padding:26px 16px 0;color:var(--t-text)}
.tr-rail{display:flex;gap:12px;overflow-x:auto;padding:0 16px 6px;scrollbar-width:none}
.tr-rail::-webkit-scrollbar{display:none}
.tr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 10px;padding:8px 16px 24px}
.tr-grid .t-prod,.tr-grid .t-prod .ph{width:100% !important}
.tr-cats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px 6px;padding:8px 12px 24px}
.tr-cats .tr-tile .im{width:76px;height:76px}
.tr-tabs{display:flex;justify-content:space-around;align-items:center;height:calc(64px + env(safe-area-inset-bottom,0px));padding-bottom:env(safe-area-inset-bottom,0px);background:var(--card);border-top:1px solid var(--t-line)}
.tr-tabs button{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;border:none;background:none;font-family:var(--t-font);font-size:12px;color:var(--t-sub);cursor:pointer}
.tr-tabs button.on{color:var(--acc);font-weight:600}
.tr-tabs.touring{position:relative;z-index:62}
.tr-tabs.touring button.on:not(.tour){color:var(--t-sub);font-weight:400}
.tr-tabs button.tour{background:var(--acc);color:#fff;font-weight:600;border-radius:0 0 16px 16px;align-self:stretch;margin:0 6px;justify-content:center;transition:background .2s}
.tr-tour-bg{position:absolute;inset:0;z-index:60;background:rgba(0,0,0,.5);animation:tFade .25s ease}
.tr-tour{position:absolute;left:0;right:0;z-index:61;background:var(--acc);color:#fff;border-radius:20px 20px 0 0;padding:26px 20px 16px;overflow:hidden;animation:tUp .3s cubic-bezier(.2,.8,.2,1)}
.tr-tour .art{position:absolute;left:-14px;bottom:-18px;pointer-events:none}
.tr-tour .x{position:absolute;top:12px;right:12px;width:32px;height:32px;border:none;background:none;display:flex;align-items:center;justify-content:center;cursor:pointer}
.tr-tour .txt{position:relative;animation:tFade .25s ease}
.tr-tour b{display:block;font-size:24px;font-weight:800;line-height:1.2}
.tr-tour p{margin:6px 0 0;font-size:14px;line-height:1.4;opacity:.95}
.tr-tour .foot{position:relative;display:flex;align-items:center;justify-content:flex-end;gap:14px;margin-top:22px;font-size:13px}
.tr-tour .foot button{height:36px;padding:0 16px;border:none;border-radius:10px;background:rgba(0,0,0,.18);color:#fff;font-family:var(--t-font);font-size:14px;font-weight:600;cursor:pointer}
.tr-pill{position:absolute;left:50%;transform:translateX(-50%);z-index:60;display:flex;align-items:center;gap:10px;height:52px;padding:0 6px 0 6px;border:none;border-radius:26px;background:var(--acc);color:#fff;box-shadow:0 6px 18px rgba(0,180,146,.35);cursor:pointer;font-family:var(--t-font)}
.tr-pill .th{width:40px;height:40px;border-radius:50%;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center}
.tr-pill .tx{display:flex;flex-direction:column;align-items:flex-start;line-height:1.15;padding-right:8px}
.tr-pill .tx small{font-size:12px;opacity:.95}
.tr-pill .tx b{font-size:15px}
.tr-pill .go{width:40px;height:40px;border-radius:50%;background:var(--acc-d);display:flex;align-items:center;justify-content:center}
.tr-list{display:flex;align-items:center;gap:12px;width:calc(100% - 32px);margin:22px 16px 0;padding:14px;border-radius:14px;border:1px solid var(--t-line);background:var(--card);font-family:var(--t-font);text-align:left;cursor:pointer;color:var(--t-text)}
.tr-list .ill{width:44px;height:44px;border-radius:12px;background:var(--acc-l);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tr-list .tx{flex:1;min-width:0;display:flex;flex-direction:column}
.tr-list .tx b{font-size:16px;font-weight:600;display:flex;align-items:center;gap:6px}
.tr-list .tx b i{font-style:normal;font-size:10px;font-weight:700;color:#fff;background:#5B3FD6;padding:2px 7px;border-radius:9px}
.tr-list .tx>span{font-size:13px;color:var(--t-sub)}
.tr-list .go{width:36px;height:36px;border-radius:50%;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.t-nomatch-btn{margin-top:16px;height:44px;padding:0 18px;border-radius:10px;border:1.5px solid var(--acc);background:none;color:var(--acc);font-family:var(--t-font);font-size:16px;font-weight:600;cursor:pointer}
.tr-page{position:absolute;inset:0;z-index:45;background:var(--card);display:flex;flex-direction:column}
.tr-page .hd{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 16px 8px}
.tr-page .hd b{font-size:20px;font-weight:600;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tr-page .sb{display:flex;align-items:center;gap:12px;height:48px;margin:6px 16px 6px;padding:0 14px;border-radius:12px;background:var(--t-bg2)}
.tr-page .sb input{flex:1;min-width:0;border:none;background:none;outline:none;font-family:var(--t-font);font-size:16px;color:var(--t-text)}
.t-menu-btn{width:44px;height:44px;border:none;background:none;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t-text);flex-shrink:0}
/* Infos boutique (Toters) */
.ti-row{display:flex;align-items:center;gap:14px;min-height:64px;border-top:1px solid var(--t-line);font-size:15px;color:var(--t-text);cursor:pointer;background:none;border-left:none;border-right:none;border-bottom:none;width:100%;padding:0;font-family:var(--t-font);text-align:left}
.ti-row .ic{width:40px;height:40px;border-radius:10px;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;flex:0 0 40px}
.ti-row>span:not(.ic){flex:1}
/* Avis (Toters) */
.tv-top{display:flex;align-items:center;gap:14px;padding:4px 16px 8px}
.tv-top .big{font-size:48px;font-weight:700;line-height:1}
.tv-bars{padding:4px 16px 18px}
.tv-bar{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--t-sub);margin:5px 0}
.tv-bar .st{width:84px;display:flex;justify-content:flex-end;gap:1px}
.tv-bar .tr{flex:1;height:6px;border-radius:3px;background:#E3E4E8;overflow:hidden}
.tv-bar .tr i{display:block;height:100%;background:var(--acc)}
.tv-bar .pc{width:34px;text-align:right}
.tv-card{margin:0 16px 12px;padding:14px 16px;border-radius:14px;background:var(--card);box-shadow:0 1px 6px rgba(0,0,0,.07)}
.t-oos{position:absolute;inset:0;background:rgba(255,255,255,.75);display:flex;align-items:center;justify-content:center;color:#E5484D;font-weight:600;font-size:13px}
.t-plus{position:absolute;right:6px;bottom:6px;width:32px;height:32px;border-radius:50%;background:#fff;border:none;box-shadow:0 1px 6px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--acc);z-index:2}
.t-plus .n{font-size:13px;font-weight:700;color:var(--acc)}

/* Page boutique */
.t-store-hero{height:calc(200px + env(safe-area-inset-top,0px));position:relative;background:var(--t-bg2)}
.t-store-top{position:absolute;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:calc(12px + env(safe-area-inset-top,0px)) 12px 12px;z-index:5}
.t-store-top>div{display:flex;gap:8px}
.t-store-mini{position:absolute;top:0;left:0;right:0;z-index:40;display:flex;align-items:center;gap:12px;padding:calc(10px + env(safe-area-inset-top,0px)) 16px 10px;height:calc(64px + env(safe-area-inset-top,0px));box-sizing:border-box;background:#3a3a3a center/cover no-repeat;color:#fff}
.t-round-btn.dim{background:rgba(255,255,255,.45);color:#000}
.t-punchbar{flex-shrink:0;padding:6px 16px calc(12px + env(safe-area-inset-bottom,0px));background:var(--card);border-radius:18px 18px 0 0;box-shadow:0 -4px 16px rgba(0,0,0,.06)}
.t-punchbar{cursor:pointer}
.t-punchbar .chev{display:block;width:36px;height:12px;margin:0 auto 8px;background:no-repeat center/36px 12px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='12' viewBox='0 0 36 12'%3E%3Cpath d='M3 10 18 3l15 7' fill='none' stroke='%23D5D7DD' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}
.t-perk{display:flex;gap:14px;align-items:flex-start;margin-bottom:22px}
.t-perk .tile{width:64px;height:64px;border-radius:14px;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.t-perk b{font-size:17px;font-weight:700;display:block}
.t-perk .d{font-size:14px;color:var(--t-text);margin-top:2px;line-height:1.35}
.t-perk .track{height:4px;border-radius:4px;background:var(--t-line);margin-top:12px;overflow:hidden}
.t-perk .track i{display:block;height:100%;background:var(--acc)}
.t-perk .left{font-size:13px;color:var(--t-sub);text-align:right;margin-top:6px}
.t-punchbar .row{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}
.t-punchbar .track{height:4px;border-radius:4px;background:var(--t-line);margin-top:12px;overflow:hidden}
.t-punchbar .track i{display:block;height:100%;background:var(--acc)}
.t-store-card{margin:-46px 16px 0;position:relative;z-index:4;background:var(--card);border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,.08);padding:8px 8px 12px}
.t-logo{width:48px;height:48px;border-radius:50%;overflow:hidden;background:var(--t-bg2);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--acc);font-size:17px}
.t-stats{display:flex;border-top:1px solid var(--t-line);margin:10px 8px 0;padding-top:12px}
.t-stats>div{flex:1;text-align:center}
.t-stats small{display:block;font-size:11px;color:var(--t-sub);margin-bottom:3px}
.t-stats b{font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:4px}
.t-loyal{display:flex;gap:12px;overflow-x:auto;padding:16px;scrollbar-width:none}
.t-loyal::-webkit-scrollbar{display:none}
.t-loyal-card{width:150px;min-height:117px;flex-shrink:0;border-radius:14px;border:1px solid var(--t-line);padding:12px;position:relative;background:var(--card);box-shadow:0 1px 4px rgba(0,0,0,.05)}
.t-dots{display:flex;gap:2px;margin-bottom:8px}
.t-dots i{width:16px;height:16px;border-radius:50%;background:#C9CCD3;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:9px;color:#fff;font-weight:700;border:1.5px solid #fff;margin-left:-4px}
.t-dots i:first-child{margin-left:0}
.t-dots i.on{background:var(--acc)}
.t-tabs{display:flex;gap:0;overflow-x:auto;padding:0 6px;border-bottom:1px solid var(--t-line);scrollbar-width:none;background:var(--card)}
.t-tabs::-webkit-scrollbar{display:none}
.t-tab{padding:14px 10px 11px;border:none;background:none;font-family:inherit;font-size:15px;font-weight:500;color:var(--t-text);white-space:nowrap;cursor:pointer;border-bottom:3px solid transparent;flex-shrink:0}
.t-tab.on{color:var(--acc);border-bottom-color:var(--acc);font-weight:600}
.t-menu-sec{padding:22px 0 8px;font-size:20px;font-weight:700;border-bottom:1px solid var(--t-line);margin:0 16px}
.t-item{display:flex;gap:12px;padding:16px 16px;cursor:pointer;min-height:142px}
.t-item .info{flex:1;min-width:0}
.t-item .nm{font-size:16px;font-weight:400;color:var(--t-text);line-height:1.3}
.t-item .ds{font-size:13px;color:var(--t-sub);margin-top:4px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.t-item .pr{font-size:16px;font-weight:600;margin-top:6px;white-space:nowrap}
.t-item .ph{width:110px;height:110px;border-radius:12px;overflow:hidden;position:relative;flex-shrink:0;background:var(--t-bg2);border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.1)}

/* Feuille du bas */
.t-sheet-bg{position:absolute;inset:0;background:rgba(0,0,0,.4);z-index:900;animation:tFade .2s ease}
.t-sheet{position:absolute;left:0;right:0;bottom:0;background:var(--card);border-radius:20px 20px 0 0;z-index:901;max-height:92%;display:flex;flex-direction:column;animation:tUp .28s cubic-bezier(.2,.8,.2,1);padding-bottom:env(safe-area-inset-bottom,0px);color:var(--t-text)}
.t-sheet .grab{width:36px;height:4px;border-radius:4px;background:#D5D7DD;margin:8px auto 4px;flex-shrink:0}
.t-sheet .content{overflow-y:auto;flex:1}
@keyframes tUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes tFade{from{opacity:0}to{opacity:1}}

/* Fiche produit (photo 246) */
.t-pd{position:absolute;inset:0;z-index:850;background:var(--card);display:flex;flex-direction:column;animation:tUp .3s cubic-bezier(.2,.8,.2,1)}
.t-pd-img{height:calc(246px + env(safe-area-inset-top,0px));position:sticky;top:0;z-index:0;background:var(--t-bg2);flex-shrink:0;overflow:hidden}
.t-pd.parked{z-index:1;animation:tPark .32s cubic-bezier(.2,.8,.2,1) forwards;pointer-events:none}
.t-pd.unpark{animation:tUnpark .3s cubic-bezier(.2,.8,.2,1)}
.t-pushin>.t-scr,.t-pushin>.t-store-foot{position:relative;z-index:2;background:var(--card);box-shadow:-8px 0 24px rgba(0,0,0,.12);animation:tPushIn .32s cubic-bezier(.2,.8,.2,1)}
.t-pushin>.t-store-foot{box-shadow:none}
.t-pd.parked .t-bottom{visibility:hidden}
@keyframes tPark{from{transform:none}to{transform:translate3d(-30%,0,0);visibility:hidden}}
@keyframes tUnpark{from{transform:translate3d(-30%,0,0);opacity:.6}to{transform:none;opacity:1}}
@keyframes tPushIn{from{transform:translate3d(100%,0,0)}to{transform:none}}
.t-iv{position:absolute;inset:0;z-index:900;background:#fff;display:flex;flex-direction:column;animation:tFade .2s ease}
.t-iv-top{padding:calc(12px + env(safe-area-inset-top,0px)) 12px 8px}
.t-iv-top .t-round-btn{background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.12)}
.t-iv-stage{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:none}
.t-iv-stage img{max-width:100%;max-height:100%;object-fit:contain;transform-origin:center;will-change:transform;user-select:none;-webkit-user-drag:none}
.t-iv-thumbs{display:flex;gap:10px;padding:14px 16px calc(14px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--t-line);overflow-x:auto}
.t-iv-thumbs button{flex-shrink:0;width:72px;height:72px;padding:4px;border-radius:14px;border:2px solid transparent;background:#fff;cursor:pointer}
.t-iv-thumbs button.on{border-color:var(--acc)}
.t-iv-thumbs img{width:100%;height:100%;object-fit:cover;border-radius:10px}
.t-pd-dim{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;will-change:opacity}
.t-pd-top{position:absolute;top:0;left:0;right:0;height:calc(64px + env(safe-area-inset-top,0px));z-index:6;pointer-events:none}
.t-pd-band{position:absolute;inset:0;overflow:hidden;background:var(--t-bg2)}
.t-pd-band img{position:absolute;top:0;left:0;width:100%;height:calc(246px + env(safe-area-inset-top,0px));object-fit:cover}
.t-pd-band i{position:absolute;inset:0;background:#000;opacity:0;will-change:opacity}
.t-pd-top button{pointer-events:auto}
.t-pd-title{position:absolute;left:68px;right:120px;bottom:0;height:64px;display:flex;align-items:center;font-size:17px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transform:translateY(6px);transition:opacity .2s ease,transform .2s ease}
.t-pd-top.solid .t-pd-title{opacity:1;transform:none}
.t-pd-sheet{margin-top:-20px;border-radius:20px 20px 0 0;background:var(--card);position:relative;z-index:2;padding:20px 16px 8px}
.t-opt-h{display:flex;align-items:center;justify-content:space-between;padding:18px 0 6px}
.t-opt-h b{font-size:18px;font-weight:700}
.t-req{font-size:12px;font-weight:500;padding:3px 8px;border-radius:6px;background:var(--t-bg2);color:var(--t-sub)}
.t-req.need{background:#FFF1E8;color:#E06B1F}
.t-opt{display:flex;align-items:center;gap:12px;min-height:46px;padding:4px 0;cursor:pointer}
.t-opt .l{flex:1}
.t-opt .l div{font-size:16px;color:var(--t-text)}
.t-opt .l small{font-size:13px;color:var(--t-sub)}
.t-check{width:20px;height:20px;border-radius:4px;border:2px solid #C9CCD3;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-right:14px}
.t-check.on{background:#2B2B2B;border-color:#2B2B2B}
.t-radio{width:20px;height:20px;border-radius:50%;border:2px solid #C9CCD3;flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-right:14px}
.t-radio.on{border-color:var(--acc)}
.t-radio.on::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--acc)}
.t-note{width:100%;min-height:84px;border-radius:12px;border:1px solid var(--t-line);background:var(--t-page);padding:12px 14px;font-family:inherit;font-size:14px;color:var(--t-text);outline:none;resize:none}
.t-note:focus{border-color:var(--acc)}

/* Barre d'action du bas */
.t-bottom{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));background:var(--card);border-top:1px solid var(--t-line);box-shadow:0 -2px 8px rgba(0,0,0,.04)}
.t-stepper{display:flex;align-items:center;gap:0;flex-shrink:0}
.t-stepper button{width:40px;height:44px;border:none;background:none;cursor:pointer;color:var(--acc);display:flex;align-items:center;justify-content:center}
.t-stepper b{min-width:30px;text-align:center;font-size:18px;font-weight:600}
.t-cta{flex:1;min-width:0;height:48px;border-radius:12px;border:none;background:var(--acc);color:#fff;font-family:var(--t-font);font-size:16px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:space-between;padding:0 16px;gap:8px}
.t-cta span{white-space:nowrap}
/* Panier — mesures relevées sur Toters (écran 360 px) */
.t-head h1.tc-h{font-size:20px;font-weight:600;margin-left:-6px}
.tc-card{background:var(--card);border-radius:16px;margin:17px 16px 0;color:var(--t-text);overflow:hidden}
.tc-store{display:flex;align-items:center;gap:11px;padding:11px 12px 8px;cursor:pointer}
.tc-store .nm{flex:1;min-width:0;font-size:19px;font-weight:600;line-height:1.25;letter-spacing:-.2px}.tc-store .nm small{display:block;font-size:13px;font-weight:400;color:var(--t-sub);margin-top:1px;letter-spacing:0}
.tc-store .go{width:32px;height:32px;border-radius:50%;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tc-intro{margin:14px 16px 0;font-size:14px;color:var(--t-sub)}
.tc-multi .tc-store{cursor:default}
.tc-multi .tc-store .nm small{display:block;font-size:13px;font-weight:400;color:var(--t-sub);margin-top:1px}
.tc-multi .tc-store .go{border:none;cursor:pointer;color:var(--t-text)}
.tc-thumbs{display:flex;gap:8px;padding:6px 12px 0}
.tc-thumbs .th{position:relative;width:50px;height:50px;border-radius:10px;overflow:hidden;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;border:1px solid var(--t-line);font-size:13px;font-weight:700;color:var(--t-sub)}
.tc-thumbs .th b{position:absolute;top:2px;right:2px;min-width:18px;height:18px;border-radius:9px;background:rgba(0,0,0,.65);color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center;padding:0 4px}
.tc-sum{padding:10px 12px 0;font-size:16px;font-weight:600}
.tc-acts{display:flex;gap:10px;padding:12px}
.tc-acts .t-cta{flex:1;height:46px;font-size:15px;white-space:nowrap;padding:0 10px}
.tc-goal{margin:0 15px;padding:2px 0 9px;border-bottom:1px solid var(--t-line)}
.tc-goal .gmsg{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;line-height:1.3;white-space:nowrap}
.tc-goal .gmsg svg{flex-shrink:0}
.tc-goal .gmsg span{overflow:hidden;text-overflow:ellipsis}
.tc-goal .bar{display:flex;align-items:center;margin:10px 4px 0}
.tc-goal .trk{flex:1;height:3px;border-radius:3px;background:#E3E4E8;margin:0 4px;overflow:hidden}
.tc-goal .trk span{display:block;height:100%;background:var(--acc);border-radius:3px;min-width:6%}
.tc-goal .dot{width:12px;height:12px;border-radius:50%;border:3px solid #D9DADF;background:#fff;flex-shrink:0;box-sizing:border-box}
.tc-goal .dot.on{border-color:var(--acc)}
.tc-goal .lbl{display:flex;justify-content:space-between;font-size:13px;color:var(--t-text);margin-top:6px}
.tc-goal .cap{font-size:13px;color:var(--t-sub);text-align:right;margin-top:3px}
.tc-line{display:flex;gap:12px;margin:10px 12px 0;padding:10px;background:var(--t-bg2);border-radius:12px;align-items:center}
.tc-line .ph{width:64px;height:64px;border-radius:10px;background:var(--card);overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.tc-line .info{flex:1;min-width:0}
.tc-line .nm{font-size:15px;font-weight:600;line-height:1.3}
.tc-line .sub{font-size:13px;color:var(--t-sub);margin-top:2px;line-height:1.35}
.tc-line .pr{font-size:15px;font-weight:600;margin-top:4px;white-space:nowrap}
.tc-qty{display:flex;align-items:center;justify-content:space-between;width:82px;height:32px;border:1px solid #E6E6EA;border-radius:16px;background:var(--card);padding:0 4px;flex-shrink:0;box-sizing:border-box}
.tc-qty button{width:24px;height:30px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t-text);padding:0}
.tc-qty b{font-size:14px;font-weight:500;min-width:16px;text-align:center}
.tc-total{border-top:1.5px dashed #DCDDE1;margin-top:14px;padding:16px 12px 17px}
.tc-total .row{display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:600}
.tc-total .row.disc{font-size:14px;color:#16A34A;margin-top:6px}
.t-bottom.sheet .tc-add{flex:0 0 100px;justify-content:center;padding:0;border-radius:10px;font-size:17px;font-weight:500}
.t-bottom.sheet .tc-go{border-radius:10px;font-size:17px;padding:0 14px 0 16px;justify-content:space-between}
.t-bottom.sheet .tc-go .p{font-size:14px}
.t-bottom.sheet{position:relative;flex-wrap:nowrap;gap:16px;border-top:none;border-radius:16px 16px 0 0;padding:40px 16px calc(14px + env(safe-area-inset-bottom,0px));box-shadow:0 -4px 16px rgba(0,0,0,.06)}
.t-bottom.sheet .grab{position:absolute;top:8px;left:50%;transform:translateX(-50%);width:36px;height:12px;background:no-repeat center/36px 12px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='12' viewBox='0 0 36 12'%3E%3Cpath d='M3 10 18 3l15 7' fill='none' stroke='%23D5D7DD' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}
.t-cta.center{justify-content:center}
.t-cta:disabled{opacity:.5;cursor:default}
.t-cta:active:not(:disabled){transform:scale(.98)}
.t-cta.ghost{background:var(--t-bg2);color:var(--t-text);flex:0 0 auto;padding:0 20px}

/* Barre panier flottante */
.t-cartbar{position:absolute;left:16px;right:16px;z-index:60;height:48px;border-radius:12px;background:var(--acc);color:#fff;display:flex;align-items:center;padding:0 12px;gap:12px;cursor:pointer;box-shadow:0 4px 14px rgba(0,180,146,.35);animation:tUp .3s ease;border:none}
.t-cartbar .n{min-width:28px;height:28px;border-radius:8px;background:var(--acc-d);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;padding:0 6px}
.t-cartbar .l{flex:1;text-align:center;font-size:16px;font-weight:600}
.t-cartbar .p{font-size:15px;font-weight:600;white-space:nowrap}
.t-cartbar.inline{position:static;width:100%;height:52px;margin-top:14px;animation:none;box-shadow:none;font-family:var(--t-font)}
.t-storefoot{cursor:default}
.t-storefoot>div[role=button]{cursor:pointer}
.t-storefoot:not(:has(.chev)){padding-top:2px}

/* Panier */
.t-card{background:var(--card);border-radius:16px;border:1px solid var(--t-line);margin:16px;color:var(--t-text)}
.t-progress{position:relative;height:3px;background:#E3E4E8;border-radius:3px;margin:16px 12px 8px}
.t-progress .fill{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--acc)}
.t-progress .dot{position:absolute;top:50%;width:20px;height:20px;border-radius:50%;transform:translate(-50%,-50%);background:var(--card);border:2px solid #D5D7DD;display:flex;align-items:center;justify-content:center}
.t-progress .dot.on{border-color:var(--acc);background:var(--acc);color:#fff}
.t-line{display:flex;gap:12px;padding:16px 12px;align-items:flex-start}
.t-line .ph{width:60px;height:60px;border-radius:12px;overflow:hidden;flex-shrink:0;background:var(--t-bg2)}
.t-qty{display:flex;align-items:center;border-radius:16px;background:var(--t-bg2);height:32px;padding:0 2px;flex-shrink:0}
.t-qty button{width:28px;height:32px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t-text)}
.t-qty b{min-width:20px;text-align:center;font-size:14px;font-weight:600}
.t-toggle{width:44px;height:26px;border-radius:26px;background:#D5D7DD;position:relative;border:none;cursor:pointer;flex-shrink:0;transition:background .2s}
.t-toggle::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.2);transition:transform .2s}
.t-toggle.on{background:var(--acc)}
.t-toggle.on::after{transform:translateX(18px)}
.t-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:14px}
.t-row>span:last-child,.t-nowrap{white-space:nowrap}

/* Barre du bas (navigation, 64 + zone système) */
.t-nav{display:flex;justify-content:space-around;align-items:center;height:calc(64px + env(safe-area-inset-bottom,0px));padding:0 4px env(safe-area-inset-bottom,0px);background:var(--card);border-top:1px solid var(--t-line);flex-shrink:0}
.t-nav button{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;font-family:var(--t-font);font-size:11px;font-weight:400;color:var(--t-sub);padding:4px 0;position:relative}
.t-nav button.on{color:var(--acc);font-weight:500}

/* Listes type « compte » */
.t-group{background:var(--card);border-radius:16px;margin:16px;padding:4px 16px;border:none}
.t-group .gh{font-size:15px;font-weight:600;padding:16px 0 0}
.ta-tiles{display:flex;gap:28px;padding:16px 24px 20px !important}
.ta-tile{display:flex;flex-direction:column;align-items:center;gap:8px;background:none;border:none;cursor:pointer;font-family:var(--t-font);color:var(--t-text);padding:0;width:60px}
.ta-tile .ic{width:48px;height:48px;border-radius:12px;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;position:relative}
.ta-tile .bd{position:absolute;top:-8px;right:-10px;min-width:24px;height:24px;padding:0 5px;border-radius:12px;background:var(--acc);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;box-sizing:border-box}
.ta-tile .lb{font-size:13.5px;white-space:nowrap}
.t-li{display:flex;align-items:center;gap:12px;min-height:56px;padding:4px 0;cursor:pointer;border-bottom:1px solid var(--t-line);background:none;border-left:none;border-right:none;border-top:none;width:100%;font-family:inherit;text-align:left;color:var(--t-text)}
.t-li:last-child{border-bottom:none}
.t-li .ic{width:40px;height:40px;border-radius:10px;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;flex:0 0 40px;color:var(--t-sub)}
.t-li{gap:16px !important;min-height:57px !important}
.t-li>span:not(.ic){flex:1;font-size:16px}

/* Champs */
.t-field{margin-bottom:12px}
.t-field label{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:var(--t-text)}
.t-input{width:100%;height:48px;border-radius:12px;border:1px solid var(--t-line);background:var(--card);padding:0 14px;font-family:var(--t-font);font-size:15px;color:var(--t-text);outline:none}
.t-input:focus{border-color:var(--acc)}
.t-phone{display:flex;align-items:center;height:52px;border-radius:12px;border:1px solid var(--t-line);padding:0 12px;gap:8px}
.t-phone:focus-within{border-color:var(--acc)}
.t-phone input{flex:1;border:none;outline:none;background:transparent;font-family:var(--t-font);font-size:16px;color:var(--t-text);min-width:0}
.t-flag{width:30px;height:20px;border-radius:2px;overflow:hidden;flex-shrink:0;display:flex}
.t-otp{display:flex;gap:8px;justify-content:center}
.t-otp input{width:44px;height:52px;border-radius:12px;border:1px solid var(--t-line);text-align:center;font-size:20px;font-weight:600;font-family:var(--t-font);color:var(--t-text);background:var(--card);outline:none}
.t-otp input:focus{border-color:var(--acc)}

/* Grille collections (156 × 87, forme pilule) */
/* Recherche — mesures relevées sur Toters */
.ts-head{display:flex;align-items:center;gap:8px;padding:6px 16px 10px}
.ts-head .t-hcart{margin-left:4px}
.ts-box{flex:1;min-width:0;display:flex;align-items:center;gap:10px;height:48px;padding:0 10px 0 12px;border-radius:12px;background:var(--t-bg2);cursor:text}
.ts-box input{flex:1;min-width:0;border:none;background:none;outline:none;font-family:var(--t-font);font-size:16px;color:var(--t-text)}
.ts-box input::placeholder{color:var(--t-sub)}
.ts-clear{width:24px;height:24px;border-radius:50%;border:none;background:#E3E4E8;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--t-text);flex-shrink:0;padding:0}
.ts-filter{border:none;background:none;padding:0;display:flex;cursor:pointer;color:var(--t-text);flex-shrink:0;position:relative}
.ts-filter.on::after{content:"";position:absolute;top:-2px;right:-2px;width:8px;height:8px;border-radius:50%;background:var(--acc)}
.ts-h{font-size:20px;font-weight:600;padding:0 16px;margin:18px 0 10px;color:var(--t-text)}
.ts-recent{display:flex;flex-wrap:wrap;gap:12px;padding:0 16px}
.ts-recent button{height:40px;padding:0 12px;border-radius:12px;border:none;background:var(--t-bg2);font-family:var(--t-font);font-size:14px;font-weight:500;color:var(--t-text);cursor:pointer}
.ts-coll{display:grid;grid-template-columns:1fr 1fr;column-gap:16px;row-gap:22px;padding:14px 16px 24px}
.ts-coll button{background:none;border:none;padding:0;cursor:pointer;text-align:left;font-family:inherit;min-width:0}
.ts-coll .pill{height:77px;border-radius:39px;position:relative;margin-top:10px}
.ts-coll .pic{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);width:88px;height:88px;border-radius:50%;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,.18);border:3px solid rgba(255,255,255,.9)}
.ts-coll b{display:block;margin-top:14px;font-size:16px;font-weight:600;color:var(--t-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ts-seg{padding:0 16px}
.ts-seg button{height:44px;font-size:16px}
.ts-kinds{display:flex;gap:12px;overflow-x:auto;padding:12px 16px 4px;scrollbar-width:none}
.ts-kinds::-webkit-scrollbar{display:none}
.ts-kinds button{height:40px;padding:0 14px;border-radius:12px;border:1.5px solid transparent;background:var(--t-bg2);font-family:var(--t-font);font-size:13px;font-weight:600;color:var(--t-text);white-space:nowrap;cursor:pointer;flex-shrink:0}
.ts-kinds button.on{background:var(--card);border-color:var(--acc);color:var(--acc)}
.ts-count{padding:18px 16px 10px;font-size:14px;color:var(--t-sub)}
.ts-store{display:flex;gap:12px;padding:14px 16px;cursor:pointer;align-items:center}
.ts-store .logo{border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.08);flex-shrink:0;display:flex}
.ts-store .nm{font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--t-text)}
.ts-store .sub{font-size:14px;color:var(--t-sub);margin-top:2px}
.ts-store .rt{display:flex;align-items:center;gap:6px;font-size:14px;color:var(--t-text);margin-top:2px}
.ts-store .closed,.ts-item .closed{display:inline-block;margin-top:6px;padding:4px 8px;border-radius:8px;background:#FDECEC;color:#E5484D;font-size:12px;font-weight:600}
.ts-item{display:flex;gap:12px;padding:16px;cursor:pointer;align-items:center}
.ts-item .nm{font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--t-text)}
.ts-item .pr{font-size:14px;color:var(--t-text);margin-top:3px}
.ts-item .pr s{color:var(--t-sub);margin-left:6px}
.ts-item .sub{font-size:14px;color:var(--t-sub);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ts-item .ph{width:68px;height:68px;border-radius:12px;overflow:hidden;flex-shrink:0;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.1);display:flex;align-items:center;justify-content:center}
.ts-filters{padding:4px 16px 8px}
.ts-filters h3{font-size:20px;font-weight:600;margin:22px 0 6px;color:var(--t-text)}
.ts-filters .ts-row{display:flex;align-items:center;gap:14px;width:100%;min-height:57px;border:none;border-bottom:1px solid var(--t-line);background:none;padding:0;font-family:var(--t-font);font-size:16px;font-weight:500;color:var(--t-text);cursor:pointer;text-align:left}
.ts-filters .ts-row span{flex:1}
.ts-filters .cimg{flex:0 0 44px !important;width:44px;height:44px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--t-bg2)}
.ts-filters .radio{width:20px;height:20px;border-radius:50%;border:1.5px solid #D5D7DD;box-sizing:border-box;flex-shrink:0}
.ts-filters .radio.on{border:6px solid #4A4F5C}
.ts-filters .box{width:24px;height:24px;border-radius:6px;border:1.5px solid #D5D7DD;box-sizing:border-box;flex-shrink:0}
.ts-filters .box.on{background:var(--acc);border-color:var(--acc);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");background-size:16px;background-position:center;background-repeat:no-repeat}
.ts-filters .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}
.ts-filters .chips button{height:40px;padding:0 11px;border-radius:12px;border:1.5px solid transparent;background:var(--t-bg2);font-family:var(--t-font);font-size:13px;font-weight:500;color:var(--t-text);cursor:pointer}
.ts-filters .chips button.on{background:var(--card);border-color:var(--acc);color:var(--acc)}
.ts-apply{position:sticky;bottom:0;background:var(--card);padding:12px 16px 12px;flex-shrink:0}
.ts-apply .t-cta{width:100%;height:48px;justify-content:center;font-size:17px}
.t-coll{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 16px 24px}
.t-coll button{background:none;border:none;padding:0;cursor:pointer;text-align:left;font-family:inherit}
.t-coll .pic{height:87px;border-radius:44px;overflow:hidden;position:relative}
.t-coll b{display:block;margin-top:8px;font-size:15px;font-weight:600;color:var(--t-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* Résultats de recherche */
.t-seg{display:flex;border-bottom:1px solid var(--t-line)}
.t-seg button{flex:1;height:41px;border:none;background:none;font-family:var(--t-font);font-size:15px;font-weight:500;color:var(--t-text);border-bottom:3px solid transparent;cursor:pointer}
.t-seg button.on{color:var(--acc);border-bottom-color:var(--acc);font-weight:600}
.t-res{display:flex;gap:12px;padding:12px 16px;border-bottom:1px solid var(--t-line);cursor:pointer;align-items:center}
.t-res .ph{width:83px;height:83px;border-radius:12px;overflow:hidden;flex-shrink:0;background:var(--t-bg2);position:relative}

/* Grandes cartes (Coursier : 328 × 104, illustration 72) */
.t-big{display:flex;gap:16px;align-items:center;margin:0 16px 16px;padding:16px;border-radius:16px;background:var(--card);border:none;box-shadow:0 1px 4px rgba(0,0,0,.04);cursor:pointer;width:calc(100% - 32px);text-align:left;font-family:var(--t-font)}
.t-big .ill{width:72px;height:72px;border-radius:12px;background:var(--acc-l);display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden}
.t-big b{display:block;font-size:16px;font-weight:600;color:var(--t-text);margin-bottom:4px}
.t-big p{font-size:13px;color:var(--t-sub);line-height:1.45}
.t-info{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:16px;height:48px;padding:0 14px 0 18px;border-radius:12px;background:var(--acc-l);color:var(--acc);font-weight:600;font-size:13.5px;white-space:nowrap}
.t-info span{overflow:hidden;text-overflow:ellipsis}
.tk-limit{display:flex;align-items:center;gap:18px;padding:10px 0;font-size:16px;color:var(--t-text)}
.tk-limit .ic{width:58px;height:58px;border-radius:50%;background:#CDEFE6;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* Écran vide / connexion requise */
.t-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 32px;gap:8px;color:var(--t-text)}
.t-empty .ic{width:72px;height:72px;border-radius:50%;background:var(--t-bg2);display:flex;align-items:center;justify-content:center;margin-bottom:6px;color:var(--t-sub)}
.t-empty b{font-size:16px;font-weight:600}
.t-empty p{font-size:14px;color:var(--t-sub);line-height:1.45}

/* En-tête d'écran simple (64 de haut, titre 18) */
.t-head{display:flex;align-items:center;gap:8px;padding:8px 16px;min-height:64px;background:var(--card);flex-shrink:0;color:var(--t-text)}
.t-head h1{font-size:18px;font-weight:700;flex:1}
.t-back{width:40px;height:40px;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--t-text);margin-left:-10px}

/* Squelettes */
.t-skel{background:linear-gradient(90deg,var(--t-bg2) 25%,var(--t-line) 50%,var(--t-bg2) 75%);background-size:200% 100%;animation:tSk 1.3s ease-in-out infinite}
@keyframes tSk{0%{background-position:200% 0}100%{background-position:-200% 0}}
/* Coursier — trajet, nature du colis, récapitulatif */
.tk-box{padding:16px;margin:12px 16px}
.tk-h{font-size:16px;font-weight:700;margin-bottom:10px;color:var(--t-text)}
.tk-route{display:flex;flex-direction:column}
.tk-stop{display:flex;align-items:flex-start;gap:12px;padding:10px 0;min-height:64px}
.tk-stop.tap{cursor:pointer}
.tk-stop+.tk-stop{border-top:1px solid var(--t-line)}
.tk-rail{position:relative;width:22px;align-self:stretch;display:flex;justify-content:center;flex-shrink:0}
.tk-dot{width:14px;height:14px;margin-top:4px;flex-shrink:0;position:relative;z-index:1}
.tk-dot.a{border-radius:50%;background:var(--acc);box-shadow:0 0 0 4px var(--acc-l)}
.tk-dot.b{border-radius:3px;background:#1F2933;box-shadow:0 0 0 4px #E5E7EB}
.tk-line{position:absolute;top:24px;bottom:-26px;left:50%;border-left:2px dashed #C9CDD2;transform:translateX(-1px)}
.tk-txt{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.tk-txt small{font-size:12px;color:var(--t-sub);font-weight:500;text-transform:uppercase;letter-spacing:.04em}
.tk-txt b{font-size:16px;font-weight:600;color:var(--t-text)}
.tk-txt b.ph{color:var(--acc);font-weight:600}
.tk-txt span{font-size:13px;color:var(--t-sub);line-height:1.4;white-space:pre-line;overflow:hidden;text-overflow:ellipsis}
.tk-stop>svg{margin-top:14px;flex-shrink:0}
.tk-kinds{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.tk-kinds button{height:76px;border-radius:14px;border:1px solid var(--t-line);background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;font-family:var(--t-font);font-size:13px;color:var(--t-text);cursor:pointer}
.tk-kinds button.on{border:2px solid var(--acc);background:var(--acc-l);color:var(--acc-d);font-weight:600}
.tk-note{display:flex;gap:8px;align-items:flex-start;margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--acc-l);font-size:13px;line-height:1.45;color:var(--acc-d)}
.tk-note svg{flex-shrink:0;margin-top:1px}
.tk-money{display:flex;align-items:center;height:48px;border-radius:12px;border:1px solid var(--t-line);padding:0 14px;gap:8px}
.tk-money:focus-within{border-color:var(--acc)}
.tk-money input{flex:1;min-width:0;border:none;outline:none;background:transparent;font-family:var(--t-font);font-size:16px;color:var(--t-text)}
.tk-money span{color:var(--t-sub);font-size:14px}
.tk-pay{display:flex;align-items:center;gap:10px;margin-top:10px;padding-top:12px;border-top:1px solid var(--t-line);font-size:14px;color:var(--t-text)}
.tk-seg{display:flex;gap:4px;padding:4px;border-radius:12px;background:var(--t-bg2);margin-bottom:14px}
.tk-seg button{flex:1;height:38px;border:none;border-radius:9px;background:transparent;font-family:var(--t-font);font-size:14px;color:var(--t-sub);cursor:pointer}
.tk-seg button.on{background:var(--card);color:var(--t-text);font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.tk-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tm-root{flex:1;display:flex;flex-direction:column;min-height:0;background:var(--t-bg2)}
.tm-stage{flex:1;position:relative;min-height:0;overflow:hidden}
.tm-map{position:absolute;inset:0}
.tm-map .real-map{height:100% !important;border-radius:0 !important}
.tm-top{position:absolute;top:calc(12px + env(safe-area-inset-top,0px));left:12px;right:12px;z-index:1000;display:flex;align-items:center;gap:10px;pointer-events:none}
.tm-top>*{pointer-events:auto}
.tm-top .sp{flex:1}
.tm-top .tk-mapbtn{position:static}
.tm-routelabel.alt{border-color:#D0D5DD;color:#475467;font-weight:600;cursor:pointer;transform:translate(-50%,-50%)}
.dr-offer{box-shadow:inset 0 0 0 2px var(--acc)}
.dr-offer-head{position:relative;display:flex;align-items:center;gap:8px;margin:-4px 0 12px;padding:8px 10px;border-radius:10px;background:var(--acc-l);color:var(--acc-d);font-size:13px;font-weight:600;overflow:hidden}
.dr-offer-head span{flex:1}
.dr-offer-head b{font-size:15px;font-variant-numeric:tabular-nums}
.dr-offer-head i{position:absolute;left:0;bottom:0;height:3px;background:var(--acc);transition:width 1s linear}
.lp-store{width:30px;height:30px;border-radius:50%;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:#fff;font:700 13px var(--t-font)}
.lp-tip{font:600 12px var(--t-font);padding:4px 8px;border-radius:8px}
.tm-routelabel{transform:translate(-50%,calc(-100% - 10px));display:inline-block;white-space:nowrap;padding:5px 10px;border-radius:14px;background:#fff;color:#111;font:700 13px var(--t-font);box-shadow:0 2px 10px rgba(0,0,0,.2);border:1.5px solid var(--acc)}
.tm-chip{height:40px;padding:0 14px;border-radius:20px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;align-items:center;font-size:15px;font-weight:700;color:#111;white-space:nowrap}
.tm-panel{position:absolute;left:0;right:0;bottom:0;z-index:1001;background:var(--t-bg2);border-radius:22px 22px 0 0;box-shadow:0 -6px 24px rgba(0,0,0,.14);display:flex;flex-direction:column;transition:height .32s cubic-bezier(.2,.8,.2,1);color:var(--t-text)}
.tm-panel.drag{transition:none}
.tm-grab{height:22px;flex-shrink:0;display:flex;justify-content:center;align-items:center;touch-action:none;cursor:grab}
.tm-grab span{width:40px;height:5px;border-radius:3px;background:#D5D7DD}
.tm-body{flex:1;min-height:0;padding-bottom:10px}
.tm-more{padding-top:2px}
.tm-more .t-card{margin-left:12px;margin-right:12px;border:none;box-shadow:none}
.tm-foot{flex-shrink:0;padding:10px 16px calc(12px + env(safe-area-inset-bottom,0px));background:var(--card);border-top:1px solid var(--t-line);z-index:1002}
.tm-foot .t-cta{width:100%}
.tm-recenter{position:absolute;right:12px;z-index:1000;width:44px;height:44px;border-radius:22px;border:none;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:bottom .32s cubic-bezier(.2,.8,.2,1)}
.tm-card{margin:0 12px 10px;padding:14px 16px;border-radius:16px;background:var(--card)}
.tm-person{display:flex;align-items:center;gap:12px}
.tm-person .av{width:48px;height:48px;border-radius:24px;overflow:hidden;background:var(--acc-l);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--acc);font-size:18px;flex-shrink:0}
.tm-person .av img{width:100%;height:100%;object-fit:cover}
.tm-person .nm{flex:1;min-width:0}
.tm-person .nm b{display:block;font-size:16px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tm-person .nm small{display:block;font-size:13px;color:var(--t-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tm-person .acts{display:flex;gap:8px;flex-shrink:0}
.tm-person+.tm-person{margin-top:12px;padding-top:12px;border-top:1px solid var(--t-line)}
.tm-code{display:flex;align-items:center;gap:10px;margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--acc-l);font-size:13px;color:var(--acc-d)}
.tm-code b{margin-left:auto;font-size:20px;letter-spacing:3px;color:var(--t-text)}
.tk-mapbtn{position:absolute;z-index:1000;width:40px;height:40px;border-radius:20px;border:none;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#111}
.tk-mapgo{position:absolute;z-index:1000;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:8px;height:42px;padding:0 16px;border:none;border-radius:21px;background:var(--acc);color:#fff;font-family:var(--t-font);font-size:14px;font-weight:600;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.2);cursor:pointer}
.tk-nav{width:40px;height:40px;border-radius:20px;border:1px solid var(--t-line);background:var(--card);display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:6px;cursor:pointer}
.tk-kind{width:42px;height:42px;border-radius:12px;background:var(--acc-l);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.tk-desc{margin-top:6px;padding:10px 12px;border-radius:12px;background:var(--t-bg2);font-size:13px;line-height:1.45;white-space:pre-wrap;color:var(--t-text)}
.tk-desc b{display:block;font-size:12px;color:var(--t-sub);font-weight:600;margin-bottom:2px}
.tk-ask{font-size:13px;color:var(--t-sub);margin:12px 0 8px}
.tk-ask b{color:var(--t-text)}
.tk-act{display:flex;gap:8px}
.tk-act .t-cta{flex:0 0 auto;padding:0 16px}
.tk-pin{flex:1;min-width:0;height:48px;border-radius:12px;border:1px solid var(--t-line);background:var(--card);text-align:center;font-family:var(--t-font);font-size:20px;font-weight:600;letter-spacing:6px;color:var(--t-text);outline:none}
.tk-pin:focus{border-color:var(--acc)}
.tk-pin::placeholder{letter-spacing:2px;color:#C9CDD2}
.tk-collect{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding:12px 14px;border-radius:12px;background:var(--acc-l);color:var(--acc-d);font-size:14px}
.tk-collect b{font-size:18px}
.tk-badge{display:inline-block;padding:6px 12px;border-radius:10px;font-size:13px;font-weight:700}
.tk-hint{font-size:15px;color:var(--t-text);margin:12px 0 14px;line-height:1.45}
.tk-prog{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.tk-prog span{height:6px;border-radius:3px;background:var(--t-line)}
.tk-prog span.on{background:var(--acc)}
.tk-progl{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:6px;font-size:11px;color:var(--t-sub)}
.tk-code{flex:1;padding:14px 10px;border-radius:14px;background:var(--acc-l);text-align:center;display:flex;flex-direction:column;gap:2px}
.tk-code small{font-size:12px;font-weight:700;color:var(--acc-d)}
.tk-code b{font-size:28px;font-weight:700;letter-spacing:5px;color:var(--t-text)}
.tk-code span{font-size:12px;color:var(--t-sub);line-height:1.35}
.tk-av{width:52px;height:52px;border-radius:26px;background:var(--acc-l);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--acc);font-size:20px;overflow:hidden;flex-shrink:0}
.tk-av img{width:100%;height:100%;object-fit:cover}
`;

export default T_CSS;
