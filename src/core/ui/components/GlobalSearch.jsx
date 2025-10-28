import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalSearch } from '../context/useGlobalSearch'

export default function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const { results, search, loading } = useGlobalSearch()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    const id = setTimeout(() => { if (q.trim()) search(q) }, 250)
    return () => clearTimeout(id)
  }, [q, search])

  function onSelect(item) {
    const path = item.path || '/'
    setOpen(false)
    setQ('')
    navigate(path)
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        className="input w-full"
        placeholder="Buscar en todo el sistema..."
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
      />
      {open && q && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow">
          {loading && <div className="p-3 text-sm text-gray-500">Buscando...</div>}
          {!loading && results.length === 0 && (
            <div className="p-3 text-sm text-gray-500">Sin resultados</div>
          )}
          <ul>
            {results.map((r, i) => (
              <li key={r.id || i} className="cursor-pointer px-3 py-2 hover:bg-gray-50" onClick={() => onSelect(r)}>
                <div className="text-sm font-medium">{r.title}</div>
                {r.subtitle && <div className="text-xs text-gray-500">{r.subtitle}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
