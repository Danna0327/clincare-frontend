import { Link } from "react-router-dom";
import { Users, Stethoscope, CalendarClock, CheckCircle2, CalendarPlus } from "lucide-react";
import { useResource } from "../hooks/useResource";
import { usePageTitle } from "../hooks/usePageTitle";
import { pacienteService } from "../api/pacienteService";
import { colaboradorService } from "../api/colaboradorService";
import { citaService } from "../api/citaService";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { Card, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { EstadoCitaBadge } from "../components/ui/Badge";
import { EmptyState, LoadingRow } from "../components/ui/Feedback";
import { formatFecha, formatHora } from "../utils/format";

export default function DashboardPage() {
  usePageTitle("Dashboard");
  const pacientes = useResource(pacienteService);
  const colaboradores = useResource(colaboradorService);
  const citas = useResource(citaService);

  const loading = pacientes.loading || colaboradores.loading || citas.loading;
  const error = pacientes.error || colaboradores.error || citas.error;

  const pendientes = citas.items.filter((c) => c.estado === "PENDIENTE").length;
  const atendidas = citas.items.filter((c) => c.estado === "ATENDIDA").length;

  const proximas = [...citas.items]
    .filter((c) => c.estado === "PENDIENTE")
    .sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Panel de control"
        subtitle="Resumen general del sistema de citas médicas."
        action={
          <Link to="/citas/nueva">
            <Button icon={CalendarPlus}>Nueva cita</Button>
          </Link>
        }
      />

      <Alert message={error} />

      <div className="stat-grid">
        <StatCard icon={Users} label="Pacientes registrados" value={pacientes.items.length} tone="primary" />
        <StatCard icon={Stethoscope} label="Colaboradores" value={colaboradores.items.length} tone="teal" />
        <StatCard icon={CalendarClock} label="Citas pendientes" value={pendientes} tone="amber" />
        <StatCard icon={CheckCircle2} label="Citas atendidas" value={atendidas} tone="green" />
      </div>

      <Card>
        <CardHeader
          title="Próximas citas pendientes"
          action={<Link to="/citas" style={{ fontSize: 13, fontWeight: 600, color: "var(--primary-600)" }}>Ver todas →</Link>}
        />
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Motivo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading && <LoadingRow colSpan={4} />}
              {!loading &&
                proximas.map((cita) => (
                  <tr key={cita.id}>
                    <td>{formatFecha(cita.fecha)}</td>
                    <td>{formatHora(cita.hora)}</td>
                    <td>{cita.motivo}</td>
                    <td>
                      <EstadoCitaBadge estado={cita.estado} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && proximas.length === 0 && (
            <EmptyState icon={CalendarClock} title="No hay citas pendientes" />
          )}
        </div>
      </Card>
    </div>
  );
}
