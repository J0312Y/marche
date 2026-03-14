/**
 * Global toast system — import and call from any component
 * Usage: import toast from '../../utils/toast';
 *        toast.success("Profil mis à jour ✅");
 *        toast.error("Erreur de connexion");
 *        toast.info("Chargement...");
 */

let _listener = null;

export function setToastListener(fn) {
  _listener = fn;
}

const toast = {
  success: (msg) => _listener?.(msg, 'success'),
  error: (msg) => _listener?.(msg, 'error'),
  info: (msg) => _listener?.(msg, 'info'),
  show: (msg, type = 'success') => _listener?.(msg, type),
};

export default toast;
