import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from "lucide-react";
import { useCitas } from "../hooks/useCitas";
import { useResource } from "../hooks/useResource";
import { usePageTitle } from "../hooks/usePageTitle";
import { pacienteService } from "../api/pacienteService";
import { colaboradorService } from "../api/colaboradorService";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import { Card, CardHeader } from "../components/ui/Card";
import { Field, Input, Select, Textarea } from "../components/ui/FormControls";
import { EstadoCitaBadge } from "../components/ui/Badge";
import { EmptyState, LoadingRow } from "../components/ui/Feedback";
import { formatFecha, formatHora, nombreCompleto } from "../utils/format";

export default function CitasPage() {
  usePageTitle("Citas");
  const toast = useToast();
  const {
    items: citas,
    loading,
    error,
    setError,
    actualizar,
    eliminar,
    cambiarEstado,
    buscarPorCedula,
    cedulaResultado,
    buscandoCedula,
    errorCedula,
    setErrorCedula,
  } = useCitas();

  const { items: pacientes } = useResource(pacienteService);
  const { items: colaboradores } = useResource(colaboradorService);

  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [cedulaBuscada, setCedulaBuscada] = useState("");

  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const pacientesPorId = useMemo(() => {
    const map = {};
    pacientes.forEach((p) => (map[p.id] = p));
    return map;
  }, [pacientes]);

  const medicosPorId = useMemo(() => {
    const map = {};
    colaboradores.forEach((c) => (map[c.id] = c));
    return map;
  }, [colaboradores]);

  const citasFiltradas = useMemo(() => {
    let lista = citas;
    if (filtroEstado !== "TODOS") lista = lista.filter((c) => c.estado === filtroEstado);
    return [...lista].sort((a, b) => `${b.fecha}${b.hora}`.localeCompare(`${a.fecha}${a.hora}`));
  }, [citas, filtroEstado]);

  async function handleCambiarEstado(cita, estado) {
    const msg = estado === "ATENDIDA" ? "¿Marcar esta cita como atendida?" : "¿Cancelar esta cita?";
    if (!window.confirm(msg)) return;
    try {
      await cambiarEstado(cita.id, estado);
      toast.success(`Cita actualizada a ${estado.toLowerCase()}.`);
    } catch (err) {
      setError(err.detail || "No se pudo actualizar el estado de la cita.");
    }
  }

  function abrirEditar(cita) {
    setEditando(cita.id);
    setForm({
      paciente_id: cita.paciente_id,
      medico_id: cita.medico_id,
      fecha: cita.fecha,
      hora: cita.hora,
      motivo: cita.motivo,
    });
    setFormError("");
  }

  async function guardarEdicion(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      await actualizar(editando, form);
      toast.success("Cita actualizada correctamente.");
      setEditando(null);
    } catch (err) {
      setFormError(err.detail || "No se pudo actualizar la cita.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(cita) {
    if (!window.confirm("¿Eliminar esta cita del sistema?")) return;
    try {
      await eliminar(cita.id);
      toast.success("Cita eliminada.");
    } catch (err) {
      setError(err.detail || "No se pudo eliminar la cita.");
    }
  }

  async function handleBuscarCedula(e) {
    e.preventDefault();
    if (!cedulaBuscada.trim()) return;
    try {
      await buscarPorCedula(cedulaBuscada.trim());
    } catch {
      /* el error ya queda reflejado en errorCedula */
    }
  }

  return (
    <div>
      <PageHeader
        title="Gestión de citas"
        subtitle="Agenda, estados y consulta de historial por cédula."
        action={
          <Link to="/citas/nueva">
            <Button icon={Plus}>Nueva cita</Button>
          </Link>
        }
      />

      <Alert message={error} onClose={() => setError("")} />

      <Card className="card-padded mb-16">
        <div className="flex-row" style={{ marginBottom: 10 }}>
          <Search size={17} style={{ color: "var(--primary-600)" }} />
          <strong style={{ fontSize: 14 }}>RF-10 · Consultar historial de citas por cédula</strong>
        </div>
        <form className="flex-row" onSubmit={handleBuscarCedula} style={{ maxWidth: 420 }}>
          <Input
            placeholder="Cédula del paciente"
            value={cedulaBuscada}
            onChange={(e) => setCedulaBuscada(e.target.value)}
            minLength={10}
            maxLength={10}
          />
          <Button type="submit" loading={buscandoCedula}>
            Buscar
          </Button>
        </form>
        {errorCedula && <Alert message={errorCedula} onClose={() => setErrorCedula("")} />}
        {cedulaResultado && (
          <div className="mt-16" style={{ fontSize: 14 }}>
            <p>
              <strong>{cedulaResultado.paciente_nombre}</strong> — {cedulaResultado.total_citas} cita(s)
              registradas
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              {cedulaResultado.citas.map((c) => (
                <li key={c.id} style={{ marginBottom: 6 }}>
                  {formatFecha(c.fecha)} {formatHora(c.hora)} — {c.medico_nombre} — {c.motivo}{" "}
                  <EstadoCitaBadge estado={c.estado} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader
          title={`Listado de citas (${citasFiltradas.length})`}
          action={
            <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={{ width: 200 }}>
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="ATENDIDA">Atendida</option>
              <option value="CANCELADA">Cancelada</option>
            </Select>
          }
        />

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <LoadingRow colSpan={7} />}
              {!loading &&
                citasFiltradas.map((cita) => (
                  <tr key={cita.id}>
                    <td>{formatFecha(cita.fecha)}</td>
                    <td>{formatHora(cita.hora)}</td>
                    <td>{pacientesPorId[cita.paciente_id] ? nombreCompleto(pacientesPorId[cita.paciente_id]) : `#${cita.paciente_id}`}</td>
                    <td>{medicosPorId[cita.medico_id] ? `Dr(a). ${nombreCompleto(medicosPorId[cita.medico_id])}` : `#${cita.medico_id}`}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <EstadoCitaBadge estado={cita.estado} />
                    </td>
                    <td>
                      <div className="row-actions">
                        {cita.estado === "PENDIENTE" && (
                          <>
                            <button
                              className="btn btn-ghost btn-icon"
                              title="Marcar atendida"
                              onClick={() => handleCambiarEstado(cita, "ATENDIDA")}
                              style={{ color: "var(--accent-green)" }}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              className="btn btn-ghost btn-icon"
                              title="Cancelar"
                              onClick={() => handleCambiarEstado(cita, "CANCELADA")}
                              style={{ color: "var(--accent-red)" }}
                            >
                              <XCircle size={16} />
                            </button>
                            <button className="btn btn-ghost btn-icon" onClick={() => abrirEditar(cita)}>
                              <Pencil size={16} />
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-danger-ghost btn-icon"
                          onClick={() => handleEliminar(cita)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && citasFiltradas.length === 0 && (
            <EmptyState icon={CalendarDays} title="No hay citas para este filtro" />
          )}
        </div>
        <div style={{ padding: "14px 22px", fontSize: 13, color: "var(--text-muted)" }}>
          Solo las citas Pendientes pueden marcarse como Atendida o Cancelada (RF-09). Los
          estados finales no pueden revertirse.
        </div>
      </Card>

      {editando && form && (
        <Modal title="Editar cita" onClose={() => setEditando(null)}>
          <Alert message={formError} onClose={() => setFormError("")} />
          <form className="form-grid" onSubmit={guardarEdicion}>
            <Field label="Paciente">
              <Select
                value={form.paciente_id}
                onChange={(e) => setForm({ ...form, paciente_id: Number(e.target.value) })}
              >
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {nombreCompleto(p)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Médico">
              <Select
                value={form.medico_id}
                onChange={(e) => setForm({ ...form, medico_id: Number(e.target.value) })}
              >
                {colaboradores
                  .filter((c) => c.rol === "MEDICO")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {nombreCompleto(c)}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Fecha">
              <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
            </Field>
            <Field label="Hora">
              <Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} required />
            </Field>
            <Field label="Motivo" full>
              <Textarea
                value={form.motivo}
                onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                minLength={5}
                required
              />
            </Field>
            <div className="full flex-row" style={{ marginTop: 6 }}>
              <Button type="submit" loading={saving}>
                Guardar cambios
              </Button>
              <Button type="button" variant="secondary" onClick={() => setEditando(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

