import { useState } from 'react'
import { useAuth } from '../../../../core/ui/context/AuthContext'
import { useToast } from '../../../../core/ui/context/ToastContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [ci, setCi] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const auth = useAuth()
  const navigate = useNavigate()
  const { show: showToast } = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
        try {
      setEmailError(null)
      setPasswordError(null)
      // basic client-side validation
      const email = String(ci || '').trim()
      const pwd = String(password || '')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!email) {
        setEmailError('El correo es obligatorio')
        setLoading(false)
        return
      }
      if (!emailRegex.test(email) || !email.toLowerCase().endsWith('@nullmail.com')) {
        setEmailError('Usa el formato CI@nullmail.com (ej. 0001@nullmail.com)')
        setLoading(false)
        return
      }
      if (!pwd) {
        setPasswordError('La contraseña es obligatoria')
        setLoading(false)
        return
      }

      await auth.login(email, pwd)
      showToast({ type: 'success', title: 'Sesión iniciada', message: 'Bienvenido al panel de usuarios.' })
      navigate('/usuarios')
    } catch (err) {
      // Normalize errors safely
      let msg = 'Credenciales inválidas o cuenta inexistente'
      try {
        if (typeof err === 'string') msg = err
        else if (err && err.message) msg = err.message
        // try parse JSON bodies (sometimes backend returns JSON string)
        try {
          const parsed = JSON.parse(msg)
          msg = parsed.error || parsed.message || msg
        } catch {}
      } catch (e) {
        // fallback
      }
      const lower = String(msg).toLowerCase()
      if (lower.includes('invalid login credentials') || lower.includes('invalid credentials') || lower.includes('unauthorized')) {
        msg = 'Credenciales inválidas. Verifica tu correo (CI@nullmail.com) y contraseña.'
      }
      setError(msg)
      showToast({ type: 'error', title: 'No se pudo iniciar sesión', message: msg })
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-24 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Correo (usar formato CI@nullmail.com)</label>
          <input className={`w-full border p-2 rounded ${emailError ? 'border-red-500 ring-2 ring-red-500/30' : ''}`} placeholder="0001@nullmail.com" value={ci} onChange={e => { setCi(e.target.value); setEmailError(null); setError(null) }} required />
          {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
        </div>
        <div>
          <label className="block text-sm text-gray-700">Contraseña</label>
          <input type="password" className={`w-full border p-2 rounded ${passwordError ? 'border-red-500 ring-2 ring-red-500/30' : ''}`} value={password} onChange={e => { setPassword(e.target.value); setPasswordError(null); setError(null) }} required />
          {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
        </div>
        {error && <Alert type="error" title="Error de autenticación">{error}</Alert>}
        <div>
          <button className="w-full bg-[#004aad] text-white p-2 rounded disabled:opacity-60" disabled={loading}>
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
