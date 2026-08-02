import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

function LoginPage() {
  const { language } = useLanguage()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card glass-panel">
        <p className="eyebrow">{language === 'hi' ? 'प्रवेश करें' : 'Welcome back'}</p>
        <h2>{language === 'hi' ? 'लॉगिन करें' : 'Login'}</h2>
        <p className="lead-text auth-lead">{language === 'hi' ? 'अपनी प्रोफाइल और योजनाएं देखने के लिए साइन इन करें।' : 'Sign in to view your profile and personalized scheme matches.'}</p>
        <form onSubmit={onSubmit} className="profile-form">
          <label>
            {language === 'hi' ? 'ईमेल' : 'Email'}
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            {language === 'hi' ? 'पासवर्ड' : 'Password'}
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit" className="primary-btn">{language === 'hi' ? 'लॉगिन' : 'Login'}</button>
          {error && <p className="error-text">{error}</p>}
        </form>
        <p className="auth-footer">
          {language === 'hi' ? 'नया खाता?' : 'New user?'} <Link to="/signup">{language === 'hi' ? 'साइनअप करें' : 'Create account'}</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage
