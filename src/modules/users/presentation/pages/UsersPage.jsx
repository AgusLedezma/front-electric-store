import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useUsers } from '../../infrastructure/context/useUsers'
import Modal from '../components/Modal'
import UserForm from '../components/UserForm'
import UserTable from '../components/UserTable'

export default function UsersPage() {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers()
  const [openCreate, setOpenCreate] = useState(false)
  const location = useLocation()
  const initialQuery = useMemo(() => {
    const p = new URLSearchParams(location.search)
    return p.get('q') || ''
  }, [location.search])
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selected, setSelected] = useState(null)

  function onEdit(user) { setSelected(user); setOpenEdit(true) }
  function onDelete(user) { setSelected(user); setOpenDelete(true) }

  async function handleCreate(payload) {
    const ok = await createUser(payload)
    if (ok) setOpenCreate(false)
  }

  async function handleEdit(payload) {
    const id = selected?.id_user || selected?.id
    // Close modal immediately for better UX
    setOpenEdit(false)
    try {
      await updateUser(id, payload)
    } finally {
      setSelected(null)
    }
  }

  async function handleDelete() {
    const id = selected?.id_user || selected?.id
    // Close modal immediately and delete in background
    setOpenDelete(false)
    try {
      await deleteUser(id)
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
        <button className="btn btn-primary" onClick={() => { setSelected(null); setOpenCreate(true) }}>+ Nuevo Usuario</button>
      </header>

      {error && (
        <div className="card border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="card p-8 text-center text-gray-600">Cargando...</div>
      ) : (
        <UserTable users={users} onEdit={onEdit} onDelete={onDelete} initialQuery={initialQuery} />
      )}

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="Crear usuario">
        <UserForm mode="create" onCancel={() => setOpenCreate(false)} onSubmit={handleCreate} />
      </Modal>

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
