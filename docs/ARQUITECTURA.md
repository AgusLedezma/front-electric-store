# Arquitectura del Sistema: Hexagonal y Despliegue Basado en Servicios

Este documento describe la arquitectura aplicada al módulo de Usuarios del sistema “SICME ELECTRIK” y cómo encaja con el estilo de estructuración interna (Hexagonal / Ports & Adapters) y el estilo de despliegue basado en servicios indicado por el tutor.

La implementación aquí documentada mantiene el funcionamiento actual del frontend (no rompe nada), a la vez que mapea cada parte a su rol dentro de la arquitectura objetivo.

---

## 1) Estilo de estructuración interna: Arquitectura Hexagonal (Ports & Adapters)

La arquitectura hexagonal separa la lógica del negocio y los casos de uso (núcleo) de los detalles de infraestructura (HTTP, almacenamiento, UI). El núcleo define los puertos (interfaces) que los adaptadores implementan.

En este repositorio, la adaptación se realiza a nivel de módulo de frontend (Users) y prepara el terreno para integrarse con un backend Node.js (Express) y una base de datos relacional (MySQL).

### Capas y responsabilidades (mapeo con el código)

- Dominio (`src/domain`)
  - `domain/user.js`: entidad/fábrica `User`. Define la forma y valores por defecto del agregado usuario. No depende de UI ni de HTTP.

- Aplicación (`src/modules/users/application`)
  - `application/user/*.js` (p. ej. `getAllUsers.js`, `createUser.js`, `updateUser.js`, `deleteUser.js`): casos de uso que orquestan la interacción entre el dominio y los adaptadores (servicios). No contienen detalles de fetch o estado de React.

- Adaptadores / Puertos (externos) (`src/adapters`)
  - `adapters/api/userService.js`: adaptador que implementa el puerto hacia el backend HTTP. Ofrece dos modos:
    - Mock (localStorage) para desarrollo rápido (`VITE_USE_MOCK=true`).
    - HTTP real hacia API REST (`VITE_API_URL`).

- Infraestructura (detalle técnico en frontend) (`src/modules/users/infrastructure`)
  - `context/UserContext.jsx` y `useUsers.js`: providers/hooks que administran estado de UI, loading y errores; invocan casos de uso.
  - `router/UserRoutes.jsx`: rutas del módulo.
  - `styles/global.css`: estilos del módulo.

- Presentación (UI) (`src/modules/users/presentation`)
  - `components/*` y `pages/UsersPage.jsx`: componentes visuales, formularios, tablas y modales.

- Core compartido (`src/core`)
  - `core/registry/moduleRegistry.js`: registro global de módulos (menú, buscadores). Permite que cada módulo se auto-registre (enfoque plug-in) sin acoplar el core a implementaciones concretas.
  - `core/ui/context/GlobalSearchContext.jsx`: proveedor de búsqueda global. Ejecuta todos los buscadores registrados por los módulos vía `moduleRegistry`.
  - `core/ui/components/*`: layout, barra lateral y componentes transversales.

### Diagrama lógico (simplificado)

```
UI (presentation) ---> Hooks/Provider (infrastructure) ---> Use Cases (application)
        ^                         |                                |
        |                         v                                v
      Layout               userService (adapter)  --->  Backend API (Express) ---> MySQL
        ^
        |-- moduleRegistry & GlobalSearch (core)
```

- La UI no conoce detalles de HTTP.
- Los casos de uso no conocen la UI ni el estado de React.
- El adaptador (userService) encapsula HTTP o Mock y se puede cambiar sin tocar el resto.

---

## 2) Estilo de despliegue: Basado en Servicios

- Backend/API REST (Node.js + Express): servicio central con la lógica de negocio y acceso a MySQL.
- Frontend Web (React): consume la API REST.
- App Móvil (React Native): también consume la misma API REST.
- Base de Datos (MySQL): única y compartida por el backend.

Esto no es microservicios; es un despliegue por servicios donde varios clientes (web y móvil) consumen los mismos endpoints.

### Endpoints esperados por el módulo de Usuarios

- GET    `${VITE_API_URL}/api/users`
- POST   `${VITE_API_URL}/api/users`         body: { ci, name, email, role, password }
- PUT    `${VITE_API_URL}/api/users/:id`     body: { ci, name, email, role }
- DELETE `${VITE_API_URL}/api/users/:id`

> En desarrollo, el mock con `localStorage` permite trabajar sin backend real (`VITE_USE_MOCK=true`).

---

## 3) Justificación técnica

- Independencia de capas: cambiar el backend (o MySQL por otro motor) no obliga a modificar la UI ni los casos de uso, mientras el contrato del adaptador se mantenga.
- Mantenibilidad: cada capa/modo tiene una responsabilidad definida. Testing unitario más fácil (mocks de `userService` y pruebas de casos de uso).
- Escalabilidad del frontend: más módulos pueden registrarse en `moduleRegistry` (menú y buscadores) sin acoplar el core.
- Reutilización: web y móvil comparten la API y evitan duplicar lógica de negocio.

---

## 4) Contratos y puntos de extensión

- `userService` (adaptador):
  - `getAll(): Promise<User[]>`
  - `create(user): Promise<User>`
  - `update(id, user): Promise<User>`
  - `remove(id): Promise<{ ok: boolean }>`
- `moduleRegistry` (core):
  - `registerMenu({ id, label, path })`
  - `registerSearcher({ id, search: (q) => Promise<Result[]> })`
- Global Search: cada módulo puede aportar un buscador. Resultado mínimo: `{ id, title, subtitle?, path }`.

---

## 5) Operación: Mock vs Backend real

- Archivo `.env.example` incluido. Pasos:
  1. Copiar como `.env` en la raíz.
  2. Si no hay backend disponible: `VITE_USE_MOCK=true` (por defecto).
  3. Con backend: `VITE_USE_MOCK=false` y `VITE_API_URL=http://localhost:3000` (o URL real).

El frontend seguirá funcionando tal cual; sólo cambia la fuente de datos del adaptador.

---

## 6) Próximas mejoras recomendadas (sin romper lo actual)

- Validaciones en casos de uso (application): verificar formato de email/CI y reglas simples antes de llamar al adaptador.
- Tests unitarios:
  - Casos de uso con `userService` mockeado.
  - `moduleRegistry` (registro/consulta y no duplicación).
  - `UserProvider` (ciclos de carga y manejo de errores).
- Búsqueda global a backend (opcional): si crece el volumen de datos, exponer endpoints de search paginados.
- Tipado gradual (TypeScript) o PropTypes estrictos + JSDoc para contratos.

---

## 7) Cómo ejecutarlo

Requisitos: Node.js 20.19+ o 22.12+.

```powershell
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa de la build
npm run preview
```

El proyecto inicia con mock habilitado por defecto y no requiere backend para probar el CRUD de usuarios.
