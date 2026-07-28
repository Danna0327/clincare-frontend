import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Paginación simple y reutilizable. Recibe la página actual, el total
 * de páginas y un callback — no conoce de dónde vienen los datos
 * (se puede usar en cualquier tabla del sistema).
 */
export default function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex-between" style={{ padding: "14px 22px" }}>
      <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Mostrando {start}-{end} de {totalItems}
      </span>
      <div className="flex-row">
        <button
          className="btn btn-secondary btn-icon btn-sm"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            className={`btn btn-sm ${n === page ? "btn-primary" : "btn-secondary"}`}
            style={{ minWidth: 34, padding: "7px 0" }}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
        <button
          className="btn btn-secondary btn-icon btn-sm"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
