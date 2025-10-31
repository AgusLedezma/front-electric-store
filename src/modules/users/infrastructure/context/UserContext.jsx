import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../../../core/ui/context/AuthContext'
import { UserContext } from './context'
import { getAllUsers } from '../../application/user/getAllUsers'
import { createUser as createUserUC } from '../../application/user/createUser'
import { updateUser as updateUserUC } from '../../application/user/updateUser'
import { deleteUser as deleteUserUC } from '../../application/user/deleteUser'

// This file exports only React components (UserProvider). Hooks and the raw context
// are provided from separate files to satisfy fast-refresh eslint rules.
export function UserProvider({ children }) {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch (err) {
      setError(err?.message || 'Error cargando usuarios')
    } finally {
      setLoading(false)
    }
  }

  // load on mount
  useEffect(() => { load() }, [])
  // reload when auth token changes (login/logout)
  useEffect(() => {
    if (token) load()
    else setUsers([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const createUser = useCallback(async (data) => {
    setLoading(true)
    setError(null)
    try {
      await createUserUC(data)
      await load()
      return true
    } catch (err) {
      setError(err?.message || 'Error creando usuario')
      return false
    } finally { setLoading(false) }
  }, [])

  const updateUser = useCallback(async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      await updateUserUC(id, data)
      await load()
      return true
    } catch (err) {
      setError(err?.message || 'Error actualizando usuario')
      return false
    } finally { setLoading(false) }
  }, [])

  const deleteUser = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      await deleteUserUC(id)
      await load()
      return true
    } catch (err) {
      setError(err?.message || 'Error eliminando usuario')
      return false
    } finally { setLoading(false) }
  }, [])

  const value = useMemo(() => ({ users, loading, error, reload: load, createUser, updateUser, deleteUser }), [users, loading, error, createUser, updateUser, deleteUser])

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: PropTypes.node
}
