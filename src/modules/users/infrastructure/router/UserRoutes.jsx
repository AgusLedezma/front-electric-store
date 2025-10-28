import { Route, Routes, Navigate } from 'react-router-dom'
import UsersPage from '../../presentation/pages/UsersPage'

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/usuarios" element={<UsersPage />} />
      <Route path="/" element={<Navigate to="/usuarios" replace />} />
      <Route path="*" element={<Navigate to="/usuarios" replace />} />
    </Routes>
  )
}
