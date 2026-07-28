import { AlertCircle, CheckCircle2, X } from "lucide-react";

export default function Alert({ type = "error", message, onClose }) {
  if (!message) return null;
  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className={`alert alert-${type}`}>
      <span className="flex-row">
        <Icon size={17} />
        {message}
      </span>
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Cerrar">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
