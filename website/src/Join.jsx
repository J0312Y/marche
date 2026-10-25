import { useEffect, useRef, useState } from 'react'
import { TYPE_LABEL } from '../../src/config/storeTypes'

/**
 * Inscription commerçant ou livreur depuis le site — mêmes routes que l'application :
 * compte (téléphone → code reçu par e-mail → nom) → demande (/vendor/register ou /driver/register)
 * → pièces justificatives (/registrations/documents). La demande arrive dans le panneau, « À valider ».
 */
const API = import.meta.env.VITE_API_URL || 'http://localhost/lamuka-api/api/v1'
const KEY = 'lk-site-token'
const VEHICLES = [['moto', 'Moto'], ['voiture', 'Voiture'], ['velo', 'Vélo'], ['pied', 'À pied']]

async function call(method, path, body, token, form) {
  const h = { Accept: 'application/json' }
  if (token) h.Authorization = 'Bearer ' + token
  if (body && !form) h['Content-Type'] = 'application/json'
  let r
  try { r = await fetch(API + path, { method, headers: h, body: form || (body ? JSON.stringify(body) : undefined) }) }
  catch { throw Object.assign(new Error('Serveur injoignable. Vérifiez votre connexion.'), { status: 0 }) }
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(j.message || 'Erreur, réessayez.'), { status: r.status, errors: j.errors })
  return j.data
}

const Step = ({ n, total }) => <div className="jn-steps" aria-label={`Étape ${n} sur ${total}`}>{Array.from({ length: total }, (_, i) => <i key={i} className={i < n ? 'on' : ''} />)}</div>

