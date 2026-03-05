import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <Moon size={24} className="moon-icon" />
      <Sun size={24} className="sun-icon" />
    </button>
  )
}
