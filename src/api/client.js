/**
 * API Client — Lamuka Market
 * HTTP client avec gestion JWT automatique
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/lamuka-api/api/v1';

let _token = localStorage.getItem('lmk_token') || null;
let _onAuthExpired = null;

export const setToken = (token) => {
  _token = token;
  if (token) localStorage.setItem('lmk_token', token);
  else localStorage.removeItem('lmk_token');
};

export const getToken = () => _token;
export const isAuthenticated = () => !!_token;
export const onAuthExpired = (cb) => { _onAuthExpired = cb; };

async function request(method, path, body = null, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json', ...options.headers };
  if (_token && !options.noAuth) headers['Authorization'] = `Bearer ${_token}`;

  const config = { method, headers };
  if (body && method !== 'GET') config.body = JSON.stringify(body);

  try {
    const res = await fetch(url, config);
    const json = await res.json();
    if (!res.ok) {
      if (res.status === 401 && _token) { setToken(null); _onAuthExpired?.(); }
      const err = new Error(json.message || 'Erreur serveur');
      err.status = res.status; err.errors = json.errors;
      throw err;
    }
    return json.data !== undefined ? json.data : json;
  } catch (err) {
    if (err.status) throw err;
    const netErr = new Error('Connexion impossible. Vérifiez votre réseau.');
    netErr.status = 0;
    throw netErr;
  }
}

async function upload(path, formData) {
  const url = `${BASE_URL}${path}`;
  const headers = {};
  if (_token) headers['Authorization'] = `Bearer ${_token}`;
  const res = await fetch(url, { method: 'POST', headers, body: formData });
  const json = await res.json();
  if (!res.ok) { const e = new Error(json.message); e.status = res.status; throw e; }
  return json.data !== undefined ? json.data : json;
}

const api = {
  get: (path, opts) => request('GET', path, null, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),
  delete: (path, opts) => request('DELETE', path, null, opts),
  upload, setToken, getToken, isAuthenticated, onAuthExpired, BASE_URL,
};

export default api;
