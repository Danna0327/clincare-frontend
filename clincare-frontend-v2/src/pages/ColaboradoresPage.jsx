import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Stethoscope } from "lucide-react";
import { useResource } from "../hooks/useResource";
import { colaboradorService } from "../api/colaboradorService";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/FormControls";
import { ActivoBadge } from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import { EmptyState, LoadingRow } from "../components/ui/Feedback";
import { nombreCompleto } from "../utils/format";

const EMPTY_FORM = {
  cedula: "",
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  rol: "MEDICO",
  especialidad: "",
  activo: true,
};

export default function ColaboradoresPage() {
  const { items, loading, error, setError, crear, actualizar, eliminar } =
    useResource(colaboradorService);

  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) => nombreCompleto(c).toLowerCase().includes(q) || c.cedula.toLowerCase().includes(q)
    );
  }, [items, search]);

  function abrirCrear() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function abrirEditar(c) {
    setEditingId(c.id);
    setForm({
      cedula: c.cedula,
      nombres: c.nombres,
      apellidos: c.apellidos,
      correo: c.correo,
      telefono: c.telefono || "",
      rol: c.rol,
      especialidad: c.especialidad || "",
      activo: c.activo,
    });
    setFormError("");
    setModalOpen(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.rol !== "MEDICO") payload.especialidad = null;

      if (editingId) {
        const { cedula, ...rest } = payload;
        await actualizar(editingId, rest);
        setSuccess("Colaborador actualizado correctamente.");
      } else {
        await crear(payload);
        setSuccess("Colaborador registrado correctamente.");
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.detail || "No se pudo guardar el colaborador.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(c) {
    if (!window.confirm(`¿Eliminar a ${nombreCompleto(c)}?`)) return;
    try {
      await eliminar(c.id);
      setSuccess("Colaborador eliminado.");
    } catch (err) {
      setError(err.detail || "No se pudo eliminar el colaborador.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Gestión de colaboradores"
        subtitle="Administra el personal médico y administrativo."
        action={
          <Button icon={Plus} onClick={abrirCrear}>
            Nuevo colaborador
          </Button>
        }
      />

      <Alert message={error} onClose={() => setError("")} />
      <Alert type="success" message={success} onClose={() => setSuccess("")} />

      <Card>
        <div className="card-header">
          <h2>Directorio ({filtrados.length})</h2>
          <div className="input-with-icon" style={{ width: 260 }}>
            <Search size={16} />
            <Input
              placeholder="Buscar por nombre o cédula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Rol</th>
                <th>Especialidad</th>
                <th>Correo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <LoadingRow colSpan={6} />}
              {!loading &&
                filtrados.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex-row">
                        <Avatar name={nombreCompleto(c)} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{nombreCompleto(c)}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.cedula}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.rol === "MEDICO" ? "badge-info" : "badge-neutral"}`}>
                        {c.rol === "MEDICO" ? "Médico" : "Administrativo"}
                      </span>
                    </td>
                    <td>{c.especialidad || "—"}</td>
                    <td>{c.correo}</td>
                    <td>
                      <ActivoBadge activo={c.activo} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-icon" onClick={() => abrirEditar(c)}>
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-danger-ghost btn-icon"
                          onClick={() => handleEliminar(c)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && filtrados.length === 0 && (
            <EmptyState icon={Stethoscope} title="No se encontraron colaboradores" />
          )}
        </div>
      </Card>

      {modalOpen && (
        <Modal
          title={editingId ? "Editar colaborador" : "Nuevo colaborador"}
          onClose={() => setModalOpen(false)}
        >
          <Alert message={formError} onClose={() => setFormError("")} />
          <form className="form-grid" onSubmit={guardar}>
            <Field label="Cédula">
              <Input
                value={form.cedula}
                onChange={(e) => setForm({ ...form, cedula: e.target.value })}
                minLength={10}
                maxLength={10}
                required
                disabled={!!editingId}
              />
            </Field>
            <Field label="Rol">
              <Select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}>
                <option value="MEDICO">Médico</option>
                <option value="ADMINISTRATIVO">Administrativo</option>
              </Select>
            </Field>
            <Field label="Nombres">
              <Input
                value={form.nombres}
                onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                required
              />
            </Field>
            <Field label="Apellidos">
              <Input
                value={form.apellidos}
                onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                required
              />
            </Field>
            <Field label="Correo">
              <Input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
              />
            </Field>
            <Field label="Teléfono">
              <Input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </Field>
            {form.rol === "MEDICO" && (
              <Field label="Especialidad">
                <Input
                  value={form.especialidad || ""}
                  onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                  placeholder="Ej. Cardiología"
                />
              </Field>
            )}
            <Field label="Estado">
              <Select
                value={form.activo ? "activo" : "inactivo"}
                onChange={(e) => setForm({ ...form, activo: e.target.value === "activo" })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Select>
            </Field>

            <div className="full flex-row" style={{ marginTop: 6 }}>
              <Button type="submit" loading={saving}>
                Guardar
              </Button>
              <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
