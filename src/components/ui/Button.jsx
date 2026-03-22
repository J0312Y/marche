/**
 * Button - Bouton réutilisable
 * @param {string} variant - "primary" | "secondary" | "outline" | "ghost"
 * @param {boolean} full - Pleine largeur
 * @param {boolean} disabled
 * @param {function} onClick
 * @param {React.ReactNode} children
 */
function Button({ variant = "primary", full = false, disabled = false, onClick, children, style = {} }) {
  const base = {
    padding: "14px 24px", borderRadius: 14, border: "none", fontSize: 15,
    fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", transition: "all .2s",
    width: full ? "100%" : "auto", textAlign: "center",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: "#F97316", color: "#fff" },
    secondary: { background: "var(--light)", color: "var(--text)" },
    outline: { background: "transparent", color: "#F97316", border: "2px solid #F97316" },
    ghost: { background: "transparent", color: "#F97316" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export default Button;
