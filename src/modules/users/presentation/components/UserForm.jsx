import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const ROLES = ['Administrador', 'Prevendedor', 'Transportista']

export default function UserForm({ mode = 'create', initialData = null, onSubmit, onCancel }) {
  const [ci, setCi] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [branch, setBranch] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState('Prevendedor')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (initialData) {
      const ciVal = initialData.ci || ''
      setCi(ciVal)
      setName(initialData.name || '')
      setLastName(initialData.last_name || '')
      // derive email from CI if not present
      setEmail(initialData.email || (ciVal ? `${ciVal}@nullmail.com` : ''))
      setBranch(initialData.branch || initialData.sucursal || '')
      setRol(initialData.rol || initialData.role || 'Prevendedor')
    }
  }, [initialData])

  const showPassword = mode === 'create'

  const errors = useMemo(() => {
    const e = {}
    if (!ci.trim()) e.ci = 'El CI es obligatorio'
    if (!name.trim()) e.name = 'El nombre es obligatorio'
    // email is derived from CI; validate format but don't require manual edit
    if (!email.trim()) e.email = 'El correo es obligatorio'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido'
    if (!branch.trim()) e.branch = 'La sucursal es obligatoria'
    if (!ROLES.includes(rol)) e.role = 'Rol inválido'
    if (showPassword && password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres'
    return e
  }, [ci, name, email, branch, rol, password, showPassword])

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (Object.keys(errors).length) return
    const payload = { ci: ci.trim(), name: name.trim(), last_name: lastName.trim(), branch: branch.trim(), email: email.trim(), rol }
    if (showPassword) payload.password = password
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="ci">Carnet de Identidad (CI)</label>
        <input id="ci" className="input" value={ci} onChange={e => setCi(e.target.value)} />
        {touched && errors.ci && <p className="text-sm text-red-600 mt-1">{errors.ci}</p>}
      </div>

      <div>
        <label className="label" htmlFor="name">Nombre Completo</label>
        <input id="name" className="input" value={name} onChange={e => setName(e.target.value)} />
        {touched && errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="label" htmlFor="branch">Sucursal</label>
        <input id="branch" className="input" value={branch} onChange={e => setBranch(e.target.value)} />
        {touched && errors.branch && <p className="text-sm text-red-600 mt-1">{errors.branch}</p>}
      </div>

      <div>
        <label className="label" htmlFor="email">Correo (derivado de CI)</label>
        <input id="email" type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} disabled />
        {touched && errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="rol">Rol</label>
        <select id="rol" className="input" value={rol} onChange={e => setRol(e.target.value)}>
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
