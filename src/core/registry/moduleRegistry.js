// Simple global module registry for menu items, search providers, and (future) routes

const _menuItems = [] // { id, label, path, icon? }
const _searchers = [] // { id, search: async (q) => Result[], toPath: (item) => string }

export const moduleRegistry = {
  registerMenu(item) {
    if (!item || !item.id || !item.label || !item.path) return
    if (_menuItems.find(m => m.id === item.id)) return
    _menuItems.push(item)
  },
  getMenu() {
    return _menuItems.slice()
  },

  registerSearcher(searcher) {
    if (!searcher || !searcher.id || typeof searcher.search !== 'function') return
    if (_searchers.find(s => s.id === searcher.id)) return
    _searchers.push(searcher)
  },
  getSearchers() {
    return _searchers.slice()
  }
}
