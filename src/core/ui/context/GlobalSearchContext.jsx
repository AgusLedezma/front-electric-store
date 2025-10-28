import PropTypes from 'prop-types'
import { useCallback, useMemo, useState } from 'react'
import { moduleRegistry } from '../../registry/moduleRegistry'
import { GlobalSearchContext } from './context'

export function GlobalSearchProvider({ children }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const search = useCallback(async (q) => {
    const query = (q ?? '').trim()
    if (!query) { setResults([]); return [] }
    setLoading(true)
    setError(null)
    try {
      const searchers = moduleRegistry.getSearchers()
      const chunks = await Promise.all(searchers.map(s => Promise.resolve(s.search(query)).catch(() => [])))
      const flat = chunks.flat().slice(0, 50) // limit for UI safety
      setResults(flat)
      return flat
    } catch (e) {
      setError(e?.message || 'Error buscando')
      setResults([])
      return []
    } finally { setLoading(false) }
  }, [])

  const value = useMemo(() => ({ results, loading, error, search }), [results, loading, error, search])

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  )
}

GlobalSearchProvider.propTypes = {
  children: PropTypes.node
}
