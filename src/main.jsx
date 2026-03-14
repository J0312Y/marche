import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA fullscreen
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// Lock to fullscreen on user interaction (Android)
const goFullscreen = () => {
  const el = document.documentElement;
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  document.removeEventListener('click', goFullscreen);
};
// Only auto-fullscreen if running as installed PWA
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
  document.addEventListener('click', goFullscreen, { once: true });
}
