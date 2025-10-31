import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export default function UserTable({ users, onEdit, onDelete, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  // keep query in sync if initialQuery changes from outside (e.g., URL search)
  useEffect(() => {
    if (initialQuery !== query) setQuery(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])
  const [page, setPage] = useState(1)
  const pageSize = 5

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const data = q
      ? users.filter(u =>
          (u.name || '').toLowerCase().includes(q) ||
          (u.branch || u.sucursal || '').toLowerCase().includes(q) ||
          ((u.ci || '') + '').toLowerCase().includes(q)
        )
      : users
    setPage(1)
    return data
  }, [users, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const current = filtered.slice(start, start + pageSize)

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <input
          placeholder="Buscar por nombre, correo o CI"
          className="input sm:max-w-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table">
          <thead>
            <tr>
              <th>ID</th>
              <th>CI</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Sucursal</th>
              <th>Correo</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {current.map(u => (
              <tr key={u.id || u.id_user} className="hover:bg-gray-50">
                <td>{u.id ?? '-'}</td>
                <td>{u.ci}</td>
                <td className="font-medium">{u.name} {u.last_name || ''}</td>
                <td>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                    {u.rol || u.role}
                  </span>
                </td>
                <td>{u.branch ?? u.sucursal}</td>
                <td>{(u.ci ? `${u.ci}@nullmail.com` : u.email) || '-'}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-secondary" onClick={() => onEdit?.(u)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => onDelete?.(u)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">Sin resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-sm text-gray-600">Mostrando {current.length} de {filtered.length}</p>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
          <span className="text-sm">Página {page} de {totalPages}</span>
          <button className="btn btn-secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}

UserTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    ci: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    sucursal: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  initialQuery: PropTypes.string,
}
