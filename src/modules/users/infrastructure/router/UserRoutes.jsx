import { Route, Routes, Navigate } from 'react-router-dom'
import UsersPage from '../../presentation/pages/UsersPage'
import LoginPage from '../../../auth/presentation/pages/LoginPage'
import RegisterPage from '../../../auth/presentation/pages/RegisterPage'
import { useAuth } from '../../../../core/ui/context/AuthContext'
import AppLayout from '../../../../core/ui/components/AppLayout'

function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/usuarios" element={<RequireAuth><AppLayout><UsersPage /></AppLayout></RequireAuth>} />
      <Route path="/" element={<Navigate to="/usuarios" replace />} />
      <Route path="*" element={<Navigate to="/usuarios" replace />} />
    </Routes>
  )
}
