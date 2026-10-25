// Animations du site, sans bibliothèque :
//  - [data-reveal]      apparition à l'entrée dans l'écran (variantes : up, left, right, scale ; délai data-delay en ms)
//  - [data-words]       titre révélé mot à mot
//  - [data-parallax]    déplacement vertical proportionnel au défilement (data-parallax="0.15")
//  - [data-progress]    variable CSS --p de 0 à 1 selon la traversée de l'élément (sections collantes)
//  - [data-count]       compteur qui monte jusqu'à sa valeur
//  - [data-scrub]       texte qui s'allume mot à mot au défilement ; [data-hscroll] rangées qui glissent à l'horizontale
//  - video[data-auto]   lecture automatique (muette) quand la vidéo est à l'écran
// L'état « apparu » est un attribut data-in (et non une classe) : React réécrit className à chaque rendu.
// Respecte « réduire les animations » du système.
export const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function splitWords(root = document) {
  root.querySelectorAll('[data-words]:not([data-split])').forEach((el) => {
    el.setAttribute('data-split', '')
    let i = 0
    const walk = (node) => {
      ;[...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment()
          n.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return }
            const s = document.createElement('span'); s.className = 'w'
            const inner = document.createElement('span'); inner.textContent = w; inner.style.transitionDelay = `${i++ * 55}ms`
            s.appendChild(inner); frag.appendChild(s)
          })
          n.replaceWith(frag)
        } else if (n.nodeType === 1) walk(n)
      })
    }
    walk(el)
  })
}

