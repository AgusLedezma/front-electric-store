import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const remove = useCallback((id) => {
    setToasts(ts => ts.filter(t => t.id !== id))
  }, [])

  const show = useCallback((options) => {
    const id = ++idRef.current
    const toast = {
      id,
      type: options?.type || 'info',
      title: options?.title || null,
      message: options?.message || '',
      duration: typeof options?.duration === 'number' ? options.duration : 3500,
    }
    setToasts(ts => [...ts, toast])
    if (toast.duration > 0) {
      setTimeout(() => remove(id), toast.duration)
    }
    return id
  }, [remove])

  const value = useMemo(() => ({ show, remove }), [show, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed z-[60] top-4 right-4 space-y-2 w-[calc(100%-2rem)] max-w-sm">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

ToastProvider.propTypes = { children: PropTypes.node }

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

function ToastItem({ toast, onClose }) {
  const color = toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : toast.type === 'warning' ? 'bg-yellow-600' : 'bg-gray-800'
  return (
    <div className={`text-white rounded shadow-lg ${color} px-4 py-3 animate-fade-in`}> 
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {toast.title && <div className="font-semibold">{toast.title}</div>}
          <div className="opacity-95 text-sm">{toast.message}</div>
        </div>
        <button className="ml-2 text-white/80 hover:text-white" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
    </div>
  )
}

ToastItem.propTypes = {
  toast: PropTypes.shape({ id: PropTypes.number, type: PropTypes.string, title: PropTypes.string, message: PropTypes.string, duration: PropTypes.number }),
  onClose: PropTypes.func,
}
