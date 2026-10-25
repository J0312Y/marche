/**
 * Icônes de la barre du bas (style Toters) : contour gris au repos, pleine et verte quand l'onglet est actif.
 */
export default function NavIcon({ name, active, size = 24 }) {
  const c = active ? "var(--acc)" : "var(--t-sub)";
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home":
      return active
        ? <svg {...common} stroke="none"><path fill={c} d="M10.6 2.6a2.2 2.2 0 0 1 2.8 0l7 5.8c.5.4.8 1 .8 1.7V19a3 3 0 0 1-3 3h-2.7a1 1 0 0 1-1-1v-4.6a1.5 1.5 0 0 0-3 0V21a1 1 0 0 1-1 1H5.8a3 3 0 0 1-3-3v-8.9c0-.7.3-1.3.8-1.7z" /></svg>
        : <svg {...common}><path d="M3.8 10.1c0-.6.3-1.1.7-1.5l6.6-5.4a1.5 1.5 0 0 1 1.8 0l6.6 5.4c.4.4.7.9.7 1.5V19a2.2 2.2 0 0 1-2.2 2.2h-2.4v-4.8a2.6 2.6 0 0 0-5.2 0v4.8H6a2.2 2.2 0 0 1-2.2-2.2z" /></svg>;
    case "search":
      return <svg {...common} strokeWidth={active ? 2.6 : 1.8}><circle cx="11" cy="11" r="7" /><line x1="20.5" y1="20.5" x2="16" y2="16" /></svg>;
    case "bowtie": // Coursier
      return active
        ? <svg {...common} stroke="none"><path fill={c} d="M2 7.3c0-1.5 1.6-2.4 2.9-1.7l5 2.7h4.2l5-2.7c1.3-.7 2.9.2 2.9 1.7v9.4c0 1.5-1.6 2.4-2.9 1.7l-5-2.7H9.9l-5 2.7C3.6 19.1 2 18.2 2 16.7z" /><rect x="9.6" y="8.8" width="4.8" height="6.4" rx="1.6" fill="#fff" opacity=".35" /></svg>
        : <svg {...common}><path d="M3 7.6c0-1 1.1-1.7 2-1.2l5 2.7v5.8l-5 2.7c-.9.5-2-.2-2-1.2zM21 7.6c0-1-1.1-1.7-2-1.2l-5 2.7v5.8l5 2.7c.9.5 2-.2 2-1.2z" /><rect x="10" y="9" width="4" height="6" rx="1.2" /></svg>;
    case "orders":
      return active
        ? <svg {...common} stroke="none"><rect x="4" y="2.5" width="16" height="19" rx="3.5" fill={c} /><g stroke="#fff" strokeWidth="1.8" strokeLinecap="round"><line x1="9.5" y1="8" x2="16" y2="8" /><line x1="9.5" y1="12" x2="16" y2="12" /><line x1="9.5" y1="16" x2="16" y2="16" /></g><g fill="#fff"><circle cx="7.2" cy="8" r="1" /><circle cx="7.2" cy="12" r="1" /><circle cx="7.2" cy="16" r="1" /></g></svg>
        : <svg {...common}><rect x="4" y="2.8" width="16" height="18.4" rx="3.5" /><line x1="9.5" y1="8" x2="16" y2="8" /><line x1="9.5" y1="12" x2="16" y2="12" /><line x1="9.5" y1="16" x2="16" y2="16" /><circle cx="7.2" cy="8" r=".4" /><circle cx="7.2" cy="12" r=".4" /><circle cx="7.2" cy="16" r=".4" /></svg>;
    case "account":
      return active
        ? <svg {...common} stroke="none"><circle cx="12" cy="7.5" r="4.5" fill={c} /><path fill={c} d="M3.5 19.5c0-3.6 3.8-6 8.5-6s8.5 2.4 8.5 6c0 1.1-.9 2-2 2h-13c-1.1 0-2-.9-2-2z" /></svg>
        : <svg {...common}><circle cx="12" cy="7.5" r="4.2" /><path d="M4 19.6c0-3.4 3.6-5.6 8-5.6s8 2.2 8 5.6c0 .9-.7 1.6-1.6 1.6H5.6c-.9 0-1.6-.7-1.6-1.6z" /></svg>;
    default:
      return null;
  }
}
