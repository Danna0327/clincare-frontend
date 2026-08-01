import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

/**
 * Modal de confirmación reutilizable. Sustituye a window.confirm() con
 * algo visualmente consistente con el resto del sistema de diseño.
 */
export default function ConfirmDialog({ title = "¿Estás segura?", message, onConfirm, onCancel, danger = true }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="flex-row" style={{ alignItems: "flex-start", marginBottom: 20 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: danger ? "#fef3f2" : "var(--primary-50)",
            color: danger ? "var(--accent-red)" : "var(--primary-600)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={20} />
        </div>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0, paddingTop: 8 }}>
          {message}
        </p>
      </div>
      <div className="flex-row" style={{ justifyContent: "flex-end" }}>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          style={danger ? { background: "var(--accent-red)" } : undefined}
        >
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
