import PropTypes from 'prop-types'
import Sidebar from './Sidebar'
import GlobalSearch from './GlobalSearch'

export default function AppLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white p-3">
          <div className="text-sm text-gray-500">Panel</div>
          <GlobalSearch />
        </header>
        <main className="flex-1 overflow-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}

AppLayout.propTypes = { children: PropTypes.node }
