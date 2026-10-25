/**
 * Accès à l'API Lamuka (mêmes routes que l'application). Jeton administrateur en localStorage.
 * VITE_API_URL : adresse de l'API (par défaut le serveur local MAMP).
 */
const BASE = import.meta.env.VITE_API_URL || "http://localhost/lamuka-api/api/v1";
const KEY = "lmk_admin_token";

let onExpired = null;
export const setOnExpired = (fn) => { onExpired = fn; };
export const getToken = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch {} };

async function request(method, path, body) {
  const headers = { Accept: "application/json" };
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  let res;
  try { res = await fetch(BASE + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined }); }
  catch { throw Object.assign(new Error("Serveur injoignable. Vérifiez votre connexion."), { status: 0 }); }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && t && !path.startsWith("/auth/")) onExpired?.();
    throw Object.assign(new Error(json.message || "Erreur serveur"), { status: res.status, errors: json.errors });
  }
  return json.data !== undefined ? json.data : json;
}

const qs = (o = {}) => {
  const p = Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return p.length ? "?" + p.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&") : "";
};

/** Envoi d'un fichier (multipart) */
async function upload(path, field, file) {
  const fd = new FormData(); fd.append(field, file);
  const t = getToken();
  let res;
  try { res = await fetch(BASE + path, { method: "POST", headers: t ? { Authorization: `Bearer ${t}` } : {}, body: fd }); }
  catch { throw Object.assign(new Error("Serveur injoignable. Vérifiez votre connexion."), { status: 0 }); }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(json.message || "Envoi impossible"), { status: res.status });
  return json.data;
}

export const api = {
  upload,
  get: (p, q) => request("GET", p + qs(q)),
  post: (p, b = {}) => request("POST", p, b),
  put: (p, b = {}) => request("PUT", p, b),
  del: (p) => request("DELETE", p),
};
/** Lien signé d'un document de l'API (facture, reçu, relevé) : { path, k } */
export const docUrl = (d, view) => d ? `${BASE}/${d.path}?k=${d.k}${view ? "&view=1" : ""}` : null;
export default api;
