import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../../../adapters/api/userService'
import { useAuth } from '../../../../core/ui/context/AuthContext'

export default function RegisterPage() {
  const [ci, setCi] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [rol, setRol] = useState('Prevendedor')
  const [branch, setBranch] = useState('Sucursal 1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const auth = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Backend will create auth user using ci (email = ci+'@nullmail.com', password = 'sicme'+ci)
      await userService.create({ ci, name, last_name: lastName, rol, branch })
      // after registering, perform autologin using default password and go to usuarios
      // default password policy: password = 'sicme' + ci
      const defaultPassword = 'sicme' + String(ci)
      const email = String(ci) + '@nullmail.com'
      await auth.login(email, defaultPassword)
      navigate('/usuarios')
    } catch (err) {
      let msg = err?.message || 'Error al registrar'
      try {
        const parsed = JSON.parse(msg)
        msg = parsed.error || parsed.message || JSON.stringify(parsed)
      } catch {}
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registro de usuario</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Cédula (CI)</label>
          <input inputMode="numeric" className="w-full border p-2 rounded" value={ci} onChange={e => setCi(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Nombre</label>
          <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Apellido</label>
          <input className="w-full border p-2 rounded" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Rol</label>
          <select className="w-full border p-2 rounded" value={rol} onChange={e => setRol(e.target.value)}>
            <option>Prevendedor</option>
            <option>Transportista</option>
            <option>Administrador</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700">Sucursal</label>
          <input className="w-full border p-2 rounded" value={branch} onChange={e => setBranch(e.target.value)} required />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button className="w-full bg-[#004aad] text-white p-2 rounded" disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
        </div>
        <div className="text-center">
          <button type="button" onClick={() => navigate('/login')} className="mt-2 text-sm text-gray-600 underline">Volver al login</button>
        </div>
      </form>
    </div>
  )
}
