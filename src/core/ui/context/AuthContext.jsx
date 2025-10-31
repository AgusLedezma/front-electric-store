/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../../../adapters/api/authService'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token)
    else localStorage.removeItem('auth_token')
  }, [token])

  async function login(ci, password) {
    const res = await authService.login(ci, password)
    // backend returns { token: sessionObject, user: [...] }
    const receivedToken = res?.token ? JSON.stringify(res.token) : null
    const receivedUser = Array.isArray(res?.user) ? res.user[0] : res.user
    setToken(receivedToken)
    setUser(receivedUser)
    return { user: receivedUser, token: receivedToken }
  }

  function logout() {
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
