import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { useResource } from "../hooks/useResource";
import { usePagination } from "../hooks/usePagination";
import { usePageTitle } from "../hooks/usePageTitle";
import { pacienteService } from "../api/pacienteService";
import { useToast } from "../context/ToastContext";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/FormControls";
import { ActivoBadge } from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Pagination from "../components/ui/Pagination";
import { EmptyState, LoadingRow } from "../components/ui/Feedback";
import { nombreCompleto } from "../utils/format";

const EMPTY_FORM = {
  cedula: "",
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  direccion: "",
  fecha_nacimiento: "",
  activo: true,
};

export default function PacientesPage() {
  usePageTitle("Pacientes");
  const toast = useToast();
  const { items, loading, error, setError, crear, actualizar, eliminar } =
    useResource(pacienteService);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const filtrados = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (p) => nombreCompleto(p).toLowerCase().includes(q) || p.cedula.toLowerCase().includes(q)
    );
  }, [items, search]);

  const { page, setPage, totalPages, pageItems, totalItems, pageSize } = usePagination(filtrados, 8);

  function abrirCrear() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function abrirEditar(p) {
    setEditingId(p.id);
    setForm({
      cedula: p.cedula,
      nombres: p.nombres,
      apellidos: p.apellidos,
      correo: p.correo,
      telefono: p.telefono,
      direccion: p.direccion || "",
      fecha_nacimiento: p.fecha_nacimiento || "",
      activo: p.activo,
    });
    setFormError("");
    setModalOpen(true);
  }

  async function guardar(e) {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      if (editingId) {
        const { cedula, ...payload } = form;
        await actualizar(editingId, payload);
        toast.success("Paciente actualizado correctamente.");
      } else {
        await crear(form);
        toast.success("Paciente registrado correctamente.");
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.detail || "No se pudo guardar el paciente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEliminar(p) {
    if (!window.confirm(`¿Eliminar a ${nombreCompleto(p)}?`)) return;
    try {
      await eliminar(p.id);
      toast.success("Paciente eliminado.");
    } catch (err) {
      setError(err.detail || "No se pudo eliminar el paciente.");
    }
  }

  return (
    <div>
      <PageHeader
        title="Gestión de pacientes"
        subtitle="Registro y administración de la información de los pacientes."
        action={
          <Button icon={Plus} onClick={abrirCrear}>
            Nuevo paciente
          </Button>
        }
      />

      <Alert message={error} onClose={() => setError("")} />

      <Card>
        <div className="card-header">
          <h2>Listado general ({filtrados.length})</h2>
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
                <th>Paciente</th>
                <th>Cédula</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && <LoadingRow colSpan={6} />}
              {!loading &&
                pageItems.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex-row">
                        <Avatar name={nombreCompleto(p)} />
                        <strong>{nombreCompleto(p)}</strong>
                      </div>
                    </td>
                    <td>{p.cedula}</td>
                    <td>{p.telefono}</td>
                    <td>{p.correo}</td>
                    <td>
                      <ActivoBadge activo={p.activo} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-icon" onClick={() => abrirEditar(p)}>
                          <Pencil size={16} />
                        </button>
                        <button
                          className="btn btn-danger-ghost btn-icon"
                          onClick={() => handleEliminar(p)}
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
            <EmptyState icon={Users} title="No se encontraron pacientes" />
          )}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={totalItems}
          pageSize={pageSize}
        />
      </Card>

      {modalOpen && (
        <Modal title={editingId ? "Editar paciente" : "Nuevo paciente"} onClose={() => setModalOpen(false)}>
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
            <Field label="Teléfono">
              <Input
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                required
              />
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
            <Field label="Correo" full>
              <Input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                required
              />
            </Field>
            <Field label="Fecha de nacimiento">
              <Input
                type="date"
                value={form.fecha_nacimiento || ""}
                onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
              />
            </Field>
            <Field label="Estado">
              <Select
                value={form.activo ? "activo" : "inactivo"}
                onChange={(e) => setForm({ ...form, activo: e.target.value === "activo" })}
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </Select>
            </Field>
            <Field label="Dirección" full>
              <Input
                value={form.direccion || ""}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
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

