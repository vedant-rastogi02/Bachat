import { Link, Outlet } from 'react-router-dom'
import LanguageToggle from '../components/LanguageToggle'
import { useLanguage } from '../context/LanguageContext'
import { useAuth } from '../context/AuthContext'

function AppLayout() {
  const { language } = useLanguage()
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="top-bar">
        <Link to="/" className="brand">
          <span className="brand-mark" role="img" aria-label="money bag">💰</span>
          <span>Bachat Buddy</span>
        </Link>
        <div className="top-actions">
          <LanguageToggle />
          {user ? (
            <button type="button" className="small-btn" onClick={logout}>
              {language === 'hi' ? 'लॉगआउट' : 'Logout'}
            </button>
          ) : (
            <Link to="/login" className="small-btn link-like">
              {language === 'hi' ? 'लॉगिन' : 'Login'}
            </Link>
          )}
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