// [data-scrub] : texte dont les mots s'allument un à un selon la progression (--p) de la section parente
export function splitScrub(root = document) {
  root.querySelectorAll('[data-scrub]:not([data-split])').forEach((el) => {
    el.setAttribute('data-split', '')
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="sw">${w.replace(/</g, '&lt;')}</span>`).join(' ')
  })
}

export function startMotion() {
  splitWords(); splitScrub()
  const html = document.documentElement
  if (reduced()) { html.classList.add('no-motion'); document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = fmt(el) }); return () => {} }
  html.classList.add('motion')

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    const el = e.target
    const d = Number(el.dataset.delay || 0)
    setTimeout(() => { el.setAttribute('data-in', ''); if (el.dataset.count !== undefined) count(el) }, d)
    io.unobserve(el)
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
  const watch = () => document.querySelectorAll('[data-reveal]:not([data-in]), [data-words]:not([data-in]), [data-count]:not([data-in])').forEach((el) => io.observe(el))
  watch()

  // Défilement : parallaxe et progression des sections
  let ticking = false
  const frame = () => {
    ticking = false
    const vh = window.innerHeight
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const r = el.getBoundingClientRect()
      const mid = r.top + r.height / 2 - vh / 2
      el.style.setProperty('--py', `${(-mid * Number(el.dataset.parallax)).toFixed(1)}px`)
    })
    document.querySelectorAll('[data-progress]').forEach((el) => {
      // [data-hscroll] : la section se fige et ses rangées (.hs-row) glissent à l'horizontale ; sa hauteur = la distance à parcourir
      if (el.dataset.hscroll !== undefined) {
        const rows = [...el.querySelectorAll('.hs-row')]
        const dist = Math.max(0, ...rows.map((row) => row.scrollWidth - window.innerWidth + 48))
        const h = Math.round(vh + dist)
        if (Math.abs(el.offsetHeight - h) > 2) el.style.height = h + 'px'
        const r0 = el.getBoundingClientRect(), p0 = dist > 0 ? Math.min(1, Math.max(0, -r0.top / dist)) : 0
        rows.forEach((row, k) => { row.style.transform = `translate3d(${(k % 2 ? -dist * (1 - p0) : -dist * p0).toFixed(1)}px,0,0)` })
      }
      const r = el.getBoundingClientRect()
      const total = r.height - vh
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : (r.top < vh && r.bottom > 0 ? 1 - r.bottom / (vh + r.height) : 0)
      el.style.setProperty('--p', p.toFixed(4))
      el.querySelectorAll('[data-scrub]').forEach((t) => {
        const ws = t.querySelectorAll('.sw'), lit = Math.round(Math.min(1, p * 1.25) * ws.length)
        ws.forEach((w, i) => { if ((i < lit) !== w.hasAttribute('data-lit')) w.toggleAttribute('data-lit', i < lit) })
      })
      el.dispatchEvent(new CustomEvent('progress', { detail: p }))
    })
    // [data-enter] : --e de 0 (le haut de l'élément arrive en bas de l'écran) à 1 (il atteint 15 % de la hauteur)
    document.querySelectorAll('[data-enter]').forEach((el) => {
      const t = el.getBoundingClientRect().top
      el.style.setProperty('--e', Math.min(1, Math.max(0, (vh - t) / (vh * 0.85))).toFixed(4))
    })
    html.style.setProperty('--scroll', String(window.scrollY))
    html.style.setProperty('--scroll-max', String(Math.max(1, html.scrollHeight - vh)))
  }
  // Vitesse de défilement → --vel (-1…1), qui retombe doucement à 0 (défilé des commerces qui penche)
  let lastY = window.scrollY, vel = 0, velRaf = 0
  const decay = () => { vel *= 0.9; html.style.setProperty('--vel', vel.toFixed(3)); velRaf = Math.abs(vel) > 0.005 ? requestAnimationFrame(decay) : 0 }
  const onScroll = () => {
    const y = window.scrollY
    vel = Math.max(-1, Math.min(1, vel * 0.6 + (y - lastY) / 60)); lastY = y
    if (!velRaf) velRaf = requestAnimationFrame(decay)
    if (!ticking) { ticking = true; requestAnimationFrame(frame) }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  frame()

  // Souris uniquement (jamais au doigt) : inclinaison des téléphones [data-tilt], boutons « magnétiques »
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const onMove = (e) => {
    const tilt = e.target.closest?.('[data-tilt]')
    document.querySelectorAll('[data-tilt]').forEach((el) => { if (el !== tilt) { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') } })
    if (tilt) {
      const r = tilt.getBoundingClientRect()
      tilt.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width) - 0.5) * 10}deg`)
      tilt.style.setProperty('--rx', `${(0.5 - ((e.clientY - r.top) / r.height)) * 8}deg`)
    }
    const btn = e.target.closest?.('.btn')
    document.querySelectorAll('.btn[data-mag]').forEach((b) => { if (b !== btn) { b.style.transform = ''; b.removeAttribute('data-mag') } })
    if (btn) {
      const r = btn.getBoundingClientRect()
      btn.setAttribute('data-mag', '')
      btn.style.transform = `translate(${((e.clientX - r.left) / r.width - 0.5) * 8}px, ${((e.clientY - r.top) / r.height - 0.5) * 8}px)`
    }
  }
  if (fine) window.addEventListener('pointermove', onMove, { passive: true })

  // Vidéos : lecture seulement quand elles sont bien visibles ; barre de progression --t
  const vio = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target
    if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}) } else v.pause()
  }), { threshold: 0.6 })
  const watchVideos = () => document.querySelectorAll('video[data-auto]:not([data-w])').forEach((v) => {
    v.setAttribute('data-w', ''); vio.observe(v)
    v.addEventListener('timeupdate', () => { if (v.duration) v.parentElement.style.setProperty('--t', (v.currentTime / v.duration).toFixed(3)) })
  })
  watchVideos()

  const mo = new MutationObserver(() => { splitWords(); splitScrub(); watch(); watchVideos(); onScroll() })
  mo.observe(document.body, { childList: true, subtree: true })
  return () => { io.disconnect(); vio.disconnect(); mo.disconnect(); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); window.removeEventListener('pointermove', onMove) }
}

const fmt = (el) => Number(el.dataset.count).toLocaleString('fr-FR').replace(/ | /g, ' ') + (el.dataset.suffix || '')
function count(el) {
  const to = Number(el.dataset.count) || 0, t0 = performance.now(), dur = 1400
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3)
    el.textContent = Math.round(to * e).toLocaleString('fr-FR').replace(/ | /g, ' ') + (el.dataset.suffix || '')
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
