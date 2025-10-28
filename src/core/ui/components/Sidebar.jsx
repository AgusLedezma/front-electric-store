import { NavLink } from 'react-router-dom'
import { moduleRegistry } from '../../registry/moduleRegistry'

export default function Sidebar() {
  const menu = moduleRegistry.getMenu()
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
      </nav>
    </aside>
  )
}
