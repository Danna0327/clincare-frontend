export function formatFecha(fecha) {
  if (!fecha) return "";
  try {
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
  } catch {
    return fecha;
  }
}

export function formatHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

export function nombreCompleto(persona) {
  if (!persona) return "";
  return `${persona.nombres} ${persona.apellidos}`;
}
