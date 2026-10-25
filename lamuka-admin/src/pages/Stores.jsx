import { useState } from "react";
import api from "../api";
import { useLoad, usePaged, useAction, PageHead, Toolbar, Tabs, Table, Pager, Badge, Drawer, Rows, Confirm, Btn, Field, ImagePick, fmt, num, dt, fullName, phone } from "../ui";
import Docs from "../Docs";

export const TYPES = { restaurant: "Restaurant", patisserie: "Pâtisserie", supermarche: "Supermarché", pharmacie: "Pharmacie", boutique: "Boutique", service: "Services", fleurs: "Fleuriste", beaute: "Beauté & soins", auto: "Services auto", gaz: "Gaz & carburant", maison: "Entretien maison" };

/** Rayons du commerce (articles.menu_section) : corriger un nom, fusionner les doublons */
function StoreSections({ id }) {
  const { data, reload } = useLoad(() => api.get(`/admin/establishments/${id}/sections`), [id]);
  const { run, busy } = useAction();
  const [edit, setEdit] = useState(null); // { from, to }
  const rename = async (from, to, ok) => { if (await run(() => api.put(`/admin/establishments/${id}/sections/rename`, { from, to }), ok)) { setEdit(null); reload(); } };
  if (!data) return <p className="muted">Chargement…</p>;
  if (!data.length) return <p className="muted">Aucun article pour l'instant.</p>;
  return <>
    <p className="muted small">Dans l'ordre affiché aux clients. Le commerçant range ses rayons depuis l'application (Catalogue › Rayons).</p>
    {data.map((r) => (
      <div key={r.name} className="inline between" style={{ padding: "8px 0", borderTop: "1px solid var(--line)" }}>
        {edit?.from === r.name
          ? <div className="inline"><input value={edit.to} maxLength={80} autoFocus onChange={(x) => setEdit({ ...edit, to: x.target.value })} /><Btn size="sm" disabled={busy || !edit.to.trim() || edit.to.trim() === r.name} onClick={() => rename(r.name, edit.to, "Rayon renommé")}>Enregistrer</Btn><Btn kind="ghost" size="sm" onClick={() => setEdit(null)}>Annuler</Btn></div>
          : <div><b>{r.name}</b>{!r.own && <> </>}{!r.own && <Badge tone="mut">catégorie</Badge>}{r.duplicate_of && <> </>}{r.duplicate_of && <Badge tone="warn">doublon de « {r.duplicate_of} »</Badge>}<small className="block">{num(r.count)} article{r.count > 1 ? "s" : ""}{r.active < r.count ? ` · ${num(r.count - r.active)} masqué${r.count - r.active > 1 ? "s" : ""}` : ""}</small></div>}
        {edit?.from !== r.name && <div className="inline">
          {r.duplicate_of && <Btn size="sm" disabled={busy} onClick={() => rename(r.name, r.duplicate_of, `Fusionné dans « ${r.duplicate_of} »`)}>Fusionner</Btn>}
          <Btn kind="ghost" size="sm" onClick={() => setEdit({ from: r.name, to: r.name })}>Renommer</Btn>
        </div>}
      </div>
    ))}
  </>;
}

