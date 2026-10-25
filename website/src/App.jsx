import { useEffect, useRef, useState } from 'react'
import { startMotion } from './motion'
import Join from './Join'

// Tout le contenu variable vient de l'API (panneau d'administration) : coordonnées, villes, commission, chiffres, FAQ, commerces
const API = import.meta.env.VITE_API_URL || 'http://localhost/lamuka-api/api/v1'
function useInfo() {
  const [info, setInfo] = useState(null)
  const [err, setErr] = useState(false)
  useEffect(() => {
    fetch(API + '/app-info').then((r) => r.json()).then((j) => { if (j?.data) setInfo(j.data); else setErr(true) }).catch(() => setErr(true))
  }, [])
  return { info, err }
}
const wa = (info, text) => info?.contact?.whatsapp ? `https://wa.me/${info.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : null
const mail = (info, subject) => info?.contact?.email ? `mailto:${info.contact.email}?subject=${encodeURIComponent(subject)}` : null
const nf = (n) => Number(n || 0).toLocaleString('fr-FR').replace(/ | /g, ' ')

// ── Icônes (traits simples) ──
const P = {
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  cash: <><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.6" /><path d="M6 9.5v5M18 9.5v5" /></>,
  map: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></>,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8-7.5 9.5-4.3-1.5-7.5-4.9-7.5-9.5V6L12 3z" /><path d="M8.8 12l2.2 2.2 4.2-4.4" /></>,
  chat: <path d="M20.5 11.5a8.5 8.5 0 01-12.4 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1120.5 11.5z" />,
  bike: <><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17l4-7h5l3 7M10 10L8.5 7H6M15 10l1.5-3H19" /></>,
  store: <><path d="M4 9.5l1.5-5h13L20 9.5M4 9.5v10h16v-10M4 9.5c0 1.6 1.3 2.5 2.7 2.5S9.3 11 9.3 9.5c0 1.6 1.3 2.5 2.7 2.5s2.7-1 2.7-2.5c0 1.6 1.3 2.5 2.6 2.5S20 11 20 9.5" /><path d="M10 19.5v-4h4v4" /></>,
  phone: <path d="M6.6 3.5h3l1.5 4-2 1.3a11 11 0 005.1 5.1l1.3-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.6 5.7a2 2 0 012-2.2z" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 000-6H9a3 3 0 010-6h6.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
}
const I = ({ n, s = 22 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
const Btn = ({ href, children, kind = '', ...p }) => href ? <a className={'btn ' + kind} href={href} {...p}>{children}<span className="btn-arr"><I n="arrow" s={18} /></span></a> : null
const Phone = ({ src, alt, className = '', ...p }) => <div className={'phone ' + className} {...p}><img src={src} alt={alt} loading="lazy" /></div>

// Parcours du client : textes de l'interface, captures réelles de l'application
const STEPS = [
  ['store', 'Choisissez', 'Parcourez les commerces de votre quartier, leurs menus et leurs rayons. Pas besoin de compte pour regarder.', '/img/accueil.webp'],
  ['map', 'Composez', 'Options, quantités, consignes pour le commerce : tout se règle depuis la fiche de l’article.', '/img/article.webp'],
  ['bike', 'Suivez', 'Le commerce prépare, un livreur récupère. Vous le voyez avancer sur la carte, par les rues.', '/img/suivi.webp'],
  ['cash', 'Payez à la réception', 'En espèces, au livreur, contre votre code de livraison. Rien à payer à l’avance.', '/img/boutique.webp'],
]

// Courtes vidéos enregistrées dans l'application (public/video, script e2e/shorts.mjs)
const SHORTS = [
  ['commander', 'Commander', 'Chercher un commerce, ouvrir un article'],
  ['suivre', 'Suivre', 'La commande, le livreur et le code de livraison'],
  ['coursier', 'Coursier', 'Envoyer un colis en quelques gestes'],
  ['commerce', 'Commerçant', 'Les commandes arrivent en direct'],
  ['livreur', 'Livreur', 'L’itinéraire jusqu’au commerce'],
]
// Illustrations flottantes autour de la phrase d'accroche
const ART = [['plats-congolais', 0.22], ['pharmacie', 0.38], ['fruits-legumes', 0.3], ['bouteilles-de-gaz', 0.18], ['bouquets', 0.34], ['patisserie', 0.26]]

// Articles mis en avant dans le haut de page : un par type de commerce
const heroPicks = (products = []) => { const seen = new Set(); return products.filter((p) => !seen.has(p.type) && seen.add(p.type)).slice(0, 3) }
const off = (p) => (p.old_price > p.price ? Math.round((1 - p.price / p.old_price) * 100) : 0)

function Nav({ info }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const f = () => setScrolled(window.scrollY > 10); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  const links = [['#comment', 'Comment ça marche'], ['#videos', 'Vidéos'],['#coursier', 'Coursier'], ['#commercants', 'Commerçants'], ['#livreurs', 'Livreurs'], ['#faq', 'Questions']]
  return (
    <header className={'nav' + (scrolled ? ' scrolled' : '') + (open ? ' open' : '')}>
      <div className="nav-progress" />
      <div className="wrap nav-in">
        <a href="#top" className="logo" onClick={() => setOpen(false)}><img src="/favicon.png" alt="" /><span>lamuka</span></a>
        <nav className="nav-links">{links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}</nav>
        <a className="btn btn-sm nav-cta" href="#telecharger" onClick={() => setOpen(false)}>Télécharger l’app</a>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
      </div>
    </header>
  )
}

function Hero({ info }) {
  const cities = info?.cities || ''
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="wrap hero-in">
        <div className="hero-txt">
          {cities && <p className="kicker" data-reveal="up">{cities} · Livraison à domicile</p>}
          <h1 data-words>Les commerces de votre ville, <em>livrés chez vous.</em></h1>
          <p className="lead" data-reveal="up" data-delay="350">Restaurants, courses, pharmacie, gaz, fleurs… Commandez en quelques gestes, suivez votre livreur sur la carte et payez en espèces à la réception.</p>
          <div className="hero-cta" data-reveal="up" data-delay="500">
            <Btn href="#telecharger">Télécharger l’app</Btn>
            <Btn href="#inscription-commerce" kind="btn-ghost-light">Inscrire mon commerce</Btn>
          </div>
          <ul className="hero-points" data-reveal="up" data-delay="650">
            <li><I n="cash" s={18} />Paiement à la livraison</li>
            <li><I n="route" s={18} />Suivi en direct</li>
            <li><I n="shield" s={18} />Remise vérifiée par code</li>
          </ul>
        </div>
        <div className="hero-visual" data-tilt data-reveal="rise" data-delay="250">
          <div className="hv-a" data-parallax="0.12"><Phone src="/img/accueil.webp" alt="Accueil de l'application Lamuka Market" className="ph-main float" /></div>
          <div className="hv-b" data-parallax="0.28"><Phone src="/img/suivi.webp" alt="Suivi d'une commande : le livreur sur la carte" className="ph-back float slow" /></div>
          {heroPicks(info?.products).map((p, i) => (
            <div className={'hero-chip hc' + i} key={p.name} data-reveal="scale" data-delay={900 + i * 260}>
              <div className="float" style={{ animationDelay: `${-i * 1.7}s` }}>
                <img src={p.image} alt="" loading="lazy" />
                <span><b>{p.name}</b><small>{p.store}</small></span>
                <em>{nf(p.price)} F</em>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Défilement continu des commerces partenaires (vrais commerces, logo et type) */
function Marquee({ info }) {
  const stores = info?.stores || []
  if (stores.length < 4) return null
  const half = Math.ceil(stores.length / 2)
  const rows = [stores.slice(0, half), stores.slice(half)]
  return (
    <section className="marquee-sec" aria-label="Commerces sur Lamuka">
      <p className="marquee-title" data-reveal="up">Ils vendent déjà sur Lamuka</p>
      {rows.map((row, k) => (
        <div className={'marquee' + (k ? ' rev' : '')} key={k}>
          <div className="mq-track">
            {[...row, ...row].map((s, i) => (
              <div className="mq-item" key={i} aria-hidden={i >= row.length}>
                {s.logo ? <img src={s.logo} alt="" loading="lazy" /> : <span className="mq-ini">{s.name[0]}</span>}
                <span><b>{s.name}</b><small>{s.type}{s.is_new && <em className="mq-new">Nouveau</em>}</small></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Stats({ info }) {
  const s = info?.stats
  if (!s) return null
  const items = [[s.stores, 'commerces partenaires'], [s.articles, 'articles en ligne'], [s.quarters, 'quartiers desservis'], [s.cities, s.cities > 1 ? 'villes' : 'ville']]
  return (
    <section className="stats">
      <div className="wrap stats-in">
        {items.map(([n, l], i) => <div key={l} data-reveal="up" data-delay={i * 90}><b data-count={n}>{nf(n)}</b><span>{l}</span></div>)}
      </div>
    </section>
  )
}

/** Phrase d'accroche qui s'allume mot à mot, illustrations qui flottent à des vitesses différentes */
function Statement() {
  return (
    <section className="say" data-progress>
      <div className="say-sticky">
        {ART.map(([k, s], i) => <img key={k} src={`/img/cut/${k}.webp`} alt="" className={'say-art sa' + i} data-parallax={s} />)}
        <p className="wrap say-txt" data-scrub>Le restaurant du coin, la pharmacie, le marché, la bouteille de gaz. Un livreur récupère, vous le suivez sur la carte, et vous payez à la réception.</p>
      </div>
    </section>
  )
}

/** Vrais articles en vente : la section se fige et deux rangées glissent en sens contraire */
function Products({ info }) {
  const items = info?.products || []
  if (items.length < 8) return null
  const half = Math.ceil(items.length / 2)
  const Card = ({ p }) => (
    <article className="pc">
      <div className="pc-img"><img src={p.image} alt="" loading="lazy" />{off(p) > 0 && <span className="pc-off">−{off(p)} %</span>}</div>
      <b>{p.name}</b>
      <small>{p.store} · {p.type}</small>
      <span className="pc-price">{nf(p.price)} F{off(p) > 0 && <s>{nf(p.old_price)} F</s>}</span>
    </article>
  )
  return (
    <section className="prod" data-progress data-hscroll>
      <div className="prod-sticky">
        <div className="wrap prod-head">
          <p className="kicker">Dans l’application en ce moment</p>
          <h2 data-words>Ce qui se commande sur Lamuka</h2>
        </div>
        {[items.slice(0, half), items.slice(half)].map((row, k) => (
          <div className="hs-row" key={k}>{row.map((p) => <Card p={p} key={p.name + p.store} />)}</div>
        ))}
      </div>
    </section>
  )
}

/** L'application en vidéo : courts enregistrements, lus quand ils sont à l'écran */
function Shorts() {
  const toggle = (e) => { const v = e.currentTarget.querySelector('video'); if (v) v.paused ? v.play() : v.pause() }
  return (
    <section className="sec shorts" id="videos">
      <div className="wrap">
        <div className="sec-head">
          <p className="kicker" data-reveal="up">L’application en vrai</p>
          <h2 data-words>Regardez plutôt</h2>
          <p className="lead" data-reveal="up" data-delay="200">Des vidéos enregistrées dans l’application : côté client, commerçant et livreur.</p>
        </div>
      </div>
      <div className="sh-row">
        {SHORTS.map(([k, t, d], i) => (
          <figure className="sh" key={k} data-reveal="up" data-delay={i * 110}>
            <div className="sh-ph" data-parallax={[0.04, 0.12, 0.02, 0.1, 0.05][i]} onClick={toggle}>
              <video src={`/video/${k}.mp4`} poster={`/video/${k}.jpg`} muted loop playsInline preload="none" data-auto aria-label={t + ' : ' + d} />
              <i className="sh-bar" />
            </div>
            <figcaption><b>{t}</b><span>{d}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** Comment ça marche : le téléphone reste à l'écran, l'étape change au fil du défilement */
function How() {
  const ref = useRef(null)
  const [step, setStep] = useState(0)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const f = (e) => setStep(Math.min(STEPS.length - 1, Math.floor(e.detail * STEPS.length * 0.999)))
    el.addEventListener('progress', f); return () => el.removeEventListener('progress', f)
  }, [])
  return (
    <section className="how" id="comment" ref={ref} data-progress style={{ '--steps': STEPS.length }}>
      <div className="how-sticky">
        <div className="wrap how-in">
          <div className="how-txt">
            <p className="kicker">Comment ça marche</p>
            <h2 data-words>De la boutique à votre porte</h2>
            <ol className="how-steps">
              {STEPS.map(([ic, t, d], i) => (
                <li key={t} className={i === step ? 'on' : i < step ? 'done' : ''}>
                  <span className="hs-ic"><I n={ic} /></span>
                  <div><h3><span className="hs-n">{i + 1}</span>{t}</h3><p>{d}</p></div>
                </li>
              ))}
            </ol>
            <div className="how-bar"><i /></div>
          </div>
          <div className="how-visual">
            <div className="phone how-phone">
              {STEPS.map(([, t, , img], i) => <img key={t} src={img} alt={t} className={i === step ? 'on' : ''} loading={i ? 'lazy' : undefined} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Trust() {
  const items = [
    ['shield', 'Deux codes, zéro doute', 'Code de retrait au commerce, code de livraison chez vous : chaque remise est vérifiée par le serveur.'],
    ['cash', 'Rien à payer d’avance', 'Vous payez en espèces quand la commande est entre vos mains.'],
    ['map', 'Une adresse sans nom de rue', 'L’épingle sur la carte et un repère écrit suffisent au livreur.'],
    ['chat', 'On se parle', 'Écrivez au commerce ou au livreur depuis la commande, ou appelez-le en un geste.'],
  ]
  return (
    <section className="sec sec-dark morph" data-enter>
      <div className="wrap">
        <div className="sec-head">
          <p className="kicker" data-reveal="up">Pensé pour le Congo</p>
          <h2 data-words>La confiance d’abord</h2>
        </div>
        <div className="trust">{items.map(([ic, t, d], i) => <div className="trust-i" key={t} data-reveal="up" data-delay={i * 120}><span><I n={ic} /></span><h3>{t}</h3><p>{d}</p></div>)}</div>
      </div>
    </section>
  )
}

function Split({ id, kicker, title, lead, ticks, visual, rev, tint, children }) {
  return (
    <section className={'sec' + (tint ? ' sec-tint' : '')} id={id}>
      <div className={'wrap split' + (rev ? ' rev' : '')}>
        {!rev && visual}
        <div>
          <p className="kicker" data-reveal="up">{kicker}</p>
          <h2 data-words>{title}</h2>
          <p className="lead" data-reveal="up" data-delay="200">{lead}</p>
          <ul className="ticks">{ticks.map((t, i) => <li key={i} data-reveal="left" data-delay={250 + i * 90}><I n="check" s={18} /><span>{t}</span></li>)}</ul>
          {children}
        </div>
        {rev && visual}
      </div>
    </section>
  )
}

function Download({ info }) {
  return (
    <section className="dl morph" id="telecharger" data-enter>
      <div className="wrap dl-in">
        <div>
          <p className="kicker" data-reveal="up">L’application</p>
          <h2 data-words>{info?.app?.store_url ? 'Disponible sur Google Play' : 'Bientôt sur Google Play'}</h2>
          <p className="lead" data-reveal="up" data-delay="200">{info?.app?.store_url ? 'Téléchargez Lamuka Market et commandez dès maintenant.' : `Lamuka Market est en cours de lancement${info?.cities ? ' à ' + info.cities : ''}. Laissez-nous un message pour recevoir le lien dès la sortie.`}</p>
          <div className="cta-row" data-reveal="up" data-delay="300">
            {info?.app?.store_url ? <Btn href={info.app.store_url} kind="btn-light" target="_blank" rel="noreferrer">Télécharger sur Google Play</Btn> : <>
              <Btn href={wa(info, 'Bonjour Lamuka, prévenez-moi à la sortie de l\'application.')} kind="btn-light" target="_blank" rel="noreferrer">Être prévenu sur WhatsApp</Btn>
              <Btn href={mail(info, 'Prévenez-moi à la sortie de Lamuka Market')} kind="btn-ghost-light">Par e-mail</Btn>
            </>}
          </div>
        </div>
        <div className="dl-visual"><div data-parallax="-0.18"><Phone src="/img/article.webp" alt="Fiche d'un article dans l'application" /></div></div>
      </div>
    </section>
  )
}

function Faq({ info }) {
  const [open, setOpen] = useState(0)
  const faq = info?.faq || []
  if (!faq.length) return null
  return (
    <section className="sec" id="faq">
      <div className="wrap faq-wrap">
        <div className="sec-head left">
          <p className="kicker" data-reveal="up">Questions fréquentes</p>
          <h2 data-words>Bon à savoir</h2>
          <p className="lead" data-reveal="up">Une autre question ? Écrivez-nous, on répond vite.</p>
          {wa(info, 'Bonjour Lamuka, j’ai une question.') && <a className="link" href={wa(info, 'Bonjour Lamuka, j’ai une question.')} target="_blank" rel="noreferrer" data-reveal="up">Nous écrire sur WhatsApp <I n="arrow" s={18} /></a>}
        </div>
        <div className="faq">
          {faq.map((f, i) => (
            <div className={'faq-i' + (open === i ? ' on' : '')} key={f.id || i} data-reveal="up" data-delay={i * 60}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}><span>{f.question}</span><I n="plus" s={20} /></button>
              <div className="faq-a"><p>{f.answer}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({ info }) {
  const c = info?.contact || {}
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div>
          <a href="#top" className="logo light"><img src="/favicon.png" alt="" /><span>lamuka</span></a>
          <p>Les commerces de votre ville, livrés chez vous.<br />{c.company ? `Une application de ${c.company}.` : ''}</p>
        </div>
        <div>
          <h4>Contact</h4>
          {c.phone && <a href={`tel:${c.phone.replace(/\s/g, '')}`}><I n="phone" s={16} />{c.phone}</a>}
          {c.email && <a href={`mailto:${c.email}`}><I n="mail" s={16} />{c.email}</a>}
          {c.whatsapp && <a href={wa(info, 'Bonjour Lamuka')} target="_blank" rel="noreferrer"><I n="chat" s={16} />WhatsApp</a>}
          {c.hours && <span className="foot-hours"><I n="clock" s={16} />{c.hours}</span>}
        </div>
        <div>
          <h4>Lamuka</h4>
          <a href="#comment">Comment ça marche</a>
          <a href="#commercants">Commerçants</a>
          <a href="#livreurs">Livreurs</a>
          <a href="#inscription-commerce">Inscrire mon commerce</a>
          <a href="#inscription-livreur">Devenir livreur</a>
          <a href="#faq">Questions fréquentes</a>
        </div>
      </div>
      <div className="wrap foot-bottom">© {new Date().getFullYear()} {c.company || 'Lamuka'}{c.address ? ' · ' + c.address : ''}</div>
    </footer>
  )
}

const JOIN = { '#inscription-commerce': 'vendor', '#inscription-livreur': 'driver', '#inscription': null }
function useJoin() {
  const read = () => (Object.prototype.hasOwnProperty.call(JOIN, window.location.hash) ? { role: JOIN[window.location.hash] } : null)
  const [join, setJoin] = useState(read)
  useEffect(() => { const f = () => setJoin(read()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f) }, [])
  const close = () => { setJoin(null); if (JOIN[window.location.hash] !== undefined) history.replaceState(null, '', window.location.pathname + window.location.search) }
  return [join, close]
}

export default function App() {
  const { info, err } = useInfo()
  const [join, closeJoin] = useJoin()
  useEffect(() => startMotion(), [])
  const commission = info?.merchants?.commission
  return (
    <>
      <Nav info={info} />
      <main>
        <Hero info={info} />
        <Marquee info={info} />
        <Stats info={info} />
        <Statement />
        <Products info={info} />
        <How />
        <Shorts />
        <Trust />
        <Split id="coursier" kicker="Coursier" title="Envoyez un colis, faites faire une course"
          lead="Votre chargeur est resté à la maison ? Un médicament introuvable dans l'application ? Un coursier s'en occupe."
          ticks={[<><b>Envoyer un colis</b> : documents, clés, vêtements, repas… d'un point à un autre de la ville.</>, <><b>Faire un achat</b> : le coursier achète dans le magasin de votre choix, vous le remboursez sur présentation du ticket.</>, 'Prix affiché avant de valider, suivi sur la carte, codes de retrait et de livraison.']}
          visual={<div className="split-visual" data-reveal="clip" data-tilt><div data-parallax="0.1"><Phone src="/img/coursier.webp" alt="Le coursier dans l'application" /></div></div>} />
        <Split id="commercants" rev tint kicker="Pour les commerçants" title="Vendez au-delà de votre quartier, sans site ni livreur à vous"
          lead="Lamuka vous apporte des clients et s'occupe de la livraison. Vous gérez tout depuis votre téléphone."
          ticks={['Nouvelles commandes en direct : accepter, préparer, marquer prête', <>Vous avez <b>vos propres livreurs</b> ? Confiez-leur vos commandes ; s’ils ne répondent pas, Lamuka trouve un livreur</>, 'Catalogue avec photos, options, sections et stock', 'Horaires, délai annoncé, livraison offerte, carte à tampons, codes promo', 'Ventes, meilleurs articles, avis et messages des clients']}
          visual={<div className="split-visual duo" data-reveal="clip" data-tilt><div data-parallax="0.06"><Phone src="/img/commerce.webp" alt="Accueil de l'espace commerçant" /></div><div className="offset" data-parallax="0.2"><Phone src="/img/catalogue.webp" alt="Catalogue du commerçant" /></div></div>}>
          {commission != null && <div className="price">
            <div data-reveal="up"><b>0 F</b><span>pour s’inscrire, sans abonnement</span></div>
            <div data-reveal="up" data-delay="120"><b data-count={commission} data-suffix=" %">{commission} %</b><span>de commission sur les ventes faites par l’app</span></div>
          </div>}
          <div className="cta-row"><Btn href="#inscription-commerce">Inscrire mon commerce</Btn><span className="muted">Gratuit, en quelques minutes. Ou dans l’app : Compte › Vendre sur Lamuka</span></div>
        </Split>
        <Split id="livreurs" kicker="Pour les livreurs" title="Livrez quand vous voulez, près de chez vous"
          lead="À moto, en voiture, à vélo ou à pied : vous choisissez vos quartiers et vos horaires."
          ticks={[<>Les courses sont proposées d’abord au livreur <b>le plus proche</b>, avec la distance et votre gain : vous acceptez ou refusez</>, 'Itinéraire par les rues vers le commerce, puis vers le client', 'Les frais de livraison vous reviennent ; vos gains sont suivis dans l’app', 'Appel et messages avec le commerce et le client']}
          visual={<div className="split-visual duo" data-reveal="clip" data-tilt><div data-parallax="0.06"><Phone src="/img/livreur.webp" alt="Course en cours, itinéraire vers le commerce" /></div><div className="offset" data-parallax="0.2"><Phone src="/img/livreur-code.webp" alt="Saisie du code de retrait" /></div></div>}>
          <div className="cta-row"><Btn href="#inscription-livreur">Devenir livreur</Btn><span className="muted">Gratuit, en quelques minutes. Ou dans l’app : Compte › Devenir livreur</span></div>
        </Split>
        <Download info={info} />
        <Faq info={info} />
        {err && <p className="wrap muted" style={{ padding: '20px 24px' }}>Informations momentanément indisponibles.</p>}
      </main>
      <Footer info={info} />
      {join && <Join key={join.role || 'choix'} role={join.role} info={info} onClose={closeJoin} />}
    </>
  )
}
