// Adapter: HTTP-only API service for Users
// This file intentionally removes local/mock behavior and always calls the configured backend.

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const userService = {
  // GET /users
  async getAll() {
    const res = await fetch(`${BASE_URL}/users`, { headers: getAuthHeader() })
    return handle(res)
  },

  // GET /users/:ci
  async getByCI(ci) {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(ci)}`, { headers: getAuthHeader() })
    return handle(res)
  },

  // POST /users  body: { ci, name, last_name, rol, branch, password }
  async create(user) {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    return handle(res)
  },

  // PATCH /users/:id_user
  async update(id_user, user) {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id_user)}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    return handle(res)
  },

  // DELETE /users/:id_user
  async remove(id_user) {
    const res = await fetch(`${BASE_URL}/users/${encodeURIComponent(id_user)}`, { method: 'DELETE', headers: getAuthHeader() })
    return handle(res)
  },
}

async function handle(res) {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : res.text()
}

function getAuthHeader() {
  try {
    const raw = localStorage.getItem('auth_token')
    if (!raw) return {}
    const sess = JSON.parse(raw)
    const access = sess?.access_token || sess?.accessToken || sess?.token || null
    if (access) return { Authorization: `Bearer ${access}` }
    return {}
  } catch {
    return {}
  }
}
