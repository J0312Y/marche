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
    primary: { background: "#6366F1", color: "#fff" },
    secondary: { background: "#F5F4F1", color: "#191815" },
    outline: { background: "transparent", color: "#6366F1", border: "2px solid #6366F1" },
    ghost: { background: "transparent", color: "#6366F1" },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export default Button;
