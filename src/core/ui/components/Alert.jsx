import PropTypes from 'prop-types'

export default function Alert({ type = 'info', title, children }) {
  const color = type === 'error'
    ? 'border-red-300 bg-red-50 text-red-800'
    : type === 'success'
    ? 'border-green-300 bg-green-50 text-green-800'
    : type === 'warning'
    ? 'border-yellow-300 bg-yellow-50 text-yellow-800'
    : 'border-blue-300 bg-blue-50 text-blue-800'

  return (
    <div className={`rounded-lg border p-4 ${color}`}>
      {title && <div className="font-semibold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  )
}

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.node,
  children: PropTypes.node,
}
