import { useData } from "../../hooks";
import Icon from "../../components/Icon";

function CategoriesScr({ go, onBack }) {
  const { CATS } = useData();
  return (
    <div className="scr">
      <div className="appbar">
        <button onClick={onBack}><Icon name="arrow_left" size={20}/></button>
        <h2>Catégories</h2>
        <div style={{ width: 38 }} />
      </div>
      <div style={{ padding: "0 16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {CATS.map(c => (
          <div key={c.id} onClick={() => { go("search") }} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", cursor: "pointer", aspectRatio: "1" }}>
            <div style={{ width: "100%", height: "70%", background: "var(--light)", position: "relative", overflow: "hidden" }}>
              {c.photo ? <img src={c.photo} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
            </div>
            <div style={{ padding: "8px 10px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{c.count} produits</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesScr;