function StoreDrawer({ id, onClose, onChanged }) {
  const { data, reload } = useLoad(() => api.get(`/admin/establishments/${id}`), [id]);
  const { run, busy } = useAction();
  const [ask, setAsk] = useState(null);
  const [rate, setRate] = useState(null);
  const [file, setFile] = useState(null);
  const e = data?.establishment || {};
  const done = () => { setAsk(null); reload(); onChanged(); };
  const act = async (what, why) => {
    const ok = { approve: "Commerce validé", reject: "Demande refusée", suspend: "Commerce suspendu" }[what];
    if (await run(() => api.put(`/admin/establishments/${id}/${what}`, why ? { reason: why } : {}), ok)) done();
  };
  const setImage = async (kind, file) => {
    if (await run(() => api.upload(`/admin/establishments/${id}/image?kind=${kind}`, "image", file), kind === "cover" ? "Couverture remplacée" : "Logo remplacé")) reload();
  };
  const saveRate = async () => {
    const v = Number(String(rate).replace(",", "."));
    if (!(v >= 0 && v <= 50)) return;
    if (await run(() => api.put(`/admin/establishments/${id}/update`, { commission_rate: v }), "Taux de commission enregistré")) { setRate(null); reload(); }
  };
  return (
    <Drawer title={e.name || "Commerce"} onClose={onClose} footer={data && <>
      {e.status === "pending" && <><Btn kind="danger" onClick={() => setAsk("reject")}>Refuser</Btn><Btn disabled={!file?.complete} title={file?.complete ? "" : "Dossier incomplet"} onClick={() => setAsk("approve")}>Valider le commerce</Btn></>}
      {e.status === "active" && <Btn kind="danger" onClick={() => setAsk("suspend")}>Suspendre</Btn>}
      {e.status === "suspended" && <Btn onClick={() => setAsk("approve")}>Réactiver</Btn>}
    </>}>
      {!data ? <p className="muted">Chargement…</p> : <>
        {e.status === "rejected" && <p className="review-note">Refusé{e.review_note ? ` : ${e.review_note}` : ""}. Le commerçant peut corriger son dossier et le renvoyer depuis l'app.</p>}
        <div className="drawer-status"><Badge s={e.status} />{String(e.is_open) === "1" ? <Badge tone="ok">Ouvert</Badge> : <Badge tone="mut">Fermé</Badge>}{String(e.free_delivery) === "1" && <Badge tone="acc">Livraison offerte</Badge>}</div>
        
        {e.status === "active" && <div className="inline between site-toggle">
          <div><b>Afficher sur le site</b><p className="muted small">{String(e.show_on_site) === "0" ? "Masqué du site. Le commerce reste visible et commandable dans l'application." : "Le commerce apparaît dans la liste des partenaires du site, dès qu'il est actif."}</p></div>
          <button className={"switch" + (String(e.show_on_site) !== "0" ? " on" : "")} disabled={busy} aria-label="Afficher sur le site"
            onClick={async () => { const v = String(e.show_on_site) === "0" ? 1 : 0; if (await run(() => api.put(`/admin/establishments/${id}/update`, { show_on_site: v }), v ? "Affiché sur le site" : "Masqué du site")) { reload(); onChanged(); } }} />
        </div>}
        <Rows items={[
          ["Type", TYPES[e.type] || e.type],
          ["Gérant", <>{fullName(e.owner_name)}<small className="block">{phone(e.owner_phone)}</small></>],
          ["Adresse", [e.address, e.city].filter(Boolean).join(", ")],
          ["Position", e.latitude ? `${Number(e.latitude).toFixed(4)}, ${Number(e.longitude).toFixed(4)}` : "Non renseignée"],
          ["Délai annoncé", e.eta_min ? `${e.eta_min} – ${e.eta_max} min` : "—"],
          ["Commande minimum", Number(e.min_order) ? fmt(e.min_order) : "Aucune"],
          ["Note", Number(e.total_reviews) ? `${Number(e.rating).toFixed(1)} / 5 (${e.total_reviews} avis)` : "Pas encore d'avis"],
          ["Commandes", num(data.orders_count)],
          ["Articles", num(data.articles_count)],
          ["Inscrit le", dt(e.created_at, false)],
          e.description && ["Description", e.description],
        ]} />
        <h4 className="sub-h">Pièces justificatives</h4>
        <Docs userId={e.owner_id} role="vendor" onState={setFile} />
        <h4 className="sub-h">Images</h4>
        <div className="img-stack">
          <ImagePick label="Logo" shape="square" current={e.avatar} busy={busy} onPick={(f) => setImage("logo", f)} hint="Carré 512 × 512, recadré au centre." />
          <ImagePick label="Couverture" shape="wide" current={e.cover_image} busy={busy} onPick={(f) => setImage("cover", f)} hint="1200 × 480, recadrée au centre." />
        </div>
        <h4 className="sub-h">Rayons</h4>
        <StoreSections id={id} />
        <h4 className="sub-h">Commission Lamuka</h4>
        {rate === null
          ? <div className="inline"><b className="big">{Number(e.commission_rate)} %</b><span className="muted">des ventes d'articles</span><Btn kind="ghost" size="sm" onClick={() => setRate(String(Number(e.commission_rate)))}>Modifier</Btn></div>
          : <div className="inline"><Field label="Taux (%)"><input type="number" min="0" max="50" step="0.5" value={rate} onChange={(x) => setRate(x.target.value)} /></Field><Btn size="sm" disabled={busy} onClick={saveRate}>Enregistrer</Btn><Btn kind="ghost" size="sm" onClick={() => setRate(null)}>Annuler</Btn></div>}
      </>}
      {ask === "approve" && <Confirm title={e.status === "pending" ? "Valider ce commerce ?" : "Réactiver ce commerce ?"} text={e.status === "pending" ? "Les pièces encore « à vérifier » seront marquées conformes. Le commerce apparaîtra dans l'application et le gérant est prévenu." : "Il réapparaîtra dans l'application et pourra recevoir des commandes. Le gérant est prévenu."} confirm={e.status === "pending" ? "Valider" : "Réactiver"} busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("approve")} />}
      {ask === "reject" && <Confirm title="Refuser la demande ?" danger reason="required" text="Le gérant voit le motif dans l'application, corrige les pièces signalées et renvoie sa demande." confirm="Refuser" busy={busy} onCancel={() => setAsk(null)} onConfirm={(w) => act("reject", w)} />}
      {ask === "suspend" && <Confirm title="Suspendre ce commerce ?" danger text="Il disparaît de l'application et ne reçoit plus de commandes, jusqu'à sa réactivation." confirm="Suspendre" busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("suspend")} />}
    </Drawer>
  );
}

