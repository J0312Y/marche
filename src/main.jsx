import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from "./components/ErrorBoundary";
import App from './App';
import Icon from "./components/Icon";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>
);

// Démarrage : après le premier affichage de l'application, on rend le fond normal à la page
// et on prévient Android de retirer l'écran de lancement natif (MainActivity → LamukaBoot)
requestAnimationFrame(() => setTimeout(() => {
  document.body.style.background = "";
  try { window.LamukaBoot?.ready(); } catch { /* navigateur : rien à prévenir */ }
}, 0));