export default function Join({ role: role0, onClose, info }) {
  const [role, setRole] = useState(role0 || null)
  const [token, setToken] = useState(() => { try { return sessionStorage.getItem(KEY) } catch { return null } })
  const [me, setMe] = useState(null)
  const [step, setStep] = useState(role0 ? 'phone' : 'role') // role | phone | code | name | form | docs | done
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [needEmail, setNeedEmail] = useState(false)
  const [mode, setMode] = useState('signup')
  const [to, setTo] = useState('')
  const [code, setCode] = useState('')
  const [first, setFirst] = useState(''); const [last, setLast] = useState('')
  const [f, setF] = useState({ type: '', name: '', description: '', vehicle: 'moto', brand: '', plate: '', zones: [] })
  const [quarters, setQuarters] = useState([])
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(''); const [err, setErr] = useState('')
  const pickRef = useRef(null); const target = useRef(null)
  const full = '+242' + phone
  const isVendor = role === 'vendor'
  const run = async (key, fn) => { setBusy(key); setErr(''); try { await fn() } catch (e) { setErr(e.message) } setBusy('') }

  // Fermer avec Échap ; pas de défilement de la page derrière
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); document.documentElement.classList.add('jn-lock')
    return () => { window.removeEventListener('keydown', k); document.documentElement.classList.remove('jn-lock') }
  }, [onClose])
  useEffect(() => { call('GET', '/zones').then((z) => setQuarters(z?.quarter_list || [])).catch(() => {}) }, [])

  // Session déjà ouverte sur le site : on reprend où en est la demande
  const resume = async (tk, r = role) => {
    const u = await call('GET', '/users/me', null, tk)
    setMe(u)
    if (!u.first_name) { setStep('name'); return }
    const st = r === 'vendor' ? u.vendor_status : u.driver_status
    if (!st || st === 'none') { setStep('form'); return }
    await loadDocs(tk, r)
  }
  const loadDocs = async (tk, r = role) => {
    const d = await call('GET', `/registrations/documents?role=${r}`, null, tk)
    setFile(d); setStep(d?.complete && d.status === 'pending' ? 'done' : 'docs')
  }
  useEffect(() => { if (token && role && step === 'phone') run('resume', () => resume(token)).catch(() => {}) }, [role]) // eslint-disable-line

  const sendCode = (e) => { e?.preventDefault(); run('code', async () => {
    if (!/^0[456]\d{7}$/.test(phone)) throw new Error('Numéro à 9 chiffres commençant par 04, 05 ou 06')
    const ex = await call('POST', '/auth/check-phone', { phone: full })
    const m = ex?.exists ? 'login' : 'signup'
    setMode(m)
    try {
      const r = await call('POST', '/auth/send-otp', { phone: full, mode: m, ...(email.trim() ? { email: email.trim() } : {}) })
      setTo(r?.to || full); setStep('code'); setCode('')
    } catch (x) {
      if (x.errors?.code === 'email_required') { setNeedEmail(true); throw new Error(m === 'signup' ? 'Indiquez votre adresse e-mail : le code de connexion y est envoyé.' : 'Ce compte n\'a pas d\'adresse e-mail : indiquez-en une pour recevoir le code.') }
      throw x
    }
  }) }
  const verify = (e) => { e?.preventDefault(); run('verify', async () => {
    const r = await call('POST', '/auth/verify-otp', { phone: full, code, mode })
    try { sessionStorage.setItem(KEY, r.token) } catch {}
    setToken(r.token)
    await resume(r.token)
  }) }
  const saveName = (e) => { e?.preventDefault(); run('name', async () => {
    await call('POST', '/auth/complete-profile', { first_name: first.trim(), last_name: last.trim() }, token)
    await resume(token)
  }) }
  const motor = f.vehicle === 'moto' || f.vehicle === 'voiture'
  const submit = (e) => { e?.preventDefault(); run('form', async () => {
    if (isVendor) {
      if (!f.type) throw new Error('Choisissez le type de commerce')
      if (f.name.trim().length < 2) throw new Error('Indiquez le nom du commerce')
      await call('POST', '/vendor/register', { name: f.name.trim(), type: f.type, plan: 'starter', description: f.description.trim() || undefined }, token)
    } else {
      if (motor && !f.plate.trim()) throw new Error('Indiquez la plaque d\'immatriculation')
      if (!f.zones.length) throw new Error('Choisissez au moins un quartier')
      await call('POST', '/driver/register', { vehicle_type: f.vehicle, vehicle_brand: motor ? f.brand.trim() || null : null, vehicle_plate: motor ? f.plate.trim().toUpperCase() : null, zones: f.zones }, token)
    }
    await loadDocs(token)
  }) }
  const upload = (fileObj) => { const type = target.current; if (!fileObj || !type) return; run('doc:' + type, async () => {
    const fd = new FormData(); fd.append('role', role); fd.append('type', type); fd.append('file', fileObj)
    await call('POST', '/registrations/documents', null, token, fd)
    const d = await call('GET', `/registrations/documents?role=${role}`, null, token); setFile(d)
  }) }
  const resubmit = () => run('resubmit', async () => { await call('POST', '/registrations/resubmit', { role }, token); await loadDocs(token) })
  const logout = () => { try { sessionStorage.removeItem(KEY) } catch {} setToken(null); setMe(null); setStep('phone'); setPhone(''); setCode('') }

  const byType = Object.fromEntries((file?.documents || []).map((d) => [d.type, d]))
  const docRows = file ? [...file.required.map((t) => [t, true]), ...file.optional.map((t) => [t, false])] : []
  const missing = file ? file.required.filter((t) => !byType[t] || byType[t].status === 'refused').length : 0
  const byCity = {}; quarters.forEach((q) => { (byCity[q.zone || ''] = byCity[q.zone || ''] || []).push(q.name) })
  const stepN = { role: 0, phone: 1, code: 1, name: 2, form: 3, docs: 4, done: 5 }[step]
  const title = !role ? 'Rejoindre Lamuka' : isVendor ? 'Inscrire mon commerce' : 'Devenir livreur'

  return (
    <div className="jn" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="jn-card">
        <header>
          <div><b>{title}</b>{role && step !== 'done' && <Step n={stepN} total={4} />}</div>
          <button className="jn-x" onClick={onClose} aria-label="Fermer">×</button>
        </header>
        <div className="jn-body">
          {step === 'role' && <div className="jn-roles">
            <p className="muted">Vous êtes…</p>
            <button onClick={() => { setRole('vendor'); setStep('phone') }}><b>Un commerce</b><span>Restaurant, boutique, pharmacie, gaz… Recevez des commandes, Lamuka livre.</span></button>
            <button onClick={() => { setRole('driver'); setStep('phone') }}><b>Un livreur</b><span>À moto, en voiture, à vélo ou à pied, dans vos quartiers.</span></button>
          </div>}

          {step === 'phone' && <form onSubmit={sendCode}>
            <h3>Votre numéro de téléphone</h3>
            <p className="muted">Il identifie votre compte Lamuka. Vous recevrez un code de confirmation par e-mail.</p>
            <label className="jn-field"><span>Téléphone</span><div className="jn-phone"><em>+242</em><input autoFocus inputMode="numeric" autoComplete="tel-national" placeholder="06X XXX XXX" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 9)); setErr('') }} /></div></label>
            {needEmail && <label className="jn-field"><span>Adresse e-mail</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" /></label>}
            {err && <p className="jn-err">{err}</p>}
            <button className="btn jn-cta" disabled={busy || phone.length !== 9 || (needEmail && !email.includes('@'))}>{busy ? 'Envoi…' : 'Recevoir le code'}</button>
          </form>}

          {step === 'code' && <form onSubmit={verify}>
            <h3>Code de confirmation</h3>
            <p className="muted">Envoyé à <b>{to}</b>. <a href="#" onClick={(e) => { e.preventDefault(); setStep('phone') }}>Modifier</a></p>
            <input className="jn-code" autoFocus inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="••••••" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErr('') }} />
            {err && <p className="jn-err">{err}</p>}
            <button className="btn jn-cta" disabled={busy || code.length !== 6}>{busy ? 'Vérification…' : 'Continuer'}</button>
          </form>}

          {step === 'name' && <form onSubmit={saveName}>
            <h3>Comment vous appelez-vous ?</h3>
            <div className="jn-two">
              <label className="jn-field"><span>Prénom</span><input autoFocus autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} /></label>
              <label className="jn-field"><span>Nom</span><input autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} /></label>
            </div>
            {err && <p className="jn-err">{err}</p>}
            <button className="btn jn-cta" disabled={busy || first.trim().length < 2 || last.trim().length < 2}>{busy ? '…' : 'Continuer'}</button>
          </form>}

          {step === 'form' && <form onSubmit={submit}>
            <h3>{isVendor ? 'Votre commerce' : 'Votre activité de livreur'}</h3>
            {me && <p className="muted">Compte de {[me.first_name, me.last_name].filter(Boolean).join(' ')} · {me.phone} · <a href="#" onClick={(e) => { e.preventDefault(); logout() }}>Changer de compte</a></p>}
            {isVendor ? <>
              <div className="jn-field"><span>Type de commerce</span><div className="jn-chips">{Object.entries(TYPE_LABEL).map(([k, l]) => <button type="button" key={k} className={f.type === k ? 'on' : ''} onClick={() => setF({ ...f, type: k })}>{l}</button>)}</div></div>
              <label className="jn-field"><span>Nom du commerce</span><input maxLength={80} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ex. : Chez Mama Ngudi" /></label>
              <label className="jn-field"><span>Ce que vous vendez <small>(facultatif)</small></span><textarea rows={3} maxLength={500} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Vos spécialités, vos produits phares…" /></label>
            </> : <>
              <div className="jn-field"><span>Moyen de transport</span><div className="jn-chips">{VEHICLES.map(([k, l]) => <button type="button" key={k} className={f.vehicle === k ? 'on' : ''} onClick={() => setF({ ...f, vehicle: k })}>{l}</button>)}</div></div>
              {motor && <div className="jn-two">
                <label className="jn-field"><span>Marque <small>(facultatif)</small></span><input maxLength={40} value={f.brand} onChange={(e) => setF({ ...f, brand: e.target.value })} placeholder={f.vehicle === 'moto' ? 'Ex. : Haojue' : 'Ex. : Toyota'} /></label>
                <label className="jn-field"><span>Plaque</span><input maxLength={20} value={f.plate} onChange={(e) => setF({ ...f, plate: e.target.value.toUpperCase() })} /></label>
              </div>}
              <div className="jn-field"><span>Quartiers où vous voulez livrer</span>
                {Object.entries(byCity).map(([city, qs]) => <div key={city}>{Object.keys(byCity).length > 1 && <small className="jn-city">{city}</small>}<div className="jn-chips">{qs.sort((a, b) => a.localeCompare(b, 'fr')).map((q) => <button type="button" key={q} className={f.zones.includes(q) ? 'on' : ''} onClick={() => setF({ ...f, zones: f.zones.includes(q) ? f.zones.filter((x) => x !== q) : [...f.zones, q] })}>{q}</button>)}</div></div>)}
              </div>
            </>}
            {err && <p className="jn-err">{err}</p>}
            <button className="btn jn-cta" disabled={!!busy}>{busy ? 'Envoi…' : 'Envoyer ma demande'}</button>
            <p className="muted small">L'inscription est gratuite. Étape suivante : les photos de vos pièces.</p>
          </form>}

          {step === 'docs' && file && <div>
            <h3>{file.status === 'rejected' ? 'Demande à compléter' : 'Vos pièces justificatives'}</h3>
            {file.status === 'rejected' && file.review_note && <p className="jn-note">Motif : {file.review_note}</p>}
            <p className="muted">Une photo nette de chaque pièce. L'équipe Lamuka les vérifie avant de valider votre {isVendor ? 'commerce' : 'compte livreur'}.</p>
            <ul className="jn-docs">{docRows.map(([t, req]) => {
              const d = byType[t]
              const st = !d ? (req ? 'À envoyer' : 'Facultatif') : d.status === 'refused' ? 'À refaire' : d.status === 'approved' ? 'Conforme' : 'Envoyée'
              return <li key={t} className={d ? (d.status === 'refused' ? 'bad' : 'ok') : ''}>
                <div><b>{file.labels[t]}</b><small>{st}{d?.review_note ? ' · ' + d.review_note : ''}</small></div>
                <button type="button" className="btn btn-sm btn-ghost" disabled={!!busy} onClick={() => { target.current = t; pickRef.current?.click() }}>{busy === 'doc:' + t ? 'Envoi…' : d ? 'Remplacer' : 'Ajouter une photo'}</button>
              </li>
            })}</ul>
            <input ref={pickRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files?.[0]); e.target.value = '' }} />
            {err && <p className="jn-err">{err}</p>}
            {file.status === 'rejected'
              ? <button className="btn jn-cta" disabled={!!busy || missing > 0} onClick={resubmit}>{busy === 'resubmit' ? 'Envoi…' : 'Renvoyer ma demande'}</button>
              : <button className="btn jn-cta" disabled={missing > 0} onClick={() => setStep('done')}>{missing ? `Encore ${missing} pièce${missing > 1 ? 's' : ''} à envoyer` : 'Terminer'}</button>}
          </div>}

          {step === 'done' && <div className="jn-done">
            <div className="jn-ok"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" /></svg></div>
            <h3>{file?.status === 'active' || file?.status === 'approved' ? 'Votre compte est validé' : 'Demande envoyée'}</h3>
            <p className="muted">{file?.status === 'active' || file?.status === 'approved'
              ? `Ouvrez l'application Lamuka Market avec le numéro ${me?.phone || full} : votre ${isVendor ? 'espace commerçant' : 'espace livreur'} vous attend.`
              : `L'équipe Lamuka vérifie votre dossier et vous prévient dans l'application dès qu'il est validé. Vous suivrez votre demande dans l'application, avec le numéro ${me?.phone || full}.`}</p>
            {info?.app?.store_url ? <a className="btn jn-cta" href={info.app.store_url} target="_blank" rel="noreferrer">Télécharger l'application</a>
              : <p className="muted small">L'application arrive bientôt sur Google Play.</p>}
            <button className="jn-link" onClick={onClose}>Fermer</button>
          </div>}
        </div>
      </div>
    </div>
  )
}