export default function Stores({ onChanged }) {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const list = usePaged("/admin/establishments", "establishments", { status, type, search });
  return (
    <div className="page">
      <PageHead title="Commerces" sub="Inscriptions à valider, commerces en ligne et taux de commission" />
      <Tabs value={status} onChange={setStatus} items={[["", "Tous"], ["pending", "À valider"], ["active", "Actifs"], ["suspended", "Suspendus"], ["rejected", "Refusés"]]} />
      <Toolbar onSearch={setSearch} placeholder="Nom du commerce ou téléphone du gérant">
        <select value={type} onChange={(e) => setType(e.target.value)}><option value="">Tous les types</option>{Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      </Toolbar>
      <Table {...list} onRow={(e) => setOpen(e.id)} empty="Aucun commerce." cols={[
        { k: "name", label: "Commerce", render: (e) => <div className="who">{e.avatar ? <img src={e.avatar} alt="" /> : <span>{e.name[0]}</span>}<div><b>{e.name}</b><small className="block">{TYPES[e.type] || e.type}</small></div></div> },
        { k: "owner", label: "Gérant", render: (e) => <>{fullName(e.owner_name, e.owner_last_name)}<small className="block">{phone(e.owner_phone)}</small></> },
        { k: "status", label: "Statut", render: (e) => <><Badge s={e.status} />{e.status === "active" && String(e.show_on_site) === "0" && <small className="block">Masqué du site</small>}</> },
        { k: "docs", label: "Dossier", render: (e) => e.status === "active" || e.status === "suspended" ? <span className="muted">—</span> : Number(e.docs_refused) > 0 ? <Badge tone="bad">À refaire</Badge> : Number(e.docs_count) >= 3 ? <Badge tone="ok">{e.docs_count} pièces</Badge> : <Badge tone="warn">{e.docs_count || 0}/3 pièces</Badge> },
        { k: "rate", label: "Commission", render: (e) => `${Number(e.commission_rate)} %` },
        { k: "orders", label: "Commandes", right: true, render: (e) => num(e.total_orders) },
        { k: "created_at", label: "Inscrit", render: (e) => dt(e.created_at, false) },
      ]} />
      <Pager {...list} />
      {open && <StoreDrawer id={open} onClose={() => setOpen(null)} onChanged={() => { list.reload(); onChanged?.(); }} />}
    </div>
  );
}
