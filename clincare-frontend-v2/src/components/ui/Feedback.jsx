export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={32} style={{ marginBottom: 10, opacity: 0.5 }} />}
      <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{title}</div>
      {description && <div style={{ fontSize: 13, marginTop: 4 }}>{description}</div>}
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}

export function LoadingRow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="flex-row" style={{ padding: "20px 0", color: "var(--text-muted)" }}>
          <Spinner />
          Cargando...
        </div>
      </td>
    </tr>
  );
}
