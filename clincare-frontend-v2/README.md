# ClinCare · Frontend

Frontend en **React + Vite** para el Sistema de Gestión de Citas Médicas **ClinCare**, consumiendo el backend FastAPI de la Tarea 02.03. Identidad visual inspirada en el prototipo de diseño del proyecto (paleta azul/celeste, tarjetas redondeadas, badges de estado).

## Arquitectura (capas con responsabilidad única)

```
src/
├── api/            # Acceso a datos. Un servicio por recurso, construido
│                    # sobre una fábrica CRUD genérica (Open/Closed).
│   ├── axiosClient.js        cliente HTTP centralizado (interceptores)
│   ├── createCrudService.js  fábrica: listar/crear/actualizar/eliminar
│   ├── authService.js        login
│   ├── pacienteService.js    CRUD de pacientes
│   ├── colaboradorService.js CRUD de colaboradores
│   └── citaService.js        CRUD de citas + cambiarEstado + consultarPorCedula
│
├── hooks/          # Lógica de estado, independiente de la UI.
│   ├── useResource.jsx  hook genérico (loading/error/list/CRUD) que
│   │                    consume cualquier servicio con el contrato CRUD
│   └── useCitas.js      compone useResource + operaciones propias de citas
│
├── context/        # Estado de sesión (AuthProvider / useAuth)
│
├── components/
│   ├── ui/          # Sistema de diseño: Button, Card, Badge, Modal,
│   │                # FormControls, Alert, Avatar, StatCard, Feedback
│   └── layout/      # Sidebar, Topbar, AppLayout, ProtectedRoute
│
├── pages/           # Login, Dashboard, Pacientes, Colaboradores, Citas, NuevaCita
│                    # Cada página solo compone hooks + componentes UI;
│                    # no conoce axios ni las rutas de la API directamente.
│
├── utils/           # Formateo de fecha/hora/nombres (sin lógica de negocio)
└── styles/          # Tokens de diseño (global.css) + estilos de componentes
```

### Cómo se aplican los principios SOLID aquí

- **S — Responsabilidad única**: cada archivo hace una sola cosa (un servicio,
  un hook, un componente visual). Las páginas no hacen fetch directo; delegan
  en los hooks.
- **O — Abierto/Cerrado**: `createCrudService` define el contrato común; cada
  recurso lo extiende (`citaService` agrega `cambiarEstado`/`consultarPorCedula`)
  sin modificar la fábrica ni los demás servicios.
- **L — Sustitución de Liskov**: cualquier servicio creado con la fábrica CRUD
  puede pasarse a `useResource` indistintamente — todos cumplen el mismo contrato.
- **I — Segregación de interfaces**: en vez de un hook "god object", hay hooks
  pequeños y específicos (`useResource`, `useCitas`, `useAuth`).
- **D — Inversión de dependencias**: las páginas dependen de abstracciones
  (hooks), no de implementaciones concretas (axios). Si cambiara el origen de
  datos, solo cambiaría la capa `api/`.

## Módulos funcionales

| Pantalla | Endpoints consumidos |
| --- | --- |
| Login | `POST /auth/login` |
| Dashboard | `GET /pacientes`, `/colaboradores`, `/citas` |
| Pacientes | `GET/POST/PUT/DELETE /pacientes` |
| Colaboradores | `GET/POST/PUT/DELETE /colaboradores` |
| Citas | CRUD de `/citas`, `PATCH /citas/{id}/estado` (RF-09), `GET /citas/paciente/{cedula}` (RF-10) |
| Nueva cita | `GET /pacientes`, `/colaboradores`, `POST /citas` |

## Instalación y ejecución

```bash
npm install
cp .env.example .env   # ajusta VITE_API_URL si el backend no está en localhost:8000
npm run dev
```

```bash
npm run build
npm run preview
```

## Variables de entorno

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `VITE_API_URL` | URL base del backend (incluye `/api/v1`) | `http://127.0.0.1:8000/api/v1` |

## Stack

React 18 · Vite · React Router DOM · Axios · lucide-react (iconos) · CSS con variables de diseño (sin frameworks de UI de terceros).
