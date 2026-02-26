/**
 * Toast — Notification feedback API
 * Usage: Toast.success('Article ajouté !'), Toast.error('Erreur réseau')
 */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);

const STYLES = {
  container: {
    position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
    pointerEvents: 'none', width: '90%', maxWidth: 360,
  },
  toast: (type) => ({
    padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8,
    fontSize: 13, fontWeight: 600, pointerEvents: 'auto', animation: 'slideDown .3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,.15)',
    background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1',
    color: '#fff',
  }),
};

const ICONS = { success: '✅', error: '❌', info: 'ℹ️' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={STYLES.container}>
        {toasts.map(t => (
          <div key={t.id} style={STYLES.toast(t.type)}>
            <span>{ICONS[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
