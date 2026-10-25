import { useState } from "react";
import api from "../api";
import { useLoad, usePaged, useAction, PageHead, Toolbar, Tabs, Table, Pager, Badge, Drawer, Rows, Confirm, Btn, num, dt, ago, fullName, phone } from "../ui";

const ROLE = { client: "Client", vendor: "Commerçant", driver: "Livreur", both: "Commerçant + livreur", admin: "Administrateur" };

function UserDrawer({ id, onClose, onChanged }) {
  const { data, reload } = useLoad(() => api.get(`/admin/users/${id}`), [id]);
  const { run, busy } = useAction();
  const [ask, setAsk] = useState(null);
  const u = data?.user || {};
  const act = async (what) => {
    if (await run(() => api.put(`/admin/users/${id}/${what}`), what === "ban" ? "Compte bloqué" : "Compte débloqué")) { setAsk(null); reload(); onChanged(); }
  };
  const banned = u.status === "banned" || u.status === "suspended";
  return (
    <Drawer title={fullName(u.first_name, u.last_name) || "Utilisateur"} onClose={onClose} footer={data && u.role !== "admin" && (banned
      ? <Btn onClick={() => setAsk("unban")}>Débloquer le compte</Btn>
      : <Btn kind="danger" onClick={() => setAsk("ban")}>Bloquer le compte</Btn>)}>
      {!data ? <p className="muted">Chargement…</p> : <>
        <div className="drawer-status"><Badge s={u.status} /><Badge tone="mut">{ROLE[u.role] || u.role}</Badge></div>
        <Rows items={[
          ["Téléphone", phone(u.phone)],
          ["E-mail", u.email ? <>{u.email}{u.email_verified_at ? <small className="block">vérifié</small> : null}</> : "—"],
          ["Commandes", num(data.orders_count)],
          data.establishments?.length > 0 && ["Commerces", data.establishments.map((e) => e.name).join(", ")],
          ["Dernière connexion", ago(u.last_login)],
          ["Inscrit le", dt(u.created_at, false)],
        ]} />
      </>}
      {ask === "ban" && <Confirm title="Bloquer ce compte ?" danger text="La personne ne pourra plus se connecter ni commander." confirm="Bloquer" busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("ban")} />}
      {ask === "unban" && <Confirm title="Débloquer ce compte ?" text="La personne pourra de nouveau se connecter." confirm="Débloquer" busy={busy} onCancel={() => setAsk(null)} onConfirm={() => act("unban")} />}
    </Drawer>
  );
}

export default function Users({ onChanged }) {
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const list = usePaged("/admin/users", "users", { role, search });
  return (
    <div className="page">
      <PageHead title="Utilisateurs" sub="Tous les comptes de l'application" />
      <Tabs value={role} onChange={setRole} items={[["", "Tous"], ["client", "Clients"], ["vendor", "Commerçants"], ["driver", "Livreurs"], ["admin", "Administrateurs"]]} />
      <Toolbar onSearch={setSearch} placeholder="Nom, téléphone ou e-mail" />
      <Table {...list} onRow={(u) => setOpen(u.id)} empty="Aucun utilisateur." cols={[
        { k: "name", label: "Nom", render: (u) => <div className="who"><span>{(u.first_name || "?")[0]}</span><div><b>{fullName(u.first_name, u.last_name)}</b><small className="block">{u.email || ""}</small></div></div> },
        { k: "phone", label: "Téléphone", render: (u) => phone(u.phone) },
        { k: "role", label: "Profil", render: (u) => <>{ROLE[u.role] || u.role}{[["driver_request", "livreur"], ["vendor_request", "commerçant"]].filter(([k]) => u[k]).map(([k, l]) => <small key={k} className="block muted">Demande {l} {u[k] === "pending" ? "en attente" : "refusée"}</small>)}</> },
        { k: "status", label: "Statut", render: (u) => <Badge s={u.status} /> },
        { k: "last_login", label: "Dernière connexion", render: (u) => ago(u.last_login) },
      ]} />
      <Pager {...list} />
      {open && <UserDrawer id={open} onClose={() => setOpen(null)} onChanged={() => { list.reload(); onChanged?.(); }} />}
    </div>
  );
}
