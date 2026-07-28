import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { useResource } from "../hooks/useResource";
import { citaService } from "../api/citaService";
import { pacienteService } from "../api/pacienteService";
import { colaboradorService } from "../api/colaboradorService";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { Card, CardHeader } from "../components/ui/Card";
import { Field, Input, Select, Textarea } from "../components/ui/FormControls";
import { nombreCompleto } from "../utils/format";

export default function NuevaCitaPage() {
  const navigate = useNavigate();
  const { items: pacientesAll, loading: loadingP } = useResource(pacienteService);
  const { items: colaboradoresAll, loading: loadingC } = useResource(colaboradorService);

  const pacientes = pacientesAll.filter((p) => p.activo);
  const medicos = colaboradoresAll.filter((c) => c.rol === "MEDICO" && c.activo);
  const loadingOpciones = loadingP || loadingC;

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    paciente_id: "",
    medico_id: "",
    fecha: "",
    hora: "",
    motivo: "",
  });

  const pacienteSeleccionado = pacientes.find((p) => String(p.id) === String(form.paciente_id));
  const medicoSeleccionado = medicos.find((m) => String(m.id) === String(form.medico_id));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.paciente_id || !form.medico_id) {
      setError("Selecciona un paciente y un médico.");
      return;
    }

    setSaving(true);
    try {
      await citaService.crear({
        paciente_id: Number(form.paciente_id),
        medico_id: Number(form.medico_id),
        fecha: form.fecha,
        hora: form.hora,
        motivo: form.motivo,
        estado: "PENDIENTE",
      });
      navigate("/citas");
    } catch (err) {
      setError(err.detail || "No se pudo crear la cita.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader title="Crear nueva cita médica" subtitle="Completa los detalles para programar una atención." />

      <div className="split-layout">
        <Card className="card-padded">
          <div className="flex-row mb-16">
            <CalendarPlus size={18} style={{ color: "var(--primary-600)" }} />
            <strong style={{ fontSize: 15 }}>Información de la cita</strong>
          </div>

          <Alert message={error} onClose={() => setError("")} />

          {loadingOpciones ? (
            <p className="text-muted">Cargando pacientes y médicos...</p>
          ) : (
            <form className="form-grid" onSubmit={handleSubmit}>
              <Field label="Paciente" full>
                <Select
                  value={form.paciente_id}
                  onChange={(e) => setForm({ ...form, paciente_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {nombreCompleto(p)} — {p.cedula}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Médico">
                <Select
                  value={form.medico_id}
                  onChange={(e) => setForm({ ...form, medico_id: e.target.value })}
                  required
                >
                  <option value="">Seleccione un médico</option>
                  {medicos.map((m) => (
                    <option key={m.id} value={m.id}>
                      Dr(a). {nombreCompleto(m)}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Especialidad">
                <Input value={medicoSeleccionado?.especialidad || ""} readOnly placeholder="Se completa al elegir un médico" />
              </Field>

              <Field label="Fecha">
                <Input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
              </Field>

              <Field label="Hora">
                <Input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} required />
              </Field>

              <Field label="Motivo de la cita" full>
                <Textarea
                  placeholder="Describe el motivo de la consulta..."
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  minLength={5}
                  required
                />
              </Field>

              <div className="full flex-row" style={{ marginTop: 6 }}>
                <Button type="submit" loading={saving}>
                  Guardar cita
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate("/citas")}>
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="card-padded">
          <CardHeader title="Resumen de cita" />
          <div style={{ padding: "16px 0", fontSize: 14, lineHeight: 1.9 }}>
            <div>
              <span className="text-muted">Paciente: </span>
              <strong>{pacienteSeleccionado ? nombreCompleto(pacienteSeleccionado) : "Sin seleccionar"}</strong>
            </div>
            <div>
              <span className="text-muted">Médico: </span>
              <strong>{medicoSeleccionado ? `Dr(a). ${nombreCompleto(medicoSeleccionado)}` : "Sin asignar"}</strong>
            </div>
            <div>
              <span className="text-muted">Horario: </span>
              <strong>{form.fecha && form.hora ? `${form.fecha} ${form.hora}` : "--/--/---- --:--"}</strong>
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: "var(--radius-md)",
              background: "var(--primary-50)",
              fontSize: 13,
              color: "var(--primary-700)",
              fontWeight: 600,
            }}
          >
            Toda cita nueva inicia en estado PENDIENTE (RF-09).
          </div>
        </Card>
      </div>
    </div>
  );
}
