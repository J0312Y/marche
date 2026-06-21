import { useState } from "react";
import { D_HISTORY, D_STATS } from "../../data/driverData";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";

const SUBSCRIPTION_PRICE = 5000; // FCFA per month — driver subscription

const METHOD_INFO = {
  airtel: { label: "Airtel Money", color: "#EF4444", iconBg: "rgba(239,68,68,0.1)" },
  mtn:    { label: "MTN MoMo",     color: "#F59E0B", iconBg: "rgba(245,158,11,0.1)" },
};

const LAMUKA_MOMO = {
  airtel: "+242 06 666 06 06",
  mtn:    "+242 05 555 05 05",
};

const fmtNum = (n) => Math.round(n).toLocaleString("fr-FR").replace(/,/g, " ");
const fmtDate = (iso) => new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });

function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

// Mock subscription state
const SUBSCRIPTION_DATA = {
  status: "pending",          // "pending" | "active" | "expired"
  dueDate: "2026-07-05",
  monthLabel: "Juin 2026",
  pastPayments: [
    { id: "SUB-2026-05", month: "Mai 2026", amount: 5000, paidAt: "2026-06-03", status: "paid" },
    { id: "SUB-2026-04", month: "Avril 2026", amount: 5000, paidAt: "2026-05-04", status: "paid" },
    { id: "SUB-2026-03", month: "Mars 2026", amount: 5000, paidAt: "2026-04-02", status: "paid" },
  ],
};

