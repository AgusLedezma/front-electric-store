import { useMemo, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useToast } from '../../../../core/ui/context/ToastContext'
import { useUsers } from '../../infrastructure/context/useUsers'
import Modal from '../components/Modal'
import UserForm from '../components/UserForm'
import UserTable from '../components/UserTable'

export default function UsersPage() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers()
  const location = useLocation()
  const initialQuery = useMemo(() => {
    const p = new URLSearchParams(location.search)
    return p.get('q') || ''
  }, [location.search])
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selected, setSelected] = useState(null)
  const { show: showToast } = useToast()

  function onEdit(user) { setSelected(user); setOpenEdit(true) }
  function onDelete(user) { setSelected(user); setOpenDelete(true) }

  // Creation is handled via the Register page; the local create modal was removed.

  async function handleEdit(payload) {
    const id = selected?.id_user || selected?.id
    // Close modal immediately for better UX
    setOpenEdit(false)
    try {
      const ok = await updateUser(id, payload)
      if (ok) {
        showToast({ type: 'success', title: 'Cambios guardados', message: `Se actualizó a ${payload.name} ${payload.last_name}.` })
      } else {
        showToast({ type: 'error', title: 'No se pudo actualizar', message: 'Revisa los datos e intenta nuevamente.' })
      }
    } finally {
      setSelected(null)
    }
  }

  async function handleDelete() {
    const id = selected?.id_user || selected?.id
    // Close modal immediately and delete in background
    setOpenDelete(false)
    try {
      const ok = await deleteUser(id)
      if (ok) {
        showToast({ type: 'success', title: 'Usuario eliminado', message: `El usuario fue eliminado correctamente.` })
      } else {
        showToast({ type: 'error', title: 'No se pudo eliminar', message: 'Intenta nuevamente en unos segundos.' })
      }
    } finally {
      setSelected(null)
    }
  }

  return (
    <div className="container-page space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#004aad]">SICME ELECTRIK · Usuarios</h1>
          <p className="text-sm text-gray-600">Gestión y administración de usuarios del sistema</p>
        </div>
        <Link className="btn btn-primary" to="/register" onClick={() => setSelected(null)}>+ Nuevo Usuario</Link>
      </header>

      {error && (
          <Alert type="error" title="No se pudo cargar la lista">{error}</Alert>
      )}

      {loading ? (
        <div className="card p-8 text-center text-gray-600">Cargando...</div>
      ) : (
        <UserTable users={users} onEdit={onEdit} onDelete={onDelete} initialQuery={initialQuery} />
      )}

      {/* El formulario de creación local fue removido. Usar /register para crear nuevos usuarios */}

      <Modal open={openEdit} onClose={() => { setOpenEdit(false); setSelected(null) }} title="Editar usuario">
        {selected && (
          <UserForm mode="edit" initialData={selected} onCancel={() => { setOpenEdit(false); setSelected(null) }} onSubmit={handleEdit} />
        )}
      </Modal>

      <Modal open={openDelete} onClose={() => { setOpenDelete(false); setSelected(null) }} title="Eliminar usuario">
        {selected && (
          <div className="space-y-4">
            <p>¿Seguro que deseas eliminar al usuario <strong>{selected.name}</strong>?</p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => { setOpenDelete(false); setSelected(null) }}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
