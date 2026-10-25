import { useEffect, useState } from 'react'

// Page /tester (non listée dans le site) : télécharger la version de test de l'application Android.
// La version en ligne est décrite par /app/version.json, publié avec l'APK (scripts/publier-apk.ps1).
const API = import.meta.env.VITE_API_URL || 'http://localhost/lamuka-api/api/v1'
const date = (iso) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function Tester() {
  const [apk, setApk] = useState(undefined)
  const [info, setInfo] = useState(null)
  const android = /android/i.test(navigator.userAgent)
  useEffect(() => {
    document.title = 'Tester l’application — Lamuka Market'
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m)
    fetch('/app/version.json', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then(setApk).catch(() => setApk(null))
    fetch(API + '/app-info').then((r) => r.json()).then((j) => setInfo(j?.data || null)).catch(() => {})
  }, [])
  const wa = info?.contact?.whatsapp && `https://wa.me/${info.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour Lamuka, je teste l'application${apk ? ' (version ' + apk.version + ')' : ''}. `)}`
  return (
    <main className="tst">
      <a href="/" className="logo tst-logo"><img src="/favicon.png" alt="" /><span>lamuka</span></a>
      <div className="tst-card">
        <p className="kicker">Version de test · Android</p>
        <h1>Tester l’application Lamuka Market</h1>
        {apk === undefined && <p className="tst-muted">Chargement…</p>}
        {apk === null && <p className="tst-muted">Aucune version de test n’est disponible pour le moment.</p>}
        {apk && <>
          <p className="tst-lead">Version {apk.version} · {String(apk.size_mb).replace('.', ',')} Mo · publiée le {date(apk.date)}</p>
          <div className="tst-dl">
            <a className="btn" href={`/app/${apk.file}`} download>Télécharger l’application</a>
            {!android && <div className="tst-qr"><img src="/app/qr.svg" alt="QR code de cette page" /><span>Sur ordinateur ? Scannez ce code avec votre téléphone Android.</span></div>}
          </div>
          <ol className="tst-steps">
            <li><b>Téléchargez</b> le fichier depuis votre téléphone Android.</li>
            <li><b>Confirmez le téléchargement</b> : Chrome prévient pour tout fichier d’application (« Ce fichier peut être dangereux ») ; appuyez sur « Télécharger quand même ».</li>
            <li><b>Ouvrez-le</b>. Si Android le demande, autorisez l’installation depuis votre navigateur (ou WhatsApp), puis appuyez sur « Installer » (ou « Mettre à jour »). Si Play Protect bloque l’application, touchez « Plus de détails » puis « Installer quand même » : elle n’est pas encore sur Google Play.</li>
            <li><b>Connectez-vous</b> avec votre numéro de téléphone : le code de connexion vous est envoyé par e-mail.</li>
          </ol>
          <div className="tst-note">
            <p><b>Nouvelle version ?</b> Revenez sur cette page et installez-la par-dessus : votre compte et vos données sont conservés.</p>
            <p><b>C’est la vraie application</b> : les commerces, commandes et livraisons sont réels.</p>
          </div>
          {wa && <a className="link tst-report" href={wa} target="_blank" rel="noreferrer">Signaler un problème sur WhatsApp</a>}
          <p className="tst-sum">Empreinte SHA-256 : <code>{apk.sha256}</code></p>
        </>}
      </div>
    </main>
  )
}
