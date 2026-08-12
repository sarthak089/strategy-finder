import { useEffect, useState } from 'react'

/**
 * Theme state. Light is the default; the choice persists in localStorage and
 * is applied as data-theme on <html> so the CSS variable overrides kick in.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('sf-theme')
      if (saved === 'light' || saved === 'dark') return saved
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('sf-theme', theme) } catch (_) {}
  }, [theme])

  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  return { theme, toggle }
}
