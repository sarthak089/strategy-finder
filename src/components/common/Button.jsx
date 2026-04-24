export default function Button({ children, onClick, variant = 'default' }) {
  const base = 'px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors'
  const styles = {
    default: `${base} bg-transparent border border-gray-600 text-gray-400 hover:bg-gray-700`,
    primary: `${base} bg-cyan-700 border border-cyan-700 text-white hover:bg-cyan-600`,
  }

  return (
    <button onClick={onClick} className={styles[variant]}>
      {children}
    </button>
  )
}