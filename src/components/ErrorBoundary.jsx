import { Component } from "react";

/**
 * ErrorBoundary — catches React rendering errors and shows a friendly fallback
 * Prevents the whole app from crashing on a single component error
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error caught by boundary:", error, errorInfo);
    // In production, you'd send this to Sentry/Crashlytics
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24, background: "var(--bg, #F9FAFB)",
        }}>
          <div style={{
            maxWidth: 360, textAlign: "center",
            background: "var(--card, #fff)", padding: 32, borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: "rgba(239,68,68,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px",
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: "var(--text, #1F2937)", letterSpacing: -0.3 }}>
              Oops, une erreur est survenue
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted, #6B7280)", lineHeight: 1.5, marginBottom: 24 }}>
              L'application a rencontré un problème inattendu. Essayez de rafraîchir ou de revenir à l'accueil.
            </p>

            {this.state.error?.message && (
              <details style={{
                marginBottom: 20, textAlign: "left",
                padding: 10, borderRadius: 8,
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
                fontSize: 11, color: "#991B1B",
              }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>Détails techniques</summary>
                <pre style={{ marginTop: 8, fontSize: 10, overflow: "auto", maxHeight: 80, fontFamily: "monospace" }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={this.handleReset} style={{
                flex: 1, padding: "11px 0", borderRadius: 12,
                border: "1px solid var(--border, #E5E7EB)",
                background: "var(--card, #fff)",
                color: "var(--text, #1F2937)",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}>Réessayer</button>
              <button onClick={this.handleReload} style={{
                flex: 1, padding: "11px 0", borderRadius: 12, border: "none",
                background: "#F97316", color: "#fff",
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit",
              }}>Rafraîchir</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
