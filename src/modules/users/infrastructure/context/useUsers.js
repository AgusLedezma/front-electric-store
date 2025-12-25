import { useContext } from 'react'
import { UserContext } from './context'

export function useUsers() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUsers debe usarse dentro de <UserProvider>')
  return ctx
}
