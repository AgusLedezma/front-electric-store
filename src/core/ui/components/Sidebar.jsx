import { NavLink } from 'react-router-dom'
import { moduleRegistry } from '../../registry/moduleRegistry'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const menu = moduleRegistry.getMenu()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="h-full w-64 shrink-0 border-r bg-white">
      <div className="p-4 text-lg font-bold text-[#004aad]">SICME ELECTRIK</div>
      <nav className="space-y-1 p-2">
        {menu.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => `block rounded px-3 py-2 text-sm ${isActive ? 'bg-[#004aad] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {item.label}
          </NavLink>
        ))}

        {!user ? (
          <NavLink to="/login" className="block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">Iniciar sesión</NavLink>
        ) : (
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-full text-left rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >Cerrar sesión</button>
        )}
      </nav>
    </aside>
  )
}
