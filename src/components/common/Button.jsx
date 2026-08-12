export default function Button({ children, onClick, variant = 'default' }) {
  const base = {
    padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s',
  }
  const styles = {
    default: { ...base, background: 'transparent', border: '1px solid var(--line-2)', color: 'var(--muted)' },
    primary: { ...base, background: 'var(--accent)', border: '1px solid var(--accent)', color: 'var(--accent-ink)' },
  }
  return (
    <button onClick={onClick} style={styles[variant]}
      onMouseEnter={e => { if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-2)' }}
      onMouseLeave={e => { if (variant === 'primary') e.currentTarget.style.background = 'var(--accent)' }}>
      {children}
    </button>
  )
}
