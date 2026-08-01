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

/**
 * Filas "esqueleto": placeholders animados mientras cargan datos de tabla.
 * Alternativa más visual al LoadingRow con spinner + texto.
 */
export function SkeletonRows({ columns, rows = 4 }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i}>
          {Array.from({ length: columns }, (_, j) => (
            <td key={j}>
              <div className="skeleton-bar" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
