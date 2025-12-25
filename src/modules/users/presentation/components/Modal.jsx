import { useEffect } from 'react'
import PropTypes from 'prop-types'

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    if (open) globalThis.addEventListener('keydown', onKey)
    return () => globalThis.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }[size] || 'max-w-lg'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose?.() }}
        onClick={onClose}
      />
      <div className={`relative w-full ${sizeClass} card bg-white max-h-[90vh] overflow-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button className="btn btn-secondary !px-2 !py-1" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.node,
  children: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
}
