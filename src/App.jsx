import { BrowserRouter } from 'react-router-dom'
import UserRoutes from './modules/users/infrastructure/router/UserRoutes'
import { UserProvider } from './modules/users/infrastructure/context/UserContext'
import { GlobalSearchProvider } from './core/ui/context/GlobalSearchContext'
import AppLayout from './core/ui/components/AppLayout'
import { AuthProvider } from './core/ui/context/AuthContext'
// Side-effect registration of modules (menu, search, etc.)
import './modules/users'
import './modules/users/infrastructure/styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <GlobalSearchProvider>
        <AuthProvider>
          <UserProvider>
            <UserRoutes />
          </UserProvider>
        </AuthProvider>
      </GlobalSearchProvider>
    </BrowserRouter>
  )
}