function DrWalletScr({ go, onBack }) {
  const totalEarnings = D_HISTORY.reduce((s, h) => s + h.fee + h.tip, 0);
  const todayEarnings = Math.round(totalEarnings * 0.15);
  const weekEarnings = D_STATS?.week?.earned || Math.round(totalEarnings * 0.4);

  const [showPayModal, setShowPayModal] = useState(false);
  const [chosenOperator, setChosenOperator] = useState(null);
  const [refCode, setRefCode] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dueDays = daysUntil(SUBSCRIPTION_DATA.dueDate);
  const isOverdue = dueDays < 0;
  const isUrgent = dueDays <= 3 && dueDays >= 0;

  const handleProofUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez uploader une image");
      return;
    }
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProofPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = () => {
    if (!proofFile) { toast.error("Uploadez la capture du paiement"); return; }
    if (!refCode || refCode.length < 4) { toast.error("Renseignez le code de référence"); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setShowPayModal(false);
        setSubmitted(false);
        setProofFile(null);
        setProofPreview(null);
        setRefCode("");
        setChosenOperator(null);
        toast.success("Preuve envoyée — Vérification sous 24h");
      }, 1400);
    }, 1200);
  };

  const copyMomo = (num) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num.replace(/\s/g, ""));
      toast.success("Numéro copié");
    }
  };

  return (
    <div className="scr" style={{ background: "#F9FAFB", paddingBottom: 24 }}>

      {/* Header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff",
        borderBottom: "0.5px solid var(--border)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="arrow_left" size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, color: "var(--text)" }}>Mes gains & Abonnement</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{SUBSCRIPTION_DATA.monthLabel}</div>
        </div>
      </div>

      <div style={{ padding: 14 }}>

        {/* ═══ EARNINGS HERO CARD ═══ */}
        <div style={{
          background: "linear-gradient(135deg, #1F2937 0%, #111827 100%)",
          borderRadius: 18, padding: 18,
          color: "#fff", marginBottom: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "linear-gradient(135deg, rgba(249,115,22,0.18), transparent)" }}/>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: 11, opacity: 0.7, fontWeight: 500, letterSpacing: 0.5 }}>GAINS COLLECTÉS · {SUBSCRIPTION_DATA.monthLabel.toUpperCase()}</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 4, letterSpacing: -0.8 }}>
              {fmtNum(totalEarnings)} <span style={{ fontSize: 16, opacity: 0.7, fontWeight: 600 }}>FCFA</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="truck" size={11} color="#fff"/>
              {D_HISTORY.length} courses · cash en main
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
              <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 500 }}>AUJOURD'HUI</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{fmtNum(todayEarnings)} F</div>
              </div>
              <div style={{ padding: "8px 10px", background: "rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 500 }}>CETTE SEMAINE</div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{fmtNum(weekEarnings)} F</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SUBSCRIPTION DUE CARD ═══ */}
        <div style={{
          background: isOverdue ? "linear-gradient(135deg, #EF4444, #DC2626)"
                    : isUrgent ? "linear-gradient(135deg, #F59E0B, #D97706)"
                    : "linear-gradient(135deg, #F97316, #EA580C)",
          borderRadius: 16, padding: 14,
          color: "#fff", marginBottom: 14,
          boxShadow: `0 8px 22px ${isOverdue ? "rgba(239,68,68,0.3)" : "rgba(249,115,22,0.28)"}`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: "rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon name="badge" size={18} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2 }}>Abonnement livreur</div>
                {isOverdue && <span style={{ padding: "2px 7px", background: "rgba(0,0,0,0.25)", borderRadius: 5, fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>EN RETARD</span>}
                {isUrgent && !isOverdue && <span style={{ padding: "2px 7px", background: "rgba(255,255,255,0.25)", borderRadius: 5, fontSize: 9, fontWeight: 800, letterSpacing: 0.5 }}>BIENTÔT DÛ</span>}
              </div>
              <div style={{ fontSize: 11, opacity: 0.9, marginBottom: 8 }}>
                {isOverdue
                  ? `En retard depuis ${Math.abs(dueDays)} jour${Math.abs(dueDays) > 1 ? "s" : ""}`
                  : `À payer avant le ${fmtDate(SUBSCRIPTION_DATA.dueDate)} · dans ${dueDays} jour${dueDays > 1 ? "s" : ""}`}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{fmtNum(SUBSCRIPTION_PRICE)} <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>FCFA</span></div>
                <button onClick={() => setShowPayModal(true)} style={{
                  padding: "8px 14px", borderRadius: 10,
                  border: "none", background: "#fff",
                  color: isOverdue ? "#DC2626" : "#EA580C",
                  fontSize: 12, fontWeight: 800,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}>
                  <Icon name="check_circle" size={13} color={isOverdue ? "#DC2626" : "#EA580C"}/>
                  Payer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{
          background: "rgba(59,130,246,0.04)",
          border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: 12, padding: 12, marginBottom: 14,
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <Icon name="info" size={14} color="#3B82F6"/>
          <div style={{ fontSize: 11, color: "#1F2937", lineHeight: 1.5, flex: 1 }}>
            <b style={{ color: "#1D4ED8" }}>Vous gardez 100% du cash collecté</b> auprès des clients. Lamuka prend uniquement un abonnement mensuel de {fmtNum(SUBSCRIPTION_PRICE)} F pour vous garder actif sur la plateforme.
          </div>
        </div>

        {/* Recent deliveries */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 8 }}>DERNIÈRES COURSES</div>
        <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--border)", overflow: "hidden", marginBottom: 14 }}>
          {D_HISTORY.slice(0, 5).map((h, i) => (
            <div key={h.id} style={{
              padding: 12,
              borderBottom: i < 4 ? "0.5px solid var(--border)" : "none",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="truck" size={14} color="#10B981"/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", fontFamily: "monospace" }}>{h.ref}</div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{h.client} · {h.date}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#10B981", fontVariantNumeric: "tabular-nums" }}>
                +{fmtNum(h.fee + h.tip)} F
              </div>
            </div>
          ))}
        </div>

        {/* Past subscription payments */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 8 }}>HISTORIQUE ABONNEMENTS</div>
        <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--border)", overflow: "hidden" }}>
          {SUBSCRIPTION_DATA.pastPayments.map((p, i) => (
            <div key={p.id} style={{
              padding: 12,
              borderBottom: i < SUBSCRIPTION_DATA.pastPayments.length - 1 ? "0.5px solid var(--border)" : "none",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="check_circle" size={14} color="#10B981"/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>{p.month}</div>
                  <span style={{ padding: "1px 6px", background: "rgba(16,185,129,0.1)", color: "#047857", borderRadius: 4, fontSize: 9, fontWeight: 800, letterSpacing: 0.3 }}>PAYÉ</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                  Le {fmtDate(p.paidAt)}
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", fontVariantNumeric: "tabular-nums" }}>
                {fmtNum(p.amount)} F
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ SUBSCRIPTION PAYMENT MODAL ═══ */}
      {showPayModal && (
        <div onClick={() => !submitting && setShowPayModal(false)} style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          animation: "fadeInFast .2s ease",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 500,
            background: "var(--card)",
            borderRadius: "20px 20px 0 0",
            padding: "16px 18px 22px",
            animation: "slideUp .25s cubic-bezier(.4,0,.2,1)",
            maxHeight: "92%", overflowY: "auto",
            boxSizing: "border-box",
          }}>
            <style>{`@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>

            {submitted ? (
              <div style={{ padding: "30px 16px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg,#10B981,#059669)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
                  <Icon name="check" size={32} color="#fff"/>
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Preuve envoyée !</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>L'équipe Lamuka vérifiera sous 24h</div>
              </div>
            ) : (
              <>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "0 auto 14px" }}/>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#F97316,#EA580C)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10, boxShadow: "0 6px 20px rgba(249,115,22,0.25)" }}>
                    <Icon name="badge" size={24} color="#fff"/>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: -0.2 }}>Payer mon abonnement</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{SUBSCRIPTION_DATA.monthLabel}</div>
                </div>

                <div style={{
                  background: "linear-gradient(135deg, rgba(249,115,22,0.06), transparent)",
                  border: "1px solid rgba(249,115,22,0.2)",
                  borderRadius: 12, padding: 14, marginBottom: 14,
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 0.5, fontWeight: 600 }}>MONTANT À PAYER</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#EA580C", margin: "4px 0", letterSpacing: -0.5 }}>
                    {fmtNum(SUBSCRIPTION_PRICE)} <span style={{ fontSize: 14, opacity: 0.85 }}>FCFA</span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>
                    Abonnement mensuel livreur Lamuka
                  </div>
                </div>

                {/* Step 1: Choose operator */}
                {!chosenOperator && (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>
                      ÉTAPE 1 · CHOISISSEZ VOTRE OPÉRATEUR
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                      {["airtel", "mtn"].map(m => {
                        const info = METHOD_INFO[m];
                        return (
                          <button key={m} onClick={() => setChosenOperator(m)} style={{
                            padding: "14px 6px", borderRadius: 11,
                            border: "1px solid var(--border)", background: "var(--card)",
                            color: "var(--text)", fontSize: 11, fontWeight: 600,
                            cursor: "pointer", fontFamily: "inherit",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                          }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: info.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Icon name="coin" size={16} color={info.color}/>
                            </div>
                            {info.label}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {chosenOperator && (
                  <>
                    {/* MoMo number */}
                    <div style={{
                      padding: 12, borderRadius: 12,
                      background: METHOD_INFO[chosenOperator].iconBg,
                      border: `1px solid ${METHOD_INFO[chosenOperator].color}40`,
                      marginBottom: 14,
                    }}>
                      <div style={{ fontSize: 10, color: METHOD_INFO[chosenOperator].color, fontWeight: 700, letterSpacing: 0.5, marginBottom: 4 }}>
                        ÉTAPE 2 · ENVOYEZ À CE NUMÉRO LAMUKA
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: METHOD_INFO[chosenOperator].color, fontFamily: "monospace", marginBottom: 6, letterSpacing: -0.3 }}>
                        {LAMUKA_MOMO[chosenOperator]}
                      </div>
                      <button onClick={() => copyMomo(LAMUKA_MOMO[chosenOperator])} style={{
                        fontSize: 10, padding: "5px 10px",
                        border: `1px solid ${METHOD_INFO[chosenOperator].color}40`,
                        background: "var(--card)", borderRadius: 6,
                        color: METHOD_INFO[chosenOperator].color, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <Icon name="copy" size={10}/>Copier
                      </button>
                      <div style={{ fontSize: 10, color: "#4B5563", marginTop: 8, lineHeight: 1.5 }}>
                        Ouvrez <b>{METHOD_INFO[chosenOperator].label}</b>, envoyez <b>{fmtNum(SUBSCRIPTION_PRICE)} F</b> à ce numéro.
                      </div>
                    </div>

                    {/* Reference code */}
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>
                      ÉTAPE 3 · CODE DE RÉFÉRENCE
                    </div>
                    <input
                      type="text"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value.toUpperCase().slice(0, 16))}
                      placeholder="Ex: TXN98765432"
                      style={{
                        width: "100%", padding: "10px 12px",
                        borderRadius: 10,
                        border: "1.5px solid var(--border)",
                        background: "var(--light)",
                        fontSize: 13, fontWeight: 600,
                        fontFamily: "monospace",
                        color: "var(--text)",
                        outline: "none", boxSizing: "border-box",
                        marginBottom: 14,
                      }}
                    />

                    {/* Screenshot upload */}
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>
                      ÉTAPE 4 · CAPTURE DE CONFIRMATION
                    </div>
                    <label style={{
                      display: "block",
                      padding: proofPreview ? 6 : 18,
                      borderRadius: 12,
                      border: `1.5px dashed ${proofPreview ? "#10B981" : "var(--border)"}`,
                      background: proofPreview ? "rgba(16,185,129,0.04)" : "var(--light)",
                      cursor: "pointer",
                      textAlign: "center",
                      marginBottom: 14,
                    }}>
                      <input type="file" accept="image/*" onChange={handleProofUpload} style={{ display: "none" }}/>
                      {proofPreview ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <img src={proofPreview} alt="preuve" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}/>
                          <div style={{ textAlign: "left", flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#047857", display: "flex", alignItems: "center", gap: 4 }}>
                              <Icon name="check_circle" size={12} color="#10B981"/>Capture chargée
                            </div>
                            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>Cliquez pour changer</div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Icon name="camera" size={22} color="var(--muted)"/>
                          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginTop: 6 }}>
                            Uploadez la capture du SMS / écran de confirmation
                          </div>
                        </>
                      )}
                    </label>

                    <div style={{
                      padding: "9px 11px", borderRadius: 9,
                      background: "rgba(59,130,246,0.05)",
                      border: "1px solid rgba(59,130,246,0.15)",
                      marginBottom: 14,
                      display: "flex", alignItems: "flex-start", gap: 7,
                    }}>
                      <Icon name="info" size={12} color="#3B82F6"/>
                      <div style={{ fontSize: 10, color: "#1D4ED8", lineHeight: 1.5 }}>
                        Lamuka vérifiera sous <b>24h</b>. Vous serez notifié une fois validé.
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => {
                    if (chosenOperator) {
                      setChosenOperator(null);
                      setProofFile(null);
                      setProofPreview(null);
                      setRefCode("");
                    } else {
                      setShowPayModal(false);
                    }
                  }} disabled={submitting} style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    border: "1px solid var(--border)", background: "var(--card)",
                    color: "var(--text)", fontSize: 12, fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit", opacity: submitting ? 0.5 : 1,
                  }}>{chosenOperator ? "Retour" : "Annuler"}</button>
                  {chosenOperator && (
                    <button
                      onClick={handleSubmitProof}
                      disabled={submitting || !proofFile || !refCode}
                      style={{
                        flex: 1.6, padding: "12px 0", borderRadius: 12, border: "none",
                        background: (!proofFile || !refCode || submitting) ? "#E5E7EB" : "linear-gradient(135deg,#F97316,#EA580C)",
                        color: (!proofFile || !refCode || submitting) ? "var(--muted)" : "#fff",
                        fontSize: 12, fontWeight: 700,
                        cursor: (!proofFile || !refCode || submitting) ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        boxShadow: (!proofFile || !refCode || submitting) ? "none" : "0 4px 14px rgba(249,115,22,0.25)",
                      }}
                    >
                      {submitting ? <><div className="spinner" style={{ width: 13, height: 13 }}/>Envoi...</> : <>Soumettre</>}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DrWalletScr;
