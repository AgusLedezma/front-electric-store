// Adapter: API service for Users (module-local copy)
// This file centralizes all HTTP calls to the backend for the Users module
// If you don't have a backend yet, set VITE_USE_MOCK=true in a .env file
// and this service will use localStorage as a mock backend.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const USE_MOCK = (import.meta.env.VITE_USE_MOCK || 'true').toLowerCase() === 'true'

const LOCAL_KEY = 'sicme_users_mock'

function delay(ms) { return new Promise(res => setTimeout(res, ms)) }

function seedMock() {
  if (!localStorage.getItem(LOCAL_KEY)) {
    const seed = [
      { id: 1, ci: '12345678', name: 'Juan Pérez', role: 'Administrador', email: 'juan@sicme.com' },
      { id: 2, ci: '87654321', name: 'María Gomez', role: 'Prevendedor', email: 'maria@sicme.com' },
      { id: 3, ci: '11223344', name: 'Carlos Ruiz', role: 'Transportista', email: 'carlos@sicme.com' },
    ]
    localStorage.setItem(LOCAL_KEY, JSON.stringify(seed))
  }
}

function readMock() { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]') }
function writeMock(data) { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)) }

function createMockService() {
  seedMock()
  return {
    // Endpoint esperado en backend: GET /api/users
    async getAll() {
      await delay(300)
      return readMock()
    },

    // Endpoint esperado en backend: POST /api/users (body: { ci, name, email, role, password })
    async create(user) {
      await delay(300)
      const list = readMock()
      const id = list.length ? Math.max(...list.map(u => u.id)) + 1 : 1
      const toSave = { id, ci: user.ci, name: user.name, email: user.email, role: user.role }
      list.push(toSave)
      writeMock(list)
      return toSave
    },

    // Endpoint esperado en backend: PUT /api/users/:id
    async update(id, user) {
      await delay(300)
      const list = readMock()
      const idx = list.findIndex(u => u.id === id)
      if (idx === -1) throw new Error('Usuario no encontrado')
      const updated = { ...list[idx], ci: user.ci, name: user.name, email: user.email, role: user.role }
      list[idx] = updated
      writeMock(list)
      return updated
    },

    // Endpoint esperado en backend: DELETE /api/users/:id
    async remove(id) {
      await delay(300)
      const list = readMock()
      const filtered = list.filter(u => u.id !== id)
      writeMock(filtered) 
      return { ok: true }
    },
  }
}

function createHttpService() {
  // NOTA: cuando conectes el backend, habilita CORS y usa estos endpoints:
  // GET    `${BASE_URL}/api/users`
  // POST   `${BASE_URL}/api/users`         body: { ci, name, email, role, password }
  // PUT    `${BASE_URL}/api/users/:id`     body: { ci, name, email, role }
  // DELETE `${BASE_URL}/api/users/:id`

  return {
    async getAll() {
      const res = await fetch(`${BASE_URL}/api/users`)
      return handle(res)
    },
    async create(user) {
      const res = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      return handle(res)
    },
    async update(id, user) {
      const res = await fetch(`${BASE_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      return handle(res)
    },
    async remove(id) {
      const res = await fetch(`${BASE_URL}/api/users/${id}`, { method: 'DELETE' })
      return handle(res)
    },
  }
}

export const userService = USE_MOCK ? createMockService() : createHttpService()

// For testing/demo, you can force mock by adding a .env file at project root:
//  VITE_USE_MOCK=true
// And optionally set your API URL when you have a backend:
//  VITE_API_URL=http://localhost:3000

// Helper at module scope to satisfy linters
async function handle(res) {
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || `HTTP ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : res.text()
}
