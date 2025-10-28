import { useContext } from 'react'
import { GlobalSearchContext } from './context'

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext)
  if (!ctx) throw new Error('useGlobalSearch debe usarse dentro de <GlobalSearchProvider>')
  return ctx
}
