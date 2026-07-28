const CITA_STYLES = {
  PENDIENTE: { cls: "badge-warning", label: "Pendiente" },
  ATENDIDA: { cls: "badge-success", label: "Atendida" },
  CANCELADA: { cls: "badge-danger", label: "Cancelada" },
};

export function EstadoCitaBadge({ estado }) {
  const s = CITA_STYLES[estado] || { cls: "badge-neutral", label: estado };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export function ActivoBadge({ activo }) {
  return (
    <span className={`badge ${activo ? "badge-success" : "badge-neutral"}`}>
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}
