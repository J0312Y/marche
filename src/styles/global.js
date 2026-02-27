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
.pimg .badge{position:absolute;top:8px;left:8px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:700;color:#fff;background:#EF4444;z-index:3}
.pimg .tag{position:absolute;top:8px;right:8px;padding:4px 8px;border-radius:6px;font-size:10px;font-weight:600;color:#6366F1;background:rgba(99,102,241,0.1);cursor:pointer;transition:all .15s;z-index:3}.pimg .tag:active{transform:scale(.95)}
.pimg .fav{position:absolute;bottom:8px;right:8px;width:32px;height:32px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.08);font-size:14px;cursor:pointer;z-index:3}
.pbody{padding:12px}.pbody h4{font-size:13px;font-weight:600;line-height:1.3;margin-bottom:3px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.pbody .pv{font-size:11px;color:#908C82;display:flex;align-items:center;gap:4px;margin-bottom:8px}
.pbody .pp{font-size:16px;font-weight:700;color:#6366F1;display:flex;align-items:center;gap:6px}
.pbody .pp .po{font-size:11px;color:#908C82;text-decoration:line-through;font-weight:400}
.pbody .pr{font-size:11px;color:#F59E0B;margin-top:4px;cursor:pointer;display:inline-flex;align-items:center;gap:2px;padding:2px 6px;border-radius:6px;margin-left:-6px;transition:all .15s}.pbody .pr:active{background:rgba(245,158,11,.1)}

/* Detail */
.det-img{height:280px;background:#F5F4F1;display:flex;align-items:center;justify-content:center;position:relative}.det-img .pe{font-size:96px}
.det-top{position:absolute;top:12px;left:12px;right:12px;display:flex;justify-content:space-between;z-index:5}
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
.gallery-img{flex:1;display:flex;align-items:center;justify-content:center;font-size:140px;overflow:hidden}
.gallery-dots{display:flex;justify-content:center;gap:6px;padding:16px;position:relative;z-index:5}.gallery-dots span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.3)}.gallery-dots span.on{background:#fff}
.gallery-close{position:absolute;top:16px;right:16px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(4px);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10}
.gallery-nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(4px);border:none;color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10}
.gallery-nav.l{left:12px}.gallery-nav.r{right:12px}
.gallery-count{position:absolute;top:16px;left:16px;padding:6px 14px;border-radius:10px;background:rgba(0,0,0,.5);color:#fff;font-size:12px;font-weight:600;z-index:10}

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
@keyframes blink{0%,100%{opacity:.2}50%{opacity:1}}
@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes imgFadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
.typing-dots{display:inline-flex;gap:3px;font-size:14px;color:#908C82;padding:2px 0}
.img-shimmer{position:absolute;inset:0;background:#F0EFEC;overflow:hidden}.img-shimmer::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);animation:shimmer 1.4s infinite}
.app-img img{transition:transform .3s ease}.pcard:hover .app-img img{transform:scale(1.05)}
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

export default CSS;
