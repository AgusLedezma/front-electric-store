const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handle(res) {
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(txt || `HTTP ${res.status}`)
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : res.text()
}

export const authService = {
  // backend expects { ci, password }
  // login expects email (must end with @nullmail.com) and password
  async login(email, password) {
    const payload = { email: String(email), password }
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return handle(res)
  },
}
