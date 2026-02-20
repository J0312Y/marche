/**
 * PhoneFrame - Cadre iPhone 16 Pro avec boutons titane et home indicator
 */
function PhoneFrame({ children }) {
  return (
    <div style={{ position: "relative", borderRadius: 61 }}>
      <div style={{ position: "absolute", inset: -2, borderRadius: 61, background: "linear-gradient(180deg,#8a8985 0%,#6b6966 20%,#4a4845 50%,#6b6966 80%,#8a8985 100%)", boxShadow: "0 50px 100px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.08) inset", zIndex: -1 }} />
      <div style={{ position: "absolute", left: -3, top: 130, width: 4, height: 28, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: -3, top: 178, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", left: -3, top: 226, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", right: -3, top: 195, width: 4, height: 72, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "0 3px 3px 0", boxShadow: "1px 0 2px rgba(0,0,0,.3)" }} />
      <div className="phone">
        {children}
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", paddingBottom: 8, paddingTop: 4 }}>
          <div style={{ width: 134, height: 5, borderRadius: 100, background: "#191815", opacity: .2 }} />
        </div>
      </div>
    </div>
  );
}

export default PhoneFrame;
