/**
 * Field - Champ de formulaire avec label
 * @param {string} label - Label du champ
 * @param {string} type - "text" | "tel" | "email" | "password" | "textarea"
 * @param {string} value
 * @param {function} onChange
 * @param {string} placeholder
 * @param {string} defaultValue
 */
function Field({ label, type = "text", value, onChange, placeholder, defaultValue }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={3}
          style={{ resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          defaultValue={defaultValue}
        />
      )}
    </div>
  );
}

export default Field;
