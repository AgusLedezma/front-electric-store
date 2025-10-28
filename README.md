# SICME ELECTRIK – Módulo de Usuarios (Frontend)

Este proyecto contiene el módulo de usuarios del sistema SICME ELECTRIK desarrollado con React + Vite y Tailwind CSS, siguiendo una adaptación de arquitectura hexagonal (Ports & Adapters).

## Estructura

```
src/
	domain/
		user.js
	application/
		user/
			createUser.js
			updateUser.js
			deleteUser.js
			getAllUsers.js
	adapters/
		api/
			userService.js
	infrastructure/
		context/
			UserContext.jsx
		router/
			UserRoutes.jsx
		styles/
			global.css
	presentation/
		components/
			Modal.jsx
			UserForm.jsx
			UserTable.jsx
		pages/
			UsersPage.jsx
```

## Mock vs Backend real

El archivo `src/adapters/api/userService.js` usa por defecto un mock en `localStorage` para que puedas probar el CRUD sin backend. Cuando tengas backend:

- Crea un archivo `.env` en la raíz a partir de `.env.example`.
- Cambia `VITE_USE_MOCK=false`.
- Ajusta `VITE_API_URL` apuntando a tu servidor.

Endpoints esperados por el backend:

- GET    `${VITE_API_URL}/api/users`
- POST   `${VITE_API_URL}/api/users`         body: { ci, name, email, role, password }
- PUT    `${VITE_API_URL}/api/users/:id`     body: { ci, name, email, role }
- DELETE `${VITE_API_URL}/api/users/:id`

Notas de CORS: habilita CORS en tu servidor Express.

## Estilos

Tailwind CSS v4 está configurado vía PostCSS (`@tailwindcss/postcss`). Tipografías: Inter y Poppins. Colores de marca usados: azul `#004aad` y naranja `#ff6b35`.

## Cómo ejecutar

Requisitos recomendados: Node.js 20.19+ o 22.12+.

```powershell
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

## Funcionalidades

- Listado de usuarios con búsqueda y paginación básica.
- Crear, editar y eliminar con modales.
- Validaciones básicas en formulario.

## Créditos

Hecho con ❤️ usando React, Vite y Tailwind.
