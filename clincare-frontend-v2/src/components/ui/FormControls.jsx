export function Field({ label, children, full = false }) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

export function Input(props) {
  return <input className="input" {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className="input" {...props}>
      {children}
    </select>
  );
}

export function Textarea(props) {
  return <textarea className="input" {...props} />;
}
