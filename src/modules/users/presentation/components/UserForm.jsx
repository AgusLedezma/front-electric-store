import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const ROLES = ['Administrador', 'Prevendedor', 'Transportista']

export default function UserForm({ mode = 'create', initialData = null, onSubmit, onCancel }) {
  const [ci, setCi] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Prevendedor')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (initialData) {
      setCi(initialData.ci || '')
      setName(initialData.name || '')
      setEmail(initialData.email || '')
      setRole(initialData.role || 'Prevendedor')
    }
  }, [initialData])

  const showPassword = mode === 'create'

  const errors = useMemo(() => {
    const e = {}
    if (!ci.trim()) e.ci = 'El CI es obligatorio'
    if (!name.trim()) e.name = 'El nombre es obligatorio'
    if (!email.trim()) e.email = 'El correo es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido'
    if (!ROLES.includes(role)) e.role = 'Rol inválido'
    if (showPassword && password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
    return e
  }, [ci, name, email, role, password, showPassword])

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    const payload = { ci: ci.trim(), name: name.trim(), email: email.trim(), role }
    if (showPassword) payload.password = password
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="ci">Carnet de Identidad (CI)</label>
        <input id="ci" className="input" value={ci} onChange={e => setCi(e.target.value)} placeholder="12345678" />
        {touched && errors.ci && <p className="text-sm text-red-600 mt-1">{errors.ci}</p>}
      </div>

      <div>
        <label className="label" htmlFor="name">Nombre Completo</label>
        <input id="name" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Juan Pérez" />
        {touched && errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="label" htmlFor="email">Correo Electrónico</label>
        <input id="email" type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@empresa.com" />
        {touched && errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="role">Rol</label>
        <select id="role" className="input" value={role} onChange={e => setRole(e.target.value)}>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {touched && errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
      </div>

      {showPassword && (
        <div>
          <label className="label" htmlFor="password">Contraseña</label>
          <input id="password" type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
          {touched && errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{mode === 'create' ? 'Crear' : 'Guardar'}</button>
      </div>
    </form>
  )
}

UserForm.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}
