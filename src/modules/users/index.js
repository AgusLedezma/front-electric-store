// Users module registration: menu and global search provider
import { moduleRegistry } from '../../core/registry/moduleRegistry'
import { userService } from '../../adapters/api/userService'

// Register menu item
moduleRegistry.registerMenu({ id: 'users', label: 'Usuarios', path: '/usuarios' })

// Register searcher
moduleRegistry.registerSearcher({
  id: 'users-search',
  async search(q) {
    const items = await userService.getAll()
    const query = q.toLowerCase()
    const filtered = items.filter(u =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.ci.toLowerCase().includes(query)
    )
    return filtered.slice(0, 20).map(u => ({
      id: `user-${u.id}`,
      title: `${u.name} (${u.ci})`,
      subtitle: u.email,
      path: `/usuarios?q=${encodeURIComponent(q)}`
    }))
  }
})
