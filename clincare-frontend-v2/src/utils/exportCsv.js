/**
 * Genera y descarga un archivo CSV a partir de una lista de objetos.
 * No sabe nada de pacientes/colaboradores/citas — solo transforma
 * datos tabulares en un archivo descargable (responsabilidad única).
 *
 * @param {string} filename - nombre del archivo, ej. "pacientes.csv"
 * @param {string[]} headers - encabezados de columna
 * @param {Array<Array<string|number>>} rows - filas de datos, mismo orden que headers
 */
export function exportToCsv(filename, headers, rows) {
  const escape = (value) => {
    const text = String(value ?? "");
    if (text.includes(",") || text.includes('"') || text.includes("\n")) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
  const csvContent = "\uFEFF" + lines.join("\n"); // BOM para acentos en Excel

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
