import { useState } from 'react'
import { useAuth } from '../../../../core/ui/context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [ci, setCi] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const auth = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // AuthContext.login accepts email (preferred) or ci. Instruct user to use 0001@nullmail.com
      // enforce client-side that user provided an email with our domain
      if (!String(ci).endsWith('@nullmail.com')) {
        throw new Error("Ingresa el correo con formato CI@nullmail.com")
      }
      await auth.login(ci, password)
      navigate('/usuarios')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Correo (usar formato CI@nullmail.com)</label>
          <input className="w-full border p-2 rounded" placeholder="0001@nullmail.com" value={ci} onChange={e => setCi(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Contraseña</label>
          <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button className="w-full bg-[#004aad] text-white p-2 rounded" disabled={loading}>
            {loading ? 'Conectando...' : 'Entrar'}
          </button>
        </div>
        <div className="text-center text-sm text-gray-600">
          ¿No tienes cuenta? <a href="/register" className="text-blue-600 underline">Regístrate</a>
        </div>
      </form>
    </div>
  )
}
